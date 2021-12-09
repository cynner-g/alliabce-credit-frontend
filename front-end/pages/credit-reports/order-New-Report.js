import { FormComponent } from '../../components/FormComponent';
import Header from "../../components/header"
import Router from "next/router";
import Image from 'next/image'
import Link from 'next/link'
import { Component } from 'react'
import { Container, Row, Col, Modal, OverlayTrigger, Popover } from 'react-bootstrap';
import {
    order_details,
    order_report,
    resubmit_report
} from '../api/credit_reports';

import {
    list_companies
} from '../api/companies'

import {
    get_provinces
} from '../api/provinces'

import styles from "./order-New-Report.module.css";
import Cookies from 'js-cookie'


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
            showEditSubmit: false,
            warning: null,
            provinces: [],
            role: "user"
        }
    }

    async componentDidMount() {
        const token = Cookies.get('token')
        this.setState({ columns: this.getColumns() });
        this.setState({
            provinces: await get_provinces({ api_token: token, language: 'en' })
        })

        // // if passing in a report to edit
        console.log(Router?.router?.query?.rptId?.length)
        if (Router?.router?.query?.rptId?.length > 0) {
            let rptId = Router.router.query.rptId;
        // if (true) {
        //     let rptId = '61ab92dc799c28f4185b143e';
            let token = Cookies.get('token')
            order_details(rptId, token).then(async (data) => {

                let columns = this.state.columns;
                let banks = {}
                let numBanks = data.banks.length

                //flatten the array of banks into single JSON object
                data.banks.forEach((bank, index) => {
                    for (const key in bank) {
                        if (bank.hasOwnProperty(key)) {
                            //watch out for "Address" field
                            if (key === 'bank_address') {
                                banks.bank_address = {};
                                for (const add in bank[key]) {
                                    if (bank[key].hasOwnProperty(add)) {
                                        banks[key][`${add}_${index}`] = bank[key][add];
                                    }
                                }
                            }
                            else {
                                banks[`${key}_${index}`] = bank[key];
                            }
                        }
                    }
                })
                data.banks = banks;

                //get array position of each item
                let firstRow = columns.findIndex(row => {
                    return row?.params?.model?.toLowerCase().split('.')[0] == 'banks'
                })

                let bankCols = columns.filter(row => {
                    return row?.params?.model?.toLowerCase().split('.')[0] == 'banks'
                })

                let newBankCols = [];
                for (let index = 0; index < numBanks; index++) {
                    //add bank name (number)
                    newBankCols.push({
                        'title': `Bank ${index + 1}`,
                        'params': {
                            model: 'banksTitle',
                            'fName': "Header", size: 16,
                            colNum: 0
                        },
                        dupNum: index
                    })

                    bankCols.forEach(bank => {
                        if (bank?.params?.model.split('.').length > 1) {
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
                            if (key === 'suppliers_address') {
                                suppliers.suppliers_address = {};
                                for (const add in supplier[key]) {
                                    if (supplier[key].hasOwnProperty(add)) {
                                        suppliers[key][`${add}_${index}`] = supplier[key][add];
                                    }
                                }
                            }
                            else {
                                suppliers[`${key}_${index}`] = supplier[key];
                            }
                        }
                    }
                })
                data.suppliers = suppliers;

                firstRow = columns.findIndex(row => {
                    return row.params?.model?.toLowerCase().split('.')[0] == 'suppliers'
                })

                let supplierCols = columns.filter(row => {
                    return row.params?.model?.toLowerCase().split('.')[0] == 'suppliers'
                })
                let newSupplierCols = [];
                for (let index = 0; index < numSuppliers; index++) {
                    newSupplierCols.push({
                        'title': `Supplier ${index + 1}`,
                        'params': {
                            model: 'suppliersTitle',
                            'fName': "Header", size: 16,
                            colNum: 0
                        },
                        dupNum: index
                    })

                    supplierCols.forEach(supplier => {
                        if (supplier.params?.model?.split('.').length > 1) {
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
                        try {
                            layers.forEach(layer => {
                                d = d[layer]
                            })
                        }
                        catch (ex) {
                            console.log(ex);
                        }
                        if (column.params.fName == "TextRow")
                            column.value = d;
                    }
                })


                await this.setState({ data: data, origData: data, isEdit: false, step: 2, columns: columns });
            });
        }

        //get user company data
        else {
            //if admin get list of all companies
            const role = Cookies.get("role")
            this.setState({ role: role })
            if (role === "admin") {
                let body = {
                    "api_token": token,
                    "language": "en",
                    "sort_by": "company_name",
                }
                //download all company names

                let companies = await list_companies(body)
                console.log(companies.data)
            }
            //TODO
        }
    }

    //Display JSON fucntions
    addBank = () => {
        let columns = this.state.columns;
        let banks = columns.filter(col => col.params?.model?.startsWith("banks"))
        banks.shift()//remove title 

        let item = banks[banks.length - 1];
        let newDupNum = item.dupNum;//get the dupNum of the last bank

        newBanks = banks.filter(bank => bank.dupNum == newDupNum); //get only last row of banks
        newDupNum++;
        let newBanks = JSON.parse(JSON.stringify(newBanks)); //ensure new variable not reference
        // newBanks.forEach(newBank => {
        for (let i = 0; i < newBanks.length; i++) {
            let params = { ...newBanks[i].params };
            if (params.model.indexOf('_') > 0) {
                params.model = params.model.replace(newBanks[i].dupNum, newDupNum)
            }
            else {
                params.model = params.model + '_' + newDupNum;
            }
            newBanks[i].value = '';
            params.value = ''
            newBanks[i].dupNum = newDupNum;
            //add remove button
            if (params.fName === 'LinkButton' && newBanks[i].dupNum > 0) { //if this is a second or greater bank
                params.onClick = (model) => this.removeBank(newBanks[i].dupNum, model);
                newBanks[i].Text = "Remove"
            }
            newBanks[i].params = params;

            //rename the model to fit the bank number
        }
        // });

        let numBanks = newBanks.length; //Banks header and Add new bank button
        let lastBank = columns.findIndex(col => col.params?.model?.startsWith("banks")) + numBanks * newDupNum;

        let titleBank = newBanks.find(bank => bank.params.fName == 'Header');
        if (titleBank) {
            let num = +titleBank.title.split(' ').pop();
            titleBank.title = titleBank.title.replace(num, num + 1);
        }

        columns.splice(lastBank + 1, 0, ...newBanks);
        // let startArray = [...columns].slice(0, lastBank + numBanks + 1);
        // let endArray = [...columns].splice(lastBank + numBanks + 1);
        // //concatenate start, new and end arrays
        // columns = startArray.concat(newBanks, endArray);
        this.setState({ columns: columns });
    }

    removeBank = (bankNum, model) => {
        let columns = this.state.columns;
        let banks = columns.filter(col => col.params?.model?.startsWith("banks."))//get all banks
        let ttlBanks = banks.length;
        let bank = banks.filter(b => b.params.model == model); //get exact bank for dupNum
        // let dupNum = bank[0].dupNum + 1;
        let dupNum = bankNum;
        let numBanks = banks.filter(b => b.dupNum == dupNum).length;//number of bank items
        let firstItem = banks.findIndex(b => b.dupNum == dupNum);//number of bank items
        let firstBank = columns.findIndex(col => col.params?.model?.startsWith("banks."))//get first bank

        banks.splice(firstItem, numBanks);
        let len = banks.length;
        //in theory replace existing bank array with new bank array
        columns.splice(firstBank, ttlBanks, ...banks);
        this.setState({ columns: columns });
    }

    addSupplier = () => {
        let columns = this.state.columns;
        let suppliers = columns.filter(col => col.params?.model?.startsWith("suppliers"))

        suppliers.shift(); //remove title and add new button
        let newDupNum = suppliers[suppliers.length - 1].dupNum;//get the dupNum of the last Supplier
        newSuppliers = suppliers.filter(supplier => supplier.dupNum == 0); //get only last row of Suppliers
        let newSuppliers = JSON.parse(JSON.stringify(newSuppliers)); //ensure new variable not reference


        newSuppliers.forEach(newSupplier => {
            newSupplier.params.model = newSupplier.params.model.replace(newSupplier.dupNum, ++newSupplier.dupNum)
            // newSupplier.dupNum++;
            newSupplier.value = '';
            newSupplier.params.value = ''
            //add remove button
            if (newSupplier.params.fName === 'LinkButton' && newSupplier.dupNum > 0) { //if this is a second or greater bank
                newSupplier.params.onClick = this.removeSupplier;
                newSupplier.Text = "Remove"
            }

        });

        let numSuppliers = newSuppliers.length; //Suppliers header and Add new supplier button
        let lastSupplier = columns.findIndex(col => col.params?.model?.startsWith("suppliers")) + numSuppliers * newDupNum;

        let titleSupplier = newSuppliers.find(supplier => supplier.params.fName == 'Header');
        if (titleSupplier) {
            let num = +titleSupplier.title.split(' ').pop();
            titleSupplier.title = titleSupplier.title.replace(num, num + 1);
        }

        let startArray = [...columns].slice(0, lastSupplier + numSuppliers + 1);
        let endArray = [...columns].splice(lastSupplier + numSuppliers + 1);
        //concatenate start, new and end arrays
        columns = startArray.concat(newSuppliers, endArray);
        this.setState({ columns: columns });
    }

    removeSupplier = (model) => {
        let columns = this.state.columns;
        let suppliers = columns.filter(col => col.params?.model?.startsWith("suppliers."))//get all suppliers
        let ttlsuppliers = suppliers.length;
        let supplier = suppliers.filter(b => b.params.model == model); //get exact supplier for dupNum
        let dupNum = supplier[0].dupNum; //dupNum of the model
        // let dupNum = model.replace(/^\D+/g, ''); //remove all text characters, leaving only numbers:  The dupNum.
        let numsuppliers = suppliers.filter(b => b.dupNum == dupNum).length;//number of supplier items
        let firstItem = suppliers.findIndex(b => b.dupNum == dupNum);//number of supplier items
        let firstsupplier = columns.findIndex(col => col.params?.model?.startsWith("suppliers."))//get first supplier

        suppliers.splice(firstItem, numsuppliers);
        let len = suppliers.length;
        //in theory replace existing supplier array with new supplier array
        columns.splice(firstsupplier, ttlsuppliers + 1, ...suppliers);
        this.setState({ columns: columns });
    }



    getColumns = () => {
        let ret =
            [
                {
                    'title': "General",
                    'params': {
                        'fName': "Header", size: 24, colNum: 0,
                        model: 'general_details',
                    }
                },
                {
                    'title': "Legal Business Name",
                    'params': {
                        'model': "general_details.legal_name",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
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
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },

                {
                    'title': "Civic Number",
                    'params': {
                        'model': "general_details.address.civic_number",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Street",
                    'params': {
                        'model': "general_details.address.street_name",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Suite",
                    'params': {
                        'model': "general_details.address.suite",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },

                {
                    'title': "City",
                    'params': {
                        'model': "general_details.address.city",
                        'required': false,
                        'fName': "TextRow",
                        'editable': true,
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
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Zip",
                    'params': {
                        'model': "general_details.address.“postal_code",
                        'required': false,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Incorporated",
                    'params': {
                        model: 'incorporate_details',
                        'fName': "Header", size: 24,
                        colNum: 0
                    }
                },
                {

                    'title': "NEQ (Number Entreprise Quebec) of the business",
                    'params': {
                        'model': "incorporate_details.quebec_enterprise_number",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
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
                        'editable': true,
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
                        'editable': true,
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
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Bank",
                    'params': {
                        model: 'banksTitle',
                        'fName': "Header", size: 24,
                        colNum: 0
                    }
                },
                {
                    Text: "Add Bank Account",
                    'dupNum': 0,
                    'params': {
                        model: 'banks.add_0',
                        onClick: this.addBank,
                        'fName': "LinkButton",
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Name",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_name_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Civic Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.civic_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Street",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.street_name_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Suite",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.suite_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },

                {
                    'title': "City",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.city_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Province",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.state_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Postal Code",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_address.postal_code_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Bank Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_phone_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Account Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.account_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Transit Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.transit_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Bank Unique Number",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_unique_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Name of Bank Manager",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_name_0",
                        'required': false,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Bank Manager Email",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_email_id_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Phone Number of Bank Manager",
                    'dupNum': 0,
                    'params': {
                        'model': "banks.bank_manager_phone_number_0",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Suppliers",
                    'params': {
                        'fName': "Header", size: 24,
                        model: 'suppliersTitle',
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {
                    supplierId: { model: '_id', visible: false },
                    Text: "Add Supplier",
                    'params': {
                        model: 'suppliers.add',
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
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }, 'dupNum': 0,
                },
                {
                    'title': "Civic Number",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.civic_number",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Street",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.street_name",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 1
                    }
                },
                {
                    'title': "Suite",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.suite",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },

                {
                    'title': "City",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.city",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 0
                    }
                },
                {
                    'title': "Province",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.state",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },
                {
                    'title': "Postal Code",
                    'dupNum': 0,
                    'params': {
                        'model': "suppliers.suppliers_address.postal_code",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
                        'defaultVal': null,
                        colNum: 2
                    }
                },

                {
                    'title': "Business Phone Number (supplier)",
                    'params': {
                        'model': "suppliers.business_phone_number",
                        'required': true,
                        'fName': "TextRow",
                        'editable': true,
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
                        'editable': true,
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

    //Button Functions
    submit = (data) => { //submit from the form component
        data = this.unflatten(data);
        let api = Cookies.get('token')
        if (this.state.isEdit) { //if we are editing page
            this.setState({ storedEdit: data, showEditSubmit: true });
            resubmit_report(data, api).then((data) => {
                console.log(data)
            });
        }
        else {
            //upload data to server here - Resubmit_report(data)
            order_report(data, api).then((data) => {
                console.log(data)
            });
            this.setState({ step: 3 })
        }
    }

    unflatten = (obj = {}) => {
        const result = {};
        let temp, substrings, property, i;
        for (property in obj) {
            substrings = property.split('.');
            temp = result;
            for (i = 0; i < substrings.length - 1; i++) {
                if (!(substrings[i] in temp)) {
                    if (isFinite(substrings[i + 1])) {
                        temp[substrings[i]] = [];
                    }
                    else {
                        temp[substrings[i]] = {};
                    }
                }
                temp = temp[substrings[i]];
            }
            temp[substrings[substrings.length - 1]] = obj[property];
        }
        return result;
    }

    //server call functions
    uploadApplication = (e) => {
        this.setState({ requestFile: e.target.files[0] })
    }

    quickOrder = (resp) => {
        if (this.state.requestFile == null) {
            this.setState({ warning: "A credit application file is required before proceeding" })
            return;
        }

        console.log("Resp: ", resp)
        //if the Quick Order button has been selected pre-popup
        if (resp == undefined)
            this.setState({ isModalOpen: true })
        else {
            //button from modal popup - closes modal
            this.setState({ isModalOpen: false })
            if (resp) { //if confirm is clicked
                let data = new FormData()
                let reports = this.state.reports
                let ordered_report = [];
                let rptList = ["Incorporate", "Bank", "Legal", "Suppliers"]
                for (let i = 0; i < 4; i++) {
                    if (reports[i]) ordered_report.push(rptList[i])
                }

                data.append('credit_application', this.state.requestFile);
                data.append('company_id', Cookies.get("company_id"));
                data.append('region', this.state.region);
                data.append('is_quick_report', true);
                data.append('ordered_report', ordered_report);

                order_report(data).then(data => {
                    //show "order successful" status message - timed out
                });

                this.setState({ step: 4 })
            }
            else { //move to next step
                this.nextStep();
            }
        }
    }


    //step functions
    //Step 1 functions
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

    nextStep = () => {

        //check to see if credit application file selected
        if (this.state.requestFile == null) {
            this.setState({ warning: "A credit application file is required before proceeding" })
            return;
        }

        //build list of items for the side of the page under steps
        let reports = this.state.reports;
        let rpts = [];
        let rptList = ["Incorporate", "Bank", "Legal", "Suppliers"]
        // let columns = this.state.columns;
        let columns = this.getColumns();
        //general is always listed
        rpts.push(<li>General</li>);
        reports.forEach((report, idx) => {
            //for each report if it is selected to be requested
            if (report || idx == 2) { //legal is always selected??
                rpts.push(<li>{rptList[idx]}</li>)
            }
            else { //if this report data is not in the selected list
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
                    if (field?.length > 0) {
                        let startRow = columns.findIndex(row => {
                            return row.params?.model?.startsWith(field)
                        });
                        let numRows = columns.filter(row => {
                            return row.params?.model?.startsWith(field)
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

    beginEdit = () => {
        this.setState({ isEdit: true });
    }

    cancelForm = () => {
        this.reportsPanel()
    }

    buildForm = () => {
        let rows = [...this.state.columns];
        let submit = this.submit;
        let cancel = this.cancelForm;
        let data = null
        console.log(rows)
        if (this.state.origData) { //if there is data
            let editable = this.state.origData.is_editable;
            if (!this.state.isEdit) {//if the edit button has been pressed
                for (let i = rows.length - 1; i >= 0; i--) {
                    let col = rows[i]
                    submit = this.beginEdit;
                    //TODO:  TEST TO SEE IF THIS REPORT IS EDITABLE
                    //IF IT IS NOT REMOVE THE EDIT BUTTON ALSO

                    if (col.params.fName === 'LinkButton') {
                        col.params.visible = false;
                    }
                    //rename Submit to 'edit'
                    if (col.params.fName === 'SubmitButton') {
                        col.params.text = "Edit"
                        if (editable == false) col.params.visible = false;
                    }

                    //remove 'Cancel' button
                    if (col.params.fName === 'CancelButton') {
                        col.params.visible = false;
                    }

                    col.params.editable = false;


                }
            }
            else {
                for (let i = rows.length - 1; i >= 0; i--) {
                    let col = rows[i]
                    submit = this.beginEdit;
                    //TODO:  TEST TO SEE IF THIS REPORT IS EDITABLE
                    //IF IT IS NOT REMOVE THE EDIT BUTTON ALSO

                    //show add/remove buttons
                    if (col.params.fName === 'LinkButton') {
                        col.params.visible = true;
                    }

                    //rename Submit to 'edit'
                    if (col.params.fName === 'SubmitButton') {
                        col.params.text = "Resubmit"
                        if (!editable) col.params.visible = false;
                    }

                    //remove 'Cancel' button
                    if (col.params.fName === 'CancelButton') {
                        if (!editable) col.params.visible = false;
                        else col.params.visible = true;
                    }

                    col.params.editable = true;
                }
            }



        }

        return (
            <div className='order_report_right'>
                <FormComponent rows={rows}
                    submit={submit}
                    cancel={cancel}
                />
            </div>
        )
    }

    buildStep = (stepText, stepNum) => {
        let style = {}
        if (stepNum == this.state.step) { style = styles.stepContainer } else { style = styles.stepUndone };
        return (
            <div className={stepNum <= this.state.step ? `${styles.stepContainer}` : `${styles.stepUndone}`}>
                <div className={stepNum <= this.state.step ? styles.stepBullet : styles.stepUnselected}>{stepNum}</div>
                {stepNum <= this.state.step ? <button className={styles.stepLink + " btn btn-link"} onClick={() => this.setState({ step: stepNum })} >{stepText}</button>
                    : <div className={styles.stepUnselected}>{stepText}</div>
                }
            </div>
        )
    }

    buildSteps = () => {
        return (
            <div className="report_steps">

                {this.buildStep("Select Reports", 1)}

                {this.buildStep("Fill in Details", 2)}
                {/* <Col className={styles.stepUndone}>
                        <div className={styles.stepUnselected}>2</div>
                        Fill in Details
                    </Col> */}

                {this.buildStep("Done", 3)}
                {/* <Col className={styles.stepUndone}>
                        <div className={styles.stepUnselected}>3</div>
                        Done
                    </Col> */}

            </div>)
    }

    buildPage = () => {
        if (this.state.step == 1) {
            return (<>
                <div className="order_reportwrap">
                    <Row>
                        {this.state.origData ? '' :
                        <Col sm={3} className="order_report_left" >
                            {this.buildSteps()}
                        </Col>
                        }
                        <Col sm={9}>
                            <div className="order_report_right">
                                <div className="or_search">
                                    <label htmlFor="select_company">Select Company</label>
                                    <input type="text" className='form-control' name="" value="" placeholder="try entering the company name" />
                                </div>

                                <div className={`or_check_group ${styles.stepContainer}`} onChange={(e) => this.setRegion(e)}>
                                    <div className='or_subtitle'>Select Region</div>
                                    <div className={`form-check ${styles.rdoSpan}`}>
                                        <input type='checkbox' name='region' value="Quebec"
                                            onChange={() => { }}
                                            checked={this.state.region == "Quebec"}
                                            className={`form-check-input ${styles.rdoCheck}`}
                                            id='rdoQuebec' />
                                        <label className="form-check-label" htmlFor='rdoQuebec'>Quebec</label>
                                    </div>
                                    <div className={`form-check ${styles.rdoSpan}`}>
                                        <input type='checkbox' name='region' value="Canada" className="form-check-input"
                                            checked={this.state.region == "Canada"}
                                            className={`form-check-input ${styles.rdoCheck}`}
                                            onChange={() => { }}
                                            id='rdoCanada' />
                                        <label className="form-check-label" htmlFor='rdoCanada'>Canada</label>
                                    </div>
                                    <div className={`form-check ${styles.rdoSpan}`}>
                                        <input type='checkbox' name='region' value="USA" className="form-check-input"
                                            checked={this.state.region == "USA"}
                                            onChange={() => { }}
                                            className={`form-check-input ${styles.rdoCheck}`}
                                            id='rdoUSA' />
                                        <label className="form-check-label" htmlFor='rdoUSA'>USA</label>
                                    </div>
                                </div>

                                <div className={`or_select_all ${styles.stepContainer}`}>
                                    <div className='or_subtitle'>Select the reports you want to order, or you can click on "Select All" to select all at once</div>
                                    <div className='form-check '>
                                        <input type='checkbox' className="form-check-input" onClick={this.selectAllReports} />
                                        <label className="form-check-label" htmlFor='rdoUSA'>Select All Reports</label>
                                    </div>
                                </div>

                                <div className="select_report">
                                    <div className={this.state.reports[0] ? styles.imageCase : styles.imageCaseHidden}
                                        onClick={e => this.toggleReport(0)}>
                                        <figure><Image
                                            src='/images/Inc.png'
                                            height={108}
                                            width={108}
                                        /></figure>
                                        <caption>Incorporate</caption>
                                    </div>
                                    <div className={this.state.reports[1] ? styles.imageCase : styles.imageCaseHidden}
                                        onClick={e => this.toggleReport(1)}>
                                        <figure><Image
                                            src='/images/Bank.png'
                                            height={108}
                                            width={108}
                                        /></figure>
                                        <caption>Bank</caption>
                                    </div>
                                    <div className={this.state.reports[2] ? styles.imageCase : styles.imageCaseHidden}
                                        onClick={e => this.toggleReport(2)}>
                                        <figure><Image
                                            src='/images/Legal.png'
                                            height={108}
                                            width={108}
                                        /></figure>
                                        <caption>Legal</caption>
                                    </div>
                                    <div className={this.state.reports[3] ? styles.imageCase : styles.imageCaseHidden}
                                        onClick={e => this.toggleReport(3)}>
                                        <figure><Image
                                            src='/images/suppliers.png'
                                            height={108}
                                            width={108}
                                        /></figure>
                                        <caption>Suppliers</caption>
                                    </div>
                                </div>
                                <div className="clearB"></div>

                                <div className={`upload_cr_app {styles.stepContainer}`}>
                                    <div className='or_subtitle'>Upload credit application</div>

                                    <label className="form-label btn" htmlFor="customFile">Upload credit application</label>
                                    <input type="file" className="form-control" id="customFile" onChange={e => this.uploadApplication(e)} />
                                    <span className="upload_cr_app fileName"> {this.state.requestFile?.name || ""}</span>
                                </div>

                                <div className="mb-5">&nbsp;</div>
                                {/* <div className="mb-5">&nbsp;</div> */}


                            </div>

                            <div className=''>
                                <Row className='quick_order_wrap'>
                                    <Col className="text-start">
                                        <div className={styles.stepContainer}>
                                            <button className="btn quick_order" onClick={() => this.quickOrder(undefined)}>Quick Order</button>

                                            <OverlayTrigger
                                                trigger="hover focus"
                                                placement='right'
                                                rootClose={true}
                                                overlay={
                                                    <Popover id={`popover-positioned-top`} classname='external_links_popup'>
                                                        <Popover.Header as="div" className='external_links_popup title'></Popover.Header>
                                                        <Popover.Body>
                                                            You can "Quick Order" a report and <br />
                                                            Alliance Credit will fill out the form for<br />
                                                            you, it may charge extra.
                                                        </Popover.Body>
                                                    </Popover>
                                                }
                                            >
                                                <i className='or_help'></i>
                                            </OverlayTrigger>


                                        </div>
                                    </Col>
                                    <Col className="text-end">
                                        <button className="btn btn-primary" onClick={this.nextStep}>Next</button>
                                    </Col>

                                </Row>
                            </div>
                            <div className="pb-5">&nbsp;</div>


                        </Col>
                    </Row>
                </div>
            </>
            )
        }
        else if (this.state.step == 2) { //show form
            return (
                <>
                    {/* <Container> */}
                    {/* <div className="breadcrumb">
                        <ul className=" me-auto mb-2 mb-lg-0">
                            <li><Link href="/credit-report"><a className="nav-link">Credit Report</a></Link></li>
                            <li>Order New Report</li>
                        </ul>
                    </div> */}
                    <div className='order_reportwrap'>
                        <Row>
                            {this.state.origData ? '' :
                            <Col className='order_report_left' sm={3}>
                                <div className='report_steps'>
                                    {this.buildSteps()}
                                    </div>
                            </Col>
                            }
                            <Col>
                                {this.buildForm()}
                            </Col>
                        </Row>
                    </div>
                    {/* </Container> */}
                </>
            )

        }
        else if (this.state.step == 3) {
            return (
                <>
                    {/* <Header /> */}
                    {/* <Container> */}
                    {/* <div className="breadcrumb">
                        <ul className=" me-auto mb-2 mb-lg-0">
                            <li><Link href="/credit-report"><a className="nav-link">Credit Report</a></Link></li>
                            <li>Order New Report</li>
                        </ul>
                    </div> */}
                    <div className='order_reportwrap'>
                        <Row>
                            {this.state.origData ? '' :
                            <Col sm={3} className="order_report_left" >
                                {this.buildSteps()}
                            </Col>
                            }
                            {/* <Col className='order_report_left' sm={3}>
                                <div className='report_steps'>
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
                                </div>
                            </Col> */}
                            <Col>
                                <div className='order_report_right'>
                                    <Row>
                                        <Col>
                                            <div className="imgblockmessage">
                                                <Image
                                                    src='/images/notepad.png'
                                                    height={314}
                                                    width={251}
                                                />

                                            </div>
                                        </Col>

                                    </Row>
                                    <div className="or_success_message">
                                        <p>You have successfully ordered the report, you can now see this report on your “Credit Reports Panel.</p>
                                        <br />

                                        <Row >
                                            <Col className={styles.doneButtonL}>
                                                <button className="btn btn-outline-primary" onClick={this.newReport}>Order New Report</button>
                                            </Col>
                                            <Col className={styles.doneButtonR}>
                                                <button className="btn btn-outline-primary" onClick={this.reportsPanel}>Go to Credit Reports Panel</button>
                                            </Col>
                                        </Row>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {/* </Container> */}

                </>
            )
        }
        else if (this.state.step == 4) { //Quick Reports
            return (
                <>
                    <Row>
                        {this.state.origData ? '' :
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
                        }
                        <Col >
                            <Row>
                                <Col>
                                    <div className={styles.doneImage}>
                                        <Image
                                            src='/images/notepad.png'
                                            height={314}
                                            width={251}
                                        />
                                        <div className={styles.doneMessage}>
                                            You have successfully ordered a Quick Report, Report form will be filled soon by us till then it will be in <strong>pending</strong> state, you can now see this report on your “Credit Reports Panel.
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

                </>
            )
        }
    }

    render() {

        return (
            <>
                <Modal
                    show={this.state.warning !== null}
                    onHide={() => this.setState({ warning: null })}
                    backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Information Needed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.state.warning}</Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-primary" onClick={() => this.setState({ warning: null })}>
                            Continue
                        </button>
                    </Modal.Footer>
                </Modal>
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

                <div className="breadcrumb">
                    <ul className=" me-auto mb-2 mb-lg-0">
                        <li><Link href="/credit-reports"><a className="nav-link">Credit Reports</a></Link></li>
                        <li>{this.state.origData ? 'Edit ' : 'Order New '}Report</li>
                    </ul>
                </div>
                <Container>
                    {this.buildPage()}
                </Container>
            </>)
    }
}


export default OrderNewReport;
