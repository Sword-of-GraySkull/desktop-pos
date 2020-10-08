import React, { Component } from "react";
import { connect } from "react-redux";
import { toaster } from "../../helper/Toaster";
import { ModalPopup } from "../../helper/ModalPopup";
import moment from "moment";
import database from "../../database";
import { getCoins, getCoinsHistory, addCoins } from "../../actions/common";
let coinFlag = false;
export class Coins extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_flag: true,
      selected_class: true,
      current_balance: 0,
      details: [],
      coin_history: [],
      credit: 100,
      // credit_amount: 100 * 0.15,
      // credit_gst: 100 * 0.15 * 0.18,
      // total: 100 * 0.15 + 100 * 0.15 * 0.18,
      credit_gst: 100 * 100 * 0.18,
      total: 100 * 100 + 100 * 100 * 0.18,
      phone: "",
      db: new database()
    };
  }
  async componentDidMount() {
    const res1 = await this.state.db.getStoreSettings();
    if (res1 && res1.status === 200) {
      this.setState({ phone: res1.store_settings.phone_number });
    }

    this.props.getCoins();
    this.props.getCoinsHistory();
    const script = document.createElement("script");

    // script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { charge_details, coin_history, coin_response } = newProps;
    if (charge_details && charge_details.code === 200) {
      this.setState({
        current_balance: charge_details.coins,
        details: charge_details.static
      });
    }

    if (coin_history && coin_history.code === 200) {
      this.setState({ coin_history: coin_history.transaction });
    }

    if (coin_response && coin_response.code === 200 && coinFlag) {
      toaster("success", coin_response.message);
      this.props.getCoins();
      coinFlag = false;
    } else if (coin_response && coin_response.code === 400 && coinFlag) {
      toaster("error", coin_response.message);
      coinFlag = false;
    }
  }

  handleTab = name => {
    if (name === "details") {
      this.setState({ selected_flag: true, selected_class: true });
    } else if (name === "statement") {
      this.setState({ selected_flag: false, selected_class: false });
    }
  };

  handleChange = (e, name) => {
    let value = e.target.value ? parseInt(e.target.value) : 0;
    // let credit_amount = value * 0.15;
    // let credit_gst = credit_amount * 0.18;
    let credit_gst = value * 100 * 0.18;
    // let total = credit_amount + credit_gst;
    let total = value * 100 + credit_gst;
    // this.setState({ [name]: value, credit_amount, credit_gst, total });
    this.setState({ [name]: value, credit_gst, total });
  };
  handlePopup = () => {
    this.setState({ popupFlag: true, credit: 100 });
  };

  modalClose = () => {
    this.setState({ popupFlag: false });
  };

  openCheckout() {
    if (this.state.credit < 100) {
      return toaster("error", "Please Purchase minimum 100 Credits");
    }
    if (navigator.onLine) {
      this.setState({ popupFlag: false });
      const { total, credit_gst, credit } = this.state;
      const { addCoins } = this.props;
      let options = {
        key: "rzp_live_ZHKSOF33DowCwC",
        // key: "rzp_test_b9qQOmmsEILmi2",  //testing
        amount: this.state.credit * 100, // 2000 paise = INR 20, amount in paisa
        name: "Huhu Solutions Pvt Ltd.",
        description: "Recharge Wallet Credit Charges",
        image: "images/fev.png",
        handler: function(response) {
          var formData = new FormData();
          formData.append(
            "payment_gateway_transaction_id",
            response.razorpay_payment_id
          );
          formData.append("payment_status", "1");
          formData.append("order_total", total);
          formData.append("tax", credit_gst);
          formData.append("payment_gateway_transaction_status", "1");
          formData.append("credits_value", credit);
          formData.append("payment_gateway_used_name", "RazorPay");
          addCoins(formData);
          coinFlag = true;
        },
        prefill: {
          // "name": "Harshil Mathur",
          // "email": "harshil@razorpay.com"
          contact: this.state.phone
        },
        notes: {
          address: "Hello World"
        },
        theme: {
          color: "#F37254"
        }
      };

      let rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      toaster("warning", "Please connect to internet to complete this action");
    }
  }

  render() {
    const {
      selected_class,
      selected_flag,
      current_balance,
      details,
      coin_history,
      popupFlag,
      credit
      // credit_amount,
      // credit_gst
    } = this.state;
    return (
      <div className="products_main_content ">
        <div className="billing_products_wrap">
          <div className="d-flex justify-content-between ">
            <h3>Coins</h3>
          </div>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <span
                className={
                  selected_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.handleTab("details")}
              >
                {" "}
                Details
              </span>
            </li>
            <li className="nav-item">
              <span
                className={
                  !selected_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.handleTab("statement")}
              >
                Coin Statement
              </span>
            </li>
          </ul>
          {selected_flag ? (
            <div className="coins_details">
              <div className="d-flex justify-content-between">
                <p>
                  <span>Current Balance: </span>
                  <strong>{current_balance}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => this.handlePopup()}
                  className="custom_btn btn"
                >
                  Recharge Coins
                </button>
              </div>
              <hr />
              <div>
                <p className="d-flex justify-content-between">
                  <span>Coin Charge Details</span>
                  <span>1 Coin = {"\u20B9"}1</span>
                </p>
                <hr />
                <ul className="list_style">
                  {details.map((data, index) => {
                    return (
                      <li
                        className="d-flex justify-content-between align-items-end"
                        key={index}
                      >
                        <div>
                          <h5>{data.name}</h5>
                          <p>{data.description}</p>
                        </div>
                        <div>
                          <p>{data.coins}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ) : coin_history.length !== 0 ? (
            <div className="coins_details">
              <ul>
                {coin_history.map((data, index) => {
                  return (
                    <li key={index}>
                      <div className="card p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-end">
                          <div>
                            {data.transaction_type ? (
                              <span className="small">Deducted</span>
                            ) : (
                              <span className="small">Added</span>
                            )}
                            {data.service === 1 && <h6>Online Order</h6>}
                            {data.service === 2 && <h6>SMS Invoice</h6>}
                            {data.service === 3 && <h6>Promotional SMS</h6>}
                            {data.service === 4 && <h6>Email Invoice</h6>}
                          </div>
                          <span
                            className={
                              data.transaction_type
                                ? "deducted_coin"
                                : "added_coin"
                            }
                          >
                            {data.coin_deducted} Coin
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-end">
                          <span>
                            {moment(data.datetime_stamp).format("hh:mm a")}
                          </span>
                          <span>
                            Closing balance: {data.remaining_balance} coin
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="no_data_found">
              <h2>
                <i
                  className="fa fa-exclamation-triangle"
                  aria-hidden="true"
                ></i>
              </h2>
              <h3>No Data Found</h3>
            </div>
          )}
          {popupFlag && (
            <ModalPopup
              className="customer-flag prd_model_box recharge_coin_popup"
              popupOpen={popupFlag}
              popupHide={this.modalClose}
              content={
                <div className="w-100">
                  <div className="model_input">
                    <h4>Add Money to Recharge Your Wallet.</h4>
                    <input
                      type="text"
                      className="number_input"
                      placeholder="e.g: 1234567890"
                      autoComplete="off"
                      name="credit"
                      value={credit}
                      onChange={e => this.handleChange(e, "credit")}
                    />
                    {/* <p className="text-right">minimum credits = 100</p>
                    <h2 className="text-center">0.15/Credit</h2>
                    <hr /> */}
                  </div>
                  {/* <p className="text-center">*Exclusive of taxes</p>

                  <p className="text-center">
                    Total={'\u20B9'}{credit_amount} + {'\u20B9'}{credit_gst.toFixed(2)}(18% GST)
                  </p> */}
                  <p className="text-center">
                    <button
                      className="btn custom_btn"
                      type="button"
                      onClick={() => this.openCheckout()}
                    >
                      Pay Now
                    </button>
                  </p>
                </div>
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    charge_details: store.common.charge_details,
    coin_history: store.common.coin_history,
    coin_response: store.common.coin_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCoins: () => dispatch(getCoins()),
    getCoinsHistory: () => dispatch(getCoinsHistory()),
    addCoins: params => dispatch(addCoins(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Coins);
