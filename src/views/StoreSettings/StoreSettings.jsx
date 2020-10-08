import React, { Component } from "react";
import database from "../../database";
import { connect } from "react-redux";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { API_URL } from "../../config";
import {
  editStoreSettings,
  storeSettings,
  cityApi,
  uploadStoreImage
} from "../../actions/settings";
import { Link } from "react-router-dom";
let edit_settings_flag = false;
let edit_store_settings_flag = false;
export class StoreSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state_data: [],
      city_data: [],
      store_data: "",
      image: "",
      email: "",
      store_name: "",
      gst_number: "",
      phone_number: "",
      registered_phone_number: "",
      address: "",
      state: "",
      city: "",
      pin_code: "",
      remarks: "",
      delivery_charges: "",
      show_images: "",
      loaderVisible: false,
      db: new database()
    };
  }
  async componentDidMount() {
    const res1 = await this.state.db.getStoreSettings();
    if (res1 && res1.status === 200) {
      this.setState({
        store_data: res1.store_settings,
        image: res1.store_settings.logo_url,
        email:
          res1.store_settings.email !== "null" ? res1.store_settings.email : "",
        store_name: res1.store_settings.business_name,
        gst_number: res1.store_settings.gst  !== null
        ? res1.store_settings.gst 
        : "",
        phone_number: res1.store_settings.phone_no_to_show_invoice,
        registered_phone_number: res1.store_settings.phone_number,
        address:
          res1.store_settings.address !== "null"
            ? res1.store_settings.address
            : "",
        state: res1.store_settings.state !== null ? res1.store_settings.state : '',
        city:
          res1.store_settings.city_name !== null
            ? res1.store_settings.city_name
            : "",
        pin_code:
          res1.store_settings.pin_code !== null
            ? res1.store_settings.pin_code
            : "",
        remarks: res1.store_settings.remarks,
        delivery_charges: res1.store_settings.delivery_charges,
        show_images: res1.store_settings.show_images
      });
    }
    let res = await this.state.db.getState();
    if (res && res.status === 200) {
      this.setState({
        state_data: res.state_data
      });
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const {
      edit_store_settings,
      store_settings,
      city_list,
      image_response
    } = newProps;
    if (edit_store_settings.code === 200 && edit_settings_flag) {
      let data = localStorage.getItem("store");
      let params = {
        store_id: data
      };
      edit_settings_flag = false;
      edit_store_settings_flag = true;
      await this.props.storeSettings(params);
    }

    if (image_response.code === 200) {
      this.setState({
        image: image_response.products
      });
    } else if (image_response.code === 400) {
      toaster("error", image_response.message);
    }
    if (store_settings.code === 200 && edit_store_settings_flag) {
      let res = await this.state.db.getStoreSettings();
      let doc = {
        _id: "storeSettings",
        status: 200,
        _rev: res._rev,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_settings: store_settings.store
      };
      await this.state.db.updateDatabaseProducts(doc);
      this.setState({ loaderVisible: false });
      toaster("success", edit_store_settings.message);
      edit_store_settings_flag = false;
      // used to update image on sidebar
      this.props.history.push("/settings/store-details");
    }

    if (city_list.code === 200) {
      this.setState({ city_data: city_list.city });
    }
  }

  handleImageChange = e => {
    // provide temporary url for the uploaded images to preview it.
    var formData = new FormData();
    formData.append("logo", e.target.files[0]);
    this.props.uploadStoreImage(formData);
    // this.setState({ image: URL.createObjectURL(e.target.files[0]),  });
  };

  handleChange = (e, name) => {
    if (
      name === "phone_number" &&
      /^[0-9]{0,10}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "email" &&
      /^[0-9A-Za-z@_.-]{0,100}$/.test(e.target.value) === false
    ) {
      return;
    }else if (
      name === "pin_code" &&
      /^[0-9]{0,6}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "store_name" &&
      /^[a-zA-Z _,0-9-]{0,100}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "gst_number" &&
      /^[0-9A-za-z]{0,15}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "address" &&
      /^[a-zA-Z _,0-9-]{0,50}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "city" &&
      /^[a-zA-Z _,0-9-]{0,30}$/.test(e.target.value) === false
    ) {
      return;
    }
    let value = e.target.value;
    if (name === "gst_number") {
      value = e.target.value.toUpperCase();
    }
    // if (name === "state") {
    //   this.props.cityApi(e.target.value);
    // }
    this.setState({ [name]: value });
  };

  handleResponse = () => {
    const {
      email,
      store_name,
      gst_number,
      address,
      state,
      city,
      pin_code,
      remarks,
      delivery_charges,
      show_images,
      phone_number
    } = this.state;
    if (email !== "" && !email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
      toaster("error", "Email ID is not valid");
      return;
    }
    if (gst_number !== "" && !gst_number.match(/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/)) {
      return toaster("error", "Please enter valid GST number");
    }
    var formData = new FormData();
    formData.append("store_id", localStorage.getItem("store"));
    // formData.append("business_type", JSON.stringify(store_data.business_type));
    formData.append("business_name", store_name);
    formData.append("email", email);
    formData.append("address", address);
    formData.append("phone_no_to_show_invoice", phone_number);
    formData.append("gst", gst_number);
    // formData.append("pan_card", "");
    formData.append("city_name", city);
    formData.append("state_id", state);
    formData.append("country_id", "");
    formData.append("authorized_signatory_name", "");
    formData.append("authorized_signatory_pan", "");
    formData.append("pin_code", pin_code);
    formData.append("remarks", remarks);
    formData.append("delivery_charges", delivery_charges);
    formData.append("show_images", show_images);
    // formData.append("offline", 0);
    // formData.append("track_inventory", 1);
    // formData.append("show_images", 1);
    // formData.append("local_sms", 0);
    // formData.append("currency_id", 1);
    // formData.append("timezone", 0);
    // formData.append("tax_setting", 0);
    // formData.append("is_active", 0);
    if (navigator.onLine) {
      this.props.editStoreSettings(formData);
      this.setState({ loaderVisible: true });
      edit_settings_flag = true;
    } else {
      toaster("warning", "Please connect to internet to update Store Settings");
    }
  };

  render() {
    const {
      email,
      store_name,
      gst_number,
      phone_number,
      registered_phone_number,
      address,
      state,
      city,
      pin_code,
      state_data,
      // city_data,
      image,
      loaderVisible
    } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <LoaderFunc visible={loaderVisible} />
        <div className="heading">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/settings">Settings</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Store Details
              </li>
            </ol>
          </nav>
          {/* <h3>Store Details</h3> */}
        </div>
        <div className="col-12 d-flex mt-auto">
          <div className="col-6">
            <div className="row">
              <div className="col border-right">
                <div className="form-group">
                  <label htmlFor="email">Register Phone Number</label>
                  <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    name={registered_phone_number}
                    value={registered_phone_number}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    autoComplete="off"
                    className="form-control"
                    placeholder="Enter email address"
                    id="email"
                    name={email}
                    value={email}
                    onChange={e => this.handleChange(e, "email")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="storeName">
                    Store Display Name / Legal Name
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter store's legal name"
                    className="form-control"
                    id="storeName"
                    name={store_name}
                    value={store_name}
                    onChange={e => this.handleChange(e, "store_name")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gstNumber">GST Number</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter GST number"
                    className="form-control"
                    id="gstNumber"
                    name={gst_number}
                    value={gst_number}
                    onChange={e => this.handleChange(e, "gst_number")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Phone Number to show on Invoice
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter phone number to show on Invoice"
                    className="form-control"
                    id="phoneNumber"
                    name={phone_number}
                    value={phone_number}
                    onChange={e => this.handleChange(e, "phone_number")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="storeAddress1">Store Address</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter your store address"
                    className="form-control"
                    id="storeAddress1"
                    name={address}
                    value={address}
                    onChange={e => this.handleChange(e, "address")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stState">State</label>
                  <select
                    className="custom-select"
                    name={state}
                    value={state}
                    onChange={e => this.handleChange(e, "state")}
                  >
                    {state === "" && (
                      <option value="">Select your state</option>
                    )}
                    {state_data.map((option, key) => (
                      <option value={option.id} key={key}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stCity">City</label>
                  {/* <select
                className="custom-select"
                name={city}
                value={city}
                onChange={e => this.handleChange(e, "city")}
              >
                {city_data.map((option, key) => (
                  <option value={option.id} key={key}>
                    {option.name}
                  </option>
                ))}
              </select> */}

                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter city name"
                    className="form-control"
                    id="stCity"
                    name={city}
                    value={city}
                    onChange={e => this.handleChange(e, "city")}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stPin">Pincode</label>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Enter PIN code"
                    className="form-control"
                    id="stPin"
                    name={pin_code}
                    value={pin_code}
                    onChange={e => this.handleChange(e, "pin_code")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="row ">
              <div className="col-12">
                <div className="img-upload pt-2">
                  <label>
                    {image ? (
                      <img src={image} alt="" />
                    ) : (
                      <img
                        src="/images/product.svg"
                        alt=""
                      />
                    )}

                    <input
                      type="file"
                      name=""
                      value=""
                      onChange={e => this.handleImageChange(e, "image")}
                      accept="image/*"
                    />
                  </label>
                  <p className="w-100">Upload Logo</p>
                </div>
                <p className="text-center">
                  <strong>Register Phone Number</strong>
                  <br />
                  {registered_phone_number}
                </p>
              </div>
              <div className="col-12 d-flex justify-content-center mt-auto">
                <input
                  type="button"
                  className="btn add_btn mb-3"
                  value="Save"
                  onClick={e => this.handleResponse(e)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    edit_store_settings: store.settings.edit_store_settings,
    store_settings: store.settings.store_settings,
    city_list: store.settings.city_list,
    image_response: store.settings.image_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editStoreSettings: params => dispatch(editStoreSettings(params)),
    storeSettings: params => dispatch(storeSettings(params)),
    cityApi: params => dispatch(cityApi(params)),
    uploadStoreImage: params => dispatch(uploadStoreImage(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreSettings);
