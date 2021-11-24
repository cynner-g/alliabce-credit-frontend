import React, { Component, createRef } from 'react';
import ContentEditable from 'react-contenteditable'
import { Table, Button, Checkbox, Popup, Pagination } from 'semantic-ui-react'
import { formatDate } from '../Utility/UtilFunctions';

import '../styles/DynamicTable.module.css';
/*
Usage:
  <DynamicTable
    data={JSON Array of Rows of data}
    InsertFn={function for inserting new data}
    UpdateFn={function to call for updating on blur}
    columns={Array list of all columns and details - see below}
    border={1} - required border thickness
    selectableRows - boolean
    striped - boolean
    title={"Title to display at top of table page"}
    CustomRowButtons={Array of buttons to place.  Contains  { onClick: this.fnName, text: "Button To Call Function text" }}
    paging=10 - pages every 10 (or whatever #) rows
/>

columns = [ {
    colName: "",
    displayName: "",
    editable: false,
    required: false,
    visible: false,
    type: "id/number/date/increment/money/checkbox/link/button",
    onClick: function(event, colName, identifier),
    linkValue: "",
    addable: false,
    validation: //regex string for validation
    defaultVal: null
}]
*/

class DynamicTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortKey: ''
            , sortDirection: "ascending",
            currentRow: 0,
        }
        try {
            this.getRowData = this.getRowData.bind(this);
            this.renderAddableFooter = this.renderAddableFooter.bind(this);
            this.renderTableDataCols = this.renderTableDataCols.bind(this);
            this.renderTableDataRows = this.renderTableDataRows.bind(this);
            this.renderTableHeader = this.renderTableHeader.bind(this);
            this.sortJson = this.sortJson.bind(this);
            this.popupRef = createRef();
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    checkForEnter = (event, column) => {
        if (!column.addable) return;
        switch (event.keyCode) {
            case 13:
                event.stopPropagation();
                event.preventDefault();
                // cannot use getElement in case multiple tables open using modals.
                //uding closest()
                // document.getElementById('insert').click();
                //this will select the row parent then have to traverse down to get the button
                //only works for add row
                let btn = event.target.closest('tr').firstElementChild.firstElementChild;
                btn.click();

                break;
            default: return;
        }
    }

    renderAddableFooter = () => {
        let insertRow = null;
        let pagingRow = null;

        if (this.props.InsertFn) {
            insertTow = (
                <Table.Row>
                    <Table.HeaderCell
                        style={{ border: this.props.border }}
                    >
                        <Button id='insert'
                            onClick={(e) => { this.getRowData(e, null, "INSERT") }}
                        >
                            Add
                        </Button>
                    </Table.HeaderCell>
                    {
                        this.props.columns.map((column, index) => {
                            let cellText = "";

                            let keyName = column.colName.replace(' ', '_');

                            let border = this.props.border;

                            if (!column.visible) return null;
                            let ret = null;
                            // console.log(column.type)
                            let classType = 'dataTable_cell ';
                            classType += column.colName.replace(' ', '_')
                            switch (column.type) {
                                case 'date':
                                    classType += ' dateCol';
                                    ret = (
                                        <DateCol
                                            tabIndex={index}
                                            key={keyName} column={column}
                                            text='' border={border}
                                            className={classType}
                                        />
                                    );
                                    break;
                                case 'checkbox':
                                    if (column.addable) {
                                        if (!ret) ret = (
                                            <Table.HeaderCell
                                                style={{ border: this.props.border }}
                                                key={keyName}
                                                name={keyName}
                                                tabstop='false'
                                                className={classType}
                                            >
                                                <Checkbox defaultChecked={false} />
                                            </Table.HeaderCell>
                                        )
                                    }
                                    else {
                                        <Table.HeaderCell></Table.HeaderCell>
                                    }
                                    break;
                                case 'increment':
                                    // Check data for last row
                                    // Get cell value for auto increment
                                    // Apply value to same cell in addable footer.
                                    // Set initial value to 0 if no rows present
                                    cellText = '0';
                                    if (this.props.data.length > 0) {
                                        let lastRow = this.props.data[this.props.data.length - 1];
                                        cellText = lastRow[column.colName];
                                    }
                                    //if this is an integer that can be incremented, make sure 
                                    //need to convert to string to make sure each item matches
                                    //using '===' as required by React Warnings in 
                                    //create-react-app
                                    if (!isNaN(cellText)) {
                                        //make sure it is a number and increment
                                        cellText = parseInt(cellText);
                                        cellText++;
                                    }
                                    break;
                                default:
                                    break;
                            }
                            if (!ret) ret = (
                                <Table.HeaderCell
                                    style={{ border: this.props.border }}
                                    key={keyName}
                                    name={keyName}
                                    tabstop='false'
                                >
                                    <ContentEditable
                                        tabIndex={index}
                                        className={classType}
                                        html={cellText + ''}
                                        disabled={!column.addable}
                                        onKeyUp={(e) => this.checkForEnter(e, column)}
                                    />
                                </Table.HeaderCell>
                            )
                            return ret;
                        })
                    }
                    <Table.Cell
                        style={{ width: '0px', border: 'none', padding: '0px', margin: '0px', color: 'red' }}
                        id='validation-insert'
                    >
                    </Table.Cell>
                </Table.Row>
            )
        }
        if (this.props.paging) {
            let numRows = this.props.data.length;
            let numPages = Math.ceil(numRows / +this.props.paging);
            pagingRow = (
                <Table.Row>
                    <Table.HeaderCell colSpan={this.props.columns.filter(col => col.visible).length}>
                        <Pagination
                            boundaryRange={2}
                            defaultActivePage={1}
                            siblingRange={3}
                            totalPages={numPages}
                            onPageChange={this.changePage}
                        />
                    </Table.HeaderCell>
                </Table.Row>
            )
        }
        // }
        // catch(ex) {
        //     console.log(ex);
        // }
    }

    changePage = (e, { activePage }) => {
        let currentRow = +this.props.paging * (activePage - 1);
        this.setState({ currentRow: currentRow })
    }

    renderFilterRow = () => {
        let ret = null;
        if (this.props.filterFn) {
            ret = this.props.columns.map((column, idx) => {
                let ret = null;
                if (column.filterable && column.visible) {
                    switch (column.type) {
                        case 'date':
                            ret = (
                                <Table.Cell key={idx}>
                                    <input type='date' onChange={(e) => this.props.filterFn(e.target, column.colName)} />
                                </Table.Cell>
                            )
                            break;
                        default:
                            ret = (
                                <Table.Cell key={idx}>
                                    <input type='text' onChange={(e) => this.props.filterFn(e.target, column.colName)} />
                                </Table.Cell>
                            )
                            break;
                    }
                }
                else {
                    if (column.visible) {
                        ret = (
                            <Table.Cell key={idx}>

                            </Table.Cell>
                        )
                    }
                }
                return ret;
            })
            if (this.props.CustomRowButtons) {
                return <Table.Row key='-1'><Table.Cell></Table.Cell>{ret}</Table.Row>;
            }
            else return <Table.Row>{ret}</Table.Row>;
        }

    }

    renderTableDataCols = (row) => {
        const rowId = row.id;
        try {
            return (
                this.props.columns.map((column, idx) => {
                    //loop through each column
                    //if !visible return nothing
                    //if not editable add contentEditable=false
                    //adjust style according to type
                    //print out column

                    let changeContent = (e) => { //handles checkbox changes
                        let ret = { id: rowId };
                        // Which column gets which value
                        ret[column.colName] = e.target.checked ? 1 : 0;
                        // this.getRowData(e, 'UPDATE')
                        this.props.UpdateFn(ret)
                    }

                    if (column.visible === false) return null; //don't need to calculate an invisible column

                    let style = {};
                    if (column.width) {
                        style.width = column.width;
                        style.maxWidth = column.width;
                        style.minWidth = column.width;
                    }
                    if (this.props.border) style.border = this.props.border;


                    let text = row[column.colName] ? row[column.colName].toString() : "";
                    if (text.trim() === 'null') text = "";

                    let subText = row[column.subText] ? row[column.subText].toString() : "";
                    if (subText.trim() === 'null') subText = "";

                    let keyName = 'row_' + rowId + '_col_' + column.colName.replace(' ', '_')
                    let classType = `dataTable_cell ${keyName}`;

                    let ret = null;
                    switch (column.type) {
                        case 'date':
                            classType += ' dateCol';
                            ret = (
                                <DateCol key={keyName} column={column} text={text + ''}
                                    className={`dateCol ${classType}`} style={style}
                                />
                            )
                            break;
                        case 'checkbox':
                            // text=text==='true'?true:false
                            let checked = text === 'true';
                            if (!ret) ret = (
                                <Table.Cell
                                    className={`checkboxCell`}
                                    key={keyName}
                                    name={column.colName.replace(' ', '_')}
                                    tabstop='false'
                                >
                                    <input type='checkbox'
                                        defaultChecked={checked}
                                        className={`checkbox  ${classType}`}
                                        disabled={!column.editable}
                                        onChange={(e) => changeContent(e, column, rowId)}
                                    />
                                </Table.Cell>
                            )
                            break;
                        case 'number':
                            classType += ' dataTable_right';
                            break;
                        case 'money':
                            text = parseFloat(text).toFixed(2);
                            if (text === 'NaN') text = ''
                            break;
                        default:
                            break;
                    }


                    if (!ret) {
                        if (column.overflowLength) {
                            let shortText = text.substring(0, column.overflowLength);
                            if (text.length > column.overflowLength) {
                                shortText += " ...";
                            }
                            ret = (
                                <Table.Cell
                                    key={keyName}
                                    name={column.colName.replace(' ', '_')}
                                    style={style}
                                >
                                    <Popup content={<ContentEditable
                                        className={classType}
                                        id={keyName}
                                        onBlur={(e) => this.getRowData(e, row.id, 'UPDATE', column)}

                                        html={text}
                                        disabled={!column.editable}
                                    />
                                    }
                                        on={['click']}
                                        position='left center'

                                        style={{
                                            zIndex: 99999,
                                            width: "500px",
                                            borderRadius: 5,
                                            padding: "10px",
                                            backgroundColor: "lightgrey",
                                            color: "black",
                                            border: 'solid 1px black'
                                        }}
                                        trigger={
                                            <div
                                                className='dataTable_cell'
                                            >{shortText}</div>
                                        }
                                    />
                                </Table.Cell>
                            )
                        }
                        else if (column.type == "link") {
                            ret = (
                                <Table.Cell
                                    key={keyName}
                                    name={column.colName.replace(' ', '_')}
                                    style={style}
                                    selectable
                                >
                                    {/* <button type="button" className="btn btn-link" onClick={(e) => column.onClick(e, column.colName, row.id)}>
                                        {column.linkValue}
                                    </button> */}
                                    <a href="#" onClick={(e) => column.onClick(e, column.colName, row.id)}>
                                        {text}
                                    </a>
                                </Table.Cell>
                            )
                        }
                        else {
                            ret = (
                                <Table.Cell
                                    key={keyName}
                                    name={column.colName.replace(' ', '_')}
                                    style={style}
                                >
                                    <ContentEditable
                                        className={classType}
                                        html={text + ''}
                                        id={keyName}
                                        disabled={!column.editable}
                                        onBlur={(e) => this.getRowData(e, row.id, 'UPDATE', column)}
                                    />
                                    <div style={{ fontSize: '9px', marginTop: '-5px' }}>{subText}</div>
                                </Table.Cell>
                            )
                        }
                    }
                    return ret;
                })//columns.map
            )
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    renderButtonsCol(row) {
        if (!this.props.CustomRowButtons || this.props.CustomRowButtons.length <= 0) return; //make sure we don't print empty cells
        // try {

        let ret = this.props.CustomRowButtons.map((item, index) => {
            return (
                <Button
                    onClick={(e) => { e.preventDefault(); item.onClick(row, document.getElementById('ROW__' + row.id)) }}
                    key={index} style={{ margin: '1px' }}
                >
                    {item.text}
                </Button >
            )
        })
        // }
        //         catch (ex) {
        //     console.log(JSON.stringify(ex));
        // }

        return (
            <Table.Cell style={{ border: this.props.border }}>
                {ret}
            </Table.Cell >
        )
    }

    renderTableDataRows = (params) => {
        try {
            let id = 0; //if a row needs an ID column because of aggregates etc
            let ret = null;
            if (params.data && params.data.length <= 0) {
                //print no data message

                //get # visible cells, all cells if none listed as visible
                let numcells = params.columns.find((col) => col.visible);
                if (numcells) numcells = numcells.length;
                else numcells = params.columns.length;

                if (params.CustomRowButtons) numcells++;
                ret = (
                    <Table.Row>
                        <Table.Cell colSpan={numcells} className='dataTable_header'>
                            No data currently available
                        </Table.Cell>
                    </Table.Row>
                )

            } else if (params.data) {
                ret = [];

                let start = +this.state.currentRow;
                let end = this.props.paging ? start + this.props.paging : params.data.length;

                if (end >= params.data.length) { end = params.data.length };
                for (let index = start; index < end; index++) {
                    let row = params.data[index];
                    //ret= (params.data.map((row, index) => {
                    //make sure that each table as an id column regardless of passed in data.
                    //required for calculations, looking for 'row.id' to process in the getRowData function
                    if (!row['id']) {
                        //check columns for an ID column
                        let idCol, idCols = params.columns.filter(col => col.type == "id");
                        if (idCols.length > 0) idCol = idCols[0];
                        if (idCol) {
                            row['id'] = row[idCol.colName]
                        }
                        else {
                            row['id'] = id++;
                        }
                    }

                    ret.push(
                        <Table.Row
                            key={index}
                            id={'ROW__' + row.id}
                        >
                            {this.renderButtonsCol(row)}
                            {this.renderTableDataCols(row, index)}
                            <Table.Cell
                                style={{
                                    width: '0px',
                                    border: 'none',
                                    padding: '0px',
                                    margin: '0px',
                                    color: 'red'
                                }}
                                id={'validate-' + row.id}
                                className="validation"
                            >
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            }
            return ret;
        }
        catch (ex) {
            console.log(ex);
        }
    }

    renderTableHeader = () => {
        try {

            let headerRow = this.props.columns.map((column, index) => {
                if (column.visible === undefined || column.visible) {
                    let style = { border: 'none' };

                    if (column.width) {
                        style.width = column.width;
                        style.maxWidth = column.width;
                        style.minWidth = column.width;
                    }

                    if (this.props.border) style.border = this.props.border;
                    let cl = "dataTable_Header";
                    if (this.state.sortKey === column.colName) cl += " sortHeader";
                    return (
                        <Table.HeaderCell
                            className={cl}
                            key={index}
                            sorted={this.state.sortKey === column.colName ? this.state.sortDirection : null}
                            onClick={() => this.sortJson(column.colName)}
                            style={style}
                        >
                            {column.displayName.toUpperCase()}
                        </Table.HeaderCell>
                    )
                }
                return null;
            });
            //if there are button function add a blank col for the header
            if (this.props.CustomRowButtons) {
                return (
                    <Table.Row>
                        <Table.HeaderCell
                            className='dataTable_Header'
                        >
                        </Table.HeaderCell>
                        {headerRow}
                    </Table.Row>
                );
            }
            else return (<Table.Row>{headerRow}</Table.Row >);
        }
        catch (ex) {
            console.log(ex);
        }
    }

    sortJson = (column) => {
        let newDir;
        try {
            let data = this.props.data;
            let sortDir = this.state.sortDirection;
            newDir = sortDir === 'ascending' ? 'descending' : "ascending"

            // //if data is a number or a date
            let isDate = (new Date(data[0][column]) !== "Invalid Date" &&
                !isNaN(new Date(data[0][column]))) ? true : false;

            if (newDir === "ascending") {
                data.sort((a, b) => {
                    if (isDate || !isNaN(a[column])) {
                        return new Date(a[column]) - new Date(b[column]);
                    }
                    return (a[column] > b[column] ? 1 : -1);
                });
            }
            else {
                data.sort((a, b) => {
                    if (isDate || !isNaN(a[column])) {
                        return new Date(b[column]) - new Date(a[column]);
                    }
                    return (a[column] < b[column] ? 1 : -1);
                });
            }

        }
        catch (ex) {
            console.log(ex.message);
        }
        this.setState({ sortDirection: newDir, sortKey: column })
    }

    getRowData = (e, rowId, fnType, column) => {
        const getValidation = (type) => {
            let ret = null;
            switch (type) {
                case 'number':
                    ret = {
                        exp: new RegExp(/\d+/),
                        message: 'Please enter a valid number'
                    }
                    break;
                case 'date':
                    ret = {
                        exp: new RegExp(/.*/),
                        message: 'You must enter a valid date'
                    };
                    break;
                case 'money':
                    ret = {
                        exp: new RegExp(/^(\d{1, 3}(,\d{3})*|(\d+))(\.\d{2})?$/),
                        message: 'You must enter a valid dollar amount.'
                    };
                    break;
                case 'increment':
                    ret = {
                        exp: new RegExp(/\d+/),
                        message: 'Please enter a valid number'

                    };
                    break;
                default:
                    ret = {
                        exp: new RegExp(/[\s\S\d\D]*/),
                        message: 'Please use a valid text entry'
                    };
                    break;
            }
            return ret;
        }

        if (!e) return; //somehow getting a function call without an event
        if (!fnType) return; //make sure called correctly
        // try {
        //     e.preventDefault();
        // }
        // catch (ex) {
        //     //e.preventDefault() does not exist when e is an onChange() event from a popup
        // }

        let submitFn = null;
        let insert = false;
        let ret = {};
        let valCol = 'validate-';

        switch (fnType) {
            case "INSERT":
                valCol += 'insert'
                insert = true;
                submitFn = this.props.InsertFn;
                break;
            case "UPDATE":
                valCol += rowId;
                ret.id = rowId;
                submitFn = this.props.UpdateFn;
                break;
            default:
                return;
        }

        if (submitFn === undefined) return;
        if (submitFn === null) return;

        //set update flag
        let update = true;
        let targetCell;
        // this.props.columns.map((column) => {
        try {
            if (insert) {
                let row = e.target.parentElement.parentElement;// button, td, tr

                for (let col of this.props.columns) {
                    // let cellClass = 'row_' + row.id + '_col_' + col.colName.replace(' ', '_')
                    let cell = row.getElementsByClassName(col.colName.replace(' ', '_'))[0];
                    if (!cell) continue;
                    //safety - checkbox should have been handled in render columns function
                    if (col.type !== 'checkbox') {
                        //get data for all cells for simplicity in updating
                        ret[col.colName] = cell.innerText;
                    }
                    // ret[col.colName] = cell.innerText;
                    cell.innerText = ''
                }
                submitFn(ret);
                return;
                // let cell = targetCell.getElementsByClassName('dataTable_cell');

                // if (cell && cell.length > 0) cell[0].innerText = ''
            }
            else {

                let cellName = column.colName.replace(' ', '_');
                let itemId = 'row_' + rowId + '_col_' + cellName;

                //reference each cell by the column title and add to return json
                targetCell = document.getElementById(itemId);
                let validation = document.getElementById(valCol);
                // let targetCell = target.cells[cellName];

                if (targetCell) {

                    //validation code 
                    if (column.validate && column.type !== 'checkbox') {
                        let pattern = getValidation(column.type);

                        //print error message if pattern match fails
                        if (pattern && !pattern.exp.test(targetCell.innerText)) {
                            let msg = `<p style='margin-left:6px;color:red'>${pattern.message}</p>`;
                            validation.innerHTML += msg;
                            update = false;
                        }
                        else {
                            validation.innerHTML = "";
                        }
                    }

                    //safety - checkbox should have been handled in render columns function
                    if (column.type !== 'checkbox') {
                        //get data for all cells for simplicity in updating
                        ret[column.colName] = targetCell.innerText;
                    }
                }

                //clear the cell contents if this is an insert
            }
        }
        catch (ex) {
            console.log(ex.message);
        }

        // if (column.overflowLength) {
        //     let overflowCell = targetCell.querySelector(`.${column.colName.replace(' ', '_')}`) || targetCell;
        //     ret[column.colName] = overflowCell.innerText;
        // }
        if (column.defaultVal !== null) {//check specifically for null in case false is set as a default value
            ret[column.colName] = column.defaultVal;
        }

        //     return null;
        // });

        if (update) submitFn(ret);
    }

    componentDidMount() {
        if (this.state.sortKey !== '') { //if it is a re-render
            this.sortJson(this.state.sortKey)
        }
    }

    render() {
        // let data = { ...this.props.data };
        // console.log("DATA: ", data);

        const style = { border: this.props.border }
        if (this.props.sticky) {
            style.position = 'fixed';
            style.top = '0px';
            style.display = 'none';
        }
        try {
            let striped = this.props.striped ? true : false;
            let selectable = this.props.selectableRows ? true : false;
            // console.log('data: ', this.props.data)
            // console.log('columns: ', this.props.columns)
            return (
                <div className='DataBox' ref='popupRef'>
                    <div className="dataTable_Title">{this.props.title || ''}</div>
                    <Table celled striped={striped}
                        selectable={selectable} sortable
                        className="dataTable_Table"
                        style={style}
                    >
                        <Table.Header>
                            {this.renderTableHeader()}
                        </Table.Header>
                        <Table.Body>
                            {this.renderFilterRow()}
                            {this.renderTableDataRows(this.props)}
                        </Table.Body>
                        <Table.Footer>
                            {this.renderAddableFooter()}
                        </Table.Footer>
                    </Table>

                </div >
            )
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
}

class DateCol extends Component {
    constructor(props) {
        super(props);

        // this.formatDate = this.formatDate.bind(this);
        this.dateRef = React.createRef();
        this.popupRef = React.createRef();
    }

    formatDate = (dt) => {
        let newDate = new Date(dt);
        return `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()}`;
    }

    handleColFocus = (e) => {
        try {
            let targetCell = this.dateRef.current.el.current;
            let dateInput = this.popupRef.current;
            e.stopPropagation();

            targetCell.style = { position: 'relative' };

            dateInput.onblur = (e) => {
                e.stopPropagation();
                if (!targetCell) return;
                try {
                    // document.getElementById("dateHolder").appendChild(dateInput);
                    targetCell.parentElement.focus();
                }
                catch (ex) { console.log(ex.message) }

                let dt = new Date(dateInput.value);
                dt.setDate(dt.getDate() + 1);

                dateInput.style = { display: 'none' };
                targetCell.innerText = this.formatDate(dt);

            }
            //prevents parent from getting click even when opening calendar
            dateInput.onclick = (e) => { e.stopPropagation(); }
            dateInput.style = { display: 'block' }

            //prevent problems with cell contents rerendering
            if (targetCell.innerText === "") targetCell.innerText = new Date().toLocaleDateString();
            let txt = targetCell.innerText.split('/');
            let dt = new Date(txt);
            dateInput.defaultValue = dt.toISOString().split('T')[0];
            targetCell.appendChild(dateInput);
            dateInput.focus();
        }
        catch (ex) {
            console.log(ex);
        }
    }

    renderDate = () => {
        let dt = this.formatDate(this.props.text);
        if (this.props.column.format && Date.parse(dt)) {
            dt = this.formatDate(dt, this.props.column.format)
        }


        return (
            <>
                <ContentEditable
                    className={this.props.className}
                    html={dt}
                    disabled={!this.props.column.editable}
                    onFocus={(e) => this.handleColFocus(e)}
                    ref={this.dateRef}
                />
                <input
                    type="date"
                    id="DATE_CALENDAR"
                    className="dataTable_DateInput"
                    style={{
                        display: 'none', position: 'relative', top: '-20px', height: '50px'
                    }}
                    onFocus={(e) => e.stopPropagation()}
                    ref={this.popupRef}
                    onKeyPress={(e) => { if (e.keyCode === 13) e.target.parentElement.focus(); }}
                    tabIndex={this.props.tabIndex}
                />
            </>
        )
    }

    render() {
        let dt = this.props.text;
        let timeString = "";
        if (this.props.column.timeSize || this.props.column.timeLocation) {

            let time = new Date(Date.parse(dt));


            timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


            let timeLocation = this.props.column.timeLocation || "right";

            // console.log("Props: ", this.props)
            try {

                if (this.props.column.format && Date.parse(dt)) {
                    dt = formatDate(dt, this.props.column.format)
                }


                switch (timeLocation) {
                    case 'above':
                        return (
                            <Table.Cell
                                name={this.props.column.colName.replace(' ', '_')}
                                style={{ ...this.props.style, whiteSpace: 'nowrap' }}
                                tabstop='false'
                            >   {this.renderDate()}<br />
                                <span style={{ fontSize: this.props.column.timeSize + "px" }}>{timeString}</span>
                            </Table.Cell>
                        );
                        break;
                    case 'below':
                        return (
                            <Table.Cell
                                name={this.props.column.colName.replace(' ', '_')}
                                style={{ ...this.props.style, whiteSpace: 'nowrap' }}
                                tabstop='false'
                            >
                                {this.renderDate()}
                                <div style={{ fontSize: this.props.column.timeSize + "px", marginTop: '-5px' }}>{timeString}</div>
                            </Table.Cell>
                        );
                        break;
                    case 'left':
                        <Table.Cell
                            name={this.props.column.colName.replace(' ', '_')}
                            style={{ ...this.props.style, whiteSpace: 'nowrap' }}
                            tabstop='false'
                        >   <span style={{ fontSize: this.props.column.timeSize + "px" }}>{timeString}</span>
                            {this.renderDate()}

                        </Table.Cell>
                        break;
                    default: <Table.Cell
                        name={this.props.column.colName.replace(' ', '_')}
                        style={{ ...this.props.style, whiteSpace: 'nowrap' }}
                        tabstop='false'
                    >
                        {this.renderDate()}<span style={{ fontSize: this.props.column.timeSize + "px" }}>{timeString}</span>
                    </Table.Cell>
                        break;
                }
            }
            catch (ex) {
                console.log(ex.message);
                return (<Table.Cell></Table.Cell>)
            }


        }
        else {

            return (
                <Table.Cell
                    name={this.props.column.colName.replace(' ', '_')}
                    style={{ ...this.props.style, whiteSpace: 'nowrap' }}
                    tabstop='false'
                >
                    {this.renderDate()}
                </Table.Cell>
            )
        }

    }
}

export default DynamicTable;


/*
Auto Increment column
Regular table cell
Check data for last row
Get cell value for auto increment
Apply value to same cell in addable footer.
*/