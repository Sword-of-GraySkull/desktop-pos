/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggled: true,
    };
  }
  toggleBox = () => {
    this.setState((prevState) => ({ isToggled: !prevState.isToggled }));
    console.log(this.state.isToggled);
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="card" style={{ marginTop: "2%" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-6">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <Link to="/online-store">Orders</Link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Order Number -3
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="col-6">
                <div className="float-right">
                  {/* b class is for bold */}
                  <button
                    className="btn btn-outline-dark b br-50 m-2 float-right"
                    style={{ border: "1px solid" }}
                  >
                    Accept
                  </button>
                  <button className="btn-del b br-50 m-2 float-right">
                    REJECT
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="card card-body">
                  <table class="table ">
                    <thead>
                      <tr>
                        <td></td>
                        <td>Product Name Details </td>
                        <td>QTY Ordered</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td width="82px">
                          <img
                            src="https://5.imimg.com/data5/OR/EW/MY-43672724/ashirwad-atta-10kg-250x250.png"
                            alt=""
                          />
                        </td>
                        <td>
                          Aashirvad Whole Wheat aata, 5 kg<br></br>
                          <div className="row">
                            <div className="col-3">
                              <s>Rs 100</s>
                            </div>
                            <div className="col-3">Rs 70</div>
                          </div>
                        </td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td width="82px">
                          <img
                            src="https://5.imimg.com/data5/OR/EW/MY-43672724/ashirwad-atta-10kg-250x250.png"
                            alt=""
                          />
                        </td>
                        <td>
                          Aashirvad Whole Wheat aata, 5 kg
                          <br></br>
                          <div className="row">
                            <div className="col-3">
                              <s>Rs 100</s>
                            </div>
                            <div className="col-3">Rs 70</div>
                          </div>
                        </td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td width="82px">
                          <img
                            src="https://5.imimg.com/data5/OR/EW/MY-43672724/ashirwad-atta-10kg-250x250.png"
                            alt=""
                          />
                        </td>
                        <td>
                          Aashirvad Whole Wheat aata, 5 kg
                          <br></br>
                          <div className="row">
                            <div className="col-3">
                              <s>Rs 100</s>
                            </div>
                            <div className="col-3">Rs 70</div>
                          </div>
                        </td>
                        <td>10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="card card-body mb-2">
                    <div className="row">
                      <div className="col">
                        <h6>Order-number 3</h6>
                        <p>10-may-2020 10:00pm</p>
                      </div>
                      <div className="col">
                        <h6 className="float-right">PENDING</h6>
                      </div>
                    </div>
                    <div>
                      <p>
                        Ankit Kushwala, homes 121, Sector 121, Noida, 201301
                      </p>
                    </div>
                    <div className="row">
                      <div className="col">
                        <i className="fa fa-2x fa-map-marker mr-3"></i>
                        <i className="fa fa-2x fa-whatsapp mr-3"></i>
                        <i className="fa fa-2x fa-phone mr-3"></i>
                        <i className="fa fa-2x fa-comments mr-3"></i>
                      </div>
                      <div className="col">
                        <h6 className="float-right">Rs 1000</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card card-body">
                    <div className="row card-item">
                      <div className="col">
                        <p>Discount On</p>
                      </div>
                      <div className="col">
                        {/* <div
                          className="btn-group btn-group-toggle"
                          data-toggle="buttons"
                        >
                          <label
                            className="btn btn-outline active"
                            style={{ border: "1px solid #F98327" }}
                          >
                            <input
                              type="radio"
                              name="options"
                              id="option1"
                              autocomplete="off"
                              checked
                            />{" "}
                            MRP
                          </label>
                          <label
                            className="btn btn-outline"
                            style={{ border: "1px solid #F98327" }}
                          >
                            <input
                              type="radio"
                              name="options"
                              id="option2"
                              autocomplete="off"
                            />{" "}
                            Selling Price
                          </label>
                        </div> */}
                        <div class="btn-group btn-toggle">
                          <button
                            class={`btn btn-lg btn-default border ${
                              this.state.isToggled ? "" : "active"
                            }`}
                            onClick={this.toggleBox}
                          >
                            MRP
                          </button>
                          <button class="btn btn-lg btn-warning active border">
                            SELLING PRICE
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">Discount Type</div>
                      <div className="col">
                        {/* <div
                          className="btn-group btn-group-toggle"
                          data-toggle="buttons"
                        >
                          <label
                            className="btn btn-outline active"
                            style={{ border: "1px solid #F98327" }}
                          >
                            <input
                              type="radio"
                              name="options"
                              id="option1"
                              autocomplete="off"
                              checked
                            />
                          </label>
                          <label
                            className="btn btn-outline"
                            style={{ border: "1px solid #F98327" }}
                          >
                            <input
                              type="radio"
                              name="options"
                              id="option2"
                              autocomplete="off"
                            />{" "}
                            Amount
                          </label>
                        </div> */}

                        <div class="btn-group btn-toggle ">
                          <button class="btn btn-lg btn-default border ">
                            %
                          </button>
                          <button class="btn btn-lg btn-warning active border">
                            Amount
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row card-item">
                      <div className="col">Amount</div>
                      <div className="col">
                        <input
                          className="online-input rounded"
                          style={{ padding: "10px 0" }}
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="card card-body my-2">
                    <div className="row">
                      <div className="col">Sub total</div>
                      <div className="col">
                        <p className="float-right"> Rs 500</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">Discount(10%)</div>
                      <div className="col">
                        <p className="float-right"> -Rs 50</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">Delivery Charges</div>
                      <div className="col">
                        <p className="float-right"> Rs 50</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">Total</div>
                      <div className="col">
                        <p className="float-right"> Rs 500</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card card-body">
                    <p>Payment Methods</p>
                    <div className="row">
                      <div className="col text-center">
                        <img src="./images/cards.png" alt="" />
                        <label>Cash</label>
                      </div>
                      <div className="col text-center">
                        <label>Credit</label>
                      </div>
                      <div className="col text-center">
                        <label>
                          UPI<br></br> Payment Link
                        </label>
                      </div>
                      <div className="col text-center">
                        <label>Split Payment</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderDetails;
