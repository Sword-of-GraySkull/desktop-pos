import React, { Component } from "react";
export default class Test extends Component {
  state = {
    tasks: [
      "https://testing.pogo91.com//media/__sized__/1552_e78c462c-ecb5-4a8a-9fe2-be01766b85eb-thumbnail-65x65-70.jpg",
      "https://testing.pogo91.com//media/__sized__/5389_1571827968881-thumbnail-65x65-70.jpg",
      "https://testing.pogo91.com//media/__sized__/5611_1576930736711-thumbnail-65x65-70.jpg",
      "https://testing.pogo91.com//media/__sized__/4997_print-thumbnail-65x65.png"
    ],
    showModal: false,
    dropData: {}
  };
  onDragStart = (ev, id, index) => {
    let data = {
      id: id,
      index: index
    };
    ev.dataTransfer.setData("data", JSON.stringify(data));
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, index) => {
    let dropData = JSON.parse(ev.dataTransfer.getData("data"));
    let dropIndex = index;
    this.setState({
      ...this.state,
      showModal: true,
      dropData,
      dropIndex
    });
  };
  close = () => {
    this.setState({
      ...this.state,
      showModal: false
    });
  };

  dropImage = e => {
    let data = this.state.dropData;
    let tasks = this.state.tasks;
    let dropIndex = this.state.dropIndex;
    if (data.index > dropIndex) {
      tasks.splice(dropIndex, 0, data.id);
      tasks.splice(data.index + 1, 1);
    } else {
      tasks.splice(dropIndex + 1, 0, data.id);
      tasks.splice(data.index, 1);
    }
    this.setState({
      ...this.state,
      showModal: false,
      tasks
    });
  };

  render() {
    return (
      <div className="container-drag">
        <h2 className="header">DRAG & DROP DEMO</h2>
        <div className="wraper-inner">
          {this.state.tasks.map((data, index) => {
            return (
              <div
                className="wip"
                onDragStart={e => this.onDragStart(e, data, index)}
                onDragOver={e => this.onDragOver(e)}
                onDrop={e => {
                  this.onDrop(e, index);
                }}
              >
                <img src={data} />
              </div>
            );
          })}
        </div>
        {/* <Modal show={this.state.showModal} onHide={e => this.close(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Are you sure you want to replace the image</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={e => this.close(e)}>
              No
            </Button>
            <Button variant="primary" onClick={e => this.dropImage(e)}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    );
  }
}

