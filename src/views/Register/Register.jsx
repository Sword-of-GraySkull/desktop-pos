import React, { Component } from "react";
import { connect } from "react-redux";
import { registerUser, getOtp, getStoreList } from "../../actions/login";
import { Link } from "react-router-dom";
import { toaster } from "../../helper/Toaster";

import FirstRegister from "./FirstRegister";
import SecondRegister from "./SecondRegister";
import ThirdRegister from "./ThirdRegister";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      name: "",
      password: "",
      otp: "",
      business_list: [],
      search_business_list: [],
      selected_business: "",
      search_keyword: "",
      business_name: "",
      tab: 1
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
    let reg = /^[0-9]{0,10}$/;
    if (name === "mobile" && reg.test(e.target.value) === false) {
      return;
    } else if (
      name === "otp" &&
      /^[0-9]{0,6}$/.test(e.target.value) === false
    ) {
      return;
    } else if (name === "search_keyword") {
      let data1 = [];
      this.state.business_list.map(data => {
        if (data.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          data1.push(data);
        }
      });
      this.setState({ search_business_list: data1 });
    }

    this.setState({ [name]: e.target.value });
  };

  handleOtp = () => {
    const { mobile, name, password } = this.state;
    if (mobile === "" && name === "" && password === "") {
      toaster("error", "Please fill all the fields.");
    } else if (mobile === "") {
      toaster("error", "Please enter the mobile number.");
    } else if (name === "") {
      toaster("error", "Please enter the Name.");
    } else if (password === "") {
      toaster("error", "Please enter the password.");
    } else if (mobile !== "" && !/^[0-9]{10}$/.test(mobile)) {
      toaster("error", "Mobile number must be of 10 digits");
    } else if (password !== "" && !/^[a-zA-Z0-9]{4,}$/.test(password)) {
      toaster("error", "Password must be of atleast 4 digits");
    } else {
      this.props.getOtp(mobile);
    }
  };
  registerHandler = e => {
    e.preventDefault();
    const { mobile, name, password } = this.state;

    if (name !== "" && password !== "" && mobile !== "") {
      // if (
      //   email !== "" &&
      //   !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      // ) {
      //   toaster("error", "Email ID is not valid");
      //   return;
      // }
      var formData = new FormData();
      // formData.append("name", name);
      // formData.append("phone_number", mobile);
      // formData.append("business_name", bussinessname);
      // formData.append("timezone", timezone);
      // formData.append("business_type", bussinesstype);
      // formData.append("currency", currency);
      // formData.append("tax_setting", taxsetting);
      // formData.append("email", email);

      // this.props.registerUser(formData);
    } else {
      toaster("error", "Please fill all fields");
    }
  };

  changeTab = () => {
    this.setState({ tab: 1, mobile: "", name: "", password: "" });
  };

  resentCode = () => {
    this.props.getOtp(this.state.mobile);
  };
  getList = () => {
    this.props.getStoreList();
  };

  setName = () => {
    this.setState({ tab: 4 });
  };

  goToLogin = () => {
    this.props.history.push("/");
  };

  render() {
    const {
      mobile,
      name,
      password,
      otp,
      business_list,
      selected_business,
      search_business_list,
      search_keyword,
      business_name,
      tab
    } = this.state;
    return (
      <section className="login_wrap">
        <div className="clearfix">
          <div className="row no-gutters">
            <div className="col-md-6">
              <div className="login_left text-center">
                <Link to="#">
                  <img src="images/logo.jpeg" alt="Pogo 91" style={{height: '50px', weight: '50px'}} />
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
                 <FirstRegister state={this.state} handleChange={this.handleChange} handleOtp={this.handleOtp}/>
                )}
                {tab === 2 && (
                 <SecondRegister state={this.state} handleChange={this.handleChange} changeTab={this.changeTab} resentCode={this.resentCode} getList={this.getList}/>
                )}
                {tab === 3 && (
                  <ThirdRegister state={this.state} handleChange={this.handleChange} setName={this.setName}/>
                )}
                {tab === 4 && (
                  <div className="form_data">
                    <div className="form-group">
                      <input
                        className="form-control mobile_input"
                        type="text"
                        placeholder="Enter your Business Name"
                        name="business_name"
                        autocomplete="new-password"
                        onChange={e => this.handleChange(e, "business_name")}
                        value={business_name}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn login_btn "
                      onClick={e => this.registerHandler(e)}
                    >
                      Next
                    </button>
                  </div>
                )}
                <div className="account_text">
                  <p>
                    Already have an account with us?{" "}
                    <Link to="#" onClick={e => this.goToLogin(e)}>
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
    register_response: store.login.register_response,
    otp_response: store.login.otp_response,
    store_list: store.login.store_list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registerUser: params => dispatch(registerUser(params)),
    getOtp: params => dispatch(getOtp(params)),
    getStoreList: () => dispatch(getStoreList())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
