import React, { userState, useEffect, useState } from 'react'
import Header from "../../components/header"
import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import Cookies from 'js-cookie'
// import Pagination from "../../components/datatable/pagination"
import { Col, Modal, Row } from 'react-bootstrap';
import DynamicTable from '../../components/DynamicTable';
import {
    get_legal_list,
    upload_legal_list,
    delete_legal_list
} from '../api/legal'

const UPLOADING = 1;
const UPLOADED = 2;
const ERROR = 3;

const LegalUploads = ({ data }) => {
    const router = useRouter()
    // const limit = 3
    // const lastPage = Math.ceil(totalPage / limit)

    const [pageData, setPageData] = useState(data);
    const [legalFile, setLegalFile] = useState(null);
    const [type, setType] = useState(null);
    const [region, setRegion] = useState(null);
    const [language, setLanguage] = useState(null);


    const [upload, showUpload] = useState(false)

    const fetchData = async () => {
        //code to load data fresh from API
        get_legal_list({ api_token: Cookies.get('token') })
    }

    const deleteClick = async (event, columnName, row) => {
        //code to send delete request to API
        let uploadID = row._id;
        let token = Cookies.get('token');

        let body = {
            api_token: token,
            legal_upload_id: uploadID
        }

        delete_legal_list(body)
            .then(res => fetch_data())
    }

    const getBadgeCss = (type) => {

        switch (type) {
            case 'Uploaded': return 'success'; break;
            case 'Uploading': return 'info'; break;
            case 'Error': return 'error'; break;
        }
    }

    const columns = [{
        colName: "reference_id",
        displayName: "File Ref. Id",
        editable: false,
        visible: true,
        addable: false,
    },
    {
        colName: "legal_report_type",
        displayName: "File Type",
        editable: false,
        required: false,
        visible: true,
        addable: false,
    },
    {
        colName: "language",
        displayName: "Language",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "status",
        displayName: "Status",
        type: "badge",
        styleFn: getBadgeCss,
        styleParam: "status",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "upload_date",
        displayName: "Upload Date",
        type: 'date',
        timeSize: 9,
        timeLocation: 'below',
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "compare_date",
        displayName: "Compared to Watchlist",
        editable: false,
        required: false,
        type: 'date',
        timeSize: 9,
        timeLocation: 'below',
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "sis_count",
        displayName: "SIS Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "clr_count",
        displayName: "CLR Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "bkr_count",
        displayName: "Bankruptcy Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "jlr_count",
        displayName: "Hypotech Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "actions",
        displayName: "Actions",
        onClick: deleteClick,
        buttonText: 'Remove',
        type: 'button',
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },

    ]

    const uploadFile = (e) => {
        setLegalFile(e.target.files[0])
    }

    const startUpload = async () => {
        let token = cookies.g
        const formData = new FormData();
        formData.append('report_type', type);
        formData.append('region', region);
        formData.append('language', language);
        formData.append('api_token', token);
        formData.append('legal_file', legalFile)
        let body = formData


        upload_legal_list(body)

        fetchData();

    }

    return (
        <>
            <Modal
                show={upload}
                onHide={() => showUpload(false)}
                backdrop="static">
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <label htmlFor='legalType'>Legal Type</label>
                            <select onChange={e => setType(e.target.value)} id='legalType'>
                                <option value='Bankruptcy'>Bankruptcy</option>
                                <option value='Commercial Law Record'>Commercial Law Record</option>
                                <option value='Hypotech'>Hypotech</option>
                                <option value='Special Information Sheet'>Special Information Sheet</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor='region'>Region</label>
                            <select onChange={e => setRegion(e.target.value)} id='region'>
                                <option value='Eastern'>Eastern</option>
                                <option value='Central'>Central</option>
                                <option value='Western'>Western</option>
                                <option value='USA'>USA</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor='language'>Language</label>
                            <select onChange={e => setLanguage(e.target.value)} id='language'>
                                <option value='English'>English</option>
                                <option value='French'>French</option>
                            </select>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label for='customFile' className='btn btn-primary'>Select Legal File</label><span>{legalFile?.name}</span>
                            <input type="file" className="form-control" style={{ visibility: 'hidden' }} id="customFile" onChange={e => this.uploadFile(e)} />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => showUpload(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={startUpload}>
                        Update Status
                    </button>
                </Modal.Footer>
            </Modal>


            <Header />
            <div className="bottom_gap">
                <button className="btn legal_upload">Legal Uploads</button>
            </div>


            <div className="listing">
                <DynamicTable data={data} columns={columns} />
            </div>
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
export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx)

    let res = await get_legal_list({ api_token: token })
    return {
        props: {
            data: res
        }
    }
}

export default LegalUploads