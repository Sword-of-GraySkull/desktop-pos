import React, { Component } from "react";

export class HoldFuc extends Component {

    func=()=>{
        const res1 = await this.state.db.getHoldProducts();
        if (
          res1 &&
          (res1.status === 200)
        ) {
          let database_holded_data = res1.holded_data;
          let data = {
            selected_product: selected_product,
            holded_reverse_data: holded_reverse_data,
            total: total,
            created_date: moment().format("YYYY-MM-DD"),
            invoice_id:
            database_holded_data[database_holded_data.length - 1] ? database_holded_data[database_holded_data.length - 1].invoice_id + 1 : 1
          };
          database_holded_data.push(data);
          let doc = {
            _id: "holdData",
            status: 200,
            updated_time: moment().format("YYYY-MM-DD"),
            holded_data: database_holded_data,
            _rev: res1._rev
          };
          await this.state.db.updateDatabaseProducts(doc);
        } else {
          let data = {
            selected_product: selected_product,
            holded_reverse_data: holded_reverse_data,
            total: total,
            created_date: moment().format("YYYY-MM-DD"),
            invoice_id: 1
          };
          let database_data = [];
          database_data.push(data);
          let doc = {
            _id: "holdData",
            status: 200,
            updated_time: moment().format("YYYY-MM-DD"),
            holded_data: database_data
          };
          await this.state.db.addDatabase(doc);
        }
    }
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
          
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        {this.props.content && <Modal.Body>{this.props.content}</Modal.Body>}
      </Modal>
    );
  }
}

export default HoldFuc;