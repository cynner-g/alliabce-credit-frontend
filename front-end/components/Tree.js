import React, { Component } from 'react';
import '../../shared/styles/treeview.css';


class Tree extends Component {

    /* FIX THIS! */
    toggle = (obj) => {
        obj.parentElement.querySelector(".tree_nested").classList.toggle("tree_active");
        obj.classList.toggle("caret-down");
    }

    /* FIX ABOVE */
    addNode = (item, index, depth) => {
        // print heading, key is ID
        // if has children
        //     recurse function passing children

        var children = null;
        if (item.children && item.children.length > 0) {
            return (
                <li key={index} >
                    <span className='tree_caret' onClick={(e) => this.toggle(e.target)}>{item.value || item[this.props.displayKey]}</span>
                    <ul className='tree_nested'>
                        {item.children.map((itm, idx) => this.addNode(itm, idx, depth + 1))}
                    </ul>
                </li>
            )
        }
        else {
            var opts = { key: index };
            if (item.clickable) opts['onClick'] = () => this.props.onClick(item);
            return (<li {...opts}>{item.value || item[this.props.displayKey]}{children}</li>);
        }
    }

    buildItems = (items) => {
        var ret = null;
        //if this is presented as an array of 1 make it the actual object to avoid unecessary <ul> tags.
        if (Array.isArray(items) && items.length === 1) items = items[0];
        if (Array.isArray(items)) {
            ret = items.map((item, index) => {
                return this.addNode(item, index, 1);
            });
        }

        return <ul className='tree_ul'> {ret}</ul>;
    }

    render() {
        try {

            return (
                <div className='row'>
                    <div className='col-2'>&nbsp;</div>
                    <div className='col-10'>
                        {this.buildItems(this.props.source)}
                    </div>
                </div>
            )
        } catch (ex) {
            return ex.message;
        }
    }

}
export default Tree;

/*
desired functions:
onClick
onHover
clickable
*/