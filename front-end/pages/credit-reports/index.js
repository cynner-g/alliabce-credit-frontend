

import {
    differenceInDays, format, formatRelative,
    subDays, parseISO, add, getMonth, getYear,
    lastDayOfMonth, lastDayOfYear, startOfDay, endOfDay
} from 'date-fns'

import Header from "../../components/header"
import Router from "next/router"
import Cookies from "js-cookie"

import { Loading } from "../../components/LoadingComponent"
import { Table, Container, Row, Col, Badge, Modal } from 'react-bootstrap';
import {
    order_list,
    cancel_order,
    add_comment,
    update_status,
    download_report_file
} from "../api/credit_reports";
import React, { Component } from 'react';
// import Select from 'react-select';
// import DatePicker, { CalendarContainer } from 'react-datepicker'
import { TagPicker, DateRangePicker } from 'rsuite'
import "react-datepicker/dist/react-datepicker.css";
import 'rsuite/dist/rsuite.min.css';
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
            rowStatus: { row: null, statusText: '', status: null },
            filterStatusData: [],
            token: Cookies.get('token')
        };
    }

    async componentDidMount() {
        this.get_data();
    }

    download_report = (id, type) => {
        const body = {
            report_order_id: id,
            type: type
        }
        api_token: this.state.token, (body, this.state.token)
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
        if (update == null) {
            update = [null, null] //make sure the array is updated correctly
        }
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
        await this.setState({ searchFilter: text })
        this.get_data();
    }

    filterStatus = async (e) => {
        if (e?.includes('All') || !e) e = [];
        await this.setState({ filterStatusData: e });
        this.get_data();
    }

    showLinks = () => {

    }

    //returns markup and text for report Status 
    //according to the passed in status code
    //primarily used from tblRow() but also called
    //from setStatus()
    getStatusCss = (code) => {
        code = +code; //ensure it's a number, not a string
        let css, text = "", icon = "", badge = <></>, badgeBG = "", className = '';
        switch (code) {
            case -1: text = ""; break;
            case PENDING:
                text = "Pending";
                className = "or_pending";
                badge = <span className="pending">Pending</span>;
                badgeBG = "info";
                break;
            case PROCESSING:
                badge = <span className="btn processing">Processing</span>;
                badgeBG = "processing";
                className = "or_processing"
                text = "Processing"

                break;
            case NEEDACTION:
                text = "Needs Action";
                className = "or_need_action";
                badge = <span className="btn need_action">Needs Action</span>;
                badgeBG = "danger";
                break;
            case ERROR:
                text = "Error";
                className = "or_error"
                badge = <span className="btn error">Error</span>;
                badgeBG = "secondary";
                break;
            case COMPLETED:
                text = "Completed"
                badge = <span className="btn completed">Completed</span>;
                className = "or_success"

                badgeBG = 'success';
                break;
            case CANCELLED:
                text = "Cancelled";
                className = "or_cancelled"
                badge = <span className="btn canceled">Cancelled</span>;
                badgeBG = 'dark';
                break;
            default: break;

        }
        return { className: className, text, badge, badgeBG };
    }

    buildDateTime = (dt) => {
        dt = new Date(dt);
        let day = 'MM-dd-uuuu'
        let time = 'h:mmaa'
        return (<><div>{format(dt, day)}</div><div className='cr-time' style={{ marginTop: '-4px', fontSize: '12px' }}>{format(dt, time)}</div></>)
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

        row.comments.sort((a, b) => new Date(b.create_date).getTime() - new Date(a.create_date).getTime())

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
                <tr>
                    <td>{refId}</td>
                    <td><div>{this.buildDateTime(order_date)}</div></td>
                    <td>{subject_name}</td>
                    <td>{user_name}<br /><span className="small10">{company_name}</span></td>
                    <td><div className={`status${status.status_code} order-status`}>{status.badge}</div></td>

                    <td className="buttongroups_wrap">
                        <div className="buttongroups">
                            <div className={`status${row.reports.incorporate.status_code}`}>
                                {(row.reports.incorporate.status_code == -1) ? '' :
                                    <span className={`btn report-status incorporate ${reportCodes.incorporate.className}`}
                                        onClick={(e) => { row.reports.incorporate.status_code == COMPLETE ? this.download_report(row.reports.incorporate._id, "Incorporate") : null }}
                                    >Incorporate</span>}
                            </div>
                            <div className={`status${row.reports.bank.status_code}`}>
                                {(row.reports.bank.status_code == -1) ? '' :
                                    <span className={`btn report-status bank_download ${reportCodes.bank.className}`}
                                        onClick={(e) => { row.reports.bank.status_code == COMPLETE ? this.download_report(row.reports.bank._id, "Bank") : null }}
                                    >Bank</span>}
                            </div>
                            <div className={`status${row.reports.legal.status_code}`}>
                                {(row.reports.legal.status_code == -1) ? '' :
                                    <span className={`btn report-status legal ${reportCodes.legal.className}`}
                                        onClick={(e) => { row.reports.legal.status_code == COMPLETE ? this.download_report(row.reports.legal._id, "Legal") : null }}
                                    >Legal</span>}
                            </div>
                            <div className={`suppliers status${row.reports.suppliers.status_code}`}>
                                {(row.reports.suppliers.status_code == -1) ? '' :
                                    <span className={`btn report-status supplier ${reportCodes.suppliers.className}`}
                                        onClick={(e) => { row.reports.suppliers.status_code == COMPLETE ? this.download_report(row.reports.suppliers._id, "Suppliers") : null }}
                                    >Suppliers</span>}
                            </div>
                            <div><button className="btn download" disabled={isDisabled} onClick={(this.download_report(row._id, 'All')}>Download All</button></div>
                            <div><button className="btn downarrow" onClick={(e) => this.showDropdownRow(e, index)} /></div>
                        </div>
                    </td>
                </tr>
                <tr className="collapse" key={index + "_2"}>
                    <td colSpan={6} className="comments_indent">
                        <Table style={{ width: '100%' }} striped >
                            <tbody>
                                <tr>
                                    <td colSpan={1}>
                                        {this.state.role === 'admin' ? '' :
                                            <button className="btn btnremove"
                                                onClick={() => this.requestCancel(row._id)}>Request Cancellation</button>
                                        }
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
                                                <tbody>
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
                                                </tbody>
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
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <input type='text' className="form-control" value={this.state.newComment} onChange={(e) => this.setState({ newComment: e.target.value })}
                                                                    placeholder='Write a comment here' />
                                                            </td>
                                                            <td className="post_status_wrap">
                                                                <select className="form-select" value={this.state.newCommentVisibility} onChange={(e) => this.setState({ newCommentVisibility: e.target.value })}>
                                                                    <option value='private'>Private</option>
                                                                    <option value='public'>Public</option>
                                                                </select>
                                                            </td>
                                                            <td className="post_add_wrap">
                                                                <button className="btn btn-primary" onClick={(e) => this.setNewComment(e, row)}>Post</button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                : ''
                                            }
                                            <div className="comments_item_wrap">
                                                {row.comments?.map((comment, idx) => {
                                                    if (!comment.is_private || this.state.role === 'admin') {
                                                        return (
                                                            <div className='comments_items' key={idx}>
                                                                <Row>
                                                                    <Col>
                                                                        <h6 className='comment-header'>{comment.is_system_comment ? "System" : "Alliance Credit"}</h6>

                                                                        {this.getStatusCss(comment.status_code).badge}
                                                                    </Col>
                                                                </Row><Row>
                                                                    <Col>
                                                                        {comment.comment}
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    <Col>
                                                                        <small>{this.getDate(comment.create_date)}</small>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        )
                                                    }
                                                    else return null;
                                                })}

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

    setStatus = async (row, value, type) => {

        // rowStatus: { row: null, statusText: '', status: null },

        let status = this.state.rowStatus;

        if (type == 0) { //checkbox
            status.row = row;
            status.status = value;
            this.setState({ rowStatus: status });
        }
        else if (type == 1) {//textarea
            status.row = row;
            status.statusText = value;
            this.setState({ rowStatus: status });
        }
        else if (type == 2) {//submit button
            let token = Cookies.get('token');
            let updatedStatus = {
                report_order_id: this.state.rowStatus.row._id,
                comment: this.state.rowStatus.statusText,
                status_code: this.state.rowStatus.status
            }
            await update_status(updatedStatus, token)
            this.get_data();
            this.setState({ rowStatus: { row: null } });
        }
        else if (type == 3) {//cancel button
            this.setState({ rowStatus: { row: null } });
        }
    }


    setNewComment = async (e, row) => {
        let id = row._id;
        let token = Cookies.get('token');
        let comment = {
            comment: this.state.newComment,
            report_order_id: id,
            is_private: this.state.newCommentVisibility == "private",
        }

        await add_comment(comment, token);
        this.get_data();
        this.setState({ newComment: '', newCommentVisibility: 'private' })
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
        let label = '';
        switch (rangeNum) {
            case 0: //today
                startDate = today;
                endDate = today;
                label = 'Today'
                break;
            case 1: //yesterday
                startDate = add(today, { days: -1 });
                endDate = add(today, { days: -1 })
                label = 'Yesteray'
                break;
            case 2://last 7 days
                startDate = add(today, { days: -7 })
                endDate = add(today, { days: -1 })
                label = 'Last 7 Days'
                break;
            case 3: //last 30 days
                startDate = add(today, { days: -30 })
                endDate = add(today, { days: -1 })
                label = 'Last 30 Days'
                break;
            case 4://this month
                month = getMonth(today);
                year = getYear(today);
                startDate = new Date(year, month, 1)
                endDate = lastDayOfMonth(today);
                label = 'This Month'
                break;
            case 5://this year
                month = getMonth(today);
                year = getYear(today);
                startDate = new Date(year, 0, 1)
                endDate = lastDayOfYear(today);
                label = 'This Year'
                break;
        }



        //send calculated values to default "date change" function of DatePicker component
        // this.filterDates([startDate, endDate]);
        // this.setState({ dateRange: rangeNum })
        return { label: label, value: [new Date(startDate), new Date(endDate)] }

    }

    // rangeContainer = ({ className, children }) => {
    //     //div sill call setDates to calculate and display date range
    //     //backround 'dateRange' variable will also be set to change color
    //     return (

    //         <CalendarContainer className={className}>
    //             <Row>
    //                 <Col>
    //                     <div onClick={() => this.setDates(0)} className={this.state.dateRange == 0 ? "bg-primary" : "bg-white"} >Today</div>
    //                     <div onClick={() => this.setDates(1)} className={this.state.dateRange == 1 ? "bg-primary" : "bg-white"} >Yesterday</div>
    //                     <div onClick={() => this.setDates(2)} className={this.state.dateRange == 2 ? "bg-primary" : "bg-white"} >Last 7 Days</div>
    //                     <div onClick={() => this.setDates(3)} className={this.state.dateRange == 3 ? "bg-primary" : "bg-white"} >Last 30 Days</div>
    //                     <div onClick={() => this.setDates(4)} className={this.state.dateRange == 4 ? "bg-primary" : "bg-white"} >This Month</div>
    //                     <div onClick={() => this.setDates(5)} className={this.state.dateRange == 5 ? "bg-primary" : "bg-white"} >This Year</div>
    //                 </Col><Col>
    //                     <div style={{ position: "relative" }}>{children}</div>
    //                 </Col>
    //             </Row>
    //         </CalendarContainer>
    //     );
    // };

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
            const options = [
                { value: "All", label: "All" },
                { value: "New", label: "New" },
                { value: "Processing", label: "Processing" },
                { value: "Pending", label: "Pending" },
                { value: "Need Action", label: "Needs Action" },
                { value: "Completed", label: "Completed" },
            ]

            const dateSegments = [
                this.setDates(0),
                this.setDates(1),
                this.setDates(2),
                this.setDates(3),
                this.setDates(4),
                this.setDates(5),
            ];
            return (
                <>
                    <Modal
                        show={this.state.rowStatus?.row !== null}
                        onHide={() => this.setStatus(null, null, 3)}
                        backdrop="static">
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>

                            <div className="form-check">
                                <input type='checkbox' className="form-check-input" id="processing"
                                    onClick={(e) => this.setStatus(this.state.rowStatus?.row, PROCESSING, 0)}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, PROCESSING, 0)}
                                    checked={this.state.rowStatus?.status == PROCESSING} />

                                <label className="form-check-label" htmlFor="processing">Processing</label>
                            </div>
                            <div className="form-check">

                                <input type='checkbox' className="form-check-input" id="needaction"
                                    onClick={(e) => this.setStatus(this.state.rowStatus?.row, NEEDACTION, 0)}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, NEEDACTION, 0)}
                                    checked={this.state.rowStatus?.status == NEEDACTION} />

                                <label className="form-check-label" htmlFor="needaction">Need Action</label>
                            </div>
                            <div className="form-check">

                                <input type='checkbox' className="form-check-input" id="error"
                                    onClick={(e) => this.setStatus(this.state.rowStatus?.row, ERROR, 0)}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, ERROR, 0)}
                                    checked={this.state.rowStatus?.status == ERROR} />


                                <label className="form-check-label" htmlFor="error">Error</label>
                            </div>
                            <div className="form-check">
                                <input type='checkbox' className="form-check-input"
                                    onClick={(e) => this.setStatus(this.state.rowStatus?.row, PENDING, 0)}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, PENDING, 0)}
                                    checked={this.state.rowStatus?.status == PENDING} />


                                <label className="form-check-label" htmlFor="flexCheckDefault">Pending</label>
                            </div>
                            <div className="form-check">
                                <input type='checkbox' className="form-check-input"
                                    onClick={(e) => this.setStatus(this.state.rowStatus?.row, COMPLETED, 0)}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, COMPLETED, 0)}
                                    checked={this.state.rowStatus?.status == COMPLETED} />


                                <label className="form-check-label" htmlFor="flexCheckDefault">Completed</label>
                            </div>
                            {this.rowStatus?.status ? this.getStatusCss(this.rowStatus?.status).badge : ''}


                            <div className="mt-3">
                                <textarea className="form-control"
                                    cols={50}
                                    rows={4}
                                    onChange={(e) => this.setStatus(this.state.rowStatus?.row, e.target.value, 1)}>
                                </textarea>
                            </div>


                        </Modal.Body >
                        <Modal.Footer className="flexstart">
                            <div>
                                <button className="btn btnedit m-3" onClick={() => this.setStatus(this.state.rowStatus?.row, null, 3)}>
                                    Cancel
                                </button>

                                <button className="btn btn-primary"
                                    onClick={() => this.setStatus(null, null, 2)}
                                    disabled={this.state.rowStatus?.statusText === ''}
                                >
                                    Update Status
                                </button>

                            </div>
                        </Modal.Footer>
                    </Modal >

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
                                        {/* <label htmlFor="Status" className="form-label">Status</label> */}

                                        <TagPicker data={options} placeholder='Filter Status'
                                            onChange={(e) => this.filterStatus(e)}
                                            style={{ width: '250px' }}
                                            onChange={(e) => this.filterStatus(e)}
                                            style={{ width: '250px' }}
                                        />

                                        {/* <Select className="form-select role"


                                            options={options}
                                            isMulti
                                            className="multiSelect"
                                            style={{ width: '250px' }}
                                        /> */}

                                    </div>
                                </Col>

                                <Col sm={4}>
                                    <div className="select_date">
                                        <label htmlFor="Status" className="form-label">Filter By Date</label>
                                        <div className='filterCol'
                                            onClick={e => this.setState({ showDates: true })}>
                                            <DateRangePicker showOneCalendar
                                                ranges={dateSegments}
                                                onOk={(update) => { this.filterDates(update) }}
                                                onClean={() => { this.filterDates(null) }}
                                                onChange={(update) => { this.filterDates(update) }}
                                            />

                                            {/*
                                            <DatePicker

                                                selectsRange={true}
                                                startDate={this.state.startFilter}
                                                endDate={this.state.endFilter}
                                                onChange={(update) => {
                                                    this.filterDates(update);
                                                }}
                                                isClearable={true}
                                                calendarContainer={this.rangeContainer}
                                            /> */}

                                        </div>
                                    </div>
                                </Col>
                                <Col sm={2}>
                                    <button className="btn addbtn" onClick={this.orderReport}>Order New Report</button>
                                </Col>

                            </Row>
                        </div>
                        <div className="listing" style={{ width: '100%' }}>
                            <table width="100%" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th className="sorted"><span>Ref. Id</span></th>
                                        <th className="sorted"><span>Order date</span></th>
                                        <th className="sorted"><span>Subject Name</span></th>
                                        <th className="sorted"><span>User Name</span></th>
                                        <th className="sorted"><span>Status</span></th>
                                        <th>Reports Status</th>
                                        {/* <th></th>
                                        <th></th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.filteredReportList?.map((row, index) => this.tblRow(row, index))}
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

