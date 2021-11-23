import React, { Component } from 'react';
import { Col, Row, Collapse } from 'react-bootstrap';

/*
List of form options.  Pass data in as JSON array in the style:
let formData = [
{ fName: 'TextRow', params: { title: 'Debtor Name', modelName: 'debtorName', required: 'true', minLength: 100, maxLength: 100, width: 200 } },
{
    fName: 'CheckCollapse', params: {
        title: 'Direct Check', openState: false, rows: [
            { fName: 'DateRow', params: { title: 'Date Paid', modelName: 'datePaid' } },
            { fName: 'TextRow', params: { title: 'AmountPaid', modelName: 'amountPaid' } },
        ]
    }
},
{ fName: 'SubmitButton', params: { title: 'Submit' } }
];

<Form rows={formData} />

Available row controls are:
'TextRow'
'CheckBox'
'DateRow'
'Div'
'CheckCollapse'
'NumberRow'
'SubmitButton'
'TextArea',
'LinkButton',
'Header'
*/




export class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openState: {},
            formData: {}
        }
    }



    handleChange = (e) => {
        console.log("Change: ", e.target.name, e.target.value.trim())
        let data = this.state.formData;
        data[e.target.name] = e.target.value.trim()
        // Trimming any whitespace
        this.setState({ formData: data });
    };


    buildTextRow = (column, index) => {

        return (
            <Col className='formCol formContent' key={index}>
                {column.title}
                <input type='text' className='formText form-control'
                    name={column.params.model}
                    onChange={(e) => this.handleChange(e)}
                    value={column.value || undefined}
                />
            </Col>
        )
    }

    buildDateRow = (col, index) => {
        let model = `${col.params.model}`;
        return (
            <Col className='formCol' key={index}>
                {params.title}

                <input type='date' className='formTextDate' model={model} />
            </Col>
        )
    }

    buildNumberRow = (col, index) => {
        let model = `${col.params.model}`;
        return (
            <Col className='formCol' key={index}>
                {col.title}
                <input type='number' className='formTextNumber'
                    model={model}
                    min={col.params.minVal}
                    max={col.params.maxVal}
                />
            </Col>

        )
    }

    buildTextArea = (col, index) => {
        let model = `${col.params.model}`;
        return (

            <Col className='formCol formTextArea' md={{ size: 7 }}>
                {col.title}
                <textarea
                    rows={col.params.rows || 5}
                    cols={col.params.cols || 50}
                    model={model}
                />
            </Col>
        )
    }

    buildSubmitButton = (col, index) => {
        return (
            <Col className='formCol' md={{ size: 2, offset: 1 }} key={index}>
                <button type="submit" className='formSubmit' color={col.params.color || "primary"}>
                    {col.params.text}
                </button >
            </Col>
        );
    }

    buildDropDown = (col, index) => {
        let model = `${col.params.model}`;
        if (col.params.placeHolder && col.params.options[0].value !== col.params.placeHolder) {
            col.params.options.unshift({ value: col.params.placeHolder, id: false, disabled: true })
        }
        return (
            <Col className='formCol formDropdown' >
                {col.title}
                <select
                    model={model}
                    defaultValue={false}
                >
                    {col.params.options.map((option, i) => {
                        return (
                            <option key={i} value={option.id || option.value || null} disabled='{option.disabled?"true":"false"}'>{option.value}</option>
                        )
                    })}
                </select>
            </Col>
        )
    }

    buildCheckBox = (params, index) => {
        let model = params.model ? params.model : "propertyName_" + Math.random();
        model = `${model}`;
        //chenerate a unique id for the label to match the checkbox.  Index doesn't work.

        let chkId = 'check_' + index == null ? Math.floor(Math.random() * 10000) : index;
        let text = params.title.split('\n').map((item, i) => <p key={i} className='formCheckP'>{item}</p>);
        if (!params.clickFn) params.clickFn = () => null;
        let ret = (
            <Col className='formCol formCheckContainer' md={{ offset: 1 }}>
                <label htmlFor={chkId}>{text}</label>
                <input type='checkbox' id={chkId} className='formCheckbox'
                    model={model} onClick={(e) => { this.handleCheck(e, params.clickParameters) }} />
            </Col>
        )
        return ret;
    }

    buildCheckCollapse = (props, index) => {

        let params = props;
        let open = this.state.openState;
        let chkId = 'check_' + index == null ? Math.floor(Math.random() * 10000) : index;
        let text = params.title.split('\n').map((item, i) => <p key={i} className='formCheckP'>{item}</p>);
        if (!params.clickFn) params.clickFn = () => null;

        if (!open[params.id]) open[params.id] = false;

        return (
            <Row className="form-group" key={index}>

                <Col className='formCol formCheckContainer' md={{ offset: 1 }}>
                    <label htmlFor={chkId}>{text}</label>
                    <input type='checkbox' id={chkId} className='formCheckbox'
                        onClick={(e) => { this.handleCheck(e, params.id) }} />
                </Col>


                {/* {this.buildCheckBox({ title: params.title, clickParameters: params.id, clickFn: params.toggle, model: params.id }, index, false)} */}
                <Col className='formCol' >
                    <Collapse in={open[params.id]}>
                        <div className='formCollapse'>
                            {this.buildRows(params.rows)}
                        </div>
                    </Collapse>
                </Col>
            </Row>
        )
    }

    buildDiv = (col, index) => {
        return (
            <div className={col.params.divclassData}>
                {this.buildRows(col.params.divrows)}
            </div>
        )
    }

    buildLinkButton = (col, index) => {
        return (
            <Col className='formCol' key={index}>
                <button className="btn btn-outline-primary formLinkButton" onClick={() => col.params.onClick()} key={index}>
                    {col.Text}
                </button>
            </Col>
        )
    }
    buildHeader = (col, index) => {

        switch (col.params.size) {
            case 1:
                return (<Col className='formCol formHeader' sm={col.length / 12}>
                    <h1>
                        {col.title}
                    </h1>
                </Col>)
                break;
            case 2:
                return (<Col className='formCol formHeader' sm={col.length / 12}>
                    <h2>
                        {col.title}
                    </h2>
                </Col>)
                break;
            case 3:
                return (<Col className='formCol formHeader' sm={col.length / 12}>
                    <h3>
                        {col.title}
                    </h3>
                </Col>)
                break;
            case 4:
                return (<Col className='formCol formHeader' sm={col.length / 12}>
                    <h4>
                        {col.title}
                    </h4>
                </Col>)
                break;
            case 5:
                return (<Col className='formCol formHeader' sm={col.length / 12}>
                    <h5>
                        {col.title}
                    </h5>
                </Col>)
                break;
        }


    }

    buildRows = (rows, data, duplicates) => {
        // console.log(data);
        // console.log(this.props.data)
        if (data) {
            duplicates.forEach(item => {
                let numDupes = data[item].length;
                for (let i = 0; i < numDupes; i++) {
                    let obj = data[item][i];
                    for (const [key, value] of Object.entries(obj)) {
                        //rename the object key
                        obj[key + "_" + (i + 1)] = obj[key]
                        delete obj[key];
                    }
                }

                let firstRow = rows.findIndex(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == item.toLowerCase();
                })
                let replArr = rows.filter(row => {
                    if (!(row.params && row.params.model)) return false;
                    return row.params.model.toLowerCase().split('.')[0] == item.toLowerCase();
                })
                let len = replArr.length;

                for (let i = 1; i <= numDupes; i++) {
                    replArr.forEach(row => {
                        row.dupNum = i;
                        row.params.model += "_" + i
                    })
                }

                let startArray = [...rows.slice(0, firstRow)];
                let endArray = [...rows.splice(firstRow + len)]

                // let replArray = [...rows.slice(firstRow), ...replArr, ...rows.splice(firstRow + len)]
                rows = startArray.concat(replArr, endArray);
            })

            // //delete original columns
            // duplicates.forEach(item => {
            //     rows = rows.filter(row => {
            //         if (!(row.params && row.params.model)) return false;
            //         return row.params.model.toLowerCase().split('.')[0] != item.toLowerCase();
            //     })
            // });


            //loop through all data and attach value to correct row/column
            if (data != null) {
                rows.forEach((row) => {
                    if (row.params.model) {
                        let mdl = row.params.model;

                        let layers = mdl.split('.');
                        let d = data;

                        //THIS IS FAILING HERE - BANK AND SUPPLIER DATA ARE MISSING

                        if (Array.isArray(d)) {
                            for (let i = 0; i < d.length; i++) {
                                layers.forEach(layer => {
                                    d[i] = d[i][layer]
                                })
                                row.value = d[i];
                            }

                            //EVERYTHING ELSE WORKS                            

                        } else {
                            layers.forEach(layer => {
                                d = d[layer]
                            })
                            row.value = d;
                        }
                    }
                })
            }
        }
            //loop through each column in that row
        let Rows = [], Cols = [];
        rows.forEach((col, index) => {
            //if col.params.colNum==0 start a new row...
            if (Cols.length > 0 && col.params.colNum === 0) {
                Rows.push(<Row className='form-group' key={col.params.model}>{Cols}</Row>)
                Cols = [];
            }
                switch (col.params.fName) {
                    case 'TextRow': Cols.push(this.buildTextRow(col, index)); break;
                    case 'CheckBox': Cols.push(this.buildCheckBox(col, index)); break;
                    case 'DateRow': Cols.push(this.buildDateRow(col, index)); break;
                    case 'Div': Cols.push(this.buildDiv(col, index)); break;
                    case 'CheckCollapse': Cols.push(this.buildCheckCollapse(col, index)); break;
                    case 'NumberRow': Cols.push(this.buildNumberRow(col, index)); break;
                    case 'SubmitButton': Cols.push(this.buildSubmitButton(col, index)); break;
                    case 'TextArea': Cols.push(this.buildTextArea(col, index)); break;
                    case 'DropDown': Cols.push(this.buildDropDown(col, index)); break;
                    case 'LinkButton': Cols.push(this.buildLinkButton(col, index)); break;
                    case 'Header': Cols.push(this.buildHeader(col, index)); break;
                    default: Cols.push(<div key={index}>{col.fName}<br />{JSON.stringify(col)}</div>); break;
                }
            })
        Rows.push(<Row className='form-group' key={'lastRow'}>{Cols}</Row>) //last row

        return Rows;
    }



    handleSubmit(e) {
        e.preventDefault()
        let data = this.state.formData;
        this.props.submit(data);
    }

    handleCheck(e, id) {
        let open=this.state.openState;
        open[id] = e.target.checked;
        this.setState({ openState: open });
    }

    render() {
        return (
            <div className='formContainer'>
                <form
                    className='formRoot'
                    model='MetFormData'
                    onSubmit={(e) => this.handleSubmit(e)}
                >
                    {this.buildRows(this.props.rows, this.props.data, this.props.duplicates)}
                </form>
            </div>
        )
    }
}

