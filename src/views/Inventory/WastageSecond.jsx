import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { submitWastage } from "../../actions/inventory";
import { getProducts } from "../../actions/products";
import database from "../../database";
import moment from "moment";
import * as _ from "lodash";
import { toaster } from "../../helper/Toaster";
let wastageFlag = false;
let product_flag = false;
export class WastageSecond extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new database(),
      product_data: [],
      wastage_flag: [],
      final_page: false,
      final_product: [],
      subtotal: 0,
      total_tax: 0,
      remarks: ""
    };
  }
  async componentDidMount() {
    let wastage_flag = [];
    const { selected_data } = this.props;

    selected_data.map((item, key) => {
      // provide data if is_published
      item.variants.price_stock[
        item.variants.price_stock.length - 1
      ].reason_for_wastage = "expired";
      wastage_flag[item.variants.variant_id] = true;
      item.wastage = "";
      return null;
    });
    this.setState({ product_data: selected_data, wastage_flag });
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    let wastage_flag = [];
    const { selected_data } = newProps;

    selected_data.map((item, key) => {
      // provide data if is_published
      item.variants.price_stock[
        item.variants.price_stock.length - 1
      ].reason_for_wastage = "expired";
      wastage_flag[item.variants.variant_id] = true;
      item.wastage = "";
      return null;
    });
    this.setState({ product_data: selected_data, wastage_flag });

    const { wastage_response } = newProps;
    if (wastage_response.code === 200 && wastageFlag) {
      toaster("success", wastage_response.message);
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
        wastageFlag = false;
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
          all_product_data.product_list && all_product_data.product_list.map(item1 => {
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

  handleChange = (e, name, data) => {
    if (name === "remarks") {
      if (e.target.value.length > 200) {
        return;
      }
      this.setState({ [name]: e.target.value });
      return;
    } else {
      if (
        e.target.value > data.price_stock[data.price_stock.length - 1].quantity
      ) {
        return toaster(
          "error",
          "Quantity can't be greater than stock quantity"
        );
      }
      let product_data = this.state.product_data;
      let product_index = product_data.findIndex(
        x => x.variants.variant_id === data.variant_id
      );
      product_data[product_index].wastage = e.target.value;
      this.setState({ product_data });
    }
  };

  handleCheckBox = (e, data) => {
    let product_data = this.state.product_data;
    let product_index = product_data.findIndex(
      x => x.variants.variant_id === data.variant_id
    );
    product_data[product_index].variants.price_stock[
      product_data[product_index].variants.price_stock.length - 1
    ].reason_for_wastage = e.target.value;
    this.setState({ product_data });
  };

  handleFinalPage = (e, value) => {
    let product = [];
    let subtotal = 0;
    let total_tax = 0;
    this.state.product_data.map(data => {
      let product_data = {
        product_id: data.product_id,
        reason_for_wastage:
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .reason_for_wastage === "expired"
            ? 1
            : 0,
        product_name: data.product_name,
        cost:
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .cost_price,
        mrp:
          data.variants.price_stock[data.variants.price_stock.length - 1].mrp,
        selling:
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price,
        quantity: parseInt(data.wastage),

        sku_code: data.sku_code,

        cgst: this.ConvertToDecimal(
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price -
          (data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price *
            (100 / (100 + data.tax))) /
          2
        ),
        sgst: this.ConvertToDecimal(
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price -
          (data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price *
            (100 / (100 + data.tax))) /
          2
        ),
        igst: 0
      };

      product.push(product_data);

      subtotal =
        subtotal +
        data.variants.price_stock[data.variants.price_stock.length - 1]
          .cost_price *
        data.wastage;
      total_tax =
        total_tax +
        (data.variants.price_stock[data.variants.price_stock.length - 1]
          .selling_price -
          data.variants.price_stock[data.variants.price_stock.length - 1]
            .selling_price *
          (100 / (100 + data.tax)));
      return null;
    });
    let final = { product };
    this.setState({
      final_page: value,
      final_product: final,
      subtotal,
      total_tax
    });
  };

  handleSubmit = e => {
    const { final_product, remarks, subtotal, total_tax } = this.state;

    var formData = new FormData();
    if (remarks === "") {
      return toaster("error", "Please add reason of wastage");
    }
    formData.append("store_id", localStorage.getItem("store"));
    formData.append("products", JSON.stringify(final_product));
    formData.append("cgst", this.ConvertToDecimal(total_tax / 2));
    formData.append("sgst", this.ConvertToDecimal(total_tax / 2));
    formData.append("igst", 1);
    formData.append("sub_total", subtotal);
    formData.append("remark", remarks);
    formData.append("created_by", localStorage.getItem("logged_user_id"));
    if (navigator.onLine) {
      this.props.submitWastage(formData);
      wastageFlag = true;
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
      product_data,
      wastage_flag,
      final_page,
      subtotal,
      remarks
    } = this.state;
    return (
      <div className="w-100 h-100 p-30">
        <div className="d-flex justify-content-between">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/inventory">Inventory</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Wastage
              </li>
            </ol>
          </nav>
          {!final_page ? (
            <div className="d-flex ml-auto">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-dark grn-btn"
                  onClick={e => this.props.handlePageChange(e, false)}
                >
                  Back
                </button>
                {product_data.every(data => data.wastage !== "") && (
                  <button
                    type="button"
                    className="btn btn-dark grn-btn ml-1"
                    onClick={e => this.handleFinalPage(e, true)}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
              <div className="d-flex ml-auto">
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-dark grn-btn"
                    onClick={e => this.handleFinalPage(e, false)}
                  >
                    Back
                </button>
                </div>
              </div>
            )}
        </div>
        {!final_page ? (
          <div className="Wastage_table table-responsive">
            <table className="table grn-view">
              {product_data.map((data, index) => {
                return (
                  <tbody key={index}>
                    <tr>
                      <td>
                        {data.image_url ? (
                          <img
                            src={data.image_url}
                            alt="product"
                            className="product_model_img"
                          />
                        ) : (
                            <img
                              src="/images/product.svg"
                              alt="product"
                              className="product_model_img"
                            />
                          )}
                      </td>
                      <td>
                        <h6 className="mb-1">
                          {data.product_name}, {data.variants.name}
                        </h6>
                        <p className="mb-0 text-success">
                          Current Stock:{" "}
                          {
                            data.variants.price_stock[
                              data.variants.price_stock.length - 1
                            ].quantity
                          }
                        </p>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center">
                          <label className="text-nowrap mr-2 mb-0">
                            Remove Stock:
                          </label>
                          {wastage_flag[data.variants.variant_id] && (
                            <input
                              type="text"
                              autoComplete="off"
                              className="form_control form-control"
                              value={data.wastage}
                              onChange={e =>
                                this.handleChange(e, "wastage", data.variants)
                              }
                            />
                          )}
                        </div>
                      </td>
                      <td>
                        <i className="fa fa-trash" onClick={e => this.props.handleCheckBox(e, data.variants.variant_id, data)} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="pt-0">
                        <div className="d-flex flex-wrap align-items-center">
                          <label className="font-weight-bold m-md-0">
                            Reason for wastage:
                          </label>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="custom-control custom-checkbox ml-3">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={"expired" + data.variants.variant_id}
                                checked={
                                  data.variants.price_stock[
                                    data.variants.price_stock.length - 1
                                  ].reason_for_wastage === "expired"
                                }
                                value="expired"
                                onChange={e =>
                                  this.handleCheckBox(e, data.variants)
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={"expired" + data.variants.variant_id}
                              >
                                Expired
                              </label>
                            </div>
                            <div className="custom-control custom-checkbox ml-3">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id={"damaged" + data.variants.variant_id}
                                checked={
                                  data.variants.price_stock[
                                    data.variants.price_stock.length - 1
                                  ].reason_for_wastage === "damaged"
                                }
                                value="damaged"
                                onChange={e =>
                                  this.handleCheckBox(e, data.variants)
                                }
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={"damaged" + data.variants.variant_id}
                              >
                                Damaged
                              </label>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        ) : (
            <div>
              <div className="w-100 p-3 box_shadow">
                <div className="w-100" id="remarks_collapse">
                  <div className="send_invoice mt-3 mb-3 border p-3">
                    <div className="form-group">
                      <h3 htmlFor="usr">
                        Remarks<small>(upto 200 characters)</small>
                      </h3>
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
                <p className="text-right">
                  <strong>Subtotal: </strong>
                  {subtotal}
                </p>
              </div>
              <div></div>
              <button
                type="button"
                className="btn btn-dark grn-btn float-right mt-4"
                onClick={e => this.handleSubmit(e)}
              >
                Submit
            </button>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    product_list: store.products.product_list,
    wastage_response: store.inventory.wastage_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProducts: params => dispatch(getProducts(params)),
    submitWastage: params => dispatch(submitWastage(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WastageSecond);
