import { differenceInDays, formatRelative, subDays, parseISO, add, getMonth, getYear, lastDayOfMonth, lastDayOfYear } from 'date-fns'
import DatePicker, { CalendarContainer } from 'react-datepicker'
import Header from "../../components/header"
import Router from "next/router"
import Cookies from "js-cookie"

import { Loading } from "../../components/LoadingComponent"
import { Table, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import { order_list, cancel_order } from "../api/credit_reports";
import React, { Component } from 'react';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import "./index.module.css"

//Simple enums
const NOTORDERED = -1
const NEW = 0
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
            filteredReportList: null,
            pageSize: 10,
            startFilter: null,
            endFilter: null,
            searchFilter: "",
            role: Cookies.get('role'),
            statusChangeRow: null,
            filterStatusData: [],
            token: Cookies.get('token')
        };
    }

    async componentDidMount() {
        this.get_data();
    }

    get_data = () => {
        let dates = {
            startDate: this.state.startFilter,
            endDate: this.state.endFilter
        }

        let body = {
            'search': this.state.searchFilter,
            'status_filter': this.state.filterStatusData,
            'dateRange': dates
        }

        order_list(body, this.state.token).then(async (data) => {
            this.setState({ origReportList: data, filteredReportList: data })
        })
    }

    // setVisible = (page = 0) => {
    //     let start = this.state.pageSize * page
    //     let end = page + this.state.pageSize;
    //     if (start < 0) start = 0;
    //     let fList = this.state.filteredReportList;
    //     if (!fList) fList = this.state.origReportList;
    //     let visible = fList.slice(start, end);
    //     this.setState({ filteredReportList: visible })
    // }

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
        if (update[0] != null) {
            newData = await newData.filter(row => {
                return differenceInDays(parseISO(row.create_date), parseISO(this.state.startFilter)) >= 0;
            })
            if (update[1] != null) {
                newData = await newData.filter(row => {
                    return differenceInDays(parseISO(row.create_date), parseISO(this.state.startFilter)) < 0;
                })
            }
        }
        await this.setState({ filteredReportList: newData })
    }

    filterText = async (e) => {
        e.preventDefault();
        let text = e.target.value.toLowerCase()
        // console.log(text)
        // let data = this.state.origReportList;
        // let newData = await data.filter(row => {
        //     //search these 4 columns
        //     return (
        //         row.subject_name?.toLowerCase().indexOf(text) >= 0 ||
        //         row.company_name?.toLowerCase().indexOf(text) >= 0 ||
        //         row.user_name?.toLowerCase().indexOf(text) >= 0 ||
        //         row.reference_id?.toLowerCase().indexOf(text) >= 0)
        // })
        // await this.setState({ filteredReportList: newData })
        await this.setState({ searchFilter: text })
        this.get_data();
    }

    filterStatus = async (e) => {
        await this.setState({ filterStatusData: e });
        this.get_data();
        // let text = e;
        // let newData = this.state.origReportList;
        // if (e?.length > 0) {
        //     newData = await newData.filter(row => {
        //         let ret = false;
        //         text.forEach(t => {
        //             if (+row.status_code == +t.value) ret = true;
        //         })
        //         return ret;
        //     });
        // }
        // await this.setState({ filteredReportList: newData })
    }

    //returns markup and text for report Status 
    //according to the passed in status code
    //primarily used from tblRow() but also called
    //from setStatus()
    getStatusCss = (code) => {
        code = +code; //ensure it's a number, not a string
        let css, text = "", icon = "", badge = <></>, badgeBG = "";
        switch (code) {
            case -1: text = ""
            case PENDING:
                text = "Pending";
                icon = "faExclamationTriangle";
                badge = <Badge bg="info">Pending</Badge>;
                badgeBG = "info";
                break;
            case PROCESSING:
                css = {
                    // padding: '5px',
                    // backgroundColor: "gold",
                    // alignItems: ' stretch',
                    // width: '81px',
                    // left: '6px',
                    // top: '2px',
                    // fontFamily: 'Roboto',
                    // fontStyle: 'normal',
                    // fontWeight: '500',
                    // fontSize: '14px',
                    // lineHeight: '150%',
                    /* identical to box height, or 21px */
                    // color: '#FFFFFF'
                };
                badge = <span className="btn processing" bg="warning">Processing</span>;
                badgeBG = "warning";
                text = "Processing";
                icon = "faClock"
                break;
            case NEEDACTION:
                text = "warning?????";
                icon = "faExclamationTriangle";
                badge = <Badge bg="danger">Warning</Badge>;
                badgeBG = "danger";
                break;
            case ERROR:
                text = "Error";
                icon = "faExclamationTriangle";
                badge = <Badge bg="secondary">Error</Badge>;
                badgeBG = "secondary";

                break;
            case COMPLETED:
                css = {
                    // width: '35px',
                    // height: '21px',
                    // left: '6px',
                    // top: '2px',
                    // fontFamily: 'Roboto',
                    // fontStyle: 'normal',
                    // fontWeight: '500',
                    // fontSize: '14px',
                    // lineHeight: '150%',
                    // color: '#388F46',
                }
                text = "Completed"
                badge = <span className="btn completed" bg='success'>Completed</span>;
                icon = "faDownload"
                badgeBG = 'success';
                break;
            case CANCELLED:
                text = "Cancelled";
                badge = <span className="btn canceled" bg='dark'>Cancelled</span>;
                badgeBG = 'dark';
                break;
            default: break;

        }
        return { css: css, text: text, icon: icon, badge: badge, badgeBG: badgeBG };
    }

    setNewComment = (row) => {
        let id = row._id;
        let rows = this.state.origReportList;
        let thisRow = rows.findIndex(item => item._id == id);
        if (thisRow >= 0) {
            let comment = {
                comment: this.state.newComment,
                create_date: new Date(),
                is_private: this.state.newCommentVisibility == "private",
                status_code: null,
                status: null
            }


            if (rows[thisRow].comments.other !== undefined) { //if the other section exists
                rows[thisRow].comments.other.push(comment)
            }
            else {
                rows[thisRow].comments.other = [comment]
            }
        }
    }

    tblRow = (row, index) => {
        const getCodes = (rpts) => {
            let incorporate = rpts?.incorporate;
            let bank = rpts?.bank;
            let legal = rpts?.legal;
            let suppliers = rpts?.suppliers;
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

        let refId = row?.reference_id;
        let order_date = row?.order_date;
        let order_time = row?.order_time;
        let subject_name = row?.subject_name;
        let user_name = row?.user_name;
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

                    <td><div className={`status${status.status_code}`}>{status.badge}</div></td>
                    <td><div className={`status${row.reports.incorporate.status_code}`}>
                        {(row.reports.incorporate.status_code == -1) ? '' : <span className="btn incorporate" bg={reportCodes.incorporate.badgeBG}>Incorporate</span>}</div></td>
                    <td><div className={`status${row.reports.bank.status_code}`}>
                        {(row.reports.bank.status_code == -1) ? '' : <span className="btn bank_download" bg={reportCodes.bank.badgeBG}>Bank</span>}</div></td>
                    <td><div className={`status${row.reports.legal.status_code}`}>
                        {(row.reports.legal.status_code == -1) ? '' : <button className="btn legal" bg={reportCodes.legal.badgeBG}>Legal</button>}</div></td>
                    <td>
                        <div className={`suppliers status${row.reports.suppliers.status_code}`}>
                            {(row.reports.suppliers.status_code == -1) ? '' : <button className="btn supplier" bg={reportCodes.suppliers.badgeBG}>Suppliers</button>}</div>
                    </td>
                    <td>
                        <button className="btn download" style={{ border: "none" }} disabled={isDisabled}>Download All</button>
                    </td>
                    <td>
                        <button className="downarrow" onClick={(e) => this.showDropdownRow(e, index)} />
                    </td>
                </tr>
                <tr className="collapse" key={index + "_2"}>
                    <td colSpan={11} className="comments_indent">

                        <Table style={{ width: '100%' }} striped >
                            <tbody>
                                <tr>
                                    <td colSpan={1}>
                                        <button className="btn btnremove"
                                            onClick={() => this.requestCancel(row._id)}>Request Cancellation</button>
                                    </td>
                                    <td colSpan={1}>

                                    </td>
                                    <td colSpan={1}>
                                        <div className="admin_moreinfo text-end">
                                            {this.state.role === 'admin' ?
                                                <>
                                                    <button className="btn btn_light" style={{ borderWidth: '1px' }}
                                                        onClick={() => this.changeStatus(row)}>Change Status</button>
                                                    <button className="btn btn_light" style={{ borderWidth: '1px' }}
                                                        onClick={() => this.showLinks(row._id)}>Show External Links</button>
                                                </>
                                                :
                                                ''
                                            }
                                            <button className="btn btnedit" disabled
                                                onClick={() => this.viewApplication(row._id)}>View Credit Application</button>
                                            <button className="btn btnedit"
                                                onClick={() => this.orderReport(row._id)}>View Report Form</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={11} className="comments_indent">
                                        <h5>More Information</h5>
                                        <div className="more_info_wrap">
                                            <table width="100%">
                                                <tr>
                                                    <td>
                                                        <p>
                                                            Price Chart: <strong>A1</strong><br />
                                                            User Phone: <strong>+1234567890</strong><br />
                                                            User Email: <strong><a href="mailto:email@company.ca">email@company.ca</a></strong><br />
                                                        </p>
                                                    </td>
                                                    <td className="info_manual">Set Manually</td>
                                                    <td className="info_price"><strong>Final Price:</strong><br />
                                                        Price :<br />
                                                        Aging Discount :<br />
                                                        Extra<br />
                                                    </td>
                                                    <td className="info_unit"><strong>CAD 90</strong><br />
                                                        CAD 100<br />
                                                        CAD 10 (10%)<br />
                                                        CAD 20
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={11} className="comments_indent">
                                        <h5>Status & Comments</h5>
                                        <div className="comments_wrapper">
                                            {this.state.role === 'admin' ?
                                                <table width="100%">
                                                    <tr>
                                                        <td>
                                                            <input type='text' className="form-control" onChange={() => this.setState({ newComment: e.target.value })}
                                                                placeholder='Write a comment here' />
                                                        </td>
                                                        <td className="post_status_wrap">
                                                            <select className="form-select" onChange={(e) => this.setState({ newCommentVisibility: e.target.value })}>
                                                                <option value='private'>Private</option>
                                                                <option value='public'>Public</option>
                                                            </select>
                                                        </td>
                                                        <td className="post_add_wrap">
                                                            <button className="btn btn-primary" onClick={() => this.setNewComment(row)}>Post</button>
                                                        </td>
                                                    </tr>
                                                </table>
                                                : ''
                                            }
                                            <div className="comments_item_wrap">
                                                <div className="comments_items">
                                                    <h6>System</h6>
                                                    <p>{row?.comments?.system?.comment}
                                                        <small>{this.getDate(row?.comments?.system?.create_date)}</small>
                                                    </p>
                                                </div>
                                                <div className="comments_items">
                                                    <h6>Alliance Credit</h6>
                                                    <p>{row.comments.custom.comment}
                                                        <small>{this.getDate(row.comments.custom.create_date)}</small>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </Table>

                    </td>
                </tr >
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

        return (<span className='date'>{txt}</span>)
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

    setDates = (rangeNum) => {
        let startDate, endDate;
        let today = new Date();
        let month, year;
        switch (rangeNum) {

            case 0: //today
                startDate = today;
                endDate = today;
                break;
            case 1: //yesterday
                startDate = add(today, { days: -1 });
                endDate = add(today, { days: -1 })
                break;
            case 2://last 7 days
                startDate = add(today, { days: -7 })
                endDate = add(today, { days: -1 })
                break;
            case 3: //last 30 days
                startDate = add(today, { days: -30 })
                endDate = add(today, { days: -1 })
                break;
            case 4://this month
                month = getMonth(today);
                year = getYear(today);
                startDate = new Date(year, month, 1)
                endDate = lastDayOfMonth(today);
                break;
            case 5://this year
                month = getMonth(today);
                year = getYear(today);
                startDate = new Date(year, 0, 1)
                endDate = lastDayOfYear(today);
                break;
        }

        //send calculated values to default "date change" function of DatePicker component
        this.filterDates([startDate, endDate]);
        this.setState({ dateRange: rangeNum })

    }

    rangeContainer = ({ className, children }) => {
        //div sill call setDates to calculate and display date range
        //backround 'dateRange' variable will also be set to change color
        return (

            <CalendarContainer className={className}>
                <Row>
                    <Col>
                        <div onClick={() => this.setDates(0)} className={this.state.dateRange == 0 ? "bg-primary" : "bg-white"} >Today</div>
                        <div onClick={() => this.setDates(1)} className={this.state.dateRange == 1 ? "bg-primary" : "bg-white"} >Yesterday</div>
                        <div onClick={() => this.setDates(2)} className={this.state.dateRange == 2 ? "bg-primary" : "bg-white"} >Last 7 Days</div>
                        <div onClick={() => this.setDates(3)} className={this.state.dateRange == 3 ? "bg-primary" : "bg-white"} >Last 30 Days</div>
                        <div onClick={() => this.setDates(4)} className={this.state.dateRange == 4 ? "bg-primary" : "bg-white"} >This Month</div>
                        <div onClick={() => this.setDates(5)} className={this.state.dateRange == 5 ? "bg-primary" : "bg-white"} >This Year</div>
                    </Col><Col>
                        <div style={{ position: "relative" }}>{children}</div>
                    </Col>
                </Row>
            </CalendarContainer>
        );
    };

    render() {
        if (this.state.reportList === null) {
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
                { value: "Canceled", label: "Cancelled" },
                { value: "Completed", label: "Completed" },
                { value: "Processing", label: "Processing" },
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
                                            checked={this.state.statusChangeRow?.status_code == PROCESSING} /></td>
                                        <td>Processing</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, NEEDACTION, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, NEEDACTION, 0)}
                                            checked={this.state.statusChangeRow?.status_code == NEEDACTION} /></td>
                                        <td>Need Action</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, ERROR, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, ERROR, 0)}
                                            checked={this.state.statusChangeRow?.status_code == ERROR} /></td>
                                        <td>Error</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, PENDING, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, PENDING, 0)}
                                            checked={this.state.statusChangeRow?.status_code == PENDING} /></td>
                                        <td>Pending</td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox'
                                            onClick={(e) => this.setStatus(this.state.statusChangeRow, COMPLETED, 0)}
                                            onChange={(e) => this.setStatus(this.state.statusChangeRow, COMPLETED, 0)}
                                            checked={this.state.statusChangeRow?.status_code == COMPLETED} /></td>
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
                    <Container fluid>
                        <div className="search">
                            <Row>

                                <Col sm={3}>
                                    <label htmlFor="companysearch" className="form-label">Search</label>
                                    <input type='text' className="form-control" id="companysearch" placeholder="Search" onChange={(e) => this.filterText(e)} />
                                </Col>

                                <Col sm={3} className='filterCol text-start'>
                                    <div className="status" style={{ width: '75%' }}>
                                        <label htmlFor="Status" className="form-label">Status</label>

                                        <Select className="form-select role" onChange={(e) => this.filterStatus(e)}
                                            onClick={(e) => this.filterStatus(e)}
                                            options={options}
                                            isMulti
                                            className="multiSelect"
                                            style={{ width: '250px' }}
                                        />

                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="select_date">
                                        <label htmlFor="Status" className="form-label">Filter By Date</label>
                                        <div className='filterCol'
                                            onClick={e => this.setState({ showDates: true })}>
                                            <DatePicker

                                                selectsRange={true}
                                                startDate={this.state.startFilter}
                                                endDate={this.state.endFilter}
                                                onChange={(update) => {
                                                    this.filterDates(update);
                                                }}
                                                isClearable={true}
                                                calendarContainer={this.rangeContainer}
                                            />

                                        </div>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <button className="btn addbtn" onClick={this.orderReport}>Order New Report</button>
                                </Col>

                            </Row>
                        </div>
                        <div className="listing">
                            <table>
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
                                    {this.state.filteredReportList?.map((row, index) => {
                                        return this.tblRow(row, index);
                                    })}
                                </tbody>
                            </table>
                        </div>
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

