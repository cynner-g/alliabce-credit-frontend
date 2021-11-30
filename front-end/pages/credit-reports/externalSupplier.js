
import { useState } from 'react';
import Router from 'next/router';
import { Row, Col, Container } from 'react-bootstrap'

const ExternalSupplier = () => {

    let [data, setData] = useState({
        accountOpening: "",
        lastPurchaseDate: "",
        currentCreditLimit: "",
        avgPaymentPeriod: "",
        NSF3months: "",
        nsfDate1: "",
        nsfAmt1: "",
        nsfDate2: "",
        nsfAmt2: "",
        highCredit: "",
        ttlAmtOwing: "",
        current: "",
        within30: "",
        btwn30_60: "",
        btwn60_90: "",
        moreThan90: "",
        Comments: "",
        NameOfPerson: "",
    })

    const handleChange = () => (e) => {
        // alert(e.target.name);
        const name = e.target.name;
        const value = e.target.value;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    let submitBank = (e) => {
        let info = new FormData();
        info.append('accountOpening', data.accountOpening);
        info.append('lastPurchaseDate', data.lastPurchaseDate);
        info.append('currentCreditLimit', data.currentCreditLimit);
        info.append('avgPaymentPeriod', data.avgPaymentPeriod);
        info.append('NSF3months', data.NSF3months);
        info.append('nsfDate1', data.nsfDate1);
        info.append('nsfAmt1', data.nsfAmt1);
        info.append('nsfDate2', data.nsfDate2);
        info.append('nsfAmt2', data.nsfAmt2);
        info.append('highCredit', data.highCredit);
        info.append('ttlAmtOwing', data.ttlAmtOwing);
        info.append('current', data.current);
        info.append('within30', data.within30);
        info.append('btwn30_60', data.btwn30_60);
        info.append('btwn60_90', data.btwn60_90);
        info.append('moreThan90', data.moreThan90);
        info.append('Comments', data.Comments);
        info.append('NameOfPerson', data.NameOfPerson);

        //submit form data here
    }

    // if (Router.query.type == "bank") {
    let clientName = "ABC CONSTRUCTION INC.";
    let supplierName = "CANAM BUILDINGS US.";
    let bankAddress = "AT BSB - MIDDLE ST"
    let acctNumber = "123456789101234567890"

    return (
        <Container>
            <form method="POST" encType="multipart/form-data" onSubmit={(e) => submitSupplier(e)}>
                <Row>
                    <Col>
                        <b>Supplier Information Request</b>

                        We would appreciate your collaboration to help the credit industry support each other and collaborate for a
                        better financial health of our respective organizations.
                        As part of the same process a full credit report on your client named <b>{clientName}</b> is currently in the process of finalization and will be available on the following site in case you want to consult it (fees may apply):
                        https://alliancecredit.ca/ <br />
                        As this request is important, we would need a return from you within 24 hours, please. Thank you for your
                        quick collaboration and contribution.
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <b>A credit reference was requested from us on your client: <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{clientName}</span></b><br />
                        <b>To open an account with the company: <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>{supplierName}</span></b><br />
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <b>Set Currentcy:</b>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <b>Activity Sector</b><br />
                        Transports <input type='number' id="" name='transports' defaultValue={1} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>Account Opening Date</b>
                        <br />
                        <input type="date" id="" name="accountOpening" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>Date of last purchase</b>
                        <br />
                        <input type="date" id="" name="lastPurchaseDate" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>Current Credit Limit</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="currentCreditLimit" onChange={(e) => handleChange(e)} />
                    </Col>

                    <Col><b>Average payment period (DSO) in days</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="avgPaymentPeriod" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>NSF (Last 3 months)</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="NSF3months" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>NSF Date</b>
                        <br />
                        <input type="date" id="" name="nsfDate1" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>NSF Amount</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="nsfAmt1" onChange={(e) => handleChange(e)} />
                    </Col>

                </Row>
                <Row>
                    <Col><b>NSF Date</b>
                        <br />
                        <input type="date" id="" name="nsfDate2" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>NSF Amount</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="nsfAmt2" onChange={(e) => handleChange(e)} />
                    </Col>

                </Row>

                <Row>
                    <Col><b>High credit</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="highCredit" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>Total Amount owing</b>
                        <br />
                        <input type="date" id="" name="ttlAmtOwing" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>Current</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="current" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>Within 30 days</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="within30" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>Between 30-60 days</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="btwn30_60" onChange={(e) => handleChange(e)} />
                    </Col>
                    <Col><b>Between 60-90 days</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="btwn60_90" onChange={(e) => handleChange(e)} />
                    </Col>
                </Row>
                <Row>
                    <Col><b>More than 90 days</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="moreThan90" onChange={(e) => handleChange(e)} />
                    </Col>

                </Row>
                <Row>
                    <Col><b>Remarks</b>
                        <br />
                        <textarea type="text" rows={5} cols={30} id="" name="Comments" onChange={(e) => handleChange(e)}></textarea>
                    </Col>

                </Row>
                <Row>
                    <Col><b>Filled By</b>
                        <br />
                        <input type="text" placeHolder='Enter a value' id="" name="NameOfPerson" onChange={(e) => handleChange(e)} />
                    </Col>

                </Row>
                <Row>
                    <Col><input type='submit'>Submit</input>
                        <button type='button'>Reject</button>
                    </Col>
                </Row>
            </form>
        </Container>
    )
}
// }

export default ExternalSupplier;