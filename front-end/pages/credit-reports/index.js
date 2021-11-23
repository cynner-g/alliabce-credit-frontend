import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faDownload, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { differenceInDays, formatRelative, subDays, parseISO } from 'date-fns'
import DatePicker from 'react-datepicker'
import Header from "../../components/header"
import Router, { withRouter } from "next/router"
// import Pagination from "../../components/datatable/pagination"
// import DynamicTable from "../../components/DynamicTable"
import { Loading } from "../../components/LoadingComponent"
import { Table, Container, Row, Col } from 'react-bootstrap';
import { credit_report_list, cancel_credit_report } from "../../data/reports";
import React, { Component } from 'react';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";

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
            endFilter: null
        };
    }

    componentDidMount() {
        credit_report_list(null, null).then((data) => {
            this.setState({ origReportList: data, filteredReportList: data })
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

    onClickHandler = (e, item) => {
        let rotation = [...this.state.rotation];
        if (rotation[item] == undefined) rotation[item] = 0;
        rotation[item] = rotation[item] == 0 ? 180 : 0;
        console.log(rotation);
        this.setState({ rotation: rotation })

        let target = e.currentTarget.parentNode;

        while (target.nodeName !== "TR") target = target.parentNode;
        const hiddenElement = target.nextSibling;
        console.log(hiddenElement)
        hiddenElement.className.indexOf("collapse show") > -1 ? hiddenElement.classList.remove("show") : hiddenElement.classList.add("show");
    };

    filterDates = async (update) => {
        this.setState({ startFilter: update[0], endFilter: update[1] });
        let newData = this.state.origReportList;
        if (this.state.startFilter != null) {
            newData = await newData.filter(row => {
                console.log("Create: ", row.create_date)
                console.log("Filter: ", this.state.filterStart)
                return differenceInDays(parseISO(row.create_date), parseISO(this.state.startFilter)) >= 0;
            })

            newData = await newData.filter(row => {
                console.log("Create: ", row.create_date)
                console.log("Filter: ", this.state.filterStart)
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

    tblRow = (row, index) => {
        const getStatusCss = (code) => {
            code = +code;
            let css, text = "", icon = "";
            switch (code) {
                case -1: text = ""
                case 1: break;
                case 2:
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
                    text = "Processing";
                    icon = "faClock"
                    break;
                case 3:
                    text = "warning?????";
                    icon = "faExclamationTriangle";
                    break;
                case 4: break;
                case 5:
                    text = "Completed";
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
                    icon = "faDownload"
                    break;
                case 6:
                    text = "Cancelled";
                    break;
                default: break;

            }
            return { css: css, text: text, icon: icon };
        }

        const getCodes = (rpts) => {
            let incorporate = rpts.incorporate;
            let bank = rpts.bank;
            let legal = rpts.legal;
            let suppliers = rpts.suppliers;
            //not entirely necessary now....
            let incorporateCSS = getStatusCss(incorporate.status_code);
            let bankCSS = getStatusCss(bank.status_code);
            let legalCSS = getStatusCss(legal.status_code);
            let suppliersCSS = getStatusCss(suppliers.status_code);

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
        let status = getStatusCss(row.status_code)
        let reportCodes = getCodes(row.reports);
        let isDisabled = false
        for (let report of row.ordered_reports) {
            if (row.reports[report.toLowerCase()].status_code !== 5) isDisabled = true;
        }

        return (
            <>
                <tr key={index}>
                    <td>{refId}</td>
                    <td>{order_date}<br /><span className="small10">{order_time}</span></td>
                    <td>{subject_name}</td>
                    <td>{user_name}<br /><span className="small10">{company_name}</span></td>

                    <td><div className={`status status${status.status_code}`}>{status.text}</div></td>
                    <td><div className={`incorporate status${reportCodes.incorporate.status_code}`}>{reportCodes.incorporate.text}</div></td>
                    <td><div className={`bank status${reportCodes.bank.status_code}`}>{reportCodes.bank.text}</div></td>
                    <td><div className={`legal status${reportCodes.legal.status_code}`}>{reportCodes.legal.text}</div></td>
                    <td><div className={`suppliers status${reportCodes.suppliers.status_code}`}>{reportCodes.suppliers.text}</div></td>
                    <td>
                        <button className="btn btn-outline-primary" style={{ border: "none" }} disabled={isDisabled}>Download All</button>
                    </td>
                    <td>
                        <FontAwesomeIcon icon={faCaretDown} style={{ transform: `rotate(${this.state.rotation[index] || 0}deg)`, height: '15px' }} onClick={(e) => this.onClickHandler(e, index)} />
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
                                        <button className="btn btn-outline-primary"
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

    getDate = (dt) => {
        dt = parseISO(dt); //date-fns parse the ISO string to a correct date object
        let numDays = differenceInDays(new Date(), dt); //get number of days between now and then
        let txt = formatRelative(subDays(dt, numDays), new Date()) //display in easy to read format
        return txt;
    }

    requestCancel = (rptId) => {
        //send fetch request here for cancellation
        cancel_credit_report(rptId);
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




    // getColumns = () => {
    //     {
    //         "_id": "619a61d19c9e463d02d0058a",
    //             "reference_id": "1637507537900",
    //                 "is_quick_report": "false",
    //                     "credit_application": "credit_application/credit_application_1637507537724.pdf",
    //                         "ordered_reports": [
    //                             "Incorporate",
    //                             "Bank",
    //                             "Legal",
    //                             "Suppliers"
    //                         ],
    //                             "status_code": 6,
    //                                 "reports": {
    //             "incorporate": {
    //                 "status_code": 5,
    //                     "status": "Completed"
    //             },
    //             "bank": {
    //                 "status_code": 2,
    //                     "is_ordered": true,
    //                         "status": "Processing"
    //             },
    //             "legal": {
    //                 "status_code": 2,
    //                     "is_ordered": true,
    //                         "status": "Processing"
    //             },
    //             "suppliers": {
    //                 "status_code": 2,
    //                     "is_ordered": true,
    //                         "status": "Processing"
    //             }
    //         },
    //         "order_date": "21/11/2021",
    //             "order_time": "15:09",
    //                 "subject_name": "JK Webdesign",
    //                     "user_name": "Admin",
    //                         "company_name": "Facebook Inc",
    //                             "is_new": true,
    //                                 "status": "Canceled",
    //                                     "comments": {
    //             "system": {
    //                 "comment": "Report under process",
    //                     "create_date": "2021-11-21T15:09:12.814Z",
    //                         "status_code": 2,
    //                             "is_private": false,
    //                                 "status": "Processing"
    //             },
    //             "custom": {
    //                 "comment": "Report under process",
    //                     "create_date": "2021-11-21T15:09:12.814Z",
    //                         "status_code": 2,
    //                             "is_private": false,
    //                                 "status": "Processing"
    //             }
    //         }
    //     }

    //     let columns = [
    //         {
    //             colName: "Name",
    //             displayName: "Name",
    //             type: "link",
    //             visible: true,
    //             onClick: this.handleClick,
    //         }
    //         , {
    //             colName: "Position",
    //             displayName: "Position",
    //             visible: true
    //         }
    //         , {
    //             colName: "Office",
    //             displayName: "Office",
    //             visible: true
    //         }
    //         , {
    //             colName: "Age",
    //             displayName: "Age",
    //             type: "link",
    //             onClick: this.handleClick,
    //         }
    //         , {
    //             colName: "Start date",
    //             displayName: "Start_date",
    //             type: "link",
    //             onClick: this.handleClick,
    //         }
    //         , {
    //             colName: "Salary",
    //             displayName: "Salary",
    //             type: "link",
    //             onClick: this.handleClick,
    //         }
    //     ]
    //     return columns;
    // }


    //     let data = {
    //         “status_code”: 200,
    //         “data”: [
    //     {
    //                 “_id”: “61953d9b3be1c7cf53d141b5",
    //                 “reference_id”: “1637170587851",
    //                 “is_quick_report”: “false”,
    //                 “credit_application”: “testing”,
    //                 “ordered_reports”: [
    //                     “Incorporate”,
    //                     “Bank”
    //     ],
    //                 “status_code”: 2,
    //                 “reports”: {
    //                     “incorporate”: {
    //                         “status_code”: 5,
    //                         “is_ordered”: true,
    //                         “status”: “Completed”
    //     },
    //                     “bank”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     },
    //                     “legal”: {
    //                         “status_code”: - 1,
    //                         “is_ordered”: false,
    //                         “status”: “Not Ordered”
    //                     },
    //                     “suppliers”: {
    //                         “status_code”: - 1,
    //                         “is_ordered”: false,
    //                         “status”: “Not Ordered”
    //                     }
    //                 },
    //                 “order_date”: “17 / 11 / 2021”,
    //                 “order_time”: “17: 34”,
    //                 “subject_name”: “JK Webdesign”,
    //                 “user_name”: “Admin”,
    //                 “company_name”: “Facebook Inc”,
    //                 “is_new”: true,
    //                 “status”: “Processing”,
    //                 “comments”: {
    //                     “system”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 17T17: 34: 54.210Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     },
    //                     “custom”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 17T17: 34: 54.210Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     }
    //                 }
    //             },
    //     {
    //                 “_id”: “619a61d19c9e463d02d0058a”,
    //                 “reference_id”: “1637507537900”,
    //                 “is_quick_report”: “false”,
    //                 “credit_application”: “credit_application / credit_application_1637507537724.pdf”,
    //                 “ordered_reports”: [
    //                     “Incorporate”,
    //                     “Bank”,
    //                     “Legal”,
    //                     “Suppliers”
    //     ],
    //                 “status_code”: 6,
    //                 “reports”: {
    //                     “incorporate”: {
    //                         “status_code”: 5,
    //                         “is_ordered”: true,
    //                         “status”: “Completed”
    //     },
    //                     “bank”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     },
    //                     “legal”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     },
    //                     “suppliers”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     }
    //                 },
    //                 “order_date”: “21 / 11 / 2021",
    //                 “order_time”: “15: 09",
    //                 “subject_name”: “JK Webdesign”,
    //                 “user_name”: “Admin”,
    //                 “company_name”: “Facebook Inc”,
    //                 “is_new”: true,
    //                 “status”: “Canceled”,
    //                 “comments”: {
    //                     “system”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 21T15: 09: 12.814Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     },
    //                     “custom”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 21T15: 09: 12.814Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     }
    //                 }
    //             },
    //     {
    //                 “_id”: “619aa4db87c0d1f3f8ea329c”,
    //                 “reference_id”: “1637520931971",
    //                 “is_quick_report”: “false”,
    //                 “credit_application”: “credit_application / credit_application_1637520931808.pdf”,
    //                 “ordered_reports”: [],
    //                 “status_code”: 2,
    //                 “reports”: {
    //                     “incorporate”: {
    //                         “status_code”: 5,
    //                         “is_ordered”: true,
    //                         “status”: “Completed”
    //     },
    //                     “bank”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     },
    //                     “legal”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     },
    //                     “suppliers”: {
    //                         “status_code”: 2,
    //                         “is_ordered”: true,
    //                         “status”: “Processing”
    //     }
    //                 },
    //                 “order_date”: “21 / 11 / 2021”,
    //                 “order_time”: “19: 58”,
    //                 “subject_name”: “JK Webdesign”,
    //                 “user_name”: “Admin”,
    //                 “company_name”: “Facebook Inc”,
    //                 “is_new”: true,
    //                 “status”: “Processing”,
    //                 “comments”: {
    //                     “system”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 21T19: 58: 16.892Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     },
    //                     “custom”: {
    //                         “comment”: “Report under process”,
    //                         “create_date”: “2021 - 11 - 21T19: 58: 16.892Z”,
    //                         “status_code”: 2,
    //                         “is_private”: false,
    //                         “status”: “Processing”
    //                     }
    //                 }
    //             }
    // ]    }
