import React, { Component } from "react";

import { Modal } from "react-bootstrap";

export class ModalPopup extends Component {
  render() {
    const props = this.props;
    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className={props.className}
        show={props.popupOpen}
        onHide={props.popupHide}
      >
          
        <Modal.Header closeButton ={(props.className !== 'bill-flag' &&  props.className !== 'hold-delete-flag unhold_invoice log_out') ? true: false}>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        {this.props.content && <Modal.Body>{this.props.content}</Modal.Body>}
      </Modal>
    );
  }
}

export default ModalPopup;
