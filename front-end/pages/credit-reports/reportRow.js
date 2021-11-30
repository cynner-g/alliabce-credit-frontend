import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const tblRow = (row, index) => {
    let downloadDisabled = 'false'
    let [stateRotation, setRotation] = useState([])
    console.log(row.reports)
    // for (obj of row.reports) {
    //     if (obj.status_code !== 5) downloadDisabled = 'true'
    // }
    const expand = (item) => {
        item.icon = item.icon == 'faCaretDown' ? 'faCaretUp' : 'faCaretDown'
    }

    const onClickHandler = (e, item) => {
        let rotation = stateRotation;
        if (rotation[item] == undefined) rotation[item] = 0;
        rotation[item] = rotation[item] == 0 ? 180 : 0;
        console.log(rotation);
        setRotation(rotation);
        row.clickHandler(e, item)
    };

    let refId = row.reference_id;
    let order_date = row.order_date;
    let order_time = row.order_time;
    let subject_name = row.subject_name;
    let user_name = row.user_name;
    let company_name = row.company_name;
    let status = row.status;
    let reports_incorporate = row.reports_incorporate;
    let reports_bank = row.reports_bank;
    let reports_legal = row.reports_legal;
    let reports_suppliers = row.reports_suppliers;

    return (
        <>
            <tr key={index}>
                <td>{refId}</td>
                <td>{order_date}<br /><span style={{ fontSize: 10 }}>{order_time}</span></td>
                <td>{subject_name}</td>
                <td>{user_name}<br /><span style={{ fontSize: 10 }}>{company_name}</span></td>

                <td>{status}</td>
                <td>{reports_incorporate}</td>
                <td>{reports_bank}</td>
                <td>{reports_legal}</td>
                <td>{reports_suppliers}</td>
                <td>
                    <button className="btn btn-outline-primary" style={{ border: "none" }}></button>
                </td>
                <td data-toggle="collapse"
                    data-target=".collapseRow"
                    aria-controls=".collapseRowID">
                    <FontAwesomeIcon icon={faCaretDown} style={{ transform: `rotate(${stateRotation[index] || 0}deg)` }} onClick={(e) => this.onClickHandler(e, index)} />
                </td>
            </tr>
            <tr className="collapse" id={`collapseRow${index}`} >
                <td colspan={10}><h1>Test</h1></td>
            </tr>
        </>)
}



    //show columns plus "sub column" option
    // const data = {
    //     "_id": "619a61d19c9e463d02d0058a",
    //     "reference_id": "1637507537900",
    //     "is_quick_report": "false",
    //     "credit_application": "credit_application/credit_application_1637507537724.pdf",
    //     "ordered_reports": [
    //         "Incorporate",
    //         "Bank",
    //         "Legal",
    //         "Suppliers"
    //     ],
    //     "status_code": 6,
    //     "reports": {
    //         "incorporate": {
    //             "status_code": 5,
    //             "is_ordered": true,
    //             "status": "Completed"
    //         },
    //         "bank": {
    //             "status_code": 2,
    //             "is_ordered": true,
    //             "status": "Processing"
    //         },
    //         "legal": {
    //             "status_code": 2,
    //             "is_ordered": true,
    //             "status": "Processing"
    //         },
    //         "suppliers": {
    //             "status_code": 2,
    //             "is_ordered": true,
    //             "status": "Processing"
    //         }
    //     },
    //     "order_date": "21/11/2021",
    //     "order_time": "15:09",
    //     "subject_name": "JK Webdesign",
    //     "user_name": "Admin",
    //     "company_name": "Facebook Inc",
    //     "is_new": true,
    //     "status": "Canceled",
    //     "comments": {
    //         "system": {
    //             "comment": "Report under process",
    //             "create_date": "2021-11-21T15:09:12.814Z",
    //             "status_code": 2,
    //             "is_private": false,
    //             "status": "Processing"
    //         },
    //         "custom": {
    //             "comment": "Report under process",
    //             "create_date": "2021-11-21T15:09:12.814Z",
    //             "status_code": 2,
    //             "is_private": false,
    //             "status": "Processing"
    //         }
    //     }
    // }