import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import database from "../../database";
import WastageSecond from "./WastageSecond";
export class Wastage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new database(),
      products: [],
      checked_data: [],
      selected_data: [],
      original_product_list: [],
      search_keyword: '',
      pageChange: false
    };
  }
  async componentDidMount() {
    let final = [];
    let checked_data = [];
    let product_data = await this.state.db.getDatabaseProducts();
    if (product_data && product_data.status === 200) {
      product_data.product_list.map((data, key) => {
        // provide data if is_published
        if (data.is_published && data.product_type !== 3) {
          data.variants.map((variant_data, inner_index) => {
            // provide data if product type service(3)
            if (
              variant_data.price_stock[variant_data.price_stock.length - 1]
                .quantity > 0
            ) {
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
                expiry_date: "",
                wastage: ""
              };
              final.push(product_data);
              // if (data.product_type === 2) {
              //   if (data.allow_below_zero) {
              checked_data[variant_data.variant_id] = false;
              //   } else {
              //     checked_data[variant_data.variant_id] = "";
              //   }
              // } else {
              //   if (data.allow_below_zero) {
              //     checked_data[variant_data.variant_id] = false;
              //   } else {
              //     checked_data[variant_data.variant_id] = "";
              //   }
              // }
            }
            return null;
          });
        }
        return null;
      });
      this.setState({ products: final, checked_data, original_product_list: final });
    }
  }
  UNSAFE_componentWillReceiveProps(newProps) { }

  handleCheckBox = (e, index, data) => {
    const { products } = this.state;
    let checked_data = this.state.checked_data;
    let selected_data = [];

    checked_data[index] = !this.state.checked_data[index];
    products.map(data => {
      if (checked_data[data.variants.variant_id]) {
        selected_data.push(data);
      } else {
        let index = selected_data.findIndex(item => data.variants.variant_id === item.variants.variant_id)
        if (index !== -1) {
          selected_data.splice(index, 1)
        }
      }
      return null;
    });
    if (selected_data.length === 0) {
      this.setState({ pageChange: false });
    }

    this.setState({ checked_data, selected_data });
  };

  handlePageChange = (e, value) => {
    this.setState({ pageChange: value });
  };

  handleChange = (e, name) => {
    const { original_product_list } = this.state;
    let productList = this.state.products;
    if (
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
    this.setState({ [name]: e.target.value, products: productList });
  };

  clearSearchProducts = () => {
    const { original_product_list } = this.state;
    this.setState({ products: original_product_list, search_keyword: "" });
  };

  render() {
    const { products, checked_data, selected_data, pageChange, search_keyword } = this.state;
    return (
      <React.Fragment>
        {!pageChange ? (
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
                  <div className="d-flex ml-auto">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn rounded btn-dark grn-btn mb-3 ml-2"
                        onClick={e => this.handlePageChange(e, true)}
                      >
                        Next
                    </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grn-view">
              {products.map((data, index) => {
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
                      {checked_data[data.variants.variant_id] !== "" && (
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
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
            <WastageSecond
              selected_data={selected_data}
              history={this.props.history}
              handlePageChange={e => this.handlePageChange(e)}
              handleCheckBox={this.handleCheckBox}
            />
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Wastage);
