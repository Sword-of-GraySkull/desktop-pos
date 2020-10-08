import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/login";
import { toaster } from "../../helper/Toaster";
import { Link } from "react-router-dom";
import database from "../../database";
let LoginFlag = false;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: new database(),
      mobile: "",
      password: ""
    };
  }

  async UNSAFE_componentWillReceiveProps(newProps) {
    const { login_response } = newProps;
    if (login_response && login_response.code === 200 && LoginFlag) {
      // this.props.history.push("/billing");
      // window.location.href="/billing"
      // localStorage.setItem("token", login_response.token);
      //   localStorage.setItem("Login", "success");
      //   localStorage.setItem(
      //     "store",
      //     login_response.store_id
      //   );
      //   localStorage.setItem(
      //     "logged_user",
      //     login_response.name
      //   );
      //   localStorage.setItem(
      //     "logged_user_id",
      //     login_response.user_id
      //   );
      //   localStorage.setItem(
      //     "store_legal_name",
      //     login_response.store_legal_name
      //   );
        let params={
          token: login_response.token, 
          Login: "success",
          store: login_response.store_id,
          logged_user: login_response.name,
          logged_user_id: login_response.user_id,
          store_legal_name: login_response.store_legal_name
        }

        let doc = {
          _id: "loginDetails",
          status: 200,
          loginDetails: params
        };
        await this.state.db.addDatabase(doc);
        // this.props.history.push("/billing");
        window.location.href="/billing"
      // toaster("success", login_response.message);
      LoginFlag = false;
    } else if (login_response && login_response.code === 400) {
      toaster("error", login_response.message);
    }
  }

  handleChange = (e, name) => {
    let reg = /^[0-9]{0,10}$/;
    if (name === "mobile" && reg.test(e.target.value) === false) {
      return;
    }
    let regs = /^([a-zA-Z0-9@*#]{0,25})$/;
    if (name === "password" && regs.test(e.target.value) === false) {
      return;
    }
    this.setState({ [name]: e.target.value });
  };

  onKeyPress = e => {
    if (e.key === "Enter") {
      this.loginHandler();
    }
  };

  loginHandler = e => {
    const { mobile, password } = this.state;

    if (mobile !== "" && password !== "") {
      var formData = new FormData();
      formData.append("username", mobile);
      formData.append("password", password);

      this.props.loginUser(formData);
      LoginFlag = true;
    } else if (mobile === "" && password !== "") {
      toaster("error", "Please enter the mobile number.");
    } else if (mobile !== "" && password === "") {
      toaster("error", "Please enter the password.");
    } else {
      toaster("error", "Please fill all the fields.");
    }
  };

  render() {
    const { mobile, password } = this.state;
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
                      className="form-control mobile_input"
                      type="text"
                      placeholder="Mobile Number"
                      name="mobile"
                      autocomplete="new-password"
                      onChange={e => this.handleChange(e, "mobile")}
                      value={mobile}
                      onKeyPress={this.onKeyPress}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control password_input"
                      type="Password"
                      placeholder="Password"
                      name="password"
                      autocomplete="new-password"
                      onChange={e => this.handleChange(e, "password")}
                      value={password}
                      onKeyPress={this.onKeyPress}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn login_btn"
                    onClick={e => this.loginHandler(e)}
                    
                  >
                    Login
                  </button>
                  <Link to="/faq" className="forgot_link">
                    Need help?
                  </Link>
                  <Link to="/forgot-password" className="forgot_link">
                    Forgot Password?
                  </Link>
                </div>
                <div className="account_text">
                  <p>
                    Don’t have an account with us?{" "}
                    <Link
                      to="/register"
                    >
                      Sign up
                    </Link>{" "}
                    here
                  </p>
                  <p>
                    By login, you agree with our{" "}
                    <Link to="/privacy-policy">Privacy Policy</Link> and,{" "}
                    <Link to="/terms">Terms & Conditions</Link>
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
    login_response: store.login.login_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: params => dispatch(loginUser(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
