import { FormComponent } from '../../components/FormComponent';
import { get_credit_report } from '../../data/reports';
import Header from "../../components/header"
import Router from "next/router";
import { Component } from 'react'


class OrderNewReport extends Component {
    constructor(props) {
        super(props);
        this.state = { data: null }
    }

    componentDidMount() {
        console.log('mounted');
        console.log(Router.router)
        console.log(Router.router.query);
        if (Router && Router.router && Router.router.query && Router.router.query.rptId) {
            let rptId = Router.router.query.rptId;
            console.log(rptId)
            get_credit_report(rptId).then((data) => {
                console.log(data);
                this.setState({ data: data });
            });
        }
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
                        'model': "banks.add",
                        onClick: "",
                        'fName': "LinkButton",
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Name",
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
                        'model': "add",
                        onClick: "",
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
                        'model': "suppliers.personal_phone_number",
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
        alert(data)
    }

    render() {
        let cols = this.getColumns();
        console.log("Data=", this.state.data)
        return (
            <>
                <Header />
                <FormComponent rows={[...cols]} data={this.state.data} submit={this.submit} duplicates={['banks', 'suppliers']} />
            </>
        )
    }


}
export default OrderNewReport;


/*
   getColumns = () => {
        return (
            [
                {
                    'row': [{
                        'title': "General",
                        'params': { 'fName': "Header", size: 2 }
                    }]
                },
                {
                    'row': [{
                        'title': "Legal Business Name",
                        'params': {
                            'model': "general_details.legal_name",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "DBA (Doing Business As) Name",
                            'params': {
                                'model': "general_details.dba_name",
                                'required': false,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [{
                        'title': "Address",
                        'params': {
                            'model': "general_details.address.address_line",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    }]
                },

                {
                    'row': [{
                        'title': "City",
                        'params': {
                            'model': "general_details.address.city",
                            'required': false,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "State",
                            'params': {
                                'model': "general_details.address.state",
                                'required': false,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                        {
                            'title': "Zip",
                            'params': {
                                'model': "general_details.address.zip",
                                'required': false,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                    ]
                },
                {
                    'row': [{
                        'title': "Incorporated",
                        'params': { 'fName': "Header", size: 2 }
                    }]
                },
                {
                    'row': [{
                        'title': "NEQ (Number Entreprise Quebec) of the business",
                        'params': {
                            'model': "incorporate_details.quebec_enterprise_number",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "Business Owner name",
                            'params': {
                                'model': "incorporate_details.business_owner_name",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [{
                        'title': "TPS de l'entreprise",
                        'params': {
                            'model': "incorporate_details.enterprise_tps",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "TVQ de l'entreprise",
                            'params': {
                                'model': "incorporate_details.enterprise_tvq",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [{
                        'title': "Bank",
                        'params': { 'fName': "Header", size: 2 }
                    }]
                },
                {
                    bankID: { model: '_id', visible: false },
                    'row': [

                        {
                            Text: "Add Bank Account",
                            'params': {
                                'model': "banks.add",
                                onClick: "",
                                'fName': "LinkButton"
                            }
                        }]
                },
                {
                    'row': [{
                        'title': "Bank Name",
                        'params': {
                            'model': "banks.bank_name",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "Bank Number",
                            'params': {
                                'model': "banks.bank_phone_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [
                        {
                            'title': "Account Number",
                            'params': {
                                'model': "banks.account_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                        {
                            'title': "Transit Number",
                            'params': {
                                'model': "banks.transit_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [
                        {
                            'title': "Bank Address",
                            'params': {
                                'model': "banks.bank_address",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                        {
                            'title': "Bank Unique Number",
                            'params': {
                                'model': "banks.bank_unique_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [
                        {
                            'title': "Name of Bank Manager",
                            'params': {
                                'model': "banks.bank_manager_name",
                                'required': false,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                        {
                            'title': "Bank Manager Email",
                            'params': {
                                'model': "banks.bank_manager_email_id",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [
                        {
                            'title': "Phone Number of Bank Manager",
                            'params': {
                                'model': "banks.bank_manager_phone_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },

                    ]
                },
                {
                    'row': [{
                        'title': "Suppliers",
                        'params': { 'fName': "Header", size: 2 }
                    }]
                },
                {
                    supplierId: { model: '_id', visible: false },
                    'row': [{
                        Text: "Add Supplier",
                        'params': {
                            'model': "add",
                            onClick: "",
                            'fName': "LinkButton"
                        }
                    }]
                },
                {
                    'row': [{
                        'title': "Supplier Business Name",
                        'params': {
                            'model': "suppliers.business_name",
                            'required': true,
                            'fName': "TextRow",
                            'defaultVal': null
                        }
                    },
                        {
                            'title': "Complete Supplier Address",
                            'params': {
                                'model': "suppliers.address",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },
                {
                    'row': [
                        {
                            'title': "Business Phone Number (supplier)",
                            'params': {
                                'model': "suppliers.business_phone_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        },
                        {
                            'title': "Personal Phone Number (supplier)",
                            'params': {
                                'model': "suppliers.personal_phone_number",
                                'required': true,
                                'fName': "TextRow",
                                'defaultVal': null
                            }
                        }]
                },

                {
                    'row': [{
                        'params': {
                            'fName': "SubmitButton",
                            'text': "Submit"
                        }

                    }]
                }
            ]
        );
    }

*/