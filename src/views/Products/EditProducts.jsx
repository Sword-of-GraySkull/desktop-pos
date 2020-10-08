import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "../../helper/Alert";
import moment from "moment";
import {
  getHSN,
  updateProduct,
  uploadImage,
  getProducts
} from "../../actions/products";
import database from "../../database";
import { toaster } from "../../helper/Toaster";
import { ModalPopup } from "../../helper/ModalPopup";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { API_URL } from "../../config";
import axios from "axios";

let update_flag = false;
let product_flag = false;
let hsn_flag = false;
class EditProducts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new database(),
      edit_data: this.props.location && this.props.location.state.data,
      product_id: "",
      product_type: 1,
      product_name: "",
      variants: [
        {
          name: "",
          barcode: "",

          price_stock: [
            {
              cost_price: "",
              id: "",
              mrp: "",
              quantity: "",
              selling_price: "",
              variant_id: "",
              weight: ""
            }
          ]
        }
      ],
      selected_weight_unit: [],
      tax_settings: true,
      hsn_code: "",
      tax: "",
      track_inventory: false,
      allow_below_zero: false,
      product_description: "",
      search_keyword: [],
      entered_search_keyword: "",
      image_url: "",
      send_low_stock_alert: false,
      allow_price_change: false,
      allow_discount: false,
      is_discountable: false,
      is_published: false,

      product_types: [],
      tax_data: [],
      hsn_data: [],
      search_hsn_input: "",
      openHSNPage: false,
      loaderVisible: false,
      hsn_selector: "product category"
    };
  }

  async componentDidMount() {
    const { edit_data } = this.state;

    let selected_weight_unit = [];
    edit_data.variants.map(data => {
      return data.price_stock.map((item, key) => {
        selected_weight_unit[item.id] = "kg";
        return null;
      });
    });
    this.setState({
      product_id: edit_data.product_id,
      product_name: edit_data.product_name,
      product_type: edit_data.product_type,
      variants: edit_data.variants,
      hsn_code: edit_data.hsn_code,
      tax: edit_data.tax_id,
      track_inventory: edit_data.track_inventory,
      allow_below_zero: edit_data.allow_below_zero,
      product_description: edit_data.product_description,
      // split use here to convert string into array
      search_keyword: edit_data.search_keyword
        ? edit_data.search_keyword.split(",")
        : [],
      image_url: edit_data.image_url,
      send_low_stock_alert: edit_data.send_low_stock_alert,
      allow_price_change: edit_data.allow_price_change,
      allow_discount: edit_data.allow_discount,
      is_discountable: edit_data.is_discountable,
      is_published: edit_data.is_published,
      selected_weight_unit: selected_weight_unit
    });
    let res1 = await this.state.db.getTax();
    if (res1 && res1.status === 200) {
      this.setState({
        tax_data: res1.tax_data
      });
    }
    let res = await this.state.db.getProductType();
    if (res && res.status === 200) {
      this.setState({
        product_types: res.product_types
      });
    }
  }

  async UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.hsn_data.code === 200 && hsn_flag) {
      this.setState({
        hsn_data: newProps.hsn_data.hsn
      });
      hsn_flag = false;
    }
    if (newProps.uploaded_image.code === 200) {
      this.setState({
        image_url: newProps.uploaded_image.image
      });
    } else if (newProps.uploaded_image.code === 400) {
      toaster("error", newProps.uploaded_image.message);
    }
    if (newProps.product_list.code === 200 && product_flag) {
      const all_product_data = await this.state.db.getDatabaseProducts();
      let data = [];
      // above condition is applied to fulfill the update operation i.e some data already present in database next time api will give a new data and updated bersion of already present data.
      data = newProps.product_list.products;
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
      this.setState({ loaderVisible: false });
      // need this line to be here because if not present the control goes to product page before all product updated in db
      // const res = await this.state.db.getDatabaseProducts();
      this.props.history.push("/products");
    }
    if (newProps.update_response.code === 200 && update_flag) {
      toaster("success", newProps.update_response.message);
      const res = await this.state.db.getDatabaseProducts();
      if (localStorage.getItem("store")) {
        let data = localStorage.getItem("store");
        let params = {
          store_id: data,
          page: 1,
          is_published: 1,
          last_update: res.updated_time
          // last_update: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS")
          // last_update: "2019-09-05 17:00:00.000000",
        };
        product_flag = true;
        update_flag = false;
        await this.props.getProducts(params);
      }
    } else if (
      newProps.update_response &&
      newProps.update_response.code === 400 &&
      update_flag
    ) {
      toaster("error", newProps.update_response.message);
      update_flag = false;
    }
  }

  handleChange = (e, name, variant_index, stock_index) => {
    if (name === "product_name" && /^[0-9A-Z a-z_-]{0,250}$/.test(e.target.value) === false) {
      return;
    }else if (
      name === "name" &&
      !e.target.value.match(/^[a-zA-Z 0-9]{0,50}$/)
    ) {
      return;
    }
    else if (name === "barcode" && !e.target.value.match(/^[a-zA-Z0-9]{0,12}$/)) {
      return;
    }
    else if (
      (name === "weight" ||
        name === "cost_price" ||
        name === "selling_price" ||
        name === "mrp") &&
      !e.target.value.match(/^[0-9]{0,10}$/)
    ) {
      return;
    } else if (name === "product_description" && e.target.value.length > 500) {
      return;
    } else if (
      name === "search_keyword" &&
      !e.target.value.match(/^[a-zA-Z0-9 ]{0,100}$/)
    ) {
      return;
    } else if (
      name === "entered_search_keyword" &&
      !e.target.value.match(/^[a-zA-Z _.,0-9-]{0,100}$/)
    ) {
      return;
    } else if (name === "name") {
      let variants = this.state.variants;
      variants[variant_index].name = e.target.value;
      this.setState({ variants: variants });
    } else if (name === "barcode") {
      let variants = this.state.variants;
      variants[variant_index].barcode = e.target.value;
      this.setState({ variants: variants });
    } else if (name === "weight") {
      let variants = this.state.variants;
      variants[variant_index].price_stock[stock_index].weight = e.target.value;
      this.setState({ variants: variants });
    } else if (name === "cost_price") {
      let variants = this.state.variants;
      variants[variant_index].price_stock[stock_index].cost_price =
        e.target.value;
      this.setState({ variants: variants });
    } else if (name === "selling_price") {
      let variants = this.state.variants;
      variants[variant_index].price_stock[stock_index].selling_price =
        e.target.value;
      this.setState({ variants: variants });
    } else if (name === "mrp") {
      let variants = this.state.variants;
      variants[variant_index].price_stock[stock_index].mrp = e.target.value;
      this.setState({ variants: variants });
    } else if (name === "search_hsn_input") {
      if (this.state.hsn_selector === "hsn code") {
        let reg = /^[0-9]{0,12}$/;
        if (!reg.test(e.target.value)) {
          return;
        }
      }
    } else if (name === "hsn_code") {
      this.setState({
        search_hsn_input: e.target.value,
        hsn_selector: "hsn code"
      });
    }

    this.setState({ [name]: e.target.value });
  };
  selectWeightUnit = (e, name, stock_key) => {
    let selected_weight_unit = this.state.selected_weight_unit;
    selected_weight_unit[stock_key] = e.target.value;
    this.setState({ selected_weight_unit: selected_weight_unit });
  };

  handleImageChange = e => {
    // provide temporary url for the uploaded images to preview it.
    var formData = new FormData();
    formData.append("store_id", localStorage.getItem("store"));
    formData.append("product_id", this.state.product_id);
    formData.append("image", e.target.files[0]);
    this.props.uploadImage(formData);
    // this.setState({ image_url: URL.createObjectURL(e.target.files[0]) });
  };

  handleClick = (e, name) => {
    if (name === "hsn_selector") {
      this.setState({
        hsn_selector: e.target.value,
        search_hsn_input: "",
        hsn_data: []
      });
      return;
    }
    // json.parse is used here to convert string value of e.target.value to boolean
    let value = JSON.parse(e.target.value);
    this.setState({ [name]: !value });
  };
  addMore = e => {
    let variants = this.state.variants;
    variants.push({
      name: "",
      barcode: "",
      newly_added: true,
      price_stock: [
        {
          cost_price: "",
          id: "",
          mrp: "",
          quantity: "",
          selling_price: "",
          variant_id: "",
          weight: ""
        }
      ]
    });
    this.setState({ variants: variants });
  };

  removeAddedBlock = (e, index) => {
    let variants = this.state.variants;
    variants.splice(index, 1);
    this.setState({ variants: variants });
  };
  // calls when search feild on change operation in hsnhelper page
  handleHSNChange = (e, name) => {
    this.setState({ [name]: e.target.value, openHSNPage: false });
  };
  // helps to open hsnhelper page
  callHSNHelper = () => {
    this.setState({
      openHSNPage: true,
      hsn_data: [],
      search_hsn_input: this.state.hsn_code !== "" ? this.state.hsn_code : "",
      hsn_selector: this.state.hsn_code !== "" ? "hsn code" : "product category"
    });
  };
  // helps to close hsnhelper page
  closeHSNHelper = () => {
    this.setState({
      openHSNPage: false,
      hsn_selector: "product category",
      search_hsn_input: "",
      hsn_data: []
    });
  };

  // call hsncode api
  getHSNCode = () => {
    const { hsn_selector, search_hsn_input } = this.state;
    if (
      this.state.search_hsn_input === "" ||
      this.state.search_hsn_input === undefined
    ) {
      this.setState({ hsn_data: [] });
      return toaster("error", "Please fill the field");
    }
    let props = {
      search_product:
        hsn_selector === "product category" ? search_hsn_input : "",
      hsn_code: hsn_selector === "hsn code" ? search_hsn_input : ""
    };
    this.props.getHSN(props);
    hsn_flag = true;
  };
  // add enter keyword in search_keyword array and empty enter keyboard field
  addSearchKeyword = () => {
    const { entered_search_keyword } = this.state;
    let search_keyword = this.state.search_keyword;
    if (entered_search_keyword.trim().length === 0) {
      return toaster("error", "Please enter valid search tag");
    }
    search_keyword.push(entered_search_keyword);
    this.setState({
      search_keyword: search_keyword,
      entered_search_keyword: ""
    });
  };

  removeSearch = (e, index) => {
    let search_keyword = this.state.search_keyword;
    search_keyword.splice(index, 1);
    this.setState({ search_keyword: search_keyword });
  };

  submitData = () => {
    const {
      product_id,
      product_name,
      product_type,
      variants,
      hsn_code,
      tax,
      track_inventory,
      allow_below_zero,
      product_description,
      search_keyword,
      send_low_stock_alert,
      allow_price_change,
      allow_discount,
      is_published,
      edit_data,
      image_url
    } = this.state;

    let data_stock = {};
    let data_variant = {};
    let stock = [];
    let variant = [];
    let weight =[];
    variants.map(data => {
      return data.price_stock.map(inner_data => {
        weight.push(inner_data.weight ? parseInt(inner_data.weight) : 0);
        // if (selected_weight_unit[inner_data.id] === "gram") {
        //   weight = convert(weight)
        //     .from("g")
        //     .to("kg");
        // }

        
        if (data.newly_added) {
          let new_data = {
            name: data.name.trim() !== "" ? data.name : "Regular",
            barcode: data.barcode,
            weight: parseInt(inner_data.weight),
            stock: inner_data.quantity ? parseInt(inner_data.quantity) : 0,
            cost: inner_data.cost_price ? inner_data.cost_price : 0,
            selling: inner_data.selling_price ? inner_data.selling_price : 0,
            mrp: inner_data.mrp ? inner_data.mrp : 0,
            id: inner_data.variant_id,
            stock_id: inner_data.id
          };
          variant.push(new_data);
        } else {
          let variant_data = {
            name: data.name.trim() !== "" ? data.name : "Regular",
            barcode: data.barcode,
            weight: parseInt(inner_data.weight),
            stock: inner_data.quantity ? parseInt(inner_data.quantity) : 0,
            cost: inner_data.cost_price ? inner_data.cost_price : 0,
            selling: inner_data.selling_price ? inner_data.selling_price : 0,
            mrp: inner_data.mrp ? inner_data.mrp : 0,
            id: inner_data.variant_id,
            stock_id: inner_data.id
          };
          stock.push(variant_data);
        }
        data_variant = { variant };
        data_stock = { stock };
        return null;
      });
    });

    if(product_type === 2 && weight.some(
      item => item === 0
    )){
      return toaster('error', 'Please enter some base value in weight field')
    }
    
    if (navigator.onLine) {
      var formData = new FormData();
      if (!product_name) {
        toaster("error", "Please enter product name");
        return;
      } else if (product_name.trim().length === 0) {
        toaster("error", "Please enter product name");
        return;
      }
      formData.append("store_id", localStorage.getItem("store"));
      formData.append("product_id", product_id);
      // formData.append("created_date", moment().format("YYYY-MM-DD"));
      formData.append("product_name", product_name);
      formData.append("product_type", product_type);

      formData.append("variant", JSON.stringify(data_variant));
      formData.append("stock", JSON.stringify(data_stock));
      formData.append("hsn_code", hsn_code);
      formData.append("tax_id", tax);
      formData.append("track_inventory", track_inventory ? 1 : 0);
      formData.append("allow_below_zero", allow_below_zero ? 1 : 0);
      formData.append("description", product_description);
      // .toString() used here to convert array of search keyword to comma separated string
      formData.append(
        "search_tag",
        search_keyword.length !== 0 ? search_keyword.toString() : product_name
      );

      formData.append("send_low_stock_alert", send_low_stock_alert ? 1 : 0);
      formData.append("price_change_at_billing", allow_price_change ? 1 : 0);

      formData.append("allow_discount", allow_discount ? 1 : 0);
      formData.append("published", is_published ? 1 : 0);
      if (edit_data.image_url !== "" && image_url === "") {
        axios
          .delete(
            `${API_URL}/api/product/update-others/?image_id=${product_id}`,
            {
              headers: {
                Authorization: "Token " + localStorage.getItem("token")
              }
            }
          )
          .then(response => {
            if (response.data.code === 200) {
              this.props.updateProduct(formData);
              this.setState({ loaderVisible: true });
              update_flag = true;
            }
          })
          .catch(err => {
            toaster(
              "error",
              "Image not deleted successfully"
            );
          });
      } else {
        this.props.updateProduct(formData);
        this.setState({ loaderVisible: true });
        update_flag = true;
      }
    } else {
      toaster(
        "warning",
        "Product can't be updated as internet is not working."
      );
    }
  };

  removeImage = () => {
    this.setState({ image_url: "" });
  };

  onKeyPress = (e, name) => {
    if (e.key === "Enter") {
      if (name === "add_search") {
        this.addSearchKeyword();
      } else if (name === "add_hsn") {
        this.getHSNCode();
      }
    }
  };

  handlePopup = () => {
    return Alert(
      "",
      "You cannot update stock from here, please go to Stock Management to update the stock.",
      "warning"
    );
  };

  render() {
    const {
      product_name,
      product_type,
      variants,
      tax_settings,
      hsn_code,
      tax,
      track_inventory,
      allow_below_zero,
      product_description,
      search_keyword,
      entered_search_keyword,
      image_url,
      send_low_stock_alert,
      allow_price_change,
      allow_discount,
      is_published,

      product_types,
      tax_data,
      hsn_data,
      openHSNPage,
      hsn_selector,
      search_hsn_input,
      loaderVisible
    } = this.state;
    return (
      <div className="products_main_content">
        <LoaderFunc visible={loaderVisible} />
        <div className="billing_products_wrap">
          <div className="d-flex justify-content-between ">
            {/* <h3>Edit Product</h3> */}

            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  {" "}
                  <Link to="/products">Products</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Edit Products
                </li>
              </ol>
            </nav>

            <div className="d-flex ml-auto">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={e => this.submitData(e)}
                >
                  Update
                </button>
                <Link to="/products" className="btn btn-dark ml-1">
                  Cancel
                </Link>
              </div>
            </div>
          </div>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className="nav-link active"
                data-toggle="tab"
                href="#basicDetails"
              >
                Basic Details
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-toggle="tab" href="#otherDetails">
                Other Details
              </a>
            </li>
          </ul>

          <div className="billing_products-tab tab-content w-100 ">
            <div className="tab-pane active" id="basicDetails">
              <form>
                <div className="row">
                  <div className="col-12 col-md-11 mx-auto">
                    <div className="row">
                      <div className="form-group col-12 col-sm-6">
                        <label>PRODUCT TYPE</label>
                        {product_types.map(
                          (option, key) =>
                            option.master_id === product_type && (
                              <input
                                type="text"
                                className="form-control"
                                name="product_type"
                                value={option.name}
                                disabled
                                key={key}
                              />
                            )
                        )}
                      </div>
                      <div className="form-group col-12 col-sm-6">
                        <label>PRODUCT NAME</label>
                        <input
                          type="text"
                          className="form-control"
                          name="product_name"
                          placeholder="e.g: Product Name"
                          value={product_name}
                          onChange={e => this.handleChange(e, "product_name")}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        {variants.map((data, key) => {
                          return (
                            <div className="card bg-white p-3" key={key}>
                              {data.newly_added && (
                                <button
                                  type="button"
                                  className="close text-right"
                                  onClick={e => this.removeAddedBlock(e, key)}
                                >
                                  &times;
                                </button>
                              )}
                              <div className="row">
                                <div className="form-group col-12 col-sm-6 col-md-6">
                                  <label>
                                    Size/Variant <small>(5Kg, Red, etc)</small>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name={data.name}
                                    value={data.name}
                                    placeholder="e.g: Variant Name"
                                    onChange={e =>
                                      this.handleChange(e, "name", key)
                                    }
                                  />
                                </div>
                                <div className="form-group col-12 col-sm-6 col-md-6">
                                  <label>BARCODE</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name={data.barcode}
                                    value={data.barcode}
                                    placeholder="e.g: 123456789123456"
                                    onChange={e =>
                                      this.handleChange(e, "barcode", key)
                                    }
                                  />
                                </div>
                                {/* <div className="form-group col-12 col-sm-6 col-md-4">
                                    <label>
                                      ENTER WEIGHT <small>(IN GRAMS)</small>
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name={data.price_stock.weight}
                                      value={data.price_stock.weight}
                                      onChange={e =>
                                        this.handleChange(e, "weight", key)
                                      }
                                    />
                                  </div> */}
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <div className="table-responsive  mt-2">
                                    <table className="table table-bordered">
                                      {data.price_stock &&
                                        data.price_stock.map(
                                          (stock_data, stock_key) => {
                                            return (
                                              <tbody key={stock_key}>
                                                <tr>
                                                  {product_type === 2 && (
                                                    <th>
                                                      ENTER WEIGHT{" "}
                                                      {/* <small>(IN GRAMS)</small> */}
                                                      {/* <ul className="weight_switch">
                                                        <li>
                                                          <label>
                                                            <input
                                                              type="checkbox"
                                                              name="selected_weight_unit"
                                                              value="gram"
                                                              checked={
                                                                selected_weight_unit[
                                                                  stock_data.id
                                                                ] === "gram"
                                                              }
                                                              onChange={e =>
                                                                this.selectWeightUnit(
                                                                  e,
                                                                  "selected_weight_unit",
                                                                  stock_data.id
                                                                )
                                                              }
                                                            />

                                                            <span>gm</span>
                                                          </label>
                                                        </li>
                                                        <li>
                                                          <label>
                                                            <input
                                                              type="checkbox"
                                                              name="selected_weight_unit"
                                                              value="kg"
                                                              checked={
                                                                selected_weight_unit[
                                                                  stock_data.id
                                                                ] === "kg"
                                                              }
                                                              onChange={e =>
                                                                this.selectWeightUnit(
                                                                  e,
                                                                  "selected_weight_unit",
                                                                  stock_data.id
                                                                )
                                                              }
                                                            />
                                                            <span>Kg</span>
                                                          </label>
                                                        </li>
                                                      </ul> */}
                                                    </th>
                                                  )}
                                                  {product_type !== 3 && (
                                                    <th>STOCK</th>
                                                  )}
                                                  <th>COST</th>
                                                  <th>SELLING PRICE</th>
                                                  <th>MRP</th>
                                                  {/* </thead>
                                                    <tbody> */}
                                                </tr>
                                                <tr>
                                                  {product_type === 2 && (
                                                    <td>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        name={stock_data.weight}
                                                        value={
                                                          stock_data.weight
                                                        }
                                                        placeholder="e.g: 1000 grams"
                                                        onChange={e =>
                                                          this.handleChange(
                                                            e,
                                                            "weight",
                                                            key,
                                                            stock_key
                                                          )
                                                        }
                                                      />
                                                      <small>
                                                        (Add weight in grams)
                                                      </small>
                                                    </td>
                                                  )}
                                                  {product_type !== 3 && (
                                                    <td>
                                                      <input
                                                        type="text"
                                                        className="form-control"
                                                        name={
                                                          stock_data.quantity
                                                        }
                                                        value={
                                                          stock_data.quantity
                                                        }
                                                        onClick={e =>
                                                          this.handlePopup(e)
                                                        }
                                                        readOnly
                                                      />
                                                    </td>
                                                  )}
                                                  <td>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name={
                                                        stock_data.cost_price
                                                      }
                                                      value={
                                                        stock_data.cost_price
                                                      }
                                                      onChange={e =>
                                                        this.handleChange(
                                                          e,
                                                          "cost_price",
                                                          key,
                                                          stock_key
                                                        )
                                                      }
                                                    />
                                                  </td>
                                                  <td>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name={
                                                        stock_data.selling_price
                                                      }
                                                      value={
                                                        stock_data.selling_price
                                                      }
                                                      onChange={e =>
                                                        this.handleChange(
                                                          e,
                                                          "selling_price",
                                                          key,
                                                          stock_key
                                                        )
                                                      }
                                                    />
                                                  </td>
                                                  <td>
                                                    <input
                                                      type="text"
                                                      className="form-control"
                                                      name={stock_data.mrp}
                                                      value={stock_data.mrp}
                                                      onChange={e =>
                                                        this.handleChange(
                                                          e,
                                                          "mrp",
                                                          key,
                                                          stock_key
                                                        )
                                                      }
                                                    />
                                                  </td>
                                                </tr>
                                              </tbody>
                                            );
                                          }
                                        )}
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <button
                          type="button"
                          className="btn btn-dark pull-right"
                          onClick={e => this.addMore(e)}
                        >
                          <i
                            className="fa fa-plus-circle"
                            aria-hidden="true"
                          ></i>{" "}
                          Add More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="tab-pane fade" id="otherDetails">
              <form method="get">
                <div className="row">
                  <div className="col-12 col-md-11 mx-auto">
                    <div className="row">
                      <div className="col-12">
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            onChange={e => this.handleClick(e, "tax_settings")}
                            checked={tax_settings}
                            value={tax_settings}
                            className="custom-control-input"
                            id="taxSettings"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="taxSettings"
                          >
                            TAX SETTINGS
                          </label>
                        </div>
                      </div>
                      {tax_settings && (
                        <div className="col-12">
                          <div className="row">
                            <div className="form-group col-12 col-md-6">
                              <label>HSN CODE</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name=""
                                  value={hsn_code}
                                  placeholder="Enter HSN Code"
                                  // onClick={e => this.callHSNHelper(e)}
                                  onChange={e =>
                                    this.handleChange(e, "hsn_code")
                                  }
                                  // readOnly
                                />
                                <div className="input-group-append">
                                  <span
                                    className="input-group-text bg-white"
                                    onClick={e => this.callHSNHelper(e)}
                                  >
                                    <i
                                      className="fa fa-search"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="form-group col-12 col-md-6">
                              <label>TAX/GST</label>
                              <select
                                className="form-control"
                                value={tax}
                                onChange={e => this.handleChange(e, "tax")}
                              >
                                {tax === "" && (
                                  <option value="">Select your tax</option>
                                )}
                                {tax_data.map((option, key) => (
                                  <option value={option.id} key={key}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                      {product_type !== 3 && (
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 col-md-4 col-lg-3">
                              <div className="custom-control custom-checkbox mb-3">
                                <input
                                  type="checkbox"
                                  onChange={e =>
                                    this.handleClick(e, "track_inventory")
                                  }
                                  checked={track_inventory}
                                  value={track_inventory}
                                  className="custom-control-input"
                                  id="trackInventory"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="trackInventory"
                                >
                                  Track Inventory
                                </label>
                              </div>
                            </div>
                            {track_inventory && (
                              <div className="col-12 col-md-4">
                                <div className="custom-control custom-checkbox mb-3">
                                  <input
                                    type="checkbox"
                                    onChange={e =>
                                      this.handleClick(e, "allow_below_zero")
                                    }
                                    checked={allow_below_zero}
                                    value={allow_below_zero}
                                    className="custom-control-input"
                                    id="allowQuantityBelowZero"
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="allowQuantityBelowZero"
                                  >
                                    Allow Quantity Below Zero
                                  </label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="form-group col-12">
                        <label>
                          PRODUCT DESCRIPTION{" "}
                          <small>(upto 500 characters)</small>
                        </label>
                        <textarea
                          className="form-control"
                          name="product_description"
                          value={product_description}
                          placeholder="Enter Product Description"
                          onChange={e =>
                            this.handleChange(e, "product_description")
                          }
                        ></textarea>
                      </div>
                      <div className="form-group col-12">
                        <label>Search Tags</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            name="entered_search_keyword"
                            placeholder="Enter Search Tags"
                            value={entered_search_keyword}
                            onChange={e =>
                              this.handleChange(e, "entered_search_keyword")
                            }
                            onKeyPress={e => this.onKeyPress(e, "add_search")}
                          />
                          <div
                            className="input-group-append"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="input-group-text bg-white">
                              <i
                                className="fa fa-paper-plane"
                                aria-hidden="true"
                                onClick={e => this.addSearchKeyword(e)}
                              ></i>
                            </span>
                          </div>
                        </div>
                        {search_keyword.map((search_data, search_key) => {
                          return (
                            <span className="search_tag" key={search_key}>
                              {search_data}
                              <button
                                type="button"
                                className="close"
                                onClick={e => this.removeSearch(e, search_key)}
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <div className="form-group col-12">
                        <label>Product Images</label>
                        <div className="card p-3">
                          {image_url ? (
                            <div className="viewUpload-img">
                              <img src={image_url} alt="products" />
                              <button
                                type="button"
                                className="close"
                                onClick={e => this.removeImage(e)}
                              >
                                &times;
                              </button>
                            </div>
                          ) : (
                            <label htmlFor="img_upld" className="upload-img">
                              <input
                                id="img_upld"
                                type="file"
                                onChange={e => this.handleImageChange(e)}
                                accept="image/*"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                      {product_type !== 3 && (
                        <div className="col-12 col-md-5 col-lg-3  pr-0">
                          <div className="custom-control custom-checkbox mb-3">
                            <input
                              type="checkbox"
                              onChange={e =>
                                this.handleClick(e, "send_low_stock_alert")
                              }
                              checked={send_low_stock_alert}
                              value={send_low_stock_alert}
                              className="custom-control-input"
                              id="sendlowstockalerts"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="sendlowstockalerts"
                            >
                              Send low stock alerts
                            </label>
                          </div>
                        </div>
                      )}
                      <div className="col-12 col-md-5 col-lg-3  pr-0">
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            onChange={e =>
                              this.handleClick(e, "allow_price_change")
                            }
                            checked={allow_price_change}
                            value={allow_price_change}
                            className="custom-control-input"
                            id="priceChangeatBilling"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="priceChangeatBilling"
                          >
                            Price Change at Billing
                          </label>
                        </div>
                      </div>
                      <div className="col-12 col-md-5 col-lg-3  pr-0">
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            checked={allow_discount}
                            value={allow_discount}
                            onChange={e =>
                              this.handleClick(e, "allow_discount")
                            }
                            className="custom-control-input"
                            id="allowDis"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="allowDis"
                          >
                            Allow Discount
                          </label>
                        </div>
                      </div>
                      <div className="col-12 col-md-5 col-lg-3 pr-0">
                        <div className="custom-control custom-checkbox mb-3">
                          <input
                            type="checkbox"
                            checked={is_published}
                            value={is_published}
                            onChange={e => this.handleClick(e, "is_published")}
                            className="custom-control-input"
                            id="publishProduct"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="publishProduct"
                          >
                            Publish Product{" "}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {openHSNPage && (
          <ModalPopup
            className="add-modification-flag"
            popupOpen={openHSNPage}
            popupHide={this.closeHSNHelper}
            title="HSN CODE"
            content={
              <div className="billing_products_wrap hsn_code_wrap">
                <div className="card w-100 p-3 mb-3">
                  <div className="row">
                    <div className="col-12 col-md-10">
                      <div className="input-group mb-3">
                        <input
                          className="search_input form-control"
                          type="text"
                          name="search_hsn_input"
                          placeholder="Search..."
                          value={search_hsn_input}
                          onChange={e =>
                            this.handleChange(e, "search_hsn_input")
                          }
                          onKeyPress={e => this.onKeyPress(e, "add_hsn")}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-dark"
                            type="button"
                            onClick={e => this.getHSNCode(e)}
                          >
                            <i className="fa fa-search" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>Search using: </label>
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-5">
                            <div className="custom-control custom-radio">
                              <input
                                type="radio"
                                className="custom-control-input"
                                name="hsn_selector"
                                value="product category"
                                id="product_category"
                                checked={hsn_selector === "product category"}
                                onClick={e =>
                                  this.handleClick(e, "hsn_selector")
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="product_category"
                              >
                                Product category
                              </label>
                            </div>
                          </div>

                          <div className="col-12 col-sm-6 col-md-5">
                            <div className="custom-control custom-radio">
                              <input
                                type="radio"
                                className="custom-control-input"
                                id="hsn_code"
                                name="hsn_selector"
                                value="hsn code"
                                checked={hsn_selector === "hsn code"}
                                onClick={e =>
                                  this.handleClick(e, "hsn_selector")
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="hsn_code"
                              >
                                HSN code
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="small m-0 bg-light p-1">
                    <b>Disclaimer:</b> We are helping you to provide with the
                    best possible HSN Code list. We are not responsible for any
                    wrong HSN Code mapping.
                  </p>
                </div>
                {hsn_data.length !== 0 ? (
                  <div className="card w-100 p-3 mb-3 hsn_popup_content">
                    <div className="row">
                      <div className="col-12">
                        <ul className="hsn_data-list">
                          {hsn_data.map((data, key) => {
                            return (
                              <li
                                value={data.hsn_code}
                                onClick={e =>
                                  this.handleHSNChange(e, "hsn_code")
                                }
                              >
                                {data.hsn_code_type}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card w-100 p-3 mb-3">
                    <h4 className="text-center">No Data Found</h4>
                  </div>
                )}
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
    product_list: store.products.product_list,
    uploaded_image: store.products.uploaded_image,
    hsn_data: store.products.hsn_data,
    update_response: store.products.update_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProducts: params => dispatch(getProducts(params)),
    uploadImage: params => dispatch(uploadImage(params)),
    getHSN: params => dispatch(getHSN(params)),
    updateProduct: params => dispatch(updateProduct(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProducts);
