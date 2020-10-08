import React, { Component } from "react";
import { connect } from "react-redux";
import { toaster } from "../../helper/Toaster";
import { ModalPopup } from "../../helper/ModalPopup";
import moment from "moment";
import {
  addOnSubscription,
  activeSubscription,
  buySubscriptionPlan
} from "../../actions/common";
let buy_flag = false;
export class Subscription extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_flag: true,
      selected_class: true,
      addOnSubscriptionData: [],
      activeSubscriptionData: [],
      purchase_amount: 0,
      selected_id: "",
      popupFlag: false,
      greetingFlag: false,
      mode: "purchase"
    };
  }
  componentDidMount() {
    this.props.addOnSubscription();
    this.props.activeSubscription();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      add_on_subscription,
      active_subscription,
      buy_subscription
    } = newProps;
    if (add_on_subscription && add_on_subscription.code === 200) {
      this.setState({
        addOnSubscriptionData: add_on_subscription.subscription
      });
    } else if (add_on_subscription && add_on_subscription.code === 500) {
      toaster("error", add_on_subscription.message);
    }
    if (active_subscription && active_subscription.code === 200) {
      this.setState({
        activeSubscriptionData: active_subscription.subscription
      });
    } else if (active_subscription && active_subscription.code === 500) {
      toaster("error", active_subscription.message);
    }
    if (buy_subscription && buy_subscription.code === 200 && buy_flag) {
      toaster("success", buy_subscription.message);
      this.setState({ popupFlag: false, greetingFlag: true });
      buy_flag = false;
    } else if (buy_subscription && buy_subscription.code === 500 && buy_flag) {
      toaster("error", buy_subscription.message);
      buy_flag = false;
    }
  }

  handleTab = name => {
    if (name === "subscription") {
      this.setState({ selected_flag: true, selected_class: true });
    } else if (name === "plan") {
      this.setState({ selected_flag: false, selected_class: false });
    }
  };

  handlePopup = (e, data, mode) => {
    this.setState({
      popupFlag: true,
      purchase_amount: data.amount,
      selected_id: data.id,
      mode: mode
    });
  };
  modalClose = (e, name) => {
    if (name === "confirmation") {
      this.setState({ popupFlag: false });
    } else if (name === "greetings") {
      this.setState({ greetingFlag: false });
    }
  };

  buyPlan = () => {
    const { purchase_amount, selected_id } = this.state;
    var formData = new FormData();
    formData.append("amount", purchase_amount);
    formData.append("coin_value", purchase_amount);
    formData.append("subscription", selected_id);
    this.props.buySubscriptionPlan(formData);
    buy_flag = true;
  };

  render() {
    const {
      selected_class,
      selected_flag,
      addOnSubscriptionData,
      activeSubscriptionData,
      popupFlag,
      purchase_amount,
      greetingFlag,
      mode
    } = this.state;
    return (
      <div className="products_main_content ">
        <div className="billing_products_wrap">
          <div className="d-flex justify-content-between ">
            <h3>Subscription</h3>
          </div>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <span
                className={
                  selected_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.handleTab("subscription")}
              >
                {" "}
                My Subscription
              </span>
            </li>
            <li className="nav-item">
              <span
                className={
                  !selected_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.handleTab("plan")}
              >
                Subscription Plan
              </span>
            </li>
          </ul>
          {selected_flag ? (
            <div className="container mt-3 mb-3">
              {activeSubscriptionData.length === 0 ? (
                <div className="row">
                  <div className="col-sm-12">
                    <div className="border p-3 d-flex align-itmes-center flex-column justify-content-center subscription_box">
                      <div className="shadow">
                        <h3 className="text-center">No Active Subscription</h3>
                        <p className="text-center mt-3">
                          <button
                            className="custom_btn btn"
                            type="button"
                            onClick={() => this.handleTab("plan")}
                          >
                            Get Started
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="shadow border p-3">
                  {activeSubscriptionData.map((data, index) => {
                    return (
                      <div className="active_subscription_tab" key={index}>
                        <div className="row subscription_row">
                          <div className="col-sm-8">
                            <h5>{data.subscription.name}</h5>
                          </div>
                          <div className="col-sm-4 text-right">
                            <label className="coin_count">
                              {data.amount_paid} <span>coins per month</span>
                            </label>
                          </div>

                          <div className="col-12">
                            <div className="d-flex">
                              <p className="text-secondary">Auto Renew</p>
                              <div className="custom-control custom-checkbox ml-3">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="auto_renew1"
                                  value="false"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="auto_renew1"
                                ></label>
                              </div>
                            </div>
                          </div>

                          <div className="col-6">
                            <p className="next_renew">
                              Next Renew{" "}
                              <span>
                                {moment(data.purchase_date)
                                  .add(1, "M")
                                  .format("DD/MM/YYYY")}
                              </span>
                            </p>
                          </div>
                          <div className="col-6">
                            <p className="text-right">
                              {moment(data.purchase_date)
                                .add(1, "M")
                                .diff(moment(), "days") < 5 && (
                                <button
                                  className="custom_btn btn"
                                  type="button"
                                  onClick={e =>
                                    this.handlePopup(
                                      e,
                                      data.subscription,
                                      "renew"
                                    )
                                  }
                                >
                                  Renew
                                </button>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : navigator.onLine ? (
            <div className="container">
              <div className="subscription_plans mt-3 mb-3">
                {addOnSubscriptionData.map((data, index) => {
                  return (
                    <div className="row" key={index}>
                      <div className="col-sm-12 mb-4">
                        <div className="p-3">
                          <h5 className="text-center">{data.name}</h5>
                          <p>{data.description}</p>
                          <div className="d-flex justify-content-around align-itmes-center coins_box card pt-3">
                            <label className="coin_count">
                              <img
                                className="img-flude"
                                src="images/coins.png"
                                alt=""
                              />
                              {data.amount} <span> coins per month</span>
                            </label>
                            {activeSubscriptionData.find(
                              data1 => data1.subscription.id === data.id
                            ) === undefined ? (
                              <button
                                className="custom_btn btn"
                                type="button"
                                onClick={e =>
                                  this.handlePopup(e, data, "purchase")
                                }
                              >
                                Buy
                              </button>
                            ) : (
                              <button
                                className="custom_btn btn active"
                                type="button"
                              >
                                Active
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="no_data_found">
              <h2>
                <i
                  className="fa fa-exclamation-triangle"
                  aria-hidden="true"
                ></i>
              </h2>
              <h3>Please connect to internet to view subscription plan</h3>
            </div>
          )}
        </div>
        {popupFlag && (
          <ModalPopup
            className="hold-delete-flag unhold_invoice"
            popupOpen={popupFlag}
            popupHide={e => this.modalClose(e, "confirmation")}
            // title="Invoice"
            content={
              <div className="">
                {mode === "purchase" ? (
                  <h4 className="text-dark text-center mb-3">
                    Are you sure, you want to purchase subscription plan for{" "}
                    {purchase_amount} amount?
                  </h4>
                ) : (
                  <h4 className="text-dark text-center mb-3">
                    Are you sure, you want to renew this subscription plan for{" "}
                    {purchase_amount} amount?
                  </h4>
                )}
                <div className="d-flex justify-content-center mt-2">
                  <button
                    className="btn add_btn mr-2"
                    onClick={() => this.buyPlan()}
                  >
                    Yes
                  </button>
                  <button
                    className="btn add_btn"
                    onClick={e => this.modalClose(e, "confirmation")}
                  >
                    No
                  </button>
                </div>
              </div>
            }
          />
        )}
        {greetingFlag && (
          <ModalPopup
            className="hold-delete-flag unhold_invoice"
            popupOpen={greetingFlag}
            popupHide={e => this.modalClose(e, "greetings")}
            // title="Invoice"
            content={
              <div className="">
                {mode === "purchase" ? (
                  <h4 className="text-dark text-center mb-3">
                    Thanks for purchasing this plan.
                  </h4>
                ) : (
                  <h4 className="text-dark text-center mb-3">
                    Thanks for renewing this plan.
                  </h4>
                )}
                <div className="d-flex justify-content-center mt-2">
                  <button
                    className="btn add_btn mr-2"
                    onClick={e => this.modalClose(e, "greetings")}
                  >
                    ok
                  </button>
                </div>
              </div>
            }
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    add_on_subscription: store.common.add_on_subscription,
    active_subscription: store.common.active_subscription,
    buy_subscription: store.common.buy_subscription
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addOnSubscription: () => dispatch(addOnSubscription()),
    activeSubscription: () => dispatch(activeSubscription()),
    buySubscriptionPlan: params => dispatch(buySubscriptionPlan(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
