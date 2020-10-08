import React, { Component } from "react";
import { connect } from "react-redux";
export class ProductTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(newProps) {}

  render() {
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <div className="heading">
          <h3>Product Types</h3>
        </div>

        <div className="row">
          <div className="col-12 col-lg-11 invoice-lsblk">
            <div className="w-100">
              <div className="row">
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="chk1"
                  >
                    <span>Regular</span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="chk1"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="chk1"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="chk2"
                  >
                    <span>Weighted Products</span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="chk2"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="chk2"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="chk3"
                  >
                    <span>Services</span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="chk3"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="chk3"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="chk4"
                  >
                    <span>Mobile/Electronics </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="chk4"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="chk4"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="chk5"
                  >
                    <span>Electronics</span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="chk5"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="chk5"
                      ></label>
                    </div>
                  </label>
                </div>
              </div>

              <div className="d-flex w-100 mt-4">
                <input type="button" className="btn add_btn ml-auto" value="Save" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

const mapStateToProps = store => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductTypes);
