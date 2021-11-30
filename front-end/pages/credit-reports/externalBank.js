
import { useState } from 'react';
import Router from 'next/router';
import { Row, Col, Container } from 'react-bootstrap'

export const ExternalBank = () => {

    let [data, setData] = useState({
        CustomerSince: null,
        AccountBalance: 0,
        NumberOfNSF: 0,
        LineOfCreditGranted: 0,
        PercentageUsed: null,
        SecuredBy: null,
        TypeOfLoan: null,
        LoanDate: null,
        AmountOfLoan: null,
        CurrentLoanBalance: null,
        LoanPayment: null,
        Frequencies: null,
        NumberOfLatePayments: null,
        Comments: null,
        NameOfPerson: null,
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
        info.append('company_logo_en', company_logo_en);
        info.append('company_logo_fr', query.company_logo_fr);
        info.append('company_name_en', query.company_name_en);
        info.append('company_name_fr', query.company_name_fr);
        info.append('website', query.website);
        info.append('domain', query.domain);
        info.append('email_id', query.email_id);
        info.append('phone_number', query.phone_number);
        info.append('address_line', query.address_line);
        info.append('state', query.state);
        info.append('city', query.city);
        info.append('zip_code', query.zip_code);
        info.append('portal_language', query.portal_language);
        info.append('industry_id', query.industry_id);
        info.append('pricing_chart_id', query.pricing_chart_id);
        info.append('bank_report_count', query.bank_report_count);
        info.append('suppliers_report_count', query.suppliers_report_count);
        info.append('watchlist_count', query.watchlist_count);
        info.append('company_in_watchlist_count', query.company_in_watchlist_count);
        info.append('quick_report_price', query.quick_report_price);
        info.append('aging_discount', query.aging_discount);
        info.append('language', 'en');
        info.append('api_token', token);
        info.append('company_logo_en', company_logo_en);
        info.append('company_logo_fr', company_logo_fr);
        info.append('country_code', query.country_code);
        info.append('groups', query.groups);
        //call form submit api here:

    }

    if (Router.query.type == "bank") {
        let clientName = "ABC CONSTRUCTION INC.";
        let bankName = "CANAM BUILDINGS US.";
        let bankAddress = "AT BSB - MIDDLE ST"
        let acctNumber = "123456789101234567890"

        return (
            <Container>
                <form method="POST" encType="multipart/form-data" onSubmit={(e) => submitBank(e)}>
                    <Row>
                        <Col>
                            <b>Bank Account Information Request</b>
                            Hi,
                            Your member / client named <b> {clientName} </b>
                            requested to open an account with <b>{bankName}</b>.
                            Approval of this request is conditional on the following verification of banking information;
                            Account: <b>{bankAddress}</b>
                            You will find attached the authorization given by your
                            member / client <b> {clientName} </b> for the bank
                            credit reference request.
                            As this request is important to your member / client,
                            we would need an answer from you within 24 hours.
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <b>Account Number: {acctNumber}</b>
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Customer Since</b>
                            <br />
                            <input type="date" id="" name="CustomerSince" onChange={(e) => handleChange(e)} />
                        </Col>
                        <Col><b>Account Balance</b>
                            <br />
                            <input type="text" id="" name="AccountBalance" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Number oc checks (NSF) in the last 90 days</b>
                            <br />
                            <input type="text" id="" name="NumberOfNSF" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Line of credit granted</b>
                            <br />
                            <input type="text" id="" name="LineOfCreditGranted" onChange={(e) => handleChange(e)} />
                        </Col>
                        <Col><b>%(Percentage) of line of credit used</b>
                            <br />
                            <input type="text" id="" name="PercentageUsed" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Secured By</b>
                            <br />
                            <input type="text" id="" name="SecuredBy" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Type of Loan</b>
                            <br />
                            <input type="text" id="" name="TypeOfLoan" onChange={(e) => handleChange(e)} />
                        </Col>
                        <Col><b>Loan Date</b>
                            <br />
                            <input type="date" id="" name="LoanDate" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Amount of loan</b>
                            <br />
                            <input type="text" id="" name="AmountOfLoan" onChange={(e) => handleChange(e)} />
                        </Col>
                        <Col><b>Current loan balance</b>
                            <br />
                            <input type="text" id="" name="CurrentLoanBalance" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Loan payment</b>
                            <br />
                            <input type="text" id="" name="LoanPayment" onChange={(e) => handleChange(e)} />
                        </Col>
                        <Col><b>Frequencies</b>
                            <br />
                            <input type="text" id="" name="Frequencies" onChange={(e) => handleChange(e)} />
                        </Col>
                    </Row>
                    <Row>
                        <Col><b>Number of late payments in last 90 days</b>
                            <br />
                            <input type="text" id="" name="NumberOfLatePayments" onChange={(e) => handleChange(e)} />
                        </Col>

                    </Row>
                    <Row>
                        <Col><b>Comments</b>
                            <br />
                            <textarea type="text" rows={5} cols={30} id="" name="Comments" onChange={(e) => handleChange(e)}></textarea>
                        </Col>

                    </Row>
                    <Row>
                        <Col><b>Name of person filling this form</b>
                            <br />
                            <input type="text" id="" name="NameOfPerson" onChange={(e) => handleChange(e)} />
                        </Col>

                    </Row>
                    <Row>
                        <Col></Col>
                    </Row>
                </form>
            </Container>
        )
    }
}