import React, { useState, useEffect } from 'react'
import Header from '../../components/header'
import DynamicTable from '../../components/DynamicTable'
import { Row, Col, Container, Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker'
import Cookies from "js-cookie"

const Aging = function (props) {
    let [data, setData] = useState();
    let [showUpload, setShowUpload] = useState(false);
    let [uploaded, setUploaded] = useState();
    let [errorMsg, setErrorMsg] = useState();
    let [displayError, setDisplayError] = useState('none');

    const [upToDateDate, setUpToDateDate] = useState(new Date());


    useEffect(() => {
        //get aging data
        setData({
            agings:
                [
                    { fileRef: 'AG123', upload_time: '2021-09-23T11:35', uploaded_by: 'Michle', up_to_date_by: 'September', status: 'Uploaded' },
                    { fileRef: 'AG122', upload_time: '2021-09-07T11:35', uploaded_by: 'Ben', up_to_date_by: 'August', status: 'Accepted' },
                    { fileRef: 'AG121', upload_time: '2021-09-07T11:35', uploaded_by: 'Kent', up_to_date_by: 'July', status: 'Accepted' },
                ],
            agingDue: '24 Days'
        });
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Uploaded": return 'warning'; break;
            case "Accepted": return 'success'; break;
            default: return 'info';
        }
    }

    let cols = [
        {
            colName: "fileRef",
            displayName: "File Ref. Id",
            type: "id/number/date/increment/money/checkbox/link/button"
        },
        {
            colName: "upload_time",
            displayName: "Upload Time",
            type: "date",
            timeLocation: "below",
            timeSize: 10
        },
        {
            colName: "uploaded_by",
            displayName: "Uploaded By",
        },
        {
            colName: "up_to_date_by",
            displayName: "Up To Date By",
        },
        {
            colName: "status",
            displayName: "Status",
            type: "badge",
            styleFn: getStatusColor,
            styleParam: "status"
        }
    ]

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
        formData.append("yeah", dt.getYear())

        const res = await fetch(`${process.env.API_URL}/company/company-detail`, {
            method: "POST",
            headers: {
                contentType: false,
            },
            body: formData
        })

        if (res.status !== 200) {
        //TODO:  Enable API Call HERE
        //if(response.status!==200){
            setErrorMsg(res.statusText); //response.message....
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
                                Upload a file
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
                        <DynamicTable data={data?.agings} columns={cols} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}
export default Aging