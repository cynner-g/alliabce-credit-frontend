import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faDownload, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { differenceInDays, formatRelative, subDays, parseISO } from 'date-fns'
import DatePicker from 'react-datepicker'
import Header from "../../components/header"
import Router from "next/router"
import Cookies from "js-cookie"
// import Pagination from "../../components/datatable/pagination"
// import DynamicTable from "../../components/DynamicTable"
import { Loading } from "../../components/LoadingComponent"
import { Table, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import { order_list, cancel_order } from "../api/credit_reports";
import React, { Component } from 'react';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

//Simple enums
const PENDING = 1;
const PROCESSING = 2;
const NEEDACTION = 3;
const ERROR = 4;
const COMPLETED = 5;
const CANCELLED = 6;


class CreditReports extends Component {
    constructor(props) {
        super(props);

        this.state = {
            origReportList: null,
            filteredReportList: null,
            rotation: [],
            visibleReportList: null,
            pageSize: 10,
            startFilter: null,
            endFilter: null,
            role: Cookies.get('role'),
            statusChangeRow: null
        };
    }

    componentDidMount() {
        order_list(null, null).then(async (data) => {
            await this.setState({ origReportList: data, filteredReportList: data })
        }).then(() => {
            try {
                this.setVisible();
            }
            catch (ex) { console.log(ex.message) }
        })


    }

    setVisible = (page = 0) => {
        let start = this.state.pageSize * page
        let end = page + this.state.pageSize;
        if (start < 0) start = 0;
        let fList = this.state.filteredReportList;
        if (!fList) fList = this.state.origReportList;
        let visible = fList.slice(start, end);
        this.setState({ visibleReportList: visible })
    }

    showDropdownRow = (e, item) => {
        let rotation = [...this.state.rotation];
        if (rotation[item] == undefined) rotation[item] = 0;
        rotation[item] = rotation[item] == 0 ? 180 : 0;
        this.setState({ rotation: rotation })

        let target = e.currentTarget.parentNode;

        while (target.nodeName !== "TR") target = target.parentNode;
        const hiddenElement = target.nextSibling;
        hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
    };

    filterDates = async (update) => {
        this.setState({ startFilter: update[0], endFilter: update[1] });
        let newData = this.state.origReportList;
        if (this.state.startFilter != null) {
            newData = await newData.filter(row => {
                return differenceInDays(parseISO(row.create_date), parseISO(this.state.startFilter)) >= 0;
            })

            newData = await newData.filter(row => {
                return differenceInDays(parseISO(row.create_date), parseISO(this.state.startFilter)) < 0;
            })

            await this.setState({ filteredReportList: newData })
            this.setVisible(0) //get active page.  State?
        }
    }

    filterText = async (e) => {
        e.preventDefault();
        let text = e.target.value
        console.log(text)
        let data = this.state.origReportList;
        let newData = await data.filter(row => {
            //search these 4 columns
            return (
                row.subject_name.indexOf(text) >= 0 ||
                row.company_name.indexOf(text) >= 0 ||
                row.user_name.indexOf(text) >= 0 ||
                row.reference_id.indexOf(text) >= 0)
        })
        await this.setState({ filteredReportList: newData })
        this.setVisible(0) //get active page.  State?
    }

    filterStatus = async (e) => {
        console.log(e)
        let text = e;
        let newData = this.state.origReportList;

            newData = await newData.filter(row => {
                let ret = false;
                text.forEach(t => {
                    if (+row.status_code == +t.value) ret = true;
                })
                return ret;
            });

        await this.setState({ filteredReportList: newData })
        this.setVisible(0) //get active page.  State?
    }

    //returns markup and text for report Status 
    //according to the passed in status code
    //primarily used from tblRow() but also called
    //from setStatus()
    getStatusCss = (code) => {
        code = +code; //ensure it's a number, not a string
        let css, text = "", icon = "", badge = <></>;
            switch (code) {
                case -1: text = ""
                case PENDING:
                    text = "Pending";
                    icon = "faExclamationTriangle";
                    badge = <Badge bg="info">Pending</Badge>;
                    break;

                    break;
                case PROCESSING:
                    css = {
                        padding: '5px',
                        backgroundColor: "gold",
                        alignItems: ' stretch',
                        width: '81px',
                        left: '6px',
                        top: '2px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '150%',
                        /* identical to box height, or 21px */
                        color: '#FFFFFF'
                    };
                    badge = <Badge bg="warning">Processing</Badge>;
                    text = "Processing";
                    icon = "faClock"
                    break;
                case NEEDACTION:
                    text = "warning?????";
                    icon = "faExclamationTriangle";
                    badge = <Badge bg="danger">Warning</Badge>;
                    break;
                case ERROR:
                    text = "Error";
                    icon = "faExclamationTriangle";
                    badge = <Badge bg="secondary">Error</Badge>;
                    break;
                case COMPLETED:
                    css = {
                        width: '35px',
                        height: '21px',
                        left: '6px',
                        top: '2px',
                        fontFamily: 'Roboto',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '150%',
                        color: '#388F46',
                    }
                    text = "Completed"
                    badge = <Badge bg='success'>Completed</Badge>;
                    icon = "faDownload"
                    break;
                case CANCELLED:
                    text = "Cancelled";
                    badge = <Badge bg='dark'>Cancelled</Badge>;
                    break;
                default: break;

            }
        return { css: css, text: text, icon: icon, badge: badge };
        }

    tblRow = (row, index) => {
        const getCodes = (rpts) => {
            let incorporate = rpts.incorporate;
            let bank = rpts.bank;
            let legal = rpts.legal;
            let suppliers = rpts.suppliers;
            //not entirely necessary now....
            let incorporateCSS = this.getStatusCss(incorporate.status_code);
            let bankCSS = this.getStatusCss(bank.status_code);
            let legalCSS = this.getStatusCss(legal.status_code);
            let suppliersCSS = this.getStatusCss(suppliers.status_code);

            if (incorporate.status_code >= 0) incorporateCSS.text = 'Incorporate';
            if (bank.status_code >= 0) bankCSS.text = 'Bank';
            if (legal.status_code >= 0) legalCSS.text = 'Legal';
            if (suppliers.status_code >= 0) suppliersCSS.text = 'Supplier';

            return {
                incorporate: incorporateCSS,
                bank: bankCSS,
                legal: legalCSS,
                suppliers: suppliersCSS,
            }
        }

        const expand = (item) => {
            item.icon = item.icon == 'faCaretDown' ? 'faCaretUp' : 'faCaretDown'
        }

        let refId = row.reference_id;
        let order_date = row.order_date;
        let order_time = row.order_time;
        let subject_name = row.subject_name;
        let user_name = row.user_name;
        let company_name = row.company_name;
        let status = this.getStatusCss(row.status_code)
        let reportCodes = getCodes(row.reports);
        let isDisabled = false
        for (let report of row.ordered_reports) {
            if (row.reports[report.toLowerCase()].status_code !== COMPLETED) isDisabled = true;
        }

        return (
            <>
                <tr key={index}>
                    <td>{refId}</td>
                    <td>{order_date}<br /><span className="small10">{order_time}</span></td>
                    <td>{subject_name}</td>
                    <td>{user_name}<br /><span className="small10">{company_name}</span></td>

                    <td><div className={`status status${status.status_code}`}>{status.badge}</div></td>
                    <td><div className={`incorporate status${reportCodes.incorporate.status_code}`}>{reportCodes.incorporate.text}</div></td>
                    <td><div className={`bank status${reportCodes.bank.status_code}`}>{reportCodes.bank.text}</div></td>
                    <td><div className={`legal status${reportCodes.legal.status_code}`}>{reportCodes.legal.text}</div></td>
                    <td><div className={`suppliers status${reportCodes.suppliers.status_code}`}>{reportCodes.suppliers.text}</div></td>
                    <td>
                        <button className="btn btn-outline-primary" style={{ border: "none" }} disabled={isDisabled}>Download All</button>
                    </td>
                    <td>
                        <FontAwesomeIcon icon={faCaretDown} style={{ transform: `rotate(${this.state.rotation[index] || 0}deg)`, height: '15px' }} onClick={(e) => this.showDropdownRow(e, index)} />
                    </td>
                </tr>
                <tr className="collapse" key={index + "_2"}>
                    <td colSpan={10} className="comments_indent">
                        <Table style={{ width: '100%' }} >
                            <tbody>
                                <tr>
                                    <td colSpan={1}>
                                        <button className="btn btn-outline-danger"
                                            onClick={() => this.requestCancel(row._id)}>Request Cancellation</button>
                                    </td>
                                    <td colSpan={1}>

                                    </td>
                                    <td colSpan={1}>
                                        {this.state.role === 'admin' ?
                                            <>
                                                <button className="btn btn-outline-primary" style={{ borderWidth: '1px' }}
                                                    onClick={() => this.changeStatus(row)}>Change Status</button>
                                                <button className="btn btn-outline-primary" style={{ borderWidth: '1px' }}
                                                    onClick={() => this.showLinks(row._id)}>Show External Links</button>
                                            </>
                                            :
                                            ''
                                        }
                                        <button className="btn btn-outline-danger" disabled
                                            onClick={() => this.viewApplication(row._id)}>View Credit Application</button>
                                        <button className="btn btn-outline-primary"
                                            onClick={() => this.orderReport(row._id)}>View Report Form</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1}>
                                        <h3>System</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        {row.comments.system.comment}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1} className="small10">
                                        {this.getDate(row.comments.system.create_date)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1}>
                                        <h3>Alliance Credit</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        {row.comments.custom.comment}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={1} className="small10">
                                        {this.getDate(row.comments.custom.create_date)}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                    </td>
                </tr>
            </>)
    }

    changeStatus = (row) => {
        this.setStatus(row, row.status_code, 0)
    }

    setStatus = (row, value, type) => {
        console.log(row)
        if (type == 0) { //checkbox
            let info = this.getStatusCss(value);
            row.status_code = value;
            row.status = info.text;
            row.badge = info.badge;
            this.setState({ statusChangeRow: row });
        }
        else if (type == 1) {//textarea
            let info = this.getStatusCss(row.comments.custom.comment.status_code);
            row.comments.custom.status_code = row.status_code;
            row.comments.custom.status = row.status;
            row.comments.custom.comment = value;
            this.setState({ statusChangeRow: row });
        }
        else if (type == 2) {//submit button
            let rows = this.state.origReportList;
            rows.forEach(item => {
                if (item._id === row._id) {
                    item = row;
                    this.setState({ origReportList: rows, statusChangeRow: null });
                    //TODO: add filters in place again??
                }
            })
        }
        else if (type == 3) {//cancel button
            this.setState({ statusChangeRow: null });
        }

    }

    getDate = (dt) => {
        dt = parseISO(dt); //date-fns parse the ISO string to a correct date object
        let numDays = differenceInDays(new Date(), dt); //get number of days between now and then
        let txt = formatRelative(subDays(dt, numDays), new Date()) //display in easy to read format
        return txt;
    }

    requestCancel = (rptId) => {
        //send fetch request here for cancellation
        let row = this.state.origReportList.filter(row => row._id == rptId)[0];
        this.setStatus(row, CANCELLED, 0)
        cancel_order(rptId);
    }

    expand = (item) => {
        let rotation = [...this.state.rotation];
        if (rotation[item] == undefined) rotation[item] = 0;
        rotation[item] = rotation[item] == 0 ? 180 : 0;
        this.setState({ rotation: rotation })
    }

    orderReport = (rptId) => {
        // const router = withRouter()
        let URL = "/credit-reports/order-New-Report"
        if (true) {//user is admin
            Router.push({ pathname: URL, query: { rptId: rptId || null } })
        }
    }

    render() {
        if (this.state.reportList === null || this.state.visibleReportList === null) {
            return (
                <>
                    <Header />
                    <br />
                    <Loading title="Credit Reports" />
                </>
            )
        }
        else {
            let options = [
                { value: "6", label: "Cancelled" },
                { value: "5", label: "Completed" },
                { value: "2", label: "Processing" },
            ]
            return (
                <>


                    <Modal
                        show={this.state.statusChangeRow !== null}
                        onHide={() => this.setState({ statusChangeRow: null })}
                        backdrop="static">
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <table style={{ width: '80%' }}>
                                <tbody>

                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, PROCESSING, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, PROCESSING, 0)}
                                            checked={this.state.statusChangeRow && this.state.statusChangeRow.status_code == PROCESSING} /></td>
                                        <td>Processing</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, NEEDACTION, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, NEEDACTION, 0)}
                                            checked={this.state.statusChangeRow && this.state.statusChangeRow.status_code == NEEDACTION} /></td>
                                        <td>Need Action</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, ERROR, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, ERROR, 0)}
                                            checked={this.state.statusChangeRow && this.state.statusChangeRow.status_code == ERROR} /></td>
                                        <td>Error</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, PENDING, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, PENDING, 0)}
                                            checked={this.state.statusChangeRow && this.state.statusChangeRow.status_code == PENDING} /></td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, COMPLETED, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, COMPLETED, 0)}
                                            checked={this.state.statusChangeRow && this.state.statusChangeRow.status_code == COMPLETED} /></td>
                                        <td>Completed</td>
                                    </tr>
                                    <tr><td colSpan={2}>{this.state.statusChangeRow ? this.state.statusChangeRow.badge : ''}</td></tr>
                                    <tr><td colSpan={2}>
                                        <textarea
                                            cols={50}
                                            rows={5}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, e.target.value, 1)}>
                                        </textarea>
                                    </td></tr>
                                </tbody>
                            </table>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-outline-primary" onClick={() => this.setStatus(this.state.statusChangeRow, null, 3)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={() => this.setStatus(this.state.statusChangeRow, null, 2)}>
                                Update Status
                            </button>
                        </Modal.Footer>
                    </Modal>



                    <Header />
                    <br />
                    <Container>
                        <Row >
                            <Col className='filterCol'> Search:&nbsp;<input type='text' onChange={(e) => this.filterText(e)}></input></Col>
                            <Col className='filterCol'>Status:&nbsp;
                                <Select onChange={(e) => this.filterStatus(e)}
                                    options={options}
                                    isMulti
                                    className="multiSelect"
                                /></Col>
                            <Col className='filterCol'>Filter By Date:&nbsp;
                                <DatePicker
                                    selectsRange={true}
                                    startDate={this.state.startFilter}
                                    endDate={this.state.endFilter}
                                    onChange={(update) => {
                                        this.filterDates(update);
                                    }}
                                />
                            </Col>
                            <Col className="ms-auto filterCol">
                                <button className="btn btn-primary" onClick={this.orderReport}>Order New Report</button>
                            </Col>
                        </Row>
                        <Row><Col>
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>Ref. Id</th>
                                        <th>Order date</th>
                                        <th>Subject Name</th>
                                        <th>User Name</th>
                                        <th>Status</th>
                                        <th colSpan={4}>Reports Status</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.visibleReportList.map((row, index) => {
                                        return this.tblRow(row, index);
                                    })}
                                </tbody>
                            </Table>
                        </Col></Row>
                    </Container>

                    {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}

                </>
            )
        }
    }



}

/**
 *
 *
 * @export
 * @param {*} { query: { page = 1, data = null, totalPage = 10 } }
 * @return {*} 
 */
export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
    const start = +page === 1 ? 0 : (+page + 1)
    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: data,
            page: page,
            totalPage
        }
    }

}

export default CreditReports

