import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import database from "../../database";
import moment from "moment";
import { ModalPopup } from "../../helper/ModalPopup";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { toaster } from "../../helper/Toaster";
import { addCustomer, updateCustomer, customers } from "../../actions/settings";
let customer_add_flag = false;
export class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      add_edit_flag: 0,
      customer_list: [],
      original_customer_list: [],
      customer_flag: false,
      customer_id: "",
      customer_number: "",
      add_customer_name: "",
      add_customer_email: "",
      add_customer_gst: "",
      add_customer_address: "",
      add_customer_state: "",
      add_customer_city: "",
      add_customer_pin_code: "",
      add_customer_promotion: true,
      loaderVisible: false,
      state_data: [],
      db: new database()
    };
  }
  async UNSAFE_componentWillMount() {
    const res = await this.state.db.getDatabaseCustomers();

    if (res && res.status === 200) {
      let customer_list = res.customers_list.customer;
      this.setState({
        customer_list: customer_list,
        original_customer_list: customer_list
      });
    }
    let res1 = await this.state.db.getState();
    if (res1 && res1.status === 200) {
      this.setState({
        state_data: res1.state_data
      });
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const {
      customer_response,
      edit_customer_response,
      customers_list
    } = newProps;
    if (customer_response.code === 200 && customer_add_flag) {
      toaster("success", customer_response.message);

      this.modalClose();
      this.props.customers(localStorage.getItem("store"));
      this.setState({
        search_keyword: ""
      });
      customer_add_flag = false;
      
    } else if (customer_response.code === 400 && customer_add_flag) {
      toaster("error", customer_response.message);
      customer_add_flag = false;
      this.setState({ loaderVisible: false });
    }

    if (edit_customer_response.code === 200 && customer_add_flag) {
      toaster("success", edit_customer_response.message);

      this.modalClose();
      this.props.customers(localStorage.getItem("store"));
      this.setState({
        search_keyword: ""
      });
      customer_add_flag = false;
    } else if (edit_customer_response.code === 400 && customer_add_flag) {
      toaster("error", edit_customer_response.message);
      customer_add_flag = false;
      this.setState({ loaderVisible: false });
    }

    if (customers_list.code === 200) {
      const res1 = await this.state.db.getDatabaseCustomers();
      if (res1 && res1.status === 200) {
        let doc = {
          _id: "customerList",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          _rev: res1._rev,
          customers_list: customers_list
        };
        const res2 = await this.state.db.updateDatabaseProducts(doc);
        if (res2 && res2.ok) {
          const res3 = await this.state.db.getDatabaseCustomers();

          if (res3 && res3.status === 200) {
            let customer_list = res3.customers_list.customer;

            this.setState({
              customer_list: customer_list,
              original_customer_list: customer_list
            });
            this.setState({ loaderVisible: false });
          }
        }
      }
    }
  }

  openCustomer = () => {
    this.setState({
      add_edit_flag: 1,
      customer_flag: true,
      customer_add_flag: false
    });
  };
  openEditCustomer = (e, data) => {
    this.setState({
      add_edit_flag: 2,
      customer_flag: true,
      customer_id: data.customer.customer_id,
      customer_number:
        data.customer.phone_number && data.customer.phone_number.toString(),
      add_customer_name: data.display_first_name,
      add_customer_email: data.customer.email,
      add_customer_gst: data.gst_number,
      add_customer_address: data.customer.address,
      add_customer_state: data.customer.state,
      add_customer_city: data.customer.city,
      add_customer_pin_code:
        data.customer.pin_code !== 0 ? data.customer.pin_code.toString() : "",
      add_customer_promotion: data.allow_promotions
    });
  };

  handleCustomerChange = (e, name) => {
    let reg = /^((?!(0))[0-9]{0,10})$/;
    if (name === "customer_number" && reg.test(e.target.value) === false) {
      return;
    } else if (name === "add_customer_name" && e.target.value.length > 20) {
      return;
    } else if (
      name === "add_customer_email" &&
      /^[0-9A-Za-z@_.-]{0,100}$/.test(e.target.value) === false
    ) {
      return;
    }else if (
      name === "add_customer_pin_code" &&
      /^[0-9]{0,6}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_gst" &&
      /^[0-9A-Za-z]{0,15}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_address" &&
      /^[a-zA-Z _,0-9-]{0,50}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_city" &&
      /^[a-zA-Z _,0-9-]{0,30}$/.test(e.target.value) === false
    ) {
      return;
    }
    let value = e.target.value;
    if (name === "add_customer_gst") {
      value = e.target.value.toUpperCase();
    }
    this.setState({ [name]: value });
  };

  handleCustomerClick = (e, name) => {
    // json.parse is used here to convert string value of e.target.value to boolean
    let value = JSON.parse(e.target.value);
    this.setState({ [name]: !value });
  };

  modalClose = () => {
    this.setState({
      add_edit_flag: 0,
      customer_flag: false,
      customer_id: "",
      customer_number: "",
      add_customer_name: "",
      add_customer_email: "",
      add_customer_gst: "",
      add_customer_address: "",
      add_customer_state: "",
      add_customer_city: "",
      add_customer_pin_code: "",
      add_customer_promotion: true
    });
  };

  addCustomerFunc = () => {
    const {
      customer_id,
      add_customer_name,
      customer_number,
      add_customer_email,
      add_customer_gst,
      add_customer_address,
      add_customer_state,
      add_customer_city,
      add_customer_pin_code,
      add_customer_promotion,
      add_edit_flag
    } = this.state;
    var formData = new FormData();
    if (customer_number !== "") {
      if (
        add_customer_email !== "" &&
        !add_customer_email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      ) {
        toaster("error", "Email ID is not valid");
        return;
      }
      if (customer_number !== "" && !customer_number.match(/^[0-9]{10,}$/)) {
        toaster("error", "Mobile number must contain 10 digits.");
        return;
      }
      if (
        add_customer_pin_code !== "" &&
        !add_customer_pin_code.match(/^[0-9]{6,}$/)
      ) {
        toaster("error", "Pin code must be of 6 digits.");
        return;
      }
      if (
        (add_customer_gst !== "" && add_customer_gst !== null) &&
        !add_customer_gst.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)
      ) {
        toaster("error", "Please enter valid GST number");
        return;
      }
      if (navigator.onLine) {
        if (add_edit_flag === 1) {
          formData.append("store_id", localStorage.getItem("store"));
        } else if (add_edit_flag === 2) {
          formData.append("customer_id", customer_id);
        }
        formData.append("full_name", add_customer_name);
        formData.append("phone_number", customer_number);
        formData.append("email", add_customer_email);
        formData.append("gst_number", add_customer_gst);
        formData.append("address", add_customer_address);
        formData.append("state", add_customer_state);
        formData.append("city", add_customer_city);
        formData.append("pin_code", add_customer_pin_code ? add_customer_pin_code : 0);
        formData.append("allow_promotions", add_customer_promotion ? 1 : 0);
        if (add_edit_flag === 1) {
          this.props.addCustomer(formData);
        } else if (add_edit_flag === 2) {
          this.props.updateCustomer(formData);
        }
        customer_add_flag = true;
        this.setState({ loaderVisible: true });
      } else {
        toaster(
          "warning",
          "Please connect to internet to complete this action"
        );
      }
    } else {
      toaster("error", "Please fill phone number.");
    }
  };

  handleChange = (e, name) => {
    const { original_customer_list } = this.state;
    let customerList = this.state.customer_list;
    if (
      name === "search_keyword" &&
      (e.target.value.length > 2 || e.target.value.length === 0)
    ) {
      customerList = original_customer_list.filter(
        t =>
          t.customer.email
            .toLowerCase()
            .startsWith(e.target.value.toLowerCase()) ||
          t.customer.phone_number
            .toString()
            .startsWith(e.target.value.toLowerCase())
      );
    }
    this.setState({ [name]: e.target.value, customer_list: customerList });
  };
  clearSearch = () => {
    const { original_customer_list } = this.state;
    this.setState({
      customer_list: original_customer_list,
      search_keyword: ""
    });
  };

  render() {
    const {
      customer_list,
      customer_flag,
      customer_number,
      add_customer_name,
      add_customer_address,
      add_customer_city,
      add_customer_email,
      add_customer_gst,
      add_customer_pin_code,
      add_customer_promotion,
      add_customer_state,
      state_data,
      add_edit_flag,
      loaderVisible,
      search_keyword
    } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <LoaderFunc visible={loaderVisible} />
        <div className="d-flex justify-content-between ">
          <h3>Customers</h3>

          <div className="d-flex justify-content-center h-100 top-right">
            <div className="searchbar">
              <input
                className="search_input"
                type="text"
                autoComplete="off"
                placeholder="Enter email or phone number"
                name="search_keyword"
                value={search_keyword}
                onChange={e => this.handleChange(e, "search_keyword")}
                // onKeyPress={this.onKeyPress}
              />

              <Link
                to="#"
                className="search_icon"
                onClick={e => this.clearSearch(e)}
              >
                <i
                  // className="fa fa-search"
                  className="fa fa-times"
                ></i>
              </Link>
            </div>
            <Link
              to="#"
              className="add_btn btn"
              onClick={() => this.openCustomer()}
            >
              <i className="fa fa-plus  mr-1" aria-hidden="true" />
              ADD
            </Link>
          </div>
        </div>
        {customer_list.length !== 0 ? (
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customer_list.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{data.display_first_name}</td>
                    <td>{data.customer.phone_number}</td>
                    <td>{data.customer.email}</td>
                    <td>
                      <i
                        className="fa fa-pencil-square-o"
                        aria-hidden="true"
                        onClick={e => this.openEditCustomer(e, data)}
                      ></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no_data_found">
            <h3>No Customer Found</h3>
          </div>
        )}
        {customer_flag && (
          <ModalPopup
            className="customer-flag prd_model_box"
            popupOpen={customer_flag}
            popupHide={this.modalClose}
            title={add_edit_flag === 1 ? "Add Customer" : "Edit Customer"}
            content={
              <div className="w-100">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Phone Number*</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="number_input"
                      placeholder="e.g: 1234567890"
                      name="customer_number"
                      value={customer_number}
                      onChange={e =>
                        this.handleCustomerChange(e, "customer_number")
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Full Name</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="name_input"
                      placeholder="e.g: John"
                      name="add_customer_name"
                      value={add_customer_name}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_name")
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Email Address</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="email_input"
                      placeholder="e.g: test@gmail.com"
                      name="add_customer_email"
                      value={add_customer_email}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_email")
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Gst Number</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="gst_input"
                      placeholder="e.g: ABC1234"
                      name="add_customer_gst"
                      value={add_customer_gst ? add_customer_gst : ''}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_gst")
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Address</label>
                    <input
                      type="textarea"
                      className="address_input"
                      placeholder="Enter Address"
                      name="add_customer_address"
                      value={add_customer_address}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_address")
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> State</label>
                    <select
                      className="custom-select"
                      value={add_customer_state}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_state")
                      }
                    >
                      {add_customer_state === '' &&<option value="">Select your state</option>}
                      {state_data.map((option, key) => (
                        <option value={option.name} key={key}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> City </label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="city_input"
                      name="add_customer_city"
                      placeholder="Enter City"
                      value={add_customer_city}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_city")
                      }
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="custom-lab"> Pin Code</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="pin_code_input"
                      name="add_customer_pin_code"
                      placeholder="Enter Pin Code"
                      value={add_customer_pin_code}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_pin_code")
                      }
                    />
                  </div>
                </div>

                {/* <label className="custom-lab"> Gender</label>
<div className="gender active">
  <label>
    <input
    type="radio"
    name="add_customer_gender"
    value="male"
    checked={add_customer_gender === "male"}
    onChange={e =>
    this.handleCustomerChange(e, "add_customer_gender")
  }
  />
  <span>Male</span>
</label>
<label>
  <input
  type="radio"
  name="add_customer_gender"
  value="female"
  checked={add_customer_gender === "female"}
  onChange={e =>
  this.handleCustomerChange(e, "add_customer_gender")
}
/>
<span>Female</span>
</label>
</div> */}

                <div className="row align-items-center">
                  <div className="col-12 col-md-9">
                    <div className="custom-control custom-checkbox subbutton mb-0">
                      <input
                        type="checkbox"
                        checked={add_customer_promotion}
                        value={add_customer_promotion}
                        onChange={e =>
                          this.handleCustomerClick(e, "add_customer_promotion")
                        }
                        className="custom-control-input"
                        id="promotion"
                      />
                      <label
                        className="custom-control-label control-active"
                        htmlFor="promotion"
                      >
                        Send Promotions{" "}
                      </label>
                    </div>
                    <span className="text-sm">
                      If disabled, you won't be able to send promotions to
                      customer
                    </span>
                  </div>
                  <div className="col-12 col-md-3 ">
                    <div className="submit-wrap d-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn add_btn"
                        onClick={e => this.addCustomerFunc(e)}
                      >
                        submit
                      </button>
                    </div>
                  </div>
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
    customer_response: store.settings.customer_response,
    edit_customer_response: store.settings.edit_customer_response,
    customers_list: store.settings.customers_list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addCustomer: params => dispatch(addCustomer(params)),
    updateCustomer: params => dispatch(updateCustomer(params)),
    customers: params => dispatch(customers(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
