import React, { Component } from "react";
import database from "../../database";
import { connect } from "react-redux";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import { LoaderFunc } from "../../helper/LoaderFunc";
import {
  editInvoiceMethods,
  storeInvoiceType,
  editStoreSettings,
  storeSettings
} from "../../actions/settings";
import { Link } from "react-router-dom";
let edit_invoice_flag = false;
let store_invoice_flag = false;
let edit_settings_flag = false;
let edit_store_settings_flag = false;
export class BillingSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      business_type: "",
      remarks: false,
      delivery_charges: false,
      show_images: false,
      invoice: [],
      default_invoice: "",
      loaderVisible: false,
      db: new database()
    };
  }
  async componentDidMount() {
    const res = await this.state.db.getStoreSettings();
    if (res && res.status === 200) {
      this.setState({
        business_type: res.store_settings.business_type.name,
        remarks: res.store_settings.remarks,
        delivery_charges: res.store_settings.delivery_charges,
        show_images: res.store_settings.show_images
      });
    }
    let res1 = await this.state.db.getStoreInvoice();
    if (res1 && res1.status === 200) {
      if (res1.store_invoice && res1.store_invoice.code === 200) {
        let data = res1.store_invoice.store_invoice_types.find(
          data => data.is_default
        );
        this.setState({
          invoice: res1.store_invoice.store_invoice_types,
          default_invoice: data.master_id
        });
      }
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const {
      invoice_response,
      store_invoice,
      edit_store_settings,
      store_settings
    } = newProps;
    if (
      invoice_response &&
      invoice_response.code === 200 &&
      edit_invoice_flag
    ) {
      // toaster("success", invoice_response.message);
      edit_invoice_flag = false;
      store_invoice_flag = true;
      await this.props.storeInvoiceType(localStorage.getItem("store"));
    }
    if (store_invoice && store_invoice.code === 200 && store_invoice_flag) {
      let res = await this.state.db.getStoreInvoice();
      let doc = {
        _id: "storeInvoice",
        status: 200,
        _rev: res._rev,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_invoice: newProps.store_invoice
      };

      await this.state.db.updateDatabaseProducts(doc);
      toaster("success", edit_store_settings.message);
      this.setState({ loaderVisible: false });
      store_invoice_flag = false;
    }

    if (
      edit_store_settings &&
      edit_store_settings.code === 200 &&
      edit_settings_flag
    ) {
      let data = localStorage.getItem("store");
      let params = {
        store_id: data
      };
      edit_settings_flag = false;
      edit_store_settings_flag = true;
      await this.props.storeSettings(params);
      // toaster("success", edit_store_settings.message);
    }
    if (
      store_settings &&
      store_settings.code === 200 &&
      edit_store_settings_flag
    ) {
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
      toaster("success", 'Billing settings updated');
      this.setState({ loaderVisible: false });
      edit_store_settings_flag = false;
    }
  }

  handleChange = (e, name) => {
    if (name === "default_invoice") {
      let invoice = this.state.invoice;
      let index = invoice.findIndex(
        x => x.master_id === parseInt(e.target.value)
      );
      invoice[index].is_published = true;
      this.setState({ [name]: e.target.value, invoice });
    }
  };

  handleClick = (e, name, data) => {
    if (name === "invoice") {
      let invoice = this.state.invoice;
      let index = invoice.findIndex(x => x.master_id === data);
      if (
        invoice[index].master_id === parseInt(this.state.default_invoice) &&
        invoice[index].is_published
      ) {
        toaster(
          "error",
          "This is Default Set, Please remove default before disabling the invoice tpe"
        );
        return;
      }
      invoice[index].is_published = invoice[index].is_published ? false : true;
      this.setState({ invoice });
    } else if (name === "remarks") {
      this.setState({ remarks: !this.state.remarks });
    } else if (name === "delivery_charges") {
      this.setState({ delivery_charges: !this.state.delivery_charges });
    } else if (name === "show_images") {
      this.setState({ show_images: !this.state.show_images });
    }
  };

  submitBilling = () => {
    const {
      invoice,
      default_invoice,
      remarks,
      delivery_charges,
      show_images
    } = this.state;
    let activeType = [];
    let inActiveType = [];
    invoice.map(data => {
      return data.is_published
        ? activeType.push(data.master_id)
        : inActiveType.push(data.master_id);
    });
    if (navigator.onLine) {
      var formData = new FormData();
      formData.append("store_id", localStorage.getItem("store"));
      formData.append("active_type", activeType);
      formData.append("default_id", default_invoice);
      formData.append("inactive_type", inActiveType);
      this.props.editInvoiceMethods(formData);
      edit_invoice_flag = true;
      var formData1 = new FormData();
      formData1.append("store_id", localStorage.getItem("store"));
      formData1.append("remarks", remarks);
      formData1.append("delivery_charges", delivery_charges);
      formData1.append("show_images", show_images);
      formData1.append("authorized_signatory_name", "");
      formData1.append("authorized_signatory_pan", "");
      this.props.editStoreSettings(formData1);
      this.setState({ loaderVisible: true });
      edit_settings_flag = true;
    } else {
      toaster("warning", "Please connect to internet to update Billing Settings");
    }
  };

  render() {
    const {
      business_type,
      remarks,
      delivery_charges,
      show_images,
      invoice,
      default_invoice,
      loaderVisible
    } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <LoaderFunc visible={loaderVisible} />
        <div className="heading">
          {/* <h3>Billing Settings</h3> */}

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/settings">Settings</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Billing Settings
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-12 col-lg-11 invoice-lsblk">
            <div className="w-100">
              <div className="heading_bill py-2 w-100">
                <p className="text-uppercase mb-2">Business Type</p>
                <h4 className="mb-3 font-weight-normal">{business_type}</h4>
              </div>
              <div className="row">
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="dscCheck"
                  >
                    <span>
                      Description at Checkout
                      <br />
                      <small>
                        If enable, you will be able to add Remarks while
                        generating the bill.
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="dscCheck"
                        value={remarks}
                        checked={remarks}
                        onChange={e => this.handleClick(e, "remarks")}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="dscCheck"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="odscCheck"
                  >
                    <span>
                      Other Charges at Checkout
                      <br />
                      <small>
                        If enable, you can add other charges at checkout, i.e.
                        Delivery Charges, etc.
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="odscCheck"
                        value={delivery_charges}
                        checked={delivery_charges}
                        onChange={e => this.handleClick(e, "delivery_charges")}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="odscCheck"
                      ></label>
                    </div>
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="imgCheck"
                  >
                    <span>
                      Show Product Images (Billing Screen)
                      <br />
                      <small>
                        If enable, Product images will visible on billing screen
                        else it will be invisible.
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="imgCheck"
                        value={show_images}
                        checked={show_images}
                        onChange={e => this.handleClick(e, "show_images")}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="imgCheck"
                      ></label>
                    </div>
                  </label>
                </div>
              </div>
              <div className="heading_bill py-2 w-100 mt-4">
                <h4 className="text-uppercase mb-2">Invoice Settings</h4>
              </div>
              <div className="bgc_box w-100">
                <div className="heading_bill py-2 w-100">
                  <p className="mb-2">Default Selected Invoice Type</p>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <select
                      className="custom-select mb-3"
                      value={default_invoice}
                      onChange={e => this.handleChange(e, "default_invoice")}
                    >
                      {invoice.map((option, key) => (
                        <option value={option.master_id} key={key}>
                          {option.master_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row">
                  {invoice.map((data, index) => {
                    return (
                      <div className="col-12 col-md-4 col-lg-3" key={index}>
                        <label className="d-flex mb-3" htmlFor={data.master_id}>
                          {index === 0 && (
                            <i
                              className="fa fa-envelope-open-o"
                              aria-hidden="true"
                            ></i>
                          )}
                          {index === 1 && (
                            <i
                              className="fa fa-whatsapp"
                              aria-hidden="true"
                            ></i>
                          )}
                          {index === 2 && (
                            <i
                              className="fa fa-commenting-o"
                              aria-hidden="true"
                            ></i>
                          )}
                          {data.master_name}
                          <div className="custom-control custom-checkbox ml-auto">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id={data.master_id}
                              value={data.is_published}
                              checked={data.is_published}
                              onChange={e =>
                                this.handleClick(e, "invoice", data.master_id)
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={data.master_id}
                            ></label>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="d-flex w-100 mt-4">
                <input
                  type="button"
                  className="btn add_btn ml-auto"
                  value="Save"
                  onClick={() => this.submitBilling()}
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
    invoice_response: store.settings.invoice_response,
    store_invoice: store.settings.store_invoice,
    edit_store_settings: store.settings.edit_store_settings,
    store_settings: store.settings.store_settings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    editInvoiceMethods: params => dispatch(editInvoiceMethods(params)),
    storeInvoiceType: params => dispatch(storeInvoiceType(params)),
    editStoreSettings: params => dispatch(editStoreSettings(params)),
    storeSettings: params => dispatch(storeSettings(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BillingSettings);
