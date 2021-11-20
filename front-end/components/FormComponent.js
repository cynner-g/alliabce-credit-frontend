import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Control, LocalForm } from 'react-redux-form';
import { Col, Row, Collapse } from 'react-bootstrap';
import '../../shared/styles/form.css';

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
'TextArea'
*/




class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openState:{}
        }
    }

    buildTextRow = (params, index) => {
        // let requiredText = (params, index) => {return 'A ' + title + ' is required' };
        // let minText = (params, index) => {return title + ' must be greater than ' + minLength + ' characters' };
        // let maxText = (params, index) => {return title + ' must be greater than ' + maxLength + ' characters' };

        // let model =data +  '.' + params.model;
        let model = `${params.model}`
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol formLabel' md={{ size: 2, offset: 1 }}>
                    {params.title}
                </Col>
                <Col className='formCol formContent' md={{ size: 5 }}>
                    <Control.Text className='formText form-control'
                        model={model}
                        placeholder={params.title}
                    />
                </Col>

                <Col className='formCol' md={{ size: 3 }}>
                    {/*
               <Errors
                    className="text-danger"
                    model={modelName}
                    show="touched"
                    messages={{
                        required:  requiredText() 
                        , minLength:  minText() 
                        , maxLength:  maxText() 
                    }}
                /> 
                 */}
                </Col>

            </Row>
        );
    }



    buildDateRow = (params, index) => {
        let model = `${params.model}`;
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol' md={{ size: 2, offset: 1 }}>
                    {params.title}
                </Col>
                <Col className='formCol' md={{ size: 5 }}>
                    <Control type='date' className='formText' model={model} />
                </Col>
                <Col className='formCol' md={{ size: 3 }}>
                    {/* <Errors
                    className="text-danger"
                    model={model}
                    show="touched"
                    messages={{
                        required: { required }

                    }}
                /> */}
                </Col>
            </Row >
        )
    }

    buildNumberRow = (params, index) => {
        let model = `${params.model}`;
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol' md={{ size: 2, offset: 1 }}>
                    {params.title}

                </Col>
                <Col className='formCol' md={{ size: 5 }}>
                    <Control type='number' className='formText'
                        model={model}
                        min={params.minVal}
                        max={params.maxVal}
                    />
                </Col>
                <Col className='formCol' md={{ size: 3 }}></Col>
            </Row >
        )
    }

    buildTextArea = (params, index) => {
        let model = `${params.model}`;
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol' md={{ size: 2, offset: 1 }}>
                    {params.title}

                </Col>
                <Col className='formCol' md={{ size: 7 }}>
                    <Control.Textarea
                        rows={params.rows || 5}
                        cols={params.cols || 50}
                        model={model}
                    />
                </Col>
            </Row >
        )
    }

    buildSubmitButton = (params, index) => {
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol' md={{ size: 2, offset: 1 }}>
                    <button type="submit" className='formSubmit' color={params.color || "primary"}>
                        {params.text}
                    </button >
                </Col>
            </Row>
        );
    }

    buildDropDown = (params, index) => {
        let model = `${params.model}`;
        if(params.placeHolder && params.options[0].value!== params.placeHolder){
            params.options.unshift({value:params.placeHolder, id:false, disabled:true})
        }
        return (
            <Row className="form-group" key={index}>
                <Col className='formCol' md={{ size: 2, offset: 1 }}>
                    {params.title}
                </Col>
                <Col className='formCol formDropdown' md={{ size: 8 }}>
                    <Control.Select
                        model={model}
                        defaultValue={false}
                    >
                        {/* <option disabled>{params.placeHolder}</option> */}
                        {params.options.map((option, i) => {
                            return (
                                <option key={i} value={option.id || option.value || null} disabled='{option.disabled?"true":"false"}'>{option.value}</option>
                            )
                        })}
                    </Control.Select>
                </Col>
            </Row >
        )
    }

    buildCheckBox = (params, index, addRow = true) => {
        let model = params.model ? params.model : "propertyName_" + Math.random();
        model = `${model}`;
        //chenerate a unique id for the label to match the checkbox.  Index doesn't work.

        let chkId = 'check_' + index == null ? Math.floor(Math.random() * 10000) : index;
        let text = params.title.split('\n').map((item, i) => <p key={i} className='formCheckP'>{item}</p>);
        if (!params.clickFn) params.clickFn = () => null;
        let ret = (
            <Col className='formCol formCheckContainer' md={{ offset: 1 }}>
                <label htmlFor={chkId}>{text}</label>
                <Control.Checkbox id={chkId} className='formCheckbox'
                    model={model} onClick={(e) => { this.handleCheck(e, params.clickParameters) }} />
            </Col>
        )

        if (addRow)
            return (
                <Row className="form-group" key={index}>
                    {ret}
                </Row>
            );
        else
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
                <Col className='formCol' md={{ size: 8 }}>
                    <Collapse in={open[params.id]}>
                        <div className='formCollapse'>
                            {this.buildRows(params.rows)}
                        </div>
                    </Collapse>
                </Col>
            </Row>
        )
    }

    buildDiv = (params, index) => {
        return (
            <div className={params.divclassData}>
                {this.buildRows(params.divrows)}
            </div>
        )
    }

    buildRows = (rows) => {
        return (
            rows.map((formRow, index) => {
                let func = null;
                switch (formRow.fName) {
                    case 'TextRow': func = this.buildTextRow(formRow.params, index); break;
                    case 'CheckBox': func = this.buildCheckBox(formRow.params, index); break;
                    case 'DateRow': func = this.buildDateRow(formRow.params, index); break;
                    case 'Div': func = this.buildDiv(formRow.params, index); break;
                    case 'CheckCollapse': func = this.buildCheckCollapse(formRow.params, index); break;
                    case 'NumberRow': func = this.buildNumberRow(formRow.params, index); break;
                    case 'SubmitButton': func = this.buildSubmitButton(formRow.params, index); break;
                    case 'TextArea': func = this.buildTextArea(formRow.params, index); break;
                    case 'DropDown': func = this.buildDropDown(formRow.params, index); break;
                    default: func = <div key={index}>{formRow.fName}<br />{JSON.stringify(formRow)}</div>
                }
                return func;
            })
        )
    }

    handleSubmit(values) {
        let data = values;
        this.props.submit(data);
    }

    handleCheck(e, id){
        console.log(id)
        let open=this.state.openState;
        open[id]=e.target.checked;
        console.log(open);
        this.setState({ openState: open });
    }

    render() {
        return (
            <div className='formContainer'>
                <LocalForm
                    className='formRoot'
                    model='MetFormData'
                    onSubmit={(values) => this.handleSubmit(values)}
                >
                    {this.buildRows(this.props.rows)}
                </LocalForm>
            </div>
        )
    }
}

export default FormComponent;