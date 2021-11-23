import { FormComponent } from '../../components/FormComponent';
import { get_credit_report } from '../../data/reports';
import Header from "../../components/header"
import Router from "next/router";
import Image from 'next/image'
import { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import styles from "./order-New-Report.module.css";


class OrderNewReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            columns: this.getColumns(),
            newReport: true,
            reports: [],
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
                    'params': { 'fName': "Header", size: 2, colNum: 0 }
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
                        'fName': "Header", size: 2,
                        colNum: 0
                    }
                },
                {
                    Text: "Add Bank Account",
                    'params': {

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
                        colNum: 0
                    }
                },
                {
                    supplierId: { model: '_id', visible: false },
                    Text: "Add Supplier",
                    'params': {

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

    toggleReport(e, reportID) {
        let reports = this.state.reports;
        let enabled = reports[reportID] ? false : true;
        reports[reportID] = enabled;
        this.setState({ reports: reports })
        let div = e.currentTarget;
        div.classList.remove(styles.imageCaseHidden);
        div.classList.remove(styles.imageCase);
        console.log(enabled)
        if (enabled) {
            div.classList.add(styles.imageCase);
        }
        else {
            div.classList.add(styles.imageCaseHidden);
        }
    }

    render() {
        let cols = this.state.columns;
        console.log("Data=", this.state.data)
        if (this.state.newReport) {
            return (
                <>
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
                                        <Col sm={3}>
                                            <div className={styles.imageCaseHidden + " imgParent"}
                                                onClick={e => this.toggleReport(e, 0)}>
                                                <Image
                                                    src='/images/Inc.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Incorporate
                                            </div></Col>
                                        <Col sm={3}>
                                            <div className={styles.imageCaseHidden + " imgParent"}
                                                onClick={e => this.toggleReport(e, 1)}>
                                                <Image
                                                    src='/images/Bank.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Bank
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className={styles.imageCaseHidden + " imgParent"}
                                                onClick={e => this.toggleReport(e, 2)}>
                                                <Image
                                                    src='/images/Legal.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Legal
                                            </div>
                                        </Col>
                                        <Col sm={3}>
                                            <div className={styles.imageCaseHidden + " imgParent"}
                                                onClick={e => this.toggleReport(e, 3)}>
                                                <Image
                                                    src='/images/suppliers.png'
                                                    height={108}
                                                    width={108}
                                                />
                                                Suppliers
                                            </div>
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
                            <Col sm={3}></Col>
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
