import { FormComponent } from '../../components/FormComponent';
import { get_credit_report } from '../../data/reports';
import Header from "../../components/header"
import Router from "next/router";
import Image from 'next/image'
import { Component } from 'react'
import { Container, Row, Col, Modal } from 'react-bootstrap';
import styles from "./order-New-Report.module.css";


class OrderNewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            columns: this.getColumns(),
            newReport: true,
            reports: [false, false, false, false],
            region: "Quebec",
            isModalOpen: false,
            reportList: null
        }
    }

    componentDidMount() {

        if (Router && Router.router && Router.router.query && Router.router.query.rptId && Router.router.query.rptId.length > 0) {
            let rptId = Router.router.query.rptId;
            this.setState({ newReport: false });
            get_credit_report(rptId).then((data) => {
                this.setState({ data: data });
            });
        }
    }

    addBank = () => {
        let columns = this.state.columns;
        let banks = columns.filter(col => col.params.model && col.params.model.startsWith("banks"))
        let numBanks = banks.length;

        let lastBank = columns.findIndex(col => col.params.model && col.params.model.startsWith("banks")) + numBanks;

        let newDupNum = banks[banks.length - 1].dupNum;
        banks = banks.filter(bank => bank.dupNum == newDupNum);
        let newBanks = JSON.parse(JSON.stringify(banks)); //ensure new variable not reference
        newBanks.forEach(newBank => newBank.dupNum = newDupNum + 1)
        let startArray = [...columns.slice(0, lastBank)];
        let endArray = [...columns.splice(lastBank)];
        //concatenate all temp arrays, then concatenate those with rest of display data
        columns = startArray.concat(banks, endArray);
        this.setState({ columns: columns });
    }

    addSupplier = () => {
        let columns = this.state.columns;
        let suppliers = columns.filter(col => col.params.model.startsWith("suppliers"));
        let numsuppliers = suppliers.length;

        let lastSupplier = columns.findIndex(col => col.params.model.startsWith("suppliers")) + numsuppliers;

        newDupNum = suppliers[suppliers.length - 1].dupNum;
        suppliers = suppliers.filter(supplier => supplier.dupNum == newDupNum);
        newSuppliers = JSON.parse(JSON.stringify(suppliers)); //ensure new variable not reference
        newSuppliers.forEach(newBank => newSuppliers.dupNum = newDupNum + 1)
        let startArray = [...columns.slice(0, lastSupplier)];
        let endArray = [...columns.splice(lastSupplier)];
        //concatenate all temp arrays, then concatenate those with rest of display data
        columns = startArray.concat(suppliers, endArray);
        this.setState({ columns: columns });
    }

    getColumns = () => {
        return (
            [
                {
                    'title': "General",
                    'params': {
                        'fName': "Header", size: 2, colNum: 0,
                        model: 'general_details',
                    }
                },
                {

                    'title': "Legal Business Name",
                    'params': {
                        'model': "general_details.legal_name",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0

                    }
                },
                {
                    'title': "DBA (Doing Business As) Name",
                    'params': {
                        'model': "general_details.dba_name",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },

                {
                    'title': "Address",
                    'params': {
                        'model': "general_details.address.address_line",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },

                {
                    'title': "City",
                    'params': {
                        'model': "general_details.address.city",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "State",
                    'params': {
                        'model': "general_details.address.state",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Zip",
                    'params': {
                        'model': "general_details.address.zip",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Incorporated",
                    'params': {
                        model: 'incorporate_details',
                        'fName': "Header", size: 2,
                        colNum: 0
                    }
                },
                {

                    'title': "NEQ (Number Entreprise Quebec) of the business",
                    'params': {
                        'model': "incorporate_details.quebec_enterprise_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Business Owner name",
                    'params': {
                        'model': "incorporate_details.business_owner_name",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "TPS de l'entreprise",
                    'params': {
                        'model': "incorporate_details.enterprise_tps",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "TVQ de l'entreprise",
                    'params': {
                        'model': "incorporate_details.enterprise_tvq",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Bank",
                    'params': {
                        model: 'banks',
                        'fName': "Header", size: 2,
                        colNum: 0
                    }
                },
                {
                    Text: "Add Bank Account",
                    'params': {
                        model: 'banks',
                        onClick: this.addBank,
                        'fName': "LinkButton",
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Name",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_name",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Account Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.account_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Transit Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.transit_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Bank Address",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Unique Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_unique_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Name of Bank Manager",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_name",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Manager Email",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_email_id",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Phone Number of Bank Manager",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Suppliers",
                    'params': {
                        'fName': "Header", size: 2,
                        model: 'suppliers',
                        colNum: 0
                    }
                },
                {
                    supplierId: { model: '_id', visible: false },
                    Text: "Add Supplier",
                    'params': {
                        model: 'suppliers',
                        onClick: this.addSupplier,
                        'fName': "LinkButton",
                        colNum: 0
                    }
                },
                {

                    'title': "Supplier Business Name",
                    'params': {
                        'model': "suppliers.business_name",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Complete Supplier Address",
                    'params': {
                        'model': "suppliers.address",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Business Phone Number (supplier)",
                    'params': {
                        'model': "suppliers.business_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Personal Phone Number (supplier)",
                    'params': {
                        'model': "8",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }
                },

                {
                    'params': {
                        'fName': "SubmitButton",
                        'text': "Submit",
                        colNum: 0
                    }
                }
            ]
        );
    }

    submit = (data) => {
        console.log(data)
    }

    toggleReport = (reportID) => {
        let reports = this.state.reports;
        let enabled = reports[reportID] ? false : true;
        reports[reportID] = enabled;
        this.setState({ reports: reports })
    }

    selectAllReports = () => {

        let reports = this.state.reports;
        //set all reports to unselected
        for (let i = 0; i < 4; i++) {
            reports[i] = true;
        }
        this.setState({ reports: reports });
    }

    setRegion = (e) => {
        let region = e.target.value;
        this.setState({ region: region })
    }

    uploadApplication = (e) => {
        let fileComponent = e.target.previousSibling;

    }

    quickOrder = (resp) => {
        console.log("Resp: ", resp)
        if (resp == undefined)
            this.setState({ isModalOpen: true })
        else {
            this.setState({ isModalOpen: false })
            if (!resp) {
                //send quick order data to server
            }
            else {
                this.nextStep();
            }
        }
    }

    nextStep = () => {
        let reports = this.state.reports;
        let rpts = [];
        let rptList = ["Incorporated", "Bank", "Legal", "Suppliers"]
        let columns = this.state.columns;
        rpts.push(<li>General</li>);
        reports.forEach((report, idx) => {
            if (report) {
                rpts.push(<li>{rptList[idx]}</li>)
            }
            else {
                let field = ''
                switch (idx) {
                    case 0: field = 'incorporate_details'; break;
                    case 1: field = 'banks'; break;
                    case 3: field = 'suppliers'; break;
                    default: field = null;
                }
                console.log("Field: ", field)
                if (field && field.length > 0) {
                    let startRow = columns.findIndex(row => {
                        return row.params.model && row.params.model.startsWith(field)
                    });
                    let numRows = columns.filter(row => {
                        return row.params.model && row.params.model.startsWith(field)
                    })
                    numRows = numRows.length;

                    console.log("Start, num ", startRow, numRows)
                    if (startRow >= 0) {
                        columns.splice(startRow, numRows);
                    }
                }

            }

        });

        this.setState({ columns: columns, reportList: rpts, newReport: false });



    }
    render() {
        let cols = this.state.columns;
        console.log("Data=", this.state.data)
        if (this.state.newReport) {
            return (
                <>
                    <Modal
                        show={this.state.isModalOpen}
                        onHide={() => this.quickOrder(false)}
                        backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Quick Order</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Please confirm if you wnat to quick order this report?</Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-outline-primary" onClick={() => this.quickOrder(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={() => this.quickOrder(true)}>
                                Confirm
                            </button>
                        </Modal.Footer>
                    </Modal>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3} >
                                <Container>
                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>1</div>
                                            Select Reports
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={styles.stepUndone}>
                                            <div className={styles.stepUnselected}>2</div>
                                            Fill in Details
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={styles.stepUndone}>
                                            <div className={styles.stepUnselected}>3</div>
                                            Done
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                            <Col sm={9}>
                                <Container>
                                    <Row>
                                        <div className={styles.stepContainer} onChange={(e) => this.setRegion(e)}>
                                            Select Region<br />
                                            <div className={styles.rdoSpan}>
                                                <input type='checkbox' name='region' value="Quebec"
                                                    checked={this.state.region == "Quebec"}
                                                    className={styles.rdoCheck}
                                                    id='rdoQuebec' />
                                                <label for='rdoQuebec'>Quebec</label>
                                            </div>
                                            <div className={styles.rdoSpan}>
                                                <input type='checkbox' name='region' value="Canada"
                                                    checked={this.state.region == "Canada"}
                                                    className={styles.rdoCheck}
                                                    id='rdoCanada' />
                                                <label for='rdoCanada'>Canada</label>
                                            </div>
                                            <div className={styles.rdoSpan}>
                                                <input type='checkbox' name='region' value="USA"
                                                    checked={this.state.region == "USA"}
                                                    className={styles.rdoCheck}
                                                    id='rdoUSA' />
                                                <label for='rdoUSA'>USA</label>
                                            </div>
                                        </div>
                                        <br />
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className={styles.stepContainer}>
                                                Select the reports you want to order, or you can click on "Select All" to select all at once<br />
                                                <button className="btn btn-outline-primary" onClick={this.selectAllReports}>Select All</button>
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col sm={3}>

                                            <div className={this.state.reports[0] ? styles.imageCase : styles.imageCaseHidden}
                                                onClick={e => this.toggleReport(0)}>
                                                <Image
                                                    src='/images/Inc.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Incorporate
                                            </div></Col>
                                        <Col sm={3}>
                                            <div className={this.state.reports[1] ? styles.imageCase : styles.imageCaseHidden}
                                                onClick={e => this.toggleReport(1)}>
                                                <Image
                                                    src='/images/Bank.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Bank
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className={this.state.reports[2] ? styles.imageCase : styles.imageCaseHidden}
                                                onClick={e => this.toggleReport(2)}>
                                                <Image
                                                    src='/images/Legal.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Legal
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className={this.state.reports[3] ? styles.imageCase : styles.imageCaseHidden}
                                                onClick={e => this.toggleReport(3)}>
                                                <Image
                                                    src='/images/suppliers.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Suppliers
                                            </div>
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className={styles.stepContainer}>

                                                <label class="form-label" for="customFile">Upload credit application</label>
                                                <input type="file" className="form-control" id="customFile" />
                                                <button onClick={e => this.uploadApplication(e)}>Upload</button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={10}>
                                            <div className={styles.stepContainer}>

                                                <button className="btn btn-outline-primary" onClick={() => this.quickOrder(undefined)}>Quick Order</button>
                                            </div>
                                        </Col>
                                        <Col>
                                            <button className="btn btn-primary" onClick={this.nextStep}>Next</button>
                                        </Col>

                                    </Row>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        }
        else {
            return (
                <>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3}>
                                <Container>
                                    <Row>
                                        <Col className={styles.stepUndone}>
                                            <div className={styles.stepUnselected}>1</div>
                                            Select Reports
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>2</div>
                                            Fill in Details<br />

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <ul> {this.state.reportList} </ul>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={styles.stepUndone}>
                                            <div className={styles.stepUnselected}>3</div>
                                            Done
                                        </Col>
                                    </Row>
                                </Container>

                            </Col>
                            <Col>
                                <FormComponent rows={[...cols]} data={this.state.data} submit={this.submit} duplicates={['banks', 'suppliers']} />
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        }
    }


}
export default OrderNewReport;
