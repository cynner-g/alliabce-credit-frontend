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
            formData: {},
            rows: this.props.rows,
            data: this.props.data,
            duplicates: this.props.duplicates
        }
    }



    handleChange = (e) => {
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
            <Col className='formCol' md={{ size: 1, offset: 1 }} key={index}>
                <br />
                <button type="submit" className='formSubmit' color={col.params.color || "primary"}>
                    {col.params.text}
                </button >
                <br /><br />
            </Col>
        );
    }

    buildCancelButton = (col, index) => {
        if (this.props.cancel) {
            return (
                <Col className='formCol' md={{ size: 1, offset: 1 }} key={index}>
                    <br />
                    <button className='formSubmit' onClick={() => this.props.cancel()} color={col.params.color || "primary"}>
                        {col.params.text}
                    </button >
                </Col>
            );
        }
    }

    buildDropDown = (col, index) => {
        let model = `${col.params.model}`;
        if (col.params?.options[0]?.value !== col.params?.placeHolder) {
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

    buildRows = (displayRows, data, duplicates) => {
        try {

            //loop through each column in that row
            let Rows = [], Cols = [];
            displayRows.forEach((displayCol, index) => {
                //if col.params.colNum==0 start a new row...
                if (Cols.length > 0 && displayCol.params.colNum === 0) {
                    let key = displayCol.params.model + '_' + index;
                    Rows.push(<Row className='form-group' key={key}>{Cols}</Row>)
                    Cols = [];
                }
                switch (displayCol.params.fName) {
                    case 'TextRow': Cols.push(this.buildTextRow(displayCol, index)); break;
                    case 'CheckBox': Cols.push(this.buildCheckBox(displayCol, index)); break;
                    case 'DateRow': Cols.push(this.buildDateRow(displayCol, index)); break;
                    case 'Div': Cols.push(this.buildDiv(displayCol, index)); break;
                    case 'CheckCollapse': Cols.push(this.buildCheckCollapse(displayCol, index)); break;
                    case 'NumberRow': Cols.push(this.buildNumberRow(displayCol, index)); break;
                    case 'SubmitButton': Cols.push(this.buildSubmitButton(displayCol, index)); break;
                    case 'CancelButton': Cols.push(this.buildCancelButton(displayCol, index)); break;
                    case 'TextArea': Cols.push(this.buildTextArea(displayCol, index)); break;
                    case 'DropDown': Cols.push(this.buildDropDown(displayCol, index)); break;
                    case 'LinkButton': Cols.push(this.buildLinkButton(displayCol, index)); break;
                    case 'Header': Cols.push(this.buildHeader(displayCol, index)); break;
                    default: Cols.push(<div key={index}>{displayCol.fName}<br />{JSON.stringify(col)}</div>); break;
                }
            })
            Rows.push(<Row className='form-group' key={'lastRow'}>{Cols}</Row>) //last row

            return Rows;
        }
        catch (ex) {
            return (<br />)
        }
    }

    handleSubmit(e) {
        e.preventDefault()
        let data = this.state.formData;
        this.props.submit(data);
    }

    handleCheck(e, id) {
        let open = this.state.openState;
        open[id] = e.target.checked;
        this.setState({ openState: open });
    }

    render() {
        let rows = this.buildRows(this.props.rows, this.props.data, this.props.duplicates);
        return (
            <div className='formContainer'>
                <form
                    className='formRoot'
                    model='MetFormData'
                    onSubmit={(e) => this.handleSubmit(e)}
                >
                    {rows}
                </form>
            </div>
        )
    }
}

