import React from 'react';
import { Modal } from 'react-bootstrap';


/*
Required parameters
    Style
    Header Data
    Body Data as a Function
    Footer Data
    isOpen - true/false from state of caller
    toggle - toggle function to control show/hide
    onClose - function to call when close button is clicked
*/


const ModalComponent = props => {
    let style=props.style?props.style:{};
    style.marginLeft='33%';
    return (
        <Modal show={props.isOpen} onHide={props.toggle}
            backdrop='static' style={style}
            centered>
            <Modal.Header closeButton={props.closeButton || true}>
                {props.header || ''}
            </Modal.Header>
            <Modal.Body>
                {props.body || props.children || ''}
            </Modal.Body>
            <Modal.Footer>{props.footer || ''}</Modal.Footer>
        </Modal>
    );
}


export default ModalComponent;