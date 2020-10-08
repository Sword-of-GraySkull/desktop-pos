import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createGRN } from "../../actions/inventory";
import { getProducts } from "../../actions/products";
import database from "../../database";
import moment from "moment";
import * as _ from "lodash";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { toaster } from "../../helper/Toaster";
let grnFlag = false;
let product_flag = false;
export class AddGrn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product_list: [],
      original_product_list: [],
      product_response: [],
      selected_data: [],
      checked_data: [],
      tax_data: [],
      showFlag: 1,
      discount_type: "per",
      discount: "",
      applied_discount: 0,
      purchase_invoice_number: "",
      freight_charges: "",
      subtotal: 0,
      total: 0,
      total_gst: 0,
      total_quantity: 0,
      remarks: "",
      cheque_number: "",
      payment_status: 1,
      payment_mode: 0,
      search_keyword: '',
      db: new database()
    };
  }
  async componentDidMount() {
    let res = await this.state.db.getDatabaseProducts();

    if (res && res.status === 200) {
      let product_data = res.product_list;
      let final = [];

      let checked_data = [];
      product_data.map((data, index) => {
        return data.variants.map((variant_data, inner_index) => {
          let product_data = {
            allow_below_zero: data.allow_below_zero,
            allow_discount: data.allow_discount,
            allow_price_change: data.allow_price_change,
            hsn_code: data.hsn_code,
            hsn_code_id: data.hsn_code_id,
            image_url: data.image_url,
            is_published: data.is_published,
            product_description: data.product_description,
            product_id: data.product_id,
            product_name: data.product_name,
            product_type: data.product_type,
            search_keyword: data.search_keyword,
            send_low_stock_alert: data.send_low_stock_alert,
            sku_code: data.sku_code,
            tax: data.tax,
            tax_id: data.tax_id,
            track_inventory: data.track_inventory,
            variants: variant_data,
            new_stock: "",
            batch_number: "",
            expiry_date: ""
          };
          if (data.product_type !== 3) {
            final.push(product_data);
            checked_data[variant_data.variant_id] = false;
          }
          return null;
        });
      });
      // final.map(data => {
      //   return(checked_data[data.variants.variant_id] = false)
      // });
      this.setState({
        product_list: final,
        checked_data: checked_data,
        original_product_list: final
      });
    }
    let res1 = await this.state.db.getTax();
    if (res1 && res1.status === 200) {
      this.setState({
        tax_data: res1.tax_data
      });
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const { grn_response } = newProps;

    if (grn_response.code === 200 && grnFlag) {
      toaster("success", grn_response.message);
      const res = await this.state.db.getDatabaseProducts();
      if (localStorage.getItem("store")) {
        let data = localStorage.getItem("store");
        let params = {
          store_id: data,
          page: 1,
          is_published: 1,
          last_update: res.updated_time
          // last_update: moment().format("YYYY-MM-DD")
        };
        product_flag = true;
        grnFlag = false;
        await this.props.getProducts(params);
      }
    }
    if (
      newProps.product_list &&
      newProps.product_list.code === 200 &&
      product_flag
    ) {
      for (var i = 1; i <= newProps.product_list.num_pages; i++) {
        let params = {
          store_id: localStorage.getItem("store"),
          page: i,
          is_published: 1
        };
        const res1 = await this.state.db.getDatabaseProducts();
        let data = [];

        data = _.cloneDeep(newProps.product_list.products);
        res1.product_list &&
          res1.product_list.map(async item1 => {
            let item =
              newProps.product_list.products &&
              newProps.product_list.products.find(
                item2 => item2.product_id === item1.product_id
              );
            if (item === undefined) {
              await data.push(item1);
            }
            return null;
          });

        let doc = {
          _id: "productList",
          status: 200,
          updated_time: res1.updated_time,
          _rev: res1._rev,
          product_list: data
        };
        await this.state.db.updateDatabaseProducts(doc);
        if (i !== 1) {
          await this.props.getProducts(params);
        }
        if (i === newProps.product_list.num_pages) {
          const all_product_data = await this.state.db.getDatabaseProducts();
          let data = [];
          // above condition is applied to fulfill the update operation i.e some data already present in database next time api will give a new data and updated bersion of already present data.
          data = _.cloneDeep(newProps.product_list.products);
          all_product_data.product_list.map(item1 => {
            let item =
              newProps.product_list.products &&
              newProps.product_list.products.find(
                item2 => item2.product_id === item1.product_id
              );
            if (item === undefined) {
              data.push(item1);
            }
            return null;
          });

          // above condition is applied to fulfill the update operation i.e some data already present in database next time api will give a new data and updated bersion of already present data.
          let doc = {
            _id: "productList",
            status: 200,
            // updated_time: moment().format("YYYY-MM-DD"),
            updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
            _rev: all_product_data._rev,
            product_list: data
          };
          product_flag = false;
          await this.state.db.updateDatabaseProducts(doc);

          this.props.history.push("/inventory");
        } else {
          this.props.history.push("/inventory");
        }
      }
    }
  }

  handleStockChange = (e, name, data) => {
    let selected_data = this.state.selected_data;
    let index = selected_data.findIndex(
      x => x.variants.variant_id === data.variants.variant_id
    );
    if (
      name === "cost_price" ||
      name === "mrp" ||
      name === "selling_price" ||
      name === "new_stock"
    ) {
      let reg = /(^([0-9]{0,7})([0-9]{0}|[.][0-9]{0,3}))$/;
      if (!reg.test(e.target.value)) {
        return;
      }
    }
    if (name === "batch_number") {
      let reg = /^[0-9]{0,12}$/;
      if (!reg.test(e.target.value)) {
        return;
      }
    }

    if (name === "cost_price") {
      selected_data[index].variants.price_stock[
        selected_data[index].variants.price_stock.length - 1
      ].cost_price = e.target.value;
    } else if (name === "mrp") {
      selected_data[index].variants.price_stock[
        selected_data[index].variants.price_stock.length - 1
      ].mrp = e.target.value;
    } else if (name === "selling_price") {
      selected_data[index].variants.price_stock[
        selected_data[index].variants.price_stock.length - 1
      ].selling_price = e.target.value;
    } else if (name === "new_stock") {
      if (e.target.value === "0") {
        return;
      }
      selected_data[index].new_stock = Number(e.target.value);
    } else if (name === "batch_number") {
      selected_data[index].batch_number = e.target.value;
    } else if (name === "tax_id") {
      selected_data[index].tax_id = e.target.value;
      selected_data[index].tax = this.state.tax_data.filter(
        val => val.id === Number(e.target.value)
      )[0].percentage;
    } else if (name === "expiry_date") {
      selected_data[index].expiry_date = e;
    }
    this.setState({ selected_data });
  };

  handleChange = (e, name) => {
    const { original_product_list } = this.state;
    let productList = this.state.product_list;
    if (name === "freight_charges") {
      let reg = /(^([0-9]{0,7})([0-9]{0}|[.][0-9]{0,3}))$/;
      if (!reg.test(e.target.value)) {
        return;
      }

      let data =
        this.state.subtotal +
        (e.target.value !== "" ? parseInt(e.target.value) : 0) -
        this.state.applied_discount;
      this.setState({ total: data });
    }

    if (
      name === "search_keyword" &&
      (e.target.value.length > 2 || e.target.value.length === 0)
    ) {
      productList = original_product_list.filter(
        t =>
          t.product_name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          t.variants.barcode
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
      );
    }
    this.setState({ [name]: e.target.value, product_list: productList });
  };

  clearSearchProducts = () => {
    const { original_product_list } = this.state;
    this.setState({ product_list: original_product_list, search_keyword: "" });
  };
  handleCheckBox = (e, index, data) => {
    const { product_list } = this.state;
    let checked_data = this.state.checked_data;
    let selected_data = [];
    // data.expiry_date= new Date()
    checked_data[index] = !this.state.checked_data[index];
    product_list.map(data => {
      return checked_data[data.variants.variant_id] && selected_data.push(data);
    });
    this.setState({ checked_data, selected_data });
  };

  handleDelete = (e, index, data) => {
    let selected_data = this.state.selected_data;
    let checked_data = this.state.checked_data;
    selected_data.splice(index, 1);
    checked_data[data.variants.variant_id] = false;
    if (selected_data.length === 0) {
      this.setState({ showFlag: 1 });
    }
    this.setState({ selected_data, checked_data });
  };

  handleRadio = (e, name) => {
    const { subtotal, freight_charges } = this.state;
    if (name === "discount_type") {
      let data =
        subtotal + (freight_charges !== "" ? parseInt(freight_charges) : 0) - 0;
      this.setState({
        discount: "",
        applied_discount: 0,
        total: data
      });
    }
    if (name === "payment_mode") {
      if (e.target.value === "0") {
        this.setState({ payment_status: 1 });
      } else if (e.target.value === "1") {
        this.setState({ payment_status: 0 });
      }
      this.setState({ cheque_number: "", [name]: parseInt(e.target.value) });
      return;
    }
    this.setState({ [name]: e.target.value });
  };
  handleDiscount = (e, name) => {
    const { discount_type, subtotal, freight_charges } = this.state;

    if (name === "discount") {
      if (discount_type === "per") {
        let applied_discount = 0;
        let reg = /^([0-9]{0,2}([0-9]{0}|[.][0-9]{0,2})|100)$/;
        if (!reg.test(e.target.value)) {
          return toaster(
            "error",
            "Discount percentage can't be greater than 100"
          );
        }
        applied_discount = (subtotal * e.target.value) / 100;
        let data =
          subtotal +
          (freight_charges !== "" ? parseInt(freight_charges) : 0) -
          applied_discount;
        this.setState({
          applied_discount: applied_discount,
          total: data
        });
      } else if (discount_type === "rup") {
        let applied_discount = 0;
        applied_discount = e.target.value !== "" ? parseInt(e.target.value) : 0;
        let data =
          subtotal +
          (freight_charges !== "" ? parseInt(freight_charges) : 0) -
          applied_discount;
        if (
          applied_discount >=
          subtotal + (freight_charges !== "" ? parseInt(freight_charges) : 0)
        ) {
          return toaster(
            "error",
            "Discount amount should be less than total amount"
          );
        }
        this.setState({
          applied_discount: applied_discount,
          total: data
        });
      }
    }
    this.setState({ [name]: e.target.value });
  };

  submitData = () => {
    const { selected_data } = this.state;
    let product = [];
    let cost = [];
    let selling = [];
    let mrp = [];
    let stock = [];
    let total = 0;
    let total_quantity = 0;

    let subtotal = 0;
    let total_gst = 0;

    selected_data.map(data => {
      let product_data = {
        product_id: data.product_id,
        product_name: data.product_name,
        variant: data.variants.variant_id,
        cost:
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price,
        mrp:
          data.variants.price_stock[data.variants.price_stock.length - 1].mrp,
        selling:
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price,
        quantity: parseInt(data.new_stock),
        batch: data.batch_number,
        manufacturing_date: "",
        expiry_date: data.expiry_date
          ? moment(data.expiry_date).format("YYYY-MM-DD")
          : "",
        tax_id: data.tax_id,
        sku_code: data.sku_code,
        weight: data.product_type === 2 ? data.variants.price_stock[data.variants.price_stock.length - 1]
          .weight : 0,
        cgst: this.ConvertToDecimal(
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price -
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price *
          (100 / (100 + data.tax))
        ),
        sgst: this.ConvertToDecimal(
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price -
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price *
          (100 / (100 + data.tax))
        ),
        igst: 0
      };
      cost.push(
        data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price
      );
      selling.push(
        data.variants.price_stock[data.variants.price_stock.length - 1]
          .selling_price
      );
      mrp.push(
        data.variants.price_stock[data.variants.price_stock.length - 1].mrp
      );
      stock.push(data.new_stock);
      product.push(product_data);
      total_gst = this.ConvertToDecimal(
        total_gst +
        (data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price *
          data.new_stock -
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price *
          data.new_stock *
          (100 / (100 + data.tax)))
      );
        let individual_gst=this.ConvertToDecimal((data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price *
          data.new_stock -
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price *
          data.new_stock *
          (100 / (100 + data.tax))))
          
      subtotal = subtotal +
        ((data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price *
        data.new_stock)-individual_gst)
      total =
        total +
        data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price *
        data.new_stock;

      total_quantity = total_quantity + parseInt(data.new_stock);
      return null;
    });

    if (cost.includes("")) {
      return toaster("error", "Please fill cost price");
    } else if (selling.includes("")) {
      return toaster("error", "Please fill selling price");
    } else if (mrp.includes("")) {
      return toaster("error", "Please fill mrp");
    } else if (stock.includes("")) {
      return toaster("error", "Please fill new stock");
    }
    this.setState({
      showFlag: 3,
      product_response: product,
      subtotal,
      total,
      total_quantity,
      total_gst: total_gst
    });
  };

  addGrn = () => {
    const {
      product_response,
      applied_discount,
      freight_charges,
      purchase_invoice_number,
      total_gst,
      subtotal,
      remarks,
      cheque_number,
      payment_mode,
      payment_status,
      total
    } = this.state;
    var formData = new FormData();
    let product = product_response;
    let final_product = { product };

    formData.append("store_id", localStorage.getItem("store"));
    formData.append("product", JSON.stringify(final_product));
    // formData.append("purcahse_order_id", "");
    // formData.append("store_supplier_id", "");
    formData.append("purchase_invoice_number", purchase_invoice_number);
    // formData.append("purchase_invoice_date", "");
    formData.append("total_cgst", total_gst/2);
    formData.append("total_sgst", total_gst/2);
    formData.append("total_igst", 0);
    formData.append("sub_total", subtotal);
    formData.append("discount", applied_discount);
    formData.append("freight_charges", freight_charges);
    formData.append("final_amount", total);
    formData.append("remarks", remarks);
    formData.append("created_by", localStorage.getItem("logged_user_id"));
    formData.append("payment_mode", payment_mode);
    formData.append("cheque_number", cheque_number);
    formData.append("payment_status", payment_status);
    if (navigator.onLine) {
      this.props.createGRN(formData);
      grnFlag = true;
    } else {
      toaster("warning", "Please connect to internet to complete this action");
    }
  };

  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };

  render() {
    const {
      product_list,
      checked_data,
      selected_data,
      showFlag,
      tax_data,
      discount_type,
      discount,
      applied_discount,
      purchase_invoice_number,
      freight_charges,
      subtotal,
      total,
      total_gst,
      remarks,
      payment_mode,
      cheque_number,
      total_quantity,
      search_keyword
    } = this.state;
    return (
      <div className="inv_add_grn w-100 h-100 p-30">
        <div className="d-flex justify-content-between flex-wrap">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/inventory">Inventory</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Create GRN
              </li>
            </ol>
          </nav>
          <div className="d-flex ml-auto">
            <div className="btn-group">
              {showFlag === 1 && (
                <div className="d-flex justify-content-center align-items-center h-100 top-right">
                  <div className="searchbar">
                    <input
                      className="search_input"
                      type="text"
                      autoComplete="off"
                      placeholder="Search..."
                      name="search_keyword"
                      value={search_keyword}
                      onChange={e => this.handleChange(e, "search_keyword")}
                    />

                    <Link
                      to="#"
                      className="search_icon"
                      onClick={e => this.clearSearchProducts(e)}
                    >
                      <i
                        // className="fa fa-search"
                        className="fa fa-times"
                      ></i>
                    </Link>
                  </div>
                  {selected_data.length !== 0 && (
                    <button
                      type="button"
                      className="btn rounded btn-dark grn-btn mb-3 ml-2"
                      onClick={() => this.setState({ showFlag: 2 })}
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="btn-group">
              {selected_data.length !== 0 && showFlag === 2 && (
                <div>
                  <button
                    type="button"
                    className="btn rounded btn-dark grn-btn"
                    onClick={() => this.setState({ showFlag: 1 })}
                  >
                    back
                  </button>
                  <button
                    type="button"
                    className="btn rounded btn-dark grn-btn"
                    onClick={e => this.submitData(e)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
            <div className="btn-group">
              {selected_data.length !== 0 && showFlag === 3 && (
                <div>
                  <button
                    type="button"
                    className="btn rounded btn-dark grn-btn"
                    onClick={() => this.setState({ showFlag: 2 })}
                  >
                    back
                  </button>
                  <button
                    type="button"
                    className="btn rounded btn-dark grn-btn"
                    onClick={e => this.addGrn(e)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {showFlag === 1 && (
          <div
            className="grn-view w-100 border p-3 mb-3"
            id="accordion"
            style={{ cursor: "pointer" }}
          >
            <div
              className="card-header border-0 w-100"
              data-toggle="collapse"
              data-target="#acco"
              aria-expanded="true"
              aria-controls="#acco"
            >
              <span>Open Inventory</span> <span>Allow to fix stock.</span>
            </div>
            <div id="acco" className="collapse" data-parent="#accordion">
              {product_list.map((data, index) => {
                return (
                  <label
                    className="grn-parts d-block mb-0"
                    htmlFor={data.variants.variant_id}
                    key={index}
                  >
                    <div className="grn-num">
                      <span>
                        {data.product_name}, {data.variants.name}
                      </span>

                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={data.variants.variant_id}
                          checked={checked_data[data.variants.variant_id]}
                          value={checked_data[data.variants.variant_id]}
                          onChange={e =>
                            this.handleCheckBox(
                              e,
                              data.variants.variant_id,
                              data
                            )
                          }
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={data.variants.variant_id}
                        ></label>
                      </div>
                    </div>
                    <span>
                      Stock:
                      {data.variants.price_stock[
                        data.variants.price_stock.length - 1
                      ] &&
                        data.variants.price_stock[
                          data.variants.price_stock.length - 1
                        ].quantity}
                    </span>
                    <span>
                      S.P:
                      {data.variants.price_stock[
                        data.variants.price_stock.length - 1
                      ] &&
                        data.variants.price_stock[
                          data.variants.price_stock.length - 1
                        ].selling_price}
                    </span>
                    <span>
                      M.R.P:
                      {data.variants.price_stock[
                        data.variants.price_stock.length - 1
                      ] &&
                        data.variants.price_stock[
                          data.variants.price_stock.length - 1
                        ].mrp}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {showFlag === 2 && (
          <div className="grn-box">
            {selected_data.map((data, index) => {
              return (
                <div className="grn-detail-box" key={index}>
                  <div className="top-wrap">
                    <div className="detail-row">
                      <span>
                        {data.product_name}, {data.variants.name}
                      </span>
                      <span>
                        current_stock:{" "}
                        {
                          data.variants.price_stock[
                            data.variants.price_stock.length - 1
                          ].quantity
                        }
                      </span>
                      <span>
                        subtotal:{" "}
                        {
                          data.variants.price_stock[
                            data.variants.price_stock.length - 1
                          ].cost_price * data.new_stock
                        }
                      </span>
                      <span>
                        tax:{" "}
                        {this.ConvertToDecimal(
                          data.variants.price_stock[
                            data.variants.price_stock.length - 1
                          ].cost_price * data.new_stock -
                          data.variants.price_stock[
                            data.variants.price_stock.length - 1
                          ].cost_price * data.new_stock *
                          (100 / (100 + data.tax))
                        )}
                      </span>
                    </div>
                    <span>
                      <i
                        className="fa fa-trash"
                        aria-hidden="true"
                        onClick={e => this.handleDelete(e, index, data)}
                      />
                    </span>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="table-responsive  mt-2">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>COST (Inc. GST)</th>
                              <th>SELLING PRICE (Inc. GST)</th>
                              <th>MRP</th>
                              <th>New Stock</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].cost_price
                                  }
                                  value={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].cost_price
                                  }
                                  onChange={e =>
                                    this.handleStockChange(
                                      e,
                                      "cost_price",
                                      data
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].selling_price
                                  }
                                  value={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].selling_price
                                  }
                                  onChange={e =>
                                    this.handleStockChange(
                                      e,
                                      "selling_price",
                                      data
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].mrp
                                  }
                                  value={
                                    data.variants.price_stock[
                                      data.variants.price_stock.length - 1
                                    ].mrp
                                  }
                                  onChange={e =>
                                    this.handleStockChange(e, "mrp", data)
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  name={data.new_stock}
                                  value={data.new_stock}
                                  onChange={e =>
                                    this.handleStockChange(e, "new_stock", data)
                                  }
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="wrap">
                        <div className="form-group">
                          <label>TAX/GST</label>
                          <select
                            className="form-control"
                            value={data.tax_id}
                            onChange={e =>
                              this.handleStockChange(e, "tax_id", data)
                            }
                          >
                            {data.tax_id === "" && (
                              <option value="">Select your tax</option>
                            )}
                            {tax_data.map((option, key) => (
                              <option value={option.id} key={key}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <DatePicker
                            minDate={new Date()}
                            selected={data.expiry_date}
                            onChange={e =>
                              this.handleStockChange(e, "expiry_date", data)
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>Batch Number</label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name={data.batch_number}
                            value={data.batch_number}
                            placeholder="xxxxxxxxxxxxx"
                            onChange={e =>
                              this.handleStockChange(e, "batch_number", data)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {showFlag === 3 && (
          <div className="total-product">
            <div className="total-product-wrap">
              <span>Total Products : {selected_data.length}</span>,{" "}
              <span>Quantity: {total_quantity}</span>
            </div>
            <div className="form-group purchace">
              <label>Purchace Invoice Number (optional)</label>
              <input
                type="text"
                autoComplete="off"
                className="form-control"
                name={purchase_invoice_number}
                value={purchase_invoice_number}
                onChange={e => this.handleChange(e, "purchase_invoice_number")}
              />
            </div>
            <div className="w-100 border p-3">
              <div className="d-flex justify-content-between align-items-end">
                <div className="w-100 pr-2">
                  <span className="text-muted">Remarks</span>
                  <p className="h5 m-0">Add Remarks</p>
                </div>
                <button
                  className="add_btn btn"
                  data-toggle="collapse"
                  data-target="#remarks_collapse"
                >
                  TAP TO ADD
                </button>
              </div>
              <div className="collapse w-100" id="remarks_collapse">
                <div className="send_invoice mt-3 box_shadow">
                  <div className="form-group">
                    <label htmlFor="usr">Remarks</label>
                    <textarea
                      className="form-control w-100"
                      placeholder="Add Remarks"
                      name="remarks"
                      value={remarks}
                      onChange={e => this.handleChange(e, "remarks")}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="freight-charges w-100 border p-3 m-0">
              <div className="d-flex justify-content-between align-items-end">
                <div className="w-100 pr-2">
                  <span className="text-muted">FREIGHT CHARGES</span>
                  <p className="h5 m-0">Enter Freight Charges</p>
                </div>
                <button
                  className="add_btn btn"
                  data-toggle="collapse"
                  data-target="#freight"
                >
                  TAP TO ADD
                </button>
              </div>
              <div className="collapse w-100" id="freight">
                <div className="send_invoice mt-3 box_shadow">
                  <div className="form-group ">
                    <label>Freight Charges</label>
                    <input
                      type="text"
                      autoComplete="off"
                      className="form-control"
                      name={freight_charges}
                      value={freight_charges}
                      onChange={e => this.handleChange(e, "freight_charges")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div className="w-100 border p-3 m-0">
              <div className="d-flex justify-content-between align-items-end">
                <div className="w-100 pr-2">
                  <span className="text-muted">CASH DISCOUNT ON BILL</span>
                  <p className="h5 m-0">Add Cash Discount</p>
                </div>
                <button
                  className="add_btn btn"
                  data-toggle="collapse"
                  data-target="#cash_dis"
                >
                  TAP TO ADD
                </button>
              </div>
              <div className="collapse w-100" id="cash_dis">
                <div className="form-group">
                  <div className="invoice_discount_box mt-2">
                    <ul>
                      <li className="p-0 border-0">
                        <label>Discount</label>
                      </li>
                      <li>
                        <div className="row align-items-center">
                          <div className="col-6">
                            <span>Discount Type</span>
                          </div>
                          <div className="col-6">
                            <div className="discount_type">
                              <label>
                                <input
                                  type="radio"
                                  name="discount_type"
                                  value="per"
                                  checked={discount_type === "per"}
                                  onChange={e =>
                                    this.handleRadio(e, "discount_type")
                                  }
                                />
                                <span>%</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="discount_type"
                                  value="rup"
                                  checked={discount_type === "rup"}
                                  onChange={e =>
                                    this.handleRadio(e, "discount_type")
                                  }
                                />
                                <span>&#8377;</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="row align-items-center">
                          <div className="col-6">
                            <span>Discount</span>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              autoComplete="off"
                              className="discount_input"
                              placeholder={discount_type === "per" ? "0%" : "0"}
                              name="discount"
                              value={discount}
                              onChange={e => this.handleDiscount(e, "discount")}
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <div className="w-100 border p-3 m-0">
              <div className="d-flex justify-content-between align-items-end">
                <div className="w-100 pr-2">
                  <span className="text-muted">How you made the payment?</span>
                  <p className="h5 m-0">
                    {payment_mode === 0 ? "Cash" : "Cheque"}
                  </p>
                </div>
                <button
                  className="add_btn btn"
                  data-toggle="collapse"
                  data-target="#how_pay"
                >
                  TAP TO ADD
                </button>
              </div>
              <div className="collapse w-100" id="how_pay">
                <div>
                  <div className="form-group mb-0 mt-2">
                    <div className="invoice_discount_box m-0">
                      <ul>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-6">
                              <span>Payment Mode</span>
                            </div>
                            <div className="col-6">
                              <div className="payment_mode">
                                <div className="custom-control custom-radio custom-control-inline">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="ct_1"
                                    name="payment_mode"
                                    value={0}
                                    checked={payment_mode === 0}
                                    onChange={e =>
                                      this.handleRadio(e, "payment_mode")
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="ct_1"
                                  >
                                    Cash
                                  </label>
                                </div>

                                <div className="custom-control custom-radio custom-control-inline">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="ct_2"
                                    name="payment_mode"
                                    value={1}
                                    checked={payment_mode === 1}
                                    onChange={e =>
                                      this.handleRadio(e, "payment_mode")
                                    }
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="ct_2"
                                  >
                                    Cheque
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        {payment_mode === 1 && (
                          <li>
                            <div className="row align-items-center">
                              <div className="col-6">
                                <span>Cheque Number</span>
                              </div>
                              <div className="col-6">
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="cheque_number_input form-control"
                                  placeholder=""
                                  autoFocus
                                  name="cheque_number"
                                  value={cheque_number}
                                  onChange={e =>
                                    this.handleDiscount(e, "cheque_number")
                                  }
                                />
                              </div>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />

            <table className="table table-bordered shadow">
              <tbody>
                <tr>
                  <td>
                    <b>SUBTOTAL (exclusive of tax)</b>
                  </td>
                  <td>
                    {"\u20B9"}
                    {subtotal}
                  </td>
                </tr>
                {applied_discount !== 0 && (
                  <tr>
                    <td>
                      <b>Discount on total amount</b>
                    </td>
                    <td>
                      - {"\u20B9"}
                      {applied_discount}
                    </td>
                  </tr>
                )}
                {freight_charges !== "" && (
                  <tr>
                    <td>
                      <b>Freight Charges</b>
                    </td>
                    <td>
                      {"\u20B9"}
                      {freight_charges}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>
                    <b>Total GST</b>
                  </td>
                  <td>
                    {"\u20B9"}
                    {this.ConvertToDecimal(total_gst)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Total Cash</b>
                  </td>
                  <td>
                    {"\u20B9"}
                    {total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    product_list: store.products.product_list,
    grn_response: store.inventory.grn_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProducts: params => dispatch(getProducts(params)),
    createGRN: params => dispatch(createGRN(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGrn);
