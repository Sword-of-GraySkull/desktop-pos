import React, { Component } from "react";
import { connect } from "react-redux";
import Otp from "./Otp";
import Register from "./Register";
import BusinessList from "./BusinessList";
import ProductList from "./ProductList";
import AddPro from "./AddPro";
import {
  newLoginOtp,
  newConfirmLoginOtp,
  getStoreList,
  registerUser,
  regiCategory,
  categoryProduct,
  allCategoryProduct,
  AddRegisterProduct
} from "../../../actions/login";
import {
  getTax
} from "../../../actions/products";
import { toaster } from "../../../helper/Toaster";
import { Link } from "react-router-dom";
import database from "../../../database";
import Geocode from "react-geocode";
import * as _ from "lodash";
Geocode.setApiKey("AIzaSyDURY1Pw5y-NxzrbNzp98hD_h0WWoKN8sI");
let LoginFlag = false;
let OtpFlag = false;
let RegisterFlag = false;
let StoreFlag = false;
let CategoryFlag = false;
let ProductFlag = false;
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: new database(),
      mobile: "",
      otp: "",
      tab: 1,
      name: "",
      business_name: "",
      referral_code: "",
      business_list: [],
      search_business_list: [],
      selected_business_name: "",
      selected_business: "",
      search_keyword: "",
      loader1: false,
      loader2: false,
      state_name: '',
      city_name: '',
      product_flag: false,
      selected_type: '',
      product_type_data: [],
      product_data: [],
      checked_data: [],
      varient_data: [],
      selected_data: [],
      tax_data: [],
      store_id: ''
    };
  }
  UNSAFE_componentWillMount() {
    CategoryFlag = true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
          response => {
            const address = response.results[0].formatted_address;
            let add_arr = address.split(',')
            let city_name = add_arr[add_arr.length - 4]
            let state_name = add_arr[add_arr.length - 3]
            this.setState({ city_name, state_name })
          },
          error => {
            toaster("error", error);
          }
        )
      });
    } else {
      toaster("error", "Geolocation is not supported by this browser!");
    }
  }

  async UNSAFE_componentWillReceiveProps(newProps) {
    const {
      login_response,
      otp_response,
      store_list,
      register_response,
      category_data,
      category_product_data,
      tax_data,
      register_product_response
    } = newProps;
    if (
      login_response.code === 301 &&
      LoginFlag
    ) {
      if (this.state.tab !== 1) {
        toaster("success", login_response.message);
      }
      this.setState({ tab: 2, loader1: false });
      LoginFlag = false;
    } else if (
      login_response.code === 201 &&
      LoginFlag
    ) {
      toaster("error", login_response.message);
      this.setState({ loader1:false });
      // this.setState({ loader1: false, tab: 3 });
      LoginFlag = false;
    } else if (login_response.code === 400 || login_response.code === 500) {
      toaster("error", login_response.message);
      this.setState({ loader1: false });
    }

    if (otp_response && otp_response.code === 200 && OtpFlag) {
      let params = {
        token: otp_response.token,
        Login: "success",
        store: otp_response.store_id,
        logged_user: otp_response.name,
        logged_user_id: otp_response.user_id,
        store_legal_name: otp_response.store_legal_name
      };
      localStorage.setItem("token", otp_response.token);
      localStorage.setItem("Login", otp_response.Login);
      localStorage.setItem("store", otp_response.store);
      localStorage.setItem("logged_user", otp_response.logged_user);
      localStorage.setItem("logged_user_id", otp_response.logged_user_id);
      localStorage.setItem("store_legal_name", otp_response.store_legal_name);

      let doc = {
        _id: "loginDetails",
        status: 200,
        loginDetails: params
      };
      this.setState({ loader2: false })
      await this.state.db.addDatabase(doc);
      window.location.href = "/billing";
      OtpFlag = false;
    } else if (otp_response && otp_response.code === 500 && OtpFlag) {
      if (login_response && login_response.code === 301) {
        toaster("error", otp_response.message);
      } else if (login_response && login_response.code === 201) {
        // this.setState({ tab: 3 });
        toaster("error", "User doesn't exist.");
      }
      OtpFlag = false;
      this.setState({ loader2: false })
    } else if (otp_response && otp_response.code === 400 && OtpFlag) {
      toaster("error", otp_response.message);
      OtpFlag = false;
      this.setState({ loader2: false })
    }
    if (store_list && store_list.code === 200 && StoreFlag) {
      this.setState({
        business_list: store_list.business_type,
        search_business_list: store_list.business_type,
        tab: 4
      });
      StoreFlag = false
    } else if (store_list && store_list.code === 400 && StoreFlag) {
      toaster("error", store_list.message);
      StoreFlag = false
    }
    if (register_response && register_response.code === 200 && RegisterFlag) {
      let params = {
        token: register_response.token,
        Login: "success",
        store: register_response.store_id,
        logged_user: register_response.name,
        logged_user_id: register_response.user_id,
        store_legal_name: register_response.store_legal_name
      };

      localStorage.setItem("token", register_response.token);
      localStorage.setItem("Login", register_response.Login);
      localStorage.setItem("store", register_response.store);
      localStorage.setItem("logged_user", register_response.logged_user);
      localStorage.setItem("logged_user_id", register_response.logged_user_id);
      localStorage.setItem("store_legal_name", register_response.store_legal_name);

      let doc = {
        _id: "loginDetails",
        status: 200,
        loginDetails: params
      };
      this.setState({ loader2: false, store_id: register_response.store_id })
      await this.state.db.addDatabase(doc);
      if (this.state.product_flag) {
        this.setState({ tab: 5 })
        this.props.regiCategory(this.state.selected_business);
        let params = {
          store_id: register_response.store_id,
          page: 1
        }
        this.props.allCategoryProduct(params)
        CategoryFlag = true
      } else {
        window.location.href = "/billing";
      }

      RegisterFlag = false;
    } else if (
      register_response &&
      register_response.code === 400 &&
      RegisterFlag
    ) {
      toaster("error", register_response.message);
      RegisterFlag = false;
    }
    if (register_product_response && register_product_response.code === 200 && ProductFlag) {
      window.location.href = "/billing";
      ProductFlag = false;
    } else if (
      register_product_response &&
      register_product_response.code === 400 &&
      ProductFlag
    ) {
      toaster("error", register_product_response.message);
      ProductFlag = false;
    }

    if (category_data && category_data.code === 200 && CategoryFlag) {
      this.setState({ product_type_data: category_data.category })
      this.props.getTax();
      CategoryFlag = false;
    }
    if (category_product_data && category_product_data.code === 200) {
      let checked_data = [];
      let varient_data = [];
      category_product_data.products.map((data, index) => {
        varient_data[data.id] =
          data.variant[0] && data.variant[0].variant_id;
        return data.variant && data.variant.map((variant_data, inner_index) => {
          checked_data[data.id] = [];
          checked_data[data.id][variant_data.variant_id] = false;
          return null;
        });
      });
      this.setState({ product_data: category_product_data.products, checked_data, varient_data })
    }
    if (tax_data && tax_data.code === 200) {
      this.setState({ tax_data: tax_data.tax })
    }
  }
  changeVariant = (e, selected_product_id, selected_variant_data) => {
    let varient_data = this.state.varient_data;
    varient_data[selected_product_id] = selected_variant_data.variant_id;

    this.setState({
      varient_data: varient_data
    });
  };

  handleChange = (e, name, data, variant) => {
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
        return (
          data.name.toLowerCase().includes(e.target.value.toLowerCase()) &&
          data1.push(data)
        );
      });
      this.setState({ search_business_list: data1 });
    } else if (name === "selected_business") {
      this.setState({ tab: 3, selected_business_name: data });
    } else if (name === 'product_flag') {
      this.setState({ product_flag: !this.state.product_flag });
      return;
    } else if (name === 'selected_type') {
      this.setState({ selected_type: data.id });
      let params = {
        cat_id: data.id,
        page: 1
      }
      this.props.categoryProduct(params)
      return;
    } else if (name === 'selected_type_all') {
      this.setState({ selected_type: 0 });
      let params = {
        store_id: this.state.store_id,
        page: 1
      }
      this.props.allCategoryProduct(params)
      return;
    } else if (name === 'checked_product') {
      const { product_data } = this.state;
      let checked_data = this.state.checked_data;
      let selected_data = [];
      checked_data[data][variant] = !this.state.checked_data[data][variant];
      product_data.map((pro_data, index) => {

        let p_data = _.cloneDeep(pro_data)
        p_data.variant = []
        pro_data.variant.map((item, index) => {
          if (checked_data[pro_data.id][item.variant_id]) {
            p_data.variant.push(item)
            let added = selected_data.find(pro => pro.id === pro_data.id)
            if (added === undefined) {
              selected_data.push(p_data);
            }
          }
          return null;
        })
        return null;
      }
      );
      this.setState({ checked_data, selected_data });
    }

    this.setState({ [name]: e.target.value });
  };

  handleDelete = (e, data, item) => {
    let selected_data = this.state.selected_data;
    let checked_data = this.state.checked_data;
    checked_data[data][item] = !this.state.checked_data[data][item];
    let current_pro = selected_data.find(pro => pro.id === data)
    if (current_pro !== undefined) {
      let find_index = current_pro.variant.findIndex(vari => vari.variant_id === item)
      if (find_index !== -1) {
        current_pro.variant.splice(find_index, 1);
      }
    }
    if (current_pro.variant.length === 0) {
      let index = selected_data.findIndex(pro => pro.id === data)
      selected_data.splice(index, 1);
    }
    if (selected_data.length === 0) {
      this.setState({ selected_data, tab: 5 })
    } else {
      this.setState({ selected_data })
    }
  }

  handleStockChange = (e, name, pro, vari) => {
    let selected_data = this.state.selected_data;
    if (
      name === "cost_price" ||
      name === "mrp" ||
      name === "selling_price" ||
      name === "stock"
    ) {
      let reg = /(^([0-9]{0,7})([0-9]{0}|[.][0-9]{0,3}))$/;
      if (!reg.test(e.target.value)) {
        return;
      }
    }
    let pro_index = selected_data.findIndex(
      x => x.id === pro
    );
    if (pro_index !== -1) {
      let var_index = selected_data[pro_index].variant.findIndex(
        x => x.variant_id === vari
      );
      if (name === "tax_id") {
        selected_data[pro_index].tax_id = e.target.value;
      } else if (name === "hsn") {
        selected_data[pro_index].hsn = e.target.value;
      }
      let value = e.target.value ? Number(e.target.value) : ''
      if (var_index !== -1) {
        if (name === "cost_price") {
          selected_data[pro_index].variant[var_index].cost_price = value;
        } else if (name === "mrp") {
          selected_data[pro_index].variant[var_index].mrp = value;
        } else if (name === "selling_price") {
          selected_data[pro_index].variant[var_index].selling_price = value;
        } else if (name === "stock") {
          selected_data[pro_index].variant[var_index].stock = value;
        }
      }
      this.setState({ selected_data })
    }


  }

  AddProduct = () => {
    const {
      selected_data,
      store_id
    } = this.state;

    selected_data.map((data, index) => {
      let cost = [];
      let selling = [];
      let mrp = [];
      let stock = [];

      data.variant.map((item) => {
        cost.push(item.cost_price)
        selling.push(item.selling_price)
        mrp.push(item.mrp)
        stock.push(item.stock)
        return null;
      })

      if (cost.includes("")) {
        return toaster("error", "Please fill cost price");
      } else if (selling.includes("")) {
        return toaster("error", "Please fill selling price");
      } else if (mrp.includes("")) {
        return toaster("error", "Please fill mrp");
      } else if (stock.includes("")) {
        return toaster("error", "Please fill new stock");
      }
      var formData = new FormData();
      formData.append("store_id", store_id);
      formData.append("send_low_stock_alerts", 1);
      formData.append("description", data.description);
      formData.append("tax", data.tax_id);
      formData.append("allow_discount", 1);
      formData.append("hsn_code", data.hsn);
      formData.append("product_name", data.name);
      formData.append("search_tag", data.search_keyword);
      formData.append("allow_below_zero", 1);
      formData.append("product_type", data.product_type);
      formData.append("publish_product", 1);
      formData.append("track_inventory", 1);
      formData.append("master_product_id", data.id);
      formData.append("price_change_at_billing", 1);
      formData.append("variant", JSON.stringify(data.variant));
      this.props.AddRegisterProduct(formData);
      if (index === (selected_data.length - 1)) {
        ProductFlag = true;
      }
      return null;
    })
  }


  onKeyPress = (e, name) => {
    if (name === "otp") {
      if (e.key === "Enter") {
        this.confirmOtp();
      }
    } else {
      if (e.key === "Enter") {
        this.loginHandler();
      }
    }
  };
  changeTab = (name) => {
    if (name === 'otp') {
      this.setState({ tab: 1, mobile: "", otp: "" });
    } else if (name === 'choose_business') {
      this.props.getStoreList();
      StoreFlag = true
    } else if (name === 'set_name') {
      this.setState({ tab: 2 });
    } else if (name === 'open_product') {
      this.setState({ tab: 6 });
    } else if (name === 'back_pro') {
      this.setState({ tab: 5 });
    }
  };

  resentCode = () => {
    var formData = new FormData();
    formData.append("phone_number", this.state.mobile);
    // let params={"phone_number": this.state.mobile}
    this.props.newLoginOtp(formData);
    LoginFlag = true
  };

  confirmOtp = e => {
    const { mobile, otp } = this.state;

    if (mobile !== "" && otp !== "") {
      let reg = /^[0-9]{10,}$/;
      if (reg.test(mobile) === false) {
        return;
      }
      let params = {
        mobile: mobile,
        otp: otp
      };
      this.props.newConfirmLoginOtp(params);
      this.setState({ loader2: true })
      OtpFlag = true;
    } else {
      toaster("error", "Please enter the OTP.");
    }
  };

  loginHandler = e => {
    const { mobile } = this.state;

    if (mobile !== "") {
      let reg = /^[0-9]{10}$/;
      if (reg.test(mobile) === false) {
        return toaster("error", "Mobile number must be of 10 digits.");
      }
      var formData = new FormData();
      formData.append("phone_number", mobile);
      // let params={"phone_number": mobile}
      this.props.newLoginOtp(formData);
      this.setState({ loader1: true })
      LoginFlag = true;
    } else {
      toaster("error", "Please enter the mobile number.");
    }
  };

  registerHandler = e => {
    e.preventDefault();
    const {
      name,
      mobile,
      business_name,
      selected_business,
      referral_code,
      city_name,
      state_name
    } = this.state;

    if (name !== "" && business_name !== "") {

      if (selected_business === "") {
        toaster("error", "Please select you business");
      }
      var formData = new FormData();
      formData.append("name", name);
      formData.append("phone_number", mobile);
      formData.append("business_name", business_name);
      formData.append("timezone", 12);
      formData.append("business_type", selected_business);
      formData.append("currency", 1);
      formData.append("tax_setting", 0);
      formData.append("email", 0);
      formData.append("referral_code", referral_code);
      formData.append("password", "pogo@2019");
      formData.append("city_name", city_name);
      formData.append("state_name", state_name);
      this.props.registerUser(formData);
      RegisterFlag = true;
    } else {
      toaster("error", "Please fill all fields");
    }
  };

  render() {
    const { tab, mobile, loader1 } = this.state;
    return (
      <section className="login_wrap">
        <div className="clearfix">
          <div className="row no-gutters">
            <div className="col-md-6">
              <div className="login_left text-center">
                <Link to="#">
                  <img
                    src="/logo.png"
                    alt="Pogo 91"
                    style={{ height: "50px", weight: "50px" }}
                  />
                </Link>
                <h2>
                  <span>
                    Make billing
                    <br />
                    convenient and faster
                  </span>
                  {/* Increase your sales,
                  <br />
                  Increase your revenue */}
                </h2>

                <div
                  id="myCarousel"
                  className="carousel slide"
                  data-ride="carousel"
                  data-interval="3000"
                >
                  <ol className="carousel-indicators">
                    <li
                      data-target="#myCarousel"
                      data-slide-to={0}
                      className="active"
                    />
                    <li data-target="#myCarousel" data-slide-to={1} />
                    <li data-target="#myCarousel" data-slide-to={2} />
                  </ol>

                  <div className="carousel-inner" role="listbox">
                    <div className="carousel-item active">
                      <img
                        src="images/ic_invoice_banner.svg"
                        alt="invoice"
                      // width={460}
                      // height={345}
                      />
                      <div className="carousel-caption">
                        <p>Create GST complaint invoices in seconds</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src="images/ic_launch_online_store.svg"
                        alt="launch website"
                      // width={460}
                      // height={345}
                      />
                      <div className="carousel-caption">
                        <p>Launch you own website in few clicks</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img
                        src="images/ic_promotions.svg"
                        alt="communication"
                      // width={460}
                      // height={345}
                      />
                      <div className="carousel-caption">
                        <p>Communicate better with your customers</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <h2>
                  <span>
                    Make billing
                    <br />
                    convenient and faster
                  </span>
                  Increase your sales,
                  <br />
                  Increase your revenue
                </h2> */}
              </div>
            </div>
            <div className="col-md-6">
              <div className="login_right text-center">
                {tab === 1 && (
                  <div className="form_data">
                    <div className="form-group">
                      <input
                        className="form-control mobile_input"
                        type="text"
                        autoFocus
                        placeholder="Mobile Number"
                        name="mobile"
                        autoComplete="off"
                        onChange={e => this.handleChange(e, "mobile")}
                        value={mobile}
                        onKeyPress={this.onKeyPress}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn login_btn"
                      onClick={e => this.loginHandler(e)}
                    >
                      Login
                      {loader1 &&
                        <i className="fa fa-spinner fa-pulse fa-spin  fa-fw"></i>
                      }
                    </button>
                  </div>
                )}

                {tab === 2 && (
                  <Otp
                    state={this.state}
                    handleChange={this.handleChange}
                    changeTab={this.changeTab}
                    resentCode={this.resentCode}
                    confirmOtp={this.confirmOtp}
                    onKeyPress={this.onKeyPress}
                  />
                )}

                {tab === 3 && (
                  <Register
                    state={this.state}
                    handleChange={this.handleChange}
                    registerHandler={this.registerHandler}
                    changeTab={this.changeTab}
                  />
                )}

                {tab === 4 && (
                  <BusinessList
                    state={this.state}
                    handleChange={this.handleChange}
                    changeTab={this.changeTab}
                  />
                )}

                {tab === 5 && (
                  <ProductList
                    state={this.state}
                    handleChange={this.handleChange}
                    changeTab={this.changeTab}
                    changeVariant={this.changeVariant}
                  />
                )}

                {tab === 6 && (
                  <AddPro
                    state={this.state}
                    handleChange={this.handleChange}
                    AddProduct={this.AddProduct}
                    changeTab={this.changeTab}
                    handleDelete={this.handleDelete}
                    handleStockChange={this.handleStockChange}
                  />
                )}

                <div className="account_text">
                  {/* <p>
                    Don’t have an account with us?{" "}
                    <Link to="/register">Sign up</Link> here
                  </p> */}
                  {(tab !== 3 && tab !== 4 && tab !== 5 && tab !== 6) && (<p>
                    By login, you agree with our{" "}
                    <Link to="/privacy-policy">Privacy Policy</Link> and,{" "}
                    <Link to="/terms">Terms & Conditions</Link>
                  </p>)}
                </div>
                <a
                  href="https://pogo91.page.link/pg"
                  target="_blank"
                  className="download_app mx-auto d-table"
                  rel="noopener noreferrer"
                >
                  <img src="images/g_btn.png" alt="Goggle Play" />
                </a>
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
    login_response: store.login.login_response,
    otp_response: store.login.otp_response,
    store_list: store.login.store_list,
    register_response: store.login.register_response,
    category_data: store.login.category_data,
    category_product_data: store.login.category_product_data,
    tax_data: store.products.tax_data,
    register_product_response: store.login.register_product_response

  };
};

const mapDispatchToProps = dispatch => {
  return {
    newLoginOtp: params => dispatch(newLoginOtp(params)),
    newConfirmLoginOtp: params => dispatch(newConfirmLoginOtp(params)),
    getStoreList: () => dispatch(getStoreList()),
    registerUser: params => dispatch(registerUser(params)),
    regiCategory: params => dispatch(regiCategory(params)),
    categoryProduct: params => dispatch(categoryProduct(params)),
    allCategoryProduct: params => dispatch(allCategoryProduct(params)),
    AddRegisterProduct: params => dispatch(AddRegisterProduct(params)),
    getTax: () => dispatch(getTax()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
