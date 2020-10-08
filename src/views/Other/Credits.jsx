import React, { Component } from "react";
import { connect } from "react-redux";
import { ModalPopup } from "../../helper/ModalPopup";
import { getCreditsData } from "../../actions/common";
import { toaster } from "../../helper/Toaster";
export class Credits extends Component {
  constructor(props) {
    super(props);

    this.state = {
      credits_data: [],
      popupFlag: false,
      credit: 500,
      credit_amount: 500 * 0.15,
      credit_gst: 500 * 0.15 * 0.18,
      total: 500 * 0.15 + 500 * 0.15 * 0.18,
      phone: 9888064115
    };
  }
  componentDidMount() {
    let params = {
      store_id: localStorage.getItem("store")
    };
    this.props.getCreditsData(params);
    const script = document.createElement("script");

    // script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    document.body.appendChild(script);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { credit_data } = newProps;
    if (credit_data && credit_data.code === 200) {
      this.setState({ credits_data: credit_data["store-credits-values"] });
    }
  }

  handleChange = (e, name) => {
    let value = e.target.value ? parseInt(e.target.value) : 0;
    let credit_amount = value * 0.15;
    let credit_gst = credit_amount * 0.18;
    let total = credit_amount + credit_gst;
    this.setState({ [name]: value, credit_amount, credit_gst, total });
  };
  handlePopup = () => {
    this.setState({ popupFlag: true, credit: 500 });
  };

  modalClose = () => {
    this.setState({ popupFlag: false });
  };

  openCheckout() {
    if (this.state.credit < 100) {
      return toaster("error", "Please Purchase minimum 100 Credits");
    }
    let options = {
      key: "rzp_live_ZHKSOF33DowCwC",
      amount: this.state.total * 100, // 2000 paise = INR 20, amount in paisa
      name: "Huhu Solutions Pvt Ltd.",
      description: "PROMOTIONAL SMS CREDITS",
      image: "/your_logo.png",
      handler: function(response) {
        alert(response.razorpay_payment_id);
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
  }

  render() {
    const {
      popupFlag,
      credit,
      credit_amount,
      credit_gst,
      credits_data
    } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <div className="heading">
          <h3>Credits</h3>
        </div>
        <div className="row">
          <div className="col-12 pl-2 pt-md-2">
            <ul className="credits_lst">
              {credits_data.map((data, key) => {
                return (
                  <li key={key}>
                    <div className="cr_t">
                      <p className="text-white">{data.name}</p>
                      <h3>
                        {data.available_balance !== 0
                          ? data.available_balance
                          : "NA"}
                      </h3>
                    </div>
                    <div className="p-2 bg-white text-center">
                      {data.id === 2 ? (
                        <span onClick={() => this.handlePopup()} style={{"cursor":"pointer"}}>RECHARGE</span>
                      ) : (
                        <span>Coming Soon</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {popupFlag && (
          <ModalPopup
            className="customer-flag prd_model_box recharge_coin_popup"
            popupOpen={popupFlag}
            popupHide={this.modalClose}
            title='How many promotional sms credits do you want?'
            content={
              <div className="w-100">
                <div className="model_input">
                  
                  <input
                    type="text"
                    className="number_input text-center mb-0"
                    placeholder="e.g: 1234567890"
                    name="credit"
                    value={credit}
                    onChange={e => this.handleChange(e, "credit")}
                  />
                  <p className="text-right">minimum credits = 100</p>
                  <h2 className="text-center mt-4">0.15/Credit</h2>
                  <hr />
                </div>
                <p className="text-center mb-1">*Exclusive of taxes</p>

                <p className="text-center">
                  Total={'\u20B9'}{credit_amount} + {'\u20B9'}{credit_gst.toFixed(2)}(18% GST)
                </p>
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
    );
  }
}

const mapStateToProps = store => {
  return {
    credit_data: store.common.credit_data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCreditsData: params => dispatch(getCreditsData(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Credits);
