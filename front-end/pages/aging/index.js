import React, { useState, useEffect } from 'react'
import Header from '../../components/header'
import DynamicTable from '../../components/DynamicTable'
import { Row, Col, Container, Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import Cookies from "js-cookie"
import { parseCookies } from "nookies";
import {
    get_company_details
} from '../api/companies';

import {
    aging_list
} from '../api/aging';

const Aging = function ({ agingData }) {
    let [data, setData] = useState(agingData);
    let [showUpload, setShowUpload] = useState(false);
    let [uploaded, setUploaded] = useState();
    let [errorMsg, setErrorMsg] = useState();
    let [displayError, setDisplayError] = useState('none');
    let [is_desc, setDesc] = useState(false);
    let [sort_by, setSortBy] = useState('');

    const [upToDateDate, setUpToDateDate] = useState(new Date());

    const fetchData = async (type, info, dir) => {

        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        /**************************************/
        /* This is because the function fires */
        /* before state is updated correctly  */
        /**************************************/
        // let userRole = filter_user_role;
        // let userComp = setFilter_company;
        // let srch = search;
        let sort = sort_by;
        let desc = is_desc;

        if (sort_by != filterData) {
            setDesc(true);
            desc = true;
            setSortby(filterData);
            sort = filterData;
        } else {
            desc = !is_desc
            setDesc(!is_desc);
        }
        // switch (filterType) {
        //     case "search":
        //         setSearch(filterData);
        //         srch = filterData;
        //         break;
        //     case "role":
        //         setFilter_user_role(filterData);
        //         userRole = filterData;
        //         break;
        //     case "company":
        //         setFilter_company(filterData);
        //         userComp = filterData;
        //         break;
        //     case "sort":
        //         if (sort_by != filterData) {
        //             setDesc(true);
        //             desc = true;
        //             setSortby(filterData);
        //             sort = filterData;
        //         } else {
        //             desc = !is_desc
        //             setDesc(!is_desc);
        //         }
        // }
        /**************************************/

        const body = {
            "language": 'en',
            "api_token": token,
            "sort_by": sort,
            "is_desc": desc,
            "search": srch
        }
        if (userRole.length > 0 && userRole[0] !== "") body.filter_user_role = userRole;
        if (userComp.length > 0 && userComp[0] !== "") body.filter_company = userComp;

        list_associate_user(body)
            .then(newData => {
                console.log(newData);
                setUserList(newData);
            })

    };


    const getStatusColor = (status) => {
        switch (status) {
            case "Uploaded": return 'warning'; break;
            case "Accepted": return 'success'; break;
            case "Deleted": return 'dark'; break;
            default: return 'info';
        }
    }

    // let cols = [
    //     {
    //         colName: "reference_id",
    //         displayName: "File Ref. Id",
    //         type: "id/number/date/increment/money/checkbox/link/button"
    //     },
    //     {
    //         colName: "create_date",
    //         displayName: "Upload Time",
    //         type: "date",
    //         timeLocation: "below",
    //         timeSize: 10
    //     },
    //     {
    //         colName: "uploaded_by",
    //         displayName: "Uploaded By",
    //     },
    //     {
    //         colName: "up_to_date_by",
    //         displayName: "Up To Date By",
    //     },
    //     {
    //         colName: "status",
    //         displayName: "Status",
    //         type: "badge",
    //         styleFn: getStatusColor,
    //         styleParam: "status"
    //     }
    // ]

    const uploadFile = async () => {
        const date = upToDateDate;
        const file = uploaded;
        const token = Cookies.get('token');
        const companyID = router.query.cid;
        const dt = new Date(date);

        let formData = new FormData();
        formData.append("api_token", token);
        formData.append("company_id", companyID);
        formData.append("aging_file", uploaded);
        formData.append("month", dt.getMonth());
        formData.append("year", dt.getYear())


        if (res.status_code !== 200) {
            //TODO:  Enable API Call HERE
            //if(response.status!==200){
            setErrorMsg(res.data || res.message); //response.message....
            setDisplayError('inline-block');
        }
    }



    //file upload component info
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setUploaded(fileUploaded);

    };

    return (
        <>
            <Modal
                show={showUpload}
                onHide={() => setShowUpload(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Upload Aging</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={{ offset: 1 }} >
                            <Button onClick={handleClick}>
                                Select Aging File
                            </Button>
                        </Col>
                        <Col>{uploaded?.name}</Col>
                    </Row>
                    <Row>
                        <Col sm={{ offset: 1 }}><br />
                            <DatePicker
                                selected={upToDateDate}
                                onChange={(date) => setUpToDateDate(date)}
                                dateFormat="MMMM yyyy"
                                showMonthYearPicker
                                showFullMonthYearPicker
                                showTwoColumnMonthYearPicker />
                        </Col>
                    </Row>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        accept=".xls,.xlsx,.pdf.doc.docx.csv"
                        id="aging_upload"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Container style={{ width: '100%' }}>
                        <Row>
                            <Col classname='d-flex justify-content-end' sm={12}>
                                <button className="btn btn-outline-primary" onClick={() => setShowUpload(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-outline-primary" onClick={uploadFile}>
                                    Upload Aging
                                </button><br />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <br />
                                <div className='error justify-content-center' style={{ display: displayError }}>
                                    {errorMsg}
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Footer>
            </Modal>


            <Header />
            <Container>
                <Row>
                    <Col sm={{ size: 3 }} style={{ marginBottom: '25px' }}>
                        <Button className='btn btn-primary' onClick={() => setShowUpload(true)}>Upload Aging</Button>
                    </Col>
                    <Col sm={7}>
                        <div style={{ width: '100%' }} className='text-end text-nowrap'>
                            Aging Due: <span className='h4'>{data?.agingDue}</span>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={{ size: 10 }}>
                        {/* <DynamicTable data={data} columns={cols} /> */}
                        <div className="listing">
                            <table id="example" className="table table-striped">
                                <thead>
                                    <tr>
                                        <th><div onClick={(e) => {
                                            fetchData("sort", "user_name");
                                        }
                                        }>File Ref. Id</div></th>
                                        <th><div onClick={(e) => {
                                            fetchData("sort", "date_added");
                                        }
                                        }>Upload Time</div></th>
                                        <th><div onClick={(e) => {
                                            fetchData("sort", "email_id");

                                        }
                                        }>Uploaded By</div></th>
                                        <th><div onClick={(e) => {
                                            fetchData("sort", "display_user_role");

                                        }
                                        }>Up to Date by</div></th>
                                        <th><div onClick={(e) => {
                                            fetchData("sort", "company_access");

                                        }
                                        }>Status</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item) => (
                                        <tr>
                                            <td>{item.reference_id}</td>
                                            <td>{item.create_date}</td>
                                            <td>{/*item.email_id*/}</td>
                                            <td>{item.up_to_date_by}</td>
                                            <td>{item.status}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}


/**
 *
 *
 * @export
 * @param {*} { query: { page = 1, data = null, totalPage = 10 } }
 * @return {*} 
 */
// export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
export async function getServerSideProps(ctx) {
    // const start = +page === 1 ? 0 : (+page + 1)

    // const { locale, locales, defaultLocale, asPath } = useRouter();
    const { token } = parseCookies(ctx)
    const query = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const companyId = query.cid;
    const data = await aging_list({
        api_token: token,
        company_id: companyId
    })

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let year = new Date().getFullYear();
    data.forEach(row => {
        row.up_to_date_by = ""
        if (row.update_upto) {
            row.up_to_date_by = monthNames[row.update_upto?.month];
            if (row.update_upto.year && +row.update_upto.year !== year) {
                row.up_to_date_by += ` ${row.update_upto?.year}`
            }
        }
    })
    /** 
     * limit, start, search item
     */
    return ({
        props: {
            agingData: data
        }
    })
}

export default Aging