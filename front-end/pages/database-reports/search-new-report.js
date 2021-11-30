import Header from "../../components/header";
import { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import Select from 'react-select';
import DynamicTable from '../../components/DynamicTable';
import { differenceInDays, parseISO } from 'date-fns'
import "react-datepicker/dist/react-datepicker.css";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from "./index.module.css";

const SearchNewDatabaseReport = function () {
    const [data, setData] = useState({
        original: null,
        filtered: null
    });
    const [filters, setFilters] = useState({
        Text: "",
        StartDate: '',
        EndDate: '',
        Type: ""
    })

    const [selected, updatePurchase] = useState({});

    const filterDates = (update) => {
        setFilters(filters => ({
            ...filters,
            StartDate: update[0],
            EndDate: update[1]
        }))

        let newData = data.original;
        if (update[0] != null) {
            newData = newData.filter(row => {
                console.log("Create: ", row.completed)
                console.log("Filter: ", update[0])
                let diff = differenceInDays(parseISO(row.completed), update[0]);
                return diff >= 0;
            })
        }

        if (update[1] != null) {
            newData = newData.filter(row => {
                console.log("Create: ", row.completed)
                console.log("Filter: ", update[1])
                let diff = differenceInDays(parseISO(row.completed), update[1]);
                return diff < 0;
            })
        }

        setData((prevData) => ({
            ...prevData,
            filtered: newData
        }))
    }

    const filterText = async (e) => {
        e.preventDefault();
        let text = e.target.value.toLowerCase();
        console.log(text)
        let rowData = data.original;

        setFilters((filters) => ({
            ...filters,
            Text: text
        }))
        let newData = await rowData.filter(row => {
            //search these 4 columns
            return (
                (row?.subject_name?.toLowerCase().indexOf(text) >= 0) ||
                (row?.company_name?.toLowerCase().indexOf(text) >= 0) ||
                (row?.user_name?.toLowerCase().indexOf(text) >= 0) ||
                (row?.reference_id?.toLowerCase().indexOf(text) >= 0))
        })

        setData((prevData) => ({
            ...prevData,
            filtered: newData
        }))
    }

    const filterStatus = async (e) => {
        console.log(e)
        let text = e;
        let newData = data.original;
        setFilters((filters) => ({
            ...filters,
            Type: text
        }))

        if (text.length == 0) {
            newData = data.original;
        }
        else {
            newData = await newData.filter(row => {
                let ret = false;
                text.forEach(t => {
                    if (row.rptType.toLowerCase() == t.label.toLowerCase()) ret = true;
                })
                return ret;
            });
        }

        setData((prevData) => ({
            ...prevData,
            filtered: newData
        }))
    }

    const updateSelected = (row => {
        let newSelected = selected;
        newSelected[row.id] = row.toPurchase;
        updatePurchase(newSelected);
    })

    const buyNewReports = () => {
        // const router = withRouter()
        console.log(selected);
        let sel = [];
        for (const key in selected) {
            if (selected.hasOwnProperty(key)) {
                if (selected[key] == 1) {//if it has been selected
                    sel.push(key)
                }
            }
        }
        console.log(sel)

        // let URL = "/credit-reports/order-New-Report"
        // if (true) {//user is admin
        //     Router.push({ pathname: URL, query: { rptId: rptId || null } })
        // }
    }

    const colData = [
        {
            colName: "_id",
            visible: false,
            type: "id"
        },
        {
            colName: "toPurchase",
            visible: true,
            type: 'checkbox',
            displayName: 'Select',
            editable: true
        },
        {
            colName: 'reference_id',
            displayName: "Ref. Id",
            editable: false,
            visible: true,
            subText: false
        },
        {
            colName: 'subject_name',
            displayName: "Subject Name",
            editable: false,
            visible: true,
            subText: false

        },
        {
            colName: 'completed',
            displayName: "Completion Date",
            type: "date",
            timeSize: '9',
            timeLocation: 'below',
            editable: false,
            visible: true
        },
        {
            colName: 'user_name',
            displayName: "User Name",
            editable: false,
            visible: true,
            subText: 'company_name'
        },
        {
            colName: 'rptType',
            displayName: "Report",
            editable: false,
            visible: true,
            subText: false
        }
    ]

    const reportTypes = [
        { value: "0", label: "Incorporate" },
        { value: "1", label: "Banking" },
        { value: "2", label: "Legal" },
        { value: "3", label: "Supplier" },
    ]

    const rptData = [
        {
            _id: "abcd",
            reference_id: "C143-I",
            subject_name: "Krabby Patty Pvt. Ltd.",
            completed: "2021-09-23T11:35:00",
            user_name: "Michle Smith",
            rptType: "Incorporate"
        },
        {
            _id: "def",
            reference_id: "C142-B",
            subject_name: "Green Tiles Incorporation",
            completed: "2021-09-23T11:35:00",
            user_name: "Michle Smith",
            company_name: "Sub-company",
            rptType: "Banking"
        },
        {
            _id: "ghi",
            reference_id: "C142-L",
            subject_name: "Green Tiles Incorporation",
            completed: "2021-09-07T11:35",
            user_name: "Michle Smith",
            rptType: "Legal"
        }
    ]

    const getReportData = () => {
        let rpt = rptData;

        setData({
            original: rpt,
            filtered: rpt
        })
    }

    if (data.original === null) getReportData();
    return (
        <>
            <Header />
            <Container>
                <Row >
                    <Col className={styles.filterCol}> Search:&nbsp;<input type='text' onChange={(e) => filterText(e)}></input></Col>
                    <Col className={styles.filterCol}>Status:&nbsp;
                        <div className={styles.selectDiv}>
                            <Select onChange={(e) => filterStatus(e)}
                                options={reportTypes}
                                isMulti
                            />
                        </div>
                    </Col>
                    <Col className={styles.filterCol} >Filter By Date:&nbsp;
                        <div className={styles.datePickerDiv}>
                            <DatePicker
                                selectsRange={true}
                                className={styles.bordered}
                                startDate={filters.StartDate}
                                endDate={filters.EndDate}
                                isClearable
                                onChange={(update) => {
                                    filterDates(update);
                                }}
                            />
                        </div>



                    </Col>
                    <Col className={styles.filterCol + ' ' + styles.textRight}>
                        <button className="btn btn-primary" onClick={buyNewReports}>Buy Selected Reports</button>
                    </Col>
                </Row >
                <Row>
                    <Col>
                        <DynamicTable data={data.filtered}
                            columns={[...colData]}
                            UpdateFn={updateSelected} />
                    </Col>
                </Row>
            </Container >
        </>
    )
}
export default SearchNewDatabaseReport