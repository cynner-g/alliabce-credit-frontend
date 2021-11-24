import { FormComponent } from '../../components/FormComponent';
import { order_details } from '../api/credit_reports';
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
            isEdit: false,
            data: null,
            origData: null,
            step: 1,
            reports: [false, false, false, false],
            region: "Quebec",
            isModalOpen: false,
            reportList: null,
            columns: null,
            showEditSubmit: false
        }
    }

    componentDidMount() {
        this.setState({ columns: this.getColumns() });
        if (Router && Router.router && Router.router.query && Router.router.query.rptId && Router.router.query.rptId.length > 0) {
            let rptId = Router.router.query.rptId;
            order_details(rptId).then(async (data) => {

                let columns = this.state.columns;
                let banks = {}
                let numBanks = data.banks.length

                //flatten the array of banks into single JSON object
                data.banks.forEach((bank, index) => {
                    for (const key in bank) {
                        if (bank.hasOwnProperty(key)) {
                            banks[`${key}_${index}`] = bank[key];
                        }
                    }
                })
                data.banks = banks;

                //get array position of each item
                let firstRow = columns.findIndex(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == 'banks'
                })

                let bankCols = columns.filter(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == 'banks'
                })

                let newBankCols = [];
                for (let index = 0; index < numBanks; index++) {
                    bankCols.forEach(bank => {
                        if (bank.params && bank.params.model.split('.').length > 1) {
                            let model = bank.params.model;
                            model = `${model}_${index}`;
                            bank.params.model = model;
                        }
                        newBankCols.push(bank)
                    })
                }

                let startCols = columns.slice(0, firstRow);
                let endCols = columns.splice(firstRow + bankCols.length)
                columns = startCols.concat([...newBankCols], endCols)

                // columns.splice(firstRow, bankCols.length, [...newBankCols]);

                //complete
                let suppliers = {}
                let numSuppliers = data.suppliers.length;
                data.suppliers.forEach((supplier, index) => {
                    for (const key in supplier) {
                        if (supplier.hasOwnProperty(key)) {
                            suppliers[`${key}_${index}`] = supplier[key];
                        }
                    }
                })
                data.suppliers = suppliers;

                firstRow = columns.findIndex(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == 'suppliers'
                })

                let supplierCols = columns.filter(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == 'suppliers'
                })
                let newSupplierCols = [];
                for (let index = 0; index < numSuppliers; index++) {
                    supplierCols.forEach(supplier => {
                        if (supplier.params && supplier.params.model.split('.').length > 1) {
                            let model = supplier.params.model;
                            model = `${model}_${index}`;
                            supplier.params.model = model;
                        }
                        newSupplierCols.push(supplier)
                    })
                }
                startCols = columns.slice(0, firstRow);
                endCols = columns.splice(firstRow + supplierCols.length)
                columns = startCols.concat([...newSupplierCols], endCols)

                //add Data to columns here
                columns.forEach((column) => {
                    if (column.params.model && column.params.fName == "TextRow") {
                        let model = column.params.model;
                        let layers = model.split('.');
                        let d = JSON.parse(JSON.stringify(data));
                        layers.forEach(layer => {
                            d = d[layer]
                        })
                        if (column.params.fName == "TextRow")
                            column.value = d;
                    }
                })

                // columns.splice(firstRow, supplierCols.length, [...newSupplierCols]);
                await this.setState({ data: data, origData: data, isEdit: true, step: 2, columns: columns });
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
        let ret =
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
                        model: 'banksTitle',
                        'fName': "Header", size: 2,
                        colNum: 0
                    }
                },
                {
                    Text: "Add Bank Account",
                    'params': {
                        model: 'banksAdd',
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
                        model: 'suppliersTitle',
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {
                    supplierId: { model: '_id', visible: false },
                    Text: "Add Supplier",
                    'params': {
                        model: 'suppliersAdd',
                        onClick: this.addSupplier,
                        'fName': "LinkButton",
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {

                    'title': "Supplier Business Name",
                    'params': {
                        'model': "suppliers.business_name",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {
                    'title': "Complete Supplier Address",
                    'params': {
                        'model': "suppliers.address",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }, 'dupNum': 0,
                },
                {
                    'title': "Business Phone Number (supplier)",
                    'params': {
                        'model': "suppliers.business_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {
                    'title': "Personal Phone Number (supplier)",
                    'params': {
                        'model': "suppliers.personal_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null,
                        colNum: 1
                    }, 'dupNum': 0,
                },

                {
                    'params': {
                        'fName': "SubmitButton",
                        'text': "Submit",
                        colNum: 0
                    }
                },
                {
                    'params': {
                        'fName': "CancelButton",
                        'text': "Cancel",
                        colNum: 1
                    }
                }
            ]
        return ret;
    }

    submit = (data) => {
        if (this.state.isEdit) {
            this.setState({ storedEdit: data, showEditSubmit: true });
        }

        //upload data to server here
        this.setState({ step: 3 })
    }

    resubmit = (val) => {
        let data = this.state.storedEdit;
        //upload data to server
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
                this.setState({ step: 4 })
            }
            else {
                this.nextStep();
            }
        }
    }

    nextStep = () => {
        //build list of items for the side of the page under steps

        let reports = this.state.reports;
        let rpts = [];
        let rptList = ["Incorporated", "Bank", "Legal", "Suppliers"]
        let columns = this.state.columns;
        //general is always listed
        rpts.push(<li>General</li>);
        reports.forEach((report, idx) => {
            if (report || idx == 2) {
                rpts.push(<li>{rptList[idx]}</li>)
            }
            else {
                //find and remove unused items from the form components
                let field = ''
                //get form component abbreviation for class of report
                switch (idx) {
                    case 0: field = 'incorporate_details'; break;
                    case 1: field = 'banks'; break;
                    case 3: field = 'suppliers'; break;
                    default: field = null;
                }
                try {
                    if (field && field.length > 0) {
                    let startRow = columns.findIndex(row => {
                        return row.params.model && row.params.model.startsWith(field)
                    });
                    let numRows = columns.filter(row => {
                        return row.params.model && row.params.model.startsWith(field)
                    })
                    numRows = numRows.length;

                    //once I have start position and length
                    //remove items from the columns list
                    if (startRow >= 0) {
                        columns.splice(startRow, numRows);
                    }
                }
                }
                catch (ex) { }

            }
        });

        //after all is complete update the state, causing a repost with correct data
        this.setState({ columns: columns, reportList: rpts, step: 2 });
    }


    reportsPanel = () => {
        let URL = "/credit-reports"
        if (true) {//user is admin
            Router.push({ pathname: URL });
        }
    }

    newReport = () => {
        //reset the entire state for a new report to be created
        this.setState({
            data: null,
            columns: this.getColumns(),
            step: 1,
            reports: [false, false, false, false],
            region: "Quebec",
            isModalOpen: false,
            reportList: null,
            isEdit: false
        })
    }

    render() {
        if (this.state.step == 1) {
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
                                                <label htmlFor='rdoQuebec'>Quebec</label>
                                            </div>
                                            <div className={styles.rdoSpan}>
                                                <input type='checkbox' name='region' value="Canada"
                                                    checked={this.state.region == "Canada"}
                                                    className={styles.rdoCheck}
                                                    id='rdoCanada' />
                                                <label htmlFor='rdoCanada'>Canada</label>
                                            </div>
                                            <div className={styles.rdoSpan}>
                                                <input type='checkbox' name='region' value="USA"
                                                    checked={this.state.region == "USA"}
                                                    className={styles.rdoCheck}
                                                    id='rdoUSA' />
                                                <label htmlFor='rdoUSA'>USA</label>
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

                                                <label className="form-label" htmlFor="customFile">Upload credit application</label>
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
        else if (this.state.step == 2 && !this.state.isEdit) {
            let rows = this.state.columns
            console.log(rows);
            // this.state.columns
            return (
                <>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3}>
                                <Container>
                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>1</div>
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
                                <FormComponent rows={rows}
                                    submit={this.submit}
                                />
                            </Col>
                        </Row>
                    </Container>
                </>
            )
            //data={{ ...this.state.data }}
            // duplicates={['banks', 'suppliers']}
        }
        else if (this.state.step == 2 && this.state.isEdit) {
            let rows = this.state.columns
            console.log(rows);
            return (
                <>
                    <Modal
                        show={this.state.isModalOpen}
                        onHide={() => this.quickOrder(false)}
                        backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Resubmit Form</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to resubmit the report form?</Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-outline-primary" onClick={() => this.setState({ showEditSubmit: false })}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={() => this.resubmit(true)}>
                                Confirm
                            </button>
                        </Modal.Footer>
                    </Modal>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3}>
                                <Container>
                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>1</div>
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
                                <FormComponent rows={rows}
                                    submit={this.submit}
                                    cancel={() => this.setState({ data: this.state.origData })}
                                />
                            </Col>
                        </Row>
                    </Container>
                </>
            )
            //data={{ ...this.state.data }}
            // duplicates={['banks', 'suppliers']}
        }
        else if (this.state.step == 3) {
            return (
                <>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3}>
                                <Container>
                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>1</div>
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
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>3</div>
                                            Done
                                        </Col>
                                    </Row>
                                </Container>

                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className={styles.doneImage}>
                                            <Image
                                                src='/images/notepad.png'
                                                height={314}
                                                width={251}
                                            />
                                            <div className={styles.doneMessage}>
                                                You have successfully ordered the report, you can now see this report on your “Credit Reports” Panel.
                                                <br /><br />
                                                <Container>
                                                    <Row >
                                                        <Col className={styles.doneButtonL}>
                                                            <button className="btn btn-outline-primary" onClick={this.newReport}>Order New Report</button>
                                                        </Col>
                                                        <Col className={styles.doneButtonR}>
                                                            <button className="btn btn-outline-primary" onClick={this.reportsPanel}>Go to Credit Reports Panel</button>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </div>



                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        }
        else if (this.state.step == 4) { //Quick Reports
            return (
                <>
                    <Header />
                    <Container>
                        <Row>
                            <Col sm={3}>
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
                                            Fill in Details<br />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className={styles.stepContainer}>
                                            <div className={styles.stepBullet}>3</div>
                                            Done
                                        </Col>
                                    </Row>
                                </Container>

                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <div className={styles.doneImage}>
                                            <Image
                                                src='/images/notepad.png'
                                                height={314}
                                                width={251}
                                            />
                                            <div className={styles.doneMessage}>
                                                You have successfully ordered a Quick Report, Report form will be filled soon by us till then it will be in <strong>pending</strong> state, you can now see this report on your “Credit Reports” Panel.
                                                <br /><br />
                                                <Container>
                                                    <Row >
                                                        <Col className={styles.doneButtonL}>
                                                            <button className="btn btn-outline-primary" onClick={this.newReport}>Order New Report</button>
                                                        </Col>
                                                        <Col className={styles.doneButtonR}>
                                                            <button className="btn btn-outline-primary" onClick={this.reportsPanel}>Go to Credit Reports Panel</button>
                                                        </Col>
                                                    </Row>
                                                </Container>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </>
            )
        }
    }


}
export default OrderNewReport;
