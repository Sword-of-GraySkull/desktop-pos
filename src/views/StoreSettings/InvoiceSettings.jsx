import React, { Component } from "react";
import { connect } from "react-redux";
import database from "../../database";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { saveInvoiceSettings } from "../../actions/settings";
import { Link } from "react-router-dom";
let edit_flag = false;
let read_flag = false;
export class InvoiceSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoice_settings_data: {
        batch_number: false,
        bill_flag: "",
        bill_start_number: '',
        customer_name: false,
        customer_phone: false,
        invoice_footer: false,
        invoice_footer_text: "",
        online_store_qr: false,
        online_store_url: false,
        product_expiry: false,
        show_mrp_on_bill: false,
        print_size: "0"
      },
      loaderVisible: false,
      
      db: new database()
    };
  }
  async componentDidMount() {
    const res = await this.state.db.getStoreInvoiceSettings();
    if (res && res.status === 200) {
      let data = res.invoice_settings_data;
      //because no value present in response to represent Bill Start Number
      data["bill_flag"] = res.invoice_settings_data.bill_start_number
        ? true
        : false;
      read_flag= res.invoice_settings_data.bill_start_number ? true : false
      this.setState({
        invoice_settings_data: data
      });
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const { invoice_settings_response } = newProps;
    if (
      invoice_settings_response &&
      invoice_settings_response.code === 200 &&
      edit_flag
    ) {
      const res = await this.state.db.getStoreInvoiceSettings();
      let doc = {
        _id: "storeInvoiceSettings",
        status: 200,
        _rev: res._rev,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        invoice_settings_data: invoice_settings_response.print_settings
      };
      toaster("success", invoice_settings_response.message);
      await this.state.db.updateDatabaseProducts(doc);

    
      let data = invoice_settings_response.print_settings;
      //because no value present in response to represent Bill Start Number
      data["bill_flag"] = invoice_settings_response.print_settings
        .bill_start_number
        ? true
        : false;
      read_flag= invoice_settings_response.print_settings.bill_start_number ? true : false
      this.setState({
        invoice_settings_data: data
      });

      edit_flag = false;
      this.setState({ loaderVisible: false });
    }
  }

  handleChange = (e, name) => {
    if (name === "bill_start_number" && !/^[0-9]{0,10}$/.test(e.target.value)) {
      return;
    }
    if (name === "bill_start_number") {
      let invoice_settings_data = this.state.invoice_settings_data;
      invoice_settings_data[name] = e.target.value ? parseInt(e.target.value) : '';
      this.setState({ invoice_settings_data });
      return;
    }
    let invoice_settings_data = this.state.invoice_settings_data;
    invoice_settings_data[name] = e.target.value;
    this.setState({ invoice_settings_data });
  };

  handleClick = (e, data, name) => {
    let invoice_settings_data = this.state.invoice_settings_data;
    invoice_settings_data[name] = !data;
    this.setState({ invoice_settings_data });
  };

  submitPayment = () => {
    const { invoice_settings_data } = this.state;
    if (
      invoice_settings_data.invoice_footer &&
      invoice_settings_data.invoice_footer_text === ""
    ) {
      return toaster(
        "error",
        "Please add footer text or disable invoice footer"
      );
    }
    var formData = new FormData();
    if (navigator.onLine) {
      formData.append("store_id", localStorage.getItem("store"));
      formData.append(
        "bill_start_number",
        invoice_settings_data.bill_flag
          ? (invoice_settings_data.bill_start_number ? invoice_settings_data.bill_start_number : 0)
          : 0
      );
      formData.append(
        "invoice_footer",
        invoice_settings_data.invoice_footer ? 1 : 0
      );
      formData.append(
        "invoice_footer_text",
        invoice_settings_data.invoice_footer
          ? invoice_settings_data.invoice_footer_text
          : ""
      );
      formData.append(
        "show_mrp_on_bill",
        invoice_settings_data.show_mrp_on_bill ? 1 : 0
      );
      formData.append(
        "online_store_url",
        invoice_settings_data.online_store_url ? 1 : 0
      );
      formData.append(
        "online_store_qr",
        invoice_settings_data.online_store_qr ? 1 : 0
      );
      formData.append(
        "customer_name",
        invoice_settings_data.customer_name ? 1 : 0
      );
      formData.append(
        "customer_phone",
        invoice_settings_data.customer_phone ? 1 : 0
      );
      formData.append(
        "product_expiry",
        invoice_settings_data.product_expiry ? 1 : 0
      );
      formData.append(
        "batch_number",
        invoice_settings_data.batch_number ? 1 : 0
      );
      formData.append(
        "print_size",
        parseInt(invoice_settings_data.print_size)
      );
      this.props.saveInvoiceSettings(formData);
      this.setState({ loaderVisible: true });
      edit_flag = true;
    } else {
      toaster(
        "warning",
        "Please connect to internet to update Invoice Settings"
      );
    }
  };

  render() {
    const { invoice_settings_data, loaderVisible } = this.state;
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
                Invoice
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-12 col-lg-11 invoice-lsblk">
            <div className="w-100">
              <div className="row">
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="bill"
                  >
                    <span>
                      Bill Start Number
                      <br />
                      <small>Specifying the last bill number</small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="bill"
                        value={invoice_settings_data.bill_flag}
                        checked={invoice_settings_data.bill_flag}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.bill_flag,
                            "bill_flag"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="bill"
                      ></label>
                    </div>
                  </label>
                  {invoice_settings_data.bill_flag && (
                    <label className="d-flex flex-wrap mb-3">
                      <span className="w-100">Bill Start Number</span>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        value={invoice_settings_data.bill_start_number ? invoice_settings_data.bill_start_number : ''}
                        name={invoice_settings_data.bill_start_number}
                        readOnly={read_flag}
                        onChange={e =>
                          this.handleChange(e, "bill_start_number")
                        }
                      />
                    </label>
                  )}
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="footer"
                  >
                    <span>
                      Invoice Footer
                      <br />
                      <small>
                        You will be able to add text while generating the bill
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="footer"
                        value={invoice_settings_data.invoice_footer}
                        checked={invoice_settings_data.invoice_footer}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.invoice_footer,
                            "invoice_footer"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="footer"
                      ></label>
                    </div>
                  </label>
                  {invoice_settings_data.invoice_footer && (
                    <label className="d-flex flex-wrap mb-3">
                      <span className="w-100">Footer Text</span>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        value={invoice_settings_data.invoice_footer_text}
                        name={invoice_settings_data.invoice_footer_text}
                        onChange={e =>
                          this.handleChange(e, "invoice_footer_text")
                        }
                      />
                    </label>
                  )}
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="mrp"
                  >
                    <span>
                      Show MRP on bills
                      <br />
                      <small>If on then show mrp on invoice</small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="mrp"
                        value={invoice_settings_data.show_mrp_on_bill}
                        checked={invoice_settings_data.show_mrp_on_bill}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.show_mrp_on_bill,
                            "show_mrp_on_bill"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="mrp"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="online_url"
                  >
                    <span>
                      Print Online Store Url
                      <br />
                      <small>If on then show URL on invoice</small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="online_url"
                        value={invoice_settings_data.online_store_url}
                        checked={invoice_settings_data.online_store_url}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.online_store_url,
                            "online_store_url"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="online_url"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="cust_name"
                  >
                    <span>
                      Show Customer Name
                      <br />
                      <small>
                        If you want to print customer name on invoice
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="cust_name"
                        value={invoice_settings_data.customer_name}
                        checked={invoice_settings_data.customer_name}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.customer_name,
                            "customer_name"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="cust_name"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="cust_phone"
                  >
                    <span>
                      Show Customer Phone Number
                      <br />
                      <small>
                        If you eant to print customer phone number on invoice
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="cust_phone"
                        value={invoice_settings_data.customer_phone}
                        checked={invoice_settings_data.customer_phone}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.customer_phone,
                            "customer_phone"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="cust_phone"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="expiry"
                  >
                    <span>
                      Show Product Expiry
                      <br />
                      <small>
                        If you want to show product expiry in invoice
                      </small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="expiry"
                        value={invoice_settings_data.product_expiry}
                        checked={invoice_settings_data.product_expiry}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.product_expiry,
                            "product_expiry"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="expiry"
                      ></label>
                    </div>
                  </label>
                </div>
                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="batch"
                  >
                    <span>
                      Show Batch Number
                      <br />
                      <small>If you want to show batch number in invoice</small>
                    </span>
                    <div className="custom-control custom-checkbox ml-3">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="batch"
                        value={invoice_settings_data.batch_number}
                        checked={invoice_settings_data.batch_number}
                        onChange={e =>
                          this.handleClick(
                            e,
                            invoice_settings_data.batch_number,
                            "batch_number"
                          )
                        }
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="batch"
                      ></label>
                    </div>
                  </label>
                </div>

                <div className="col-md-6 gr_box">
                  <label
                    className="d-flex justify-content-between mb-3"
                    htmlFor="batch"
                  >
                    <span>
                      Paper Size
                      <br />
                      <small>Choose paper size for printer</small>
                    </span>
                    <select
                      className="custom-select mb-3"
                      value={invoice_settings_data.print_size}
                      onChange={e => this.handleChange(e, "print_size")}
                    >
                      <option value="0">58mm</option>
                      <option value="1">80mm</option>
                      <option value="2">A4</option>
                      {/* {invoice.map((option, key) => (
                        <option value={option.master_id} key={key}>
                          {option.master_name}
                        </option>
                      ))} */}
                    </select>
                  </label>
                </div>
              </div>

              <div className="d-flex w-100 mt-4">
                <input
                  type="button"
                  className="btn add_btn ml-auto"
                  value="Save"
                  onClick={() => this.submitPayment()}
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
    invoice_settings_response: store.settings.invoice_settings_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveInvoiceSettings: params => dispatch(saveInvoiceSettings(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceSettings);
