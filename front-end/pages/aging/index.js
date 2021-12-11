import React, { useState, useEffect } from 'react'
import Header from '../../components/header'
import DynamicTable from '../../components/DynamicTable'
import { Row, Col, Container, Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import Cookies from "js-cookie"
import { parseCookies } from "nookies";
import {
    get_company_details,
    upload_aging_DB_file,
    download_user_aging_file,
    download_DB_aging_file,
    delete_aging_file
} from '../api/companies';

import {
    aging_list,

} from '../api/aging';

const Aging = function ({ agingData }) {
    let [data, setData] = useState(agingData);
    let [showUpload, setShowUpload] = useState(false);
    let [showDBUploadID, setShowDBUploadID] = useState(null);
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

        let sort = sort_by;
        let desc = is_desc;

        if (type == 'sort') {
            if (sort_by != info) {
                setDesc(true);
                desc = true;
                setSortby(info);
                sort = info;
            } else {
                desc = !is_desc
                setDesc(!is_desc);
            }
        }

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

    const downloadDB = (id) => {

        e.preventDefault();
        let token = Cookies.get('token');
        download_DB_aging_file({
            api_token: token,
            aging_id: id
        })
            .then(file => file.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                const company = report.company_name.replace(' ', '_').replace('.', '')
                const fileName = `${type}_report_${company}.pdf`;
                a.download = fileName
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

            });
    }

    const downloadUserAging = (id) => {
        e.preventDefault();
        let token = Cookies.get('token');
        download_user_aging_file({
            api_token: token,
            aging_id: id
        })
            .then(file => file.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                const company = report.company_name.replace(' ', '_').replace('.', '')
                const fileName = `${type}_report_${company}.pdf`;
                a.download = fileName
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

            });
    }

    const uploadDBFile = () => {
        const file = uploaded;
        const token = Cookies.get('token');
        const companyID = router.query.cid;

        let formData = new FormData();
        formData.append("api_token", token);
        formData.append("aging_id", showDBUploadID);
        formData.append("aging_file", uploaded);

        upload_aging_DB_file(formData)
            .then(res => {
                if (res.status_code !== 200) {
                    setErrorMsg(res.data || res.message); //response.message....
                    setDisplayError('inline-block');
                }
                else {
                    setShowDBUploadID(null)
                    fetch_data();
                }
            })
    }

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

        upload_aging_user_file(formData)
            .then(res => {
                if (res.status_code !== 200) {
                    setErrorMsg(res.data || res.message); //response.message....
                    setDisplayError('inline-block');
                }
                else {
                    setShowUpload(false);
                    fetch_data();
                }
            })
    }

    const deleteAging = (id) => {
        const token = Cookies.get('token');

        let body = {
            api_token: token,
            aging_id: id
        }

        delete_aging_file(body)
            .then(res => {
                fetchData()
            })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Uploaded": return 'warning'; break;
            case "Accepted": return 'success'; break;
            case "Deleted": return 'dark'; break;
            default: return 'info';
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

            <Modal
                show={showDBUploadID !== null}
                onHide={() => setShowDBUploadID(null)}
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

                    <input
                        type="file"
                        ref={hiddenFileInput}
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        accept=".xls,.xlsx"
                        id="aging_upload"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Container style={{ width: '100%' }}>
                        <Row>
                            <Col classname='d-flex justify-content-end' sm={12}>
                                <button className="btn btn-outline-primary" onClick={() => setShowDBUploadID(null)}>
                                    Cancel
                                </button>
                                <button className="btn btn-outline-primary" onClick={uploadDBFile}>
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

                                        <th colSpan={3}><div>Actions</div></th>
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
                                            <td>
                                                {item.status == "File Received" ?
                                                    <>
                                                        <span>
                                                            <button onClick={() => downloadUserAging(item._id)}>Download</button>
                                                        </span> &nbsp;
                                                        <span>
                                                            <button onClick={() => showDBUploadID(item._id)}>Upload DB</button>
                                                        </span> &nbsp;
                                                        <span></span>
                                                    </>
                                                    : item.status == "DB Updated" ?
                                                        <>
                                                            <span>
                                                                <button onClick={() => downloadUserAging(item._id)}>Download</button>
                                                            </span> &nbsp;
                                                            <span>
                                                                <button onClick={() => downloadDB(item._id)}>Download DB</button>
                                                            </span> &nbsp;
                                                            <span>
                                                                <button onClick={() => deleteAging(item._id)}>Delete DB</button>
                                                            </span>
                                                        </>
                                                        : ''
                                                }
                                            </td>
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