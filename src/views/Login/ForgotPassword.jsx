import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import SecondRegister from "../Register/SecondRegister";
import { toaster } from "../../helper/Toaster";
import { resendOtp } from "../../actions/login";
export class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      tab: 1
    };
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { resend_response } = newProps;

    if (resend_response && resend_response.code === 200) {
      toaster("success", resend_response.message);
      this.setState({ tab: 2 });
    } else if (resend_response && resend_response.code === 400) {
      toaster("error", resend_response.message);
    }
  }
  handleChange = (e, name) => {
    let reg = /^[0-9]{0,10}$/;
    if (name === "mobile" && reg.test(e.target.value) === false) {
      return;
    }
    this.setState({ [name]: e.target.value });
  };
  handleOtp = () => {
    const { mobile } = this.state;
    if (mobile === "") {
      toaster("error", "Please enter the mobile number.");
    } else if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      toaster("error", "Mobile number must be of 10 digits");
    } else {
      this.props.resendOtp(mobile);
    }
  };
  changeTab = () => {
    this.setState({ tab: 1 });
  };
  resentCode = () => {
    this.props.resendOtp(this.state.mobile);
  };
  getList = () =>{
    this.props.history.push('/confirm-password')
  }
  render() {
    const { mobile, tab } = this.state;
    return (
      <section className="login_wrap">
        <div className="clearfix">
          <div className="row no-gutters">
            <div className="col-md-6">
              <div className="login_left text-center">
                <Link to="#">
                  <img src="images/logo.jpeg" alt="Pogo 91" />
                </Link>
                <h2>
                  <span>
                    Make billing
                    <br />
                    convenient and faster
                  </span>
                  Increase your sales,
                  <br />
                  Increase your revenue
                </h2>
                <Link to="#" className="download_app">
                  <img src="images/g_btn.png" alt="Goggle Play" />
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="login_right text-center">
                {tab === 1 && (
                  <div className="form_data">
                    {/* <div onKeyDown={e => registerHandler("enter", e)}>  */}

                    <div className="form-group">
                      <input
                        className="form-control mobile_input"
                        type="text"
                        placeholder="Mobile Number"
                        name="mobile"
                        autocomplete="new-password"
                        onChange={e => this.handleChange(e, "mobile")}
                        value={mobile}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn login_btn "
                      onClick={e => this.handleOtp(e)}
                    >
                      Next
                    </button>
                  </div>
                )}
                {tab === 2 && <SecondRegister state={this.state} handleChange={this.handleChange} changeTab={this.changeTab} resentCode={this.resentCode} getList={this.getList}/>}
                <div className="account_text">
                  <p>
                    Already have an account with us?{" "}
                    <Link to="/login" >
                      Sign In
                    </Link>{" "}
                    here
                  </p>
                </div>
                <div className="copyright_text">Copyright 2019 | POGO91</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
const mapStateToProps = store => {
  return {
    resend_response: store.login.resend_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resendOtp: params => dispatch(resendOtp(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
