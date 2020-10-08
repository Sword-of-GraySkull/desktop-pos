import React, { Component } from "react";
import { connect } from "react-redux";
import database from "../../database";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { editPaymentMethods, storePaymentMode } from "../../actions/settings";
import { Link } from "react-router-dom";
let edit_flag = false;
export class Payments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payment_method: [],
      loaderVisible: false,
      db: new database()
    };
  }
  async componentDidMount() {
    const res = await this.state.db.getStorePayment();
    if (res && res.status === 200) {
      this.setState({
        payment_method: res.store_payment
      });
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const { payment_response, store_payment } = newProps;
    if (payment_response && payment_response.code === 200 && edit_flag) {
      toaster("success", payment_response.message);
      this.props.storePaymentMode(localStorage.getItem("store"));

      edit_flag = false;
    }
    if (store_payment && store_payment.code === 200) {
      const res = await this.state.db.getStorePayment();
      let doc = {
        _id: "storePayment",
        status: 200,
        _rev: res._rev,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_payment: store_payment.products
      };

      await this.state.db.updateDatabaseProducts(doc);
      this.setState({ loaderVisible: false });
    }
  }

  handleClick = (e, data) => {
    let payment_method = this.state.payment_method;
    let index = payment_method.findIndex(x => x.id === data.id);
    payment_method[index].is_active =
      payment_method[index].is_active === 1 ? 0 : 1;
    this.setState({ payment_method });
  };

  submitPayment = () => {
    const { payment_method } = this.state;
    let activePayment = [];
    let inActivePayment = [];
    payment_method.map(data => {
      if (data.is_active === 1) {
        activePayment.push(data.id);
      } else if (data.is_active === 0) {
        inActivePayment.push(data.id);
      }
      return null;
    });
    if (navigator.onLine) {
      var formData = new FormData();
      formData.append("store_id", localStorage.getItem("store"));
      formData.append("active_payment_modes", activePayment);
      formData.append("inactive_payment_modes", inActivePayment);
      this.props.editPaymentMethods(formData);
      this.setState({ loaderVisible: true });
      edit_flag = true;
    } else {
      toaster(
        "warning",
        "Please connect to internet to update Payment Settings"
      );
    }
  };

  render() {
    const { payment_method, loaderVisible } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <LoaderFunc visible={loaderVisible} />
        <div className="heading">
          {/* <h3>Payment</h3> */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/settings">Settings</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Payment
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-12 col-lg-11 invoice-lsblk">
            <div className="w-100">
              <div className="row">
                {payment_method.map((data, key) => {
                  return (
                    <div className="col-md-6 gr_box" key={key}>
                      <label
                        className="d-flex justify-content-between mb-3"
                        htmlFor={key}
                      >
                        <span>
                          {data.name}
                          <br />
                          <small>
                            Allow you to track all {data.name} on your POS
                          </small>
                        </span>
                        <div className="custom-control custom-checkbox ml-3">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={key}
                            value={data.is_active}
                            checked={data.is_active === 1}
                            onChange={e => this.handleClick(e, data)}
                            disabled={data.id === 1}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={key}
                          ></label>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="d-flex w-100 mt-4">
                <input
                  type="button"
                  className="btn add_btn ml-auto"
                  value="Save"
                  onClick={() => this.submitPayment()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    payment_response: store.settings.payment_response,
    store_payment: store.settings.store_payment
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editPaymentMethods: params => dispatch(editPaymentMethods(params)),
    storePaymentMode: params => dispatch(storePaymentMode(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payments);
