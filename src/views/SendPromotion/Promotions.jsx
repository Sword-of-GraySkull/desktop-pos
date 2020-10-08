import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { submitPromotion } from "../../actions/promotions";
import { toaster } from "../../helper/Toaster";
export class Promotions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: 0,
      credits: 0,
      data: "",
      used_credits: 0,
      character: 0,
      id: 1,
      days: 0
    };
  }
  componentDidMount() {
    const { state } = this.props.location.state;
    this.setState({
      customer: state.customer,
      credits: state.credits,
      data: state.data,
      used_credits: state.used_credits,
      character: state.character,
      id: state.id,
      days: state.days
    });
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { promotion_response } = newProps;
    if (promotion_response && promotion_response.code === 200) {
      toaster("success", promotion_response.message);
      this.props.history.push("/send-promotion");
    } else if (promotion_response && promotion_response.code !== 200) {
      toaster("error", promotion_response.message);
    }
  }

  handleSubmit = () => {
    const { data, id, days } = this.state;
    var formData = new FormData();
    formData.append("promotion_id", id);
    formData.append("days", days);
    formData.append("promo_message", data);
    this.props.submitPromotion(formData);
  };

  render() {
    const { customer, credits, data, used_credits } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <div className="d-flex justify-content-between ">
          {/* <h3>Payment</h3> */}

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/send-promotion">Send Promotions</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Promotions
              </li>
            </ol>
          </nav>

          <Link to="/send-promotion" className="btn btn-dark ml-1">
            Back
          </Link>
        </div>
        <div className="form-group">
          <h6>SMS</h6>
          <textarea
            className="form-control w-100"
            name="data"
            value={data}
            readOnly
          ></textarea>
        </div>

        <div className="row">
          <div className="col-sm-12 mb-3">
            <h6 className="w-100">Total Customers</h6>
            <div className="border p-3">
              <strong>{customer}</strong>
            </div>
          </div>
          <div className="col-sm-6">
            <h6 className="w-100">Available Promo Credits</h6>
            <div className="border p-3">
              <strong>{credits}</strong>
            </div>
          </div>
          <div className="col-sm-6">
            <h6 className="w-100">Total Credit Used</h6>
            <div className="border p-3">
              <strong>{used_credits}</strong>
            </div>
          </div>
        </div>

        <p className="text-danger mt-3 mb-1">Note:</p>
        <p className="text-danger mb-1">
          In case any message delivery is failed the sms will be credited back
          into your account automatically{" "}
        </p>
        <p className="text-danger mb-1">
          SMS will not be delivered on DND numbers.
        </p>
        <p className="text-danger mb-1">
          * Promotional sms are not allowed from 9PM to 9AM{" "}
        </p>

        <button
          type="button"
          onClick={() => this.handleSubmit()}
          className="btn btn-primary custom_btn float-right mt-3"
        >
          {" "}
          Send Promotions{" "}
        </button>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    promotion_response: store.promotions.promotion_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitPromotion: params => dispatch(submitPromotion(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Promotions);
