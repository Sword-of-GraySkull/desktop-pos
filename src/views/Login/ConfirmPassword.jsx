import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toaster } from "../../helper/Toaster";
export class ConfirmPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      confirm_password: ""
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { register_response, otp_response, store_list } = newProps;
    if (register_response && register_response.code === 200) {
      this.props.history.push("/");
    } else if (register_response && register_response.code === 400) {
      toaster("error", register_response.message);
    }
    if (otp_response && otp_response.code === 200) {
      this.setState({ tab: 2 });
    } else if (otp_response && otp_response.code === 400) {
      toaster("error", otp_response.message);
    }
    if (store_list && store_list.code === 200) {
      this.setState({
        business_list: store_list.business_type,
        search_business_list: store_list.business_type,
        tab: 3
      });
    } else if (store_list && store_list.code === 400) {
      toaster("error", store_list.message);
    }
  }

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  handleOtp = () => {
    const { password, confirm_password } = this.state;
    if (password === "" && confirm_password === "") {
      toaster("error", "Please fill all the fields.");
    } else if (password !== "" && !/^[a-zA-Z0-9]{4,}$/.test(password)) {
      toaster("error", "Password must be of atleast 4 digits.");
    } else if (password !== "" && confirm_password !== "") {
      toaster("error", "Password must be same.");
    } else {
      //   this.props.getOtp(mobile);
    }
  };
  render() {
    const { password, confirm_password } = this.state;
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
                <div className="form_data">
                  <div className="form-group">
                    <input
                      className="form-control password_input"
                      type="Password"
                      placeholder="Password"
                      name="password"
                      autocomplete="new-password"
                      onChange={e => this.handleChange(e, "password")}
                      value={password}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control password_input"
                      type="Password"
                      placeholder="Confirm Password"
                      name="confirm_password"
                      autocomplete="new-password"
                      onChange={e => this.handleChange(e, "confirm_password")}
                      value={confirm_password}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn login_btn "
                    // onClick={e => this.registerHandler(e)}
                  >
                    Next
                  </button>
                </div>
                <div className="account_text">
                  <p>
                    Already have an account with us?{" "}
                    <Link to="/login">Sign In</Link> here
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
    //   resend_response: store.login.resend_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //   resendOtp: params => dispatch(resendOtp(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmPassword);
