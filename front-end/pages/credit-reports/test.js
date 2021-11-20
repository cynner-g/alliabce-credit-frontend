import { FormComponent } from '../../components/FormComponent';
import Header from "../../components/header"

const test = () => {
    /*
            
            {
                'title': "DBA (Doing Business As) Name",
                'params': {
                    'model': ".DBAName",
                    'required': false,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            }]
        },
        {
            'row': [{
                'title': "Legal Business Name",
                'params': {
                    'model': ".LegalBusinessName",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },
            {
                'title': "DBA (Doing Business As) Name",
                'params': {
                    'model': ".DBAName",
                    'required': false,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            }]
        },
        {
            'row': [{
                'title': "Incorporated",
                'params': { 'fName': "Header", size: 2 }
            }]
        },
        {
            'row': [{
                'title': "NEW (Number Entreprise Quebec) of the business",
                'params': {
                    'model': ".NEQ",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },
            {
                'title': "Business Owner name",
                'params': {
                    'model': ".Owner",
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
                    'model': ".TPS",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },
            {
                'title': "TVQ de l'entreprise",
                'params': {
                    'model': ".TVQ",
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
            'row': [{
                Text: "Add Bank Account",
                'params': {
                    'model': ".add",
                    onClick: "",
                    'fName': "LinkButton"
                }
            }]
        },
        {
            'row': [{
                'title': "Bank Name",
                'params': {
                    'model': ".Name",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },
            {
                'title': "Bank Number",
                'params': {
                    'model': ".number",
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
                        'model': ".Acct",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null
                    }
                },
                {
                    'title': "Transit Number",
                    'params': {
                        'model': ".Transit",
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
                        'model': ".Address",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null
                    }
                },
                {
                    'title': "Bank Unique Number",
                    'params': {
                        'model': ".uniqueNubmer",
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
                        'model': ".manager",
                        'required': false,
                        'fName': "TextRow",
                        'defaultVal': null
                    }
                },
                {
                    'title': "Bank Manager Email",
                    'params': {
                        'model': ".mgr_email",
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
                        'model': ".mgrNumber",
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
            'row': [{
                Text: "Add Supplier",
                'params': {
                    'model': ".add",
                    onClick: "",
                    'fName': "LinkButton"
                }
            }]
        },
        {
            'row': [{
                'title': "Supplier Business Name",
                'params': {
                    'model': ".Name",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },
            {
                'title': "Complete Supplier Address",
                'params': {
                    'model': ".address",
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
                        'model': ".bus_number",
                        'required': true,
                        'fName': "TextRow",
                        'defaultVal': null
                    }
                },
                {
                    'title': "Personal Phone Number (supplier)",
                    'params': {
                        'model': ".personal_supplier_number",
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
    */
    const columns =
        [{
            'row': [{
                'title': "General",
                'params': { 'fName': "Header", size: 2 }
            }]
        }, {
            'row': [{
                'title': "Legal Business Name",
                'params': {
                    'model': ".LegalBusinessName",
                    'required': true,
                    'fName': "TextRow",
                    'defaultVal': null
                }
            },

            ]
        }
        ]

    return (
        <>
            <Header />
            <FormComponent rows={columns} submit={submit} />
        </>
    )
}

const submit = (data) => {
    console.log(data)
}

export default test;