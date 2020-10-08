import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";
import { connect } from "react-redux";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { PaginationComponent } from "../../helper/Pagination";
import { getUnpublishedProducts } from "../../actions/products";
import database from "../../database";
let un_publish_product_flag = false;
class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_keyword: "",
      product_data: [],
      varient_data: [],
      product_data_actual: [],
      filetred_data: [],
      searched_data: [],
      activePage: 1,
      starting_index: 0,
      last_index: 50,
      db: new database(),
      show_class: true,
      barcoded: false,
      loaderVisible: true
    };
  }
  async componentDidMount() {
    if (navigator.onLine) {
      this.setState({ loaderVisible: true });
    }else{
      this.setState({ loaderVisible: false });
    }
    const { starting_index, last_index } = this.state;
    const product_data = await this.state.db.getDatabaseProducts();
    // provide product list present in database
    if (product_data) {
      this.setState({
        product_data_actual: product_data.product_list,
        product_data: product_data.product_list
      });
      let product_data1 = product_data.product_list.filter(o => o.is_published);
      // used to show published data by default for first page i.e 0 to 50 records
      product_data1 = product_data1.filter(
        (data, idx) => idx >= starting_index && idx < last_index
      );
      let varient_data = this.state.varient_data;
      product_data1.map((item, key) => {
        return varient_data[item.product_id] =
          item.variants[0] && item.variants[0].variant_id;
      });
      this.setState({
        filetred_data: product_data1,
        show_class: true,
        varient_data
      });
    }
    let params1 = {
      store_id: localStorage.getItem("store"),
      page: 1,
      is_published: 0
    };
    un_publish_product_flag = true;
    await this.props.getUnpublishedProducts(params1);
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.keyword
    ) {
      this.setState({ search_keyword: this.props.location.state.keyword });
      this.searchProducts(this.props.location.state.keyword);
    }
    this.setState({ loaderVisible: false });
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.product_list_unpublished.code === 200 &&
      un_publish_product_flag
    ) {
      const res = await this.state.db.getDatabaseUnpublishedProducts();
      if (res && res.status === 200) {
        let doc = {
          _id: "productListUnpublish",
          status: 200,
          _rev: res._rev,
          product_list_unpublished: newProps.product_list_unpublished.products
        };
        await this.state.db.updateDatabaseProducts(doc);
      } else {
        let doc = {
          _id: "productListUnpublish",
          status: 200,
          product_list_unpublished: newProps.product_list_unpublished.products
        };
        await this.state.db.addDatabase(doc);
      }
      const all_product_data = await this.state.db.getDatabaseProducts();
      if (
        all_product_data &&
        (all_product_data.status === 200 ||
          (all_product_data.products && all_product_data.products.length !== 0))
      ) {
        let data = all_product_data.product_list;
        newProps.product_list_unpublished.products.map(item1 => {
          let index = data.findIndex(
            item2 => item2.product_id === item1.product_id
          );
          if (index !== -1) {
            data.splice(index, 1);
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
        await this.state.db.updateDatabaseProducts(doc);
      }
      for (var i = 2; i <= newProps.product_list_unpublished.num_pages; i++) {
        let params = {
          store_id: localStorage.getItem("store"),
          page: i,
          is_published: 0
        };
        un_publish_product_flag = true;

        await this.props.getUnpublishedProducts(params);
        if (i === newProps.product_list_unpublished.num_pages) {
          un_publish_product_flag = false;
        }
      }
    }
  }

  // calls when variant switches
  changeVariant = (e, selected_product_id, selected_variant_data) => {
    let varient_data = this.state.varient_data;
    varient_data[selected_product_id] = selected_variant_data.variant_id;
    this.setState({
      varient_data: varient_data
    });
  };

  publishedProduct = () => {
    const { product_data_actual } = this.state;
    let product_data1 = product_data_actual.filter(o => o.is_published);
    // provide published data of record 0 to 50
    this.setState({ product_data: product_data_actual });
    product_data1 = product_data1.filter((data, idx) => idx >= 0 && idx < 50);
    this.setState({
      filetred_data: product_data1,
      show_class: true,
      activePage: 1,
      starting_index: 0,
      last_index: 50,
      search_keyword: ""
    });
    // provide published data list and active class
  };

  async unPublishedProduct() {
    // const { product_data } = this.state;
    // let product_data1 = product_data.filter(o => !o.is_published);
    // // provide unpublished data of record 0 to 50
    // product_data1 = product_data1.filter((data, idx) => idx >= 0 && idx < 50);
    // this.setState({
    //   filetred_data: product_data1,
    //   show_class: false,
    //   activePage: 1,
    //   starting_index: 0,
    //   last_index: 50
    // });

    const product_data = await this.state.db.getDatabaseUnpublishedProducts();
    // provide product list present in database
    if (product_data) {
      this.setState({ product_data: product_data.product_list_unpublished });
      let product_data1 = product_data.product_list_unpublished.filter(
        o => !o.is_published
      );
      // used to show published data by default for first page i.e 0 to 50 records
      product_data1 = product_data1.filter((data, idx) => idx >= 0 && idx < 50);
      let varient_data = this.state.varient_data;
      product_data1.map((item, key) => {
        return varient_data[item.product_id] =
          item.variants[0] && item.variants[0].variant_id;
      });
      this.setState({
        filetred_data: product_data1,
        show_class: false,
        activePage: 1,
        starting_index: 0,
        last_index: 50,
        search_keyword: "",
        varient_data
      });
    }

  }
  searchProducts = data => {
    const {
      product_data,

      show_class
    } = this.state;

    // let searched_data = filetred_data.filter(o => (o.product_name.includes(search_keyword) || o.search_keyword.includes(search_keyword)));
    let searched_data = [];
    let search_keyword = data;
    if (search_keyword) {
      product_data.map((item, key) => {
        let data = item.variants.filter(
          t =>
            t.name.toLowerCase().includes(search_keyword.toLowerCase()) ||
            t.barcode.toLowerCase().includes(search_keyword.toLowerCase())
        );
        if (
          item.product_name
            .toLowerCase()
            .includes(search_keyword.toLowerCase()) ||
          (item.search_keyword !== null &&
            item.search_keyword
              .toLowerCase()
              .includes(search_keyword.toLowerCase())) ||
          data.length !== 0
        ) {
          searched_data.push(item);
        }
        return null;
      });
      // searched_data fetch searched data from all records on the basis of product name, variant name, search keyword, barcode
      searched_data = searched_data.filter((data, idx) => idx >= 0 && idx < 50);
      // provide data from 0 to 50
      this.setState({
        filetred_data: searched_data,
        searched_data,
        activePage: 1
      });
    } else {
      // calls when hit empty search
      if (show_class) {
        let product_data1 = product_data.filter(o => o.is_published);
        product_data1 = product_data1.filter(
          (data, idx) => idx >= 0 && idx < 50
        );
        this.setState({ filetred_data: product_data1, activePage: 1 });
        // provide paginated published data if user is on published product tab
      } else {
        let product_data1 = product_data.filter(o => !o.is_published);
        product_data1 = product_data1.filter(
          (data, idx) => idx >= 0 && idx < 50
        );
        this.setState({ filetred_data: product_data1, activePage: 1 });
        // provide paginated unpublished data if user is on unpublished product tab
      }
    }
  };

  // onKeyPress = e => {
  //   if (e.key === "Enter") {
  //     this.searchProducts();
  //   }
  // };

  clearSearchProducts = () => {
    const { product_data, show_class } = this.state;
    this.setState({ search_keyword: "" });
    if (show_class) {
      let product_data1 = product_data.filter(o => o.is_published);
      product_data1 = product_data1.filter((data, idx) => idx >= 0 && idx < 50);
      this.setState({ filetred_data: product_data1, activePage: 1 });
      // provide paginated published data if user is on published product tab
    } else {
      let product_data1 = product_data.filter(o => !o.is_published);
      product_data1 = product_data1.filter((data, idx) => idx >= 0 && idx < 50);
      this.setState({ filetred_data: product_data1, activePage: 1 });
      // provide paginated unpublished data if user is on unpublished product tab
    }
  };

  handleChange = (e, name) => {
    if (
      name === "search_keyword" &&
      (e.target.value.length > 2 || e.target.value.length === 0)
    ) {
      this.searchProducts(e.target.value);
    }
    this.setState({ [name]: e.target.value });
  };

  handlePageChange = pageNumber => {

    const { search_keyword, product_data, searched_data } = this.state;
    let activePagetemp = pageNumber;
    let startingIndextemp = (pageNumber - 1) * 50;
    let lastIndextemp = startingIndextemp + 49;
    if (search_keyword) {
      // call when pagination apply on searched data
      this.setState({
        activePage: activePagetemp,
        starting_index: startingIndextemp,
        last_index: lastIndextemp
      });
      let product_data1 = searched_data.filter(
        (data, idx) => idx >= startingIndextemp && idx < lastIndextemp
      );
      let varient_data = this.state.varient_data;
      product_data1.map((item, key) => {
        return varient_data[item.product_id] =
          item.variants[0] && item.variants[0].variant_id;
      });
      this.setState({ filetred_data: product_data1, varient_data });
    } else {
      // call when pagination apply on all products
      this.setState({
        activePage: activePagetemp,
        starting_index: startingIndextemp,
        last_index: lastIndextemp
      });
      if (this.state.show_class) {
        let product_data1 = product_data.filter(o => o.is_published);
        product_data1 = product_data1.filter(
          (data, idx) => idx >= startingIndextemp && idx < lastIndextemp
        );
        let varient_data = this.state.varient_data;
        product_data1.map((item, key) => {
          return varient_data[item.product_id] =
            item.variants[0] && item.variants[0].variant_id;
        });
        this.setState({ filetred_data: product_data1, varient_data });
      } else {
        let product_data1 = product_data.filter(o => !o.is_published);
        product_data1 = product_data1.filter(
          (data, idx) => idx >= startingIndextemp && idx < lastIndextemp
        );
        let varient_data = this.state.varient_data;
        product_data1.map((item, key) => {
          return varient_data[item.product_id] =
            item.variants[0] && item.variants[0].variant_id;
        });
        this.setState({ filetred_data: product_data1, varient_data });
      }
    }
  };

  addProduct = (e, redirect, keyword, barcoded) => {
    this.props.history.push({
      pathname: "/products-add",
      state: { redirected: redirect, keyword: keyword, barcoded: barcoded }
    });
  };

  keyData = (e, name) => {
    if (name === "search_keyword") {
      if (e.key === "Enter") {
        this.setState({ barcoded: true });
      } else {
        this.setState({ barcoded: false });
      }
    }
  };

  render() {
    const {
      show_class,
      activePage,
      filetred_data,
      product_data,
      searched_data,
      search_keyword,
      barcoded,
      varient_data,
      loaderVisible
    } = this.state;
    return (
      <div className="products_main_content">
        <LoaderFunc visible={loaderVisible} />
        <div className="billing_products_wrap">
          <div className="d-flex justify-content-between ">
            <h3>Product List</h3>

            <div className="d-flex justify-content-center h-100 top-right">
              <div className="searchbar">
                <input
                  className="search_input"
                  type="text"
                  placeholder="Search..."
                  autoComplete="off"
                  name="search_keyword"
                  value={search_keyword}
                  onChange={e => this.handleChange(e, "search_keyword")}
                  onKeyUp={e => this.keyData(e, "search_keyword")}
                // onKeyPress={this.onKeyPress}
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
              <Link to="/products-add" className="add_btn btn">
                <i className="fa fa-plus mr-1" aria-hidden="true" />
                ADD
              </Link>
            </div>
          </div>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <span
                className={
                  show_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.publishedProduct()}
              >
                Published Products
              </span>
            </li>
            <li className="nav-item">
              <span
                className={
                  !show_class
                    ? "product_list_class nav-link active"
                    : "product_list_class nav-link"
                }
                onClick={() => this.unPublishedProduct()}
              >
                Unpublished Products
              </span>
            </li>
          </ul>
          {filetred_data.length !== 0 ? (
            <div className="billing_products-tab w-100">
              <table className="table billing_prodcuts">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="text-right">Stock</th>
                    <th className="text-right">MRP</th>
                    <th className="text-right">Selling Price</th>
                    <th className="text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {filetred_data.map((item, key) => {
                    return (
                      <tr key={key}>
                        <td>
                          <div className="d-flex b_product">
                            <div className="product_img">
                              {item.image_url ? (
                                <img src={item.image_url} alt="product" />
                              ) : (
                                  <img src="images/product.svg" alt="product" />
                                )}
                            </div>
                            <div className="product_info">
                              <h5>
                                {item.variants.length === 1
                                  ? item.product_name +
                                  "," +
                                  " " +
                                  item.variants[0].name
                                  : item.product_name}
                              </h5>
                              {item.variants.length !== 1 && (
                                <ul className="p_varients">
                                  {item.variants.map(
                                    (variant_data, variant_key) => {
                                      return (
                                        item.variants.length !== 1 && (
                                          <li key={variant_key}>
                                            <label>
                                              <input
                                                type="radio"
                                                name="varient_data"
                                                value={
                                                  varient_data[item.product_id]
                                                }
                                                onChange={e =>
                                                  this.changeVariant(
                                                    e,
                                                    item.product_id,
                                                    variant_data
                                                  )
                                                }
                                              />

                                              <span
                                                className={
                                                  varient_data[
                                                    item.product_id
                                                  ] === variant_data.variant_id
                                                    ? "checked"
                                                    : "********"
                                                }
                                              >
                                                {variant_data.name}
                                              </span>
                                            </label>
                                          </li>
                                        )
                                      );
                                    }
                                  )}
                                </ul>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          {item.variants.map((variant_data, variant_key) => {
                            return (
                              varient_data[item.product_id] ===
                              variant_data.variant_id &&
                              item.product_type !== 3 && (
                                <span
                                  className={classnames({
                                    stock_red:
                                      (variant_data.price_stock[
                                        variant_data.price_stock &&
                                        variant_data.price_stock.length - 1
                                      ] &&
                                        variant_data.price_stock[
                                          variant_data.price_stock &&
                                          variant_data.price_stock.length - 1
                                        ].quantity) < 0,
                                    stock_green:
                                      (variant_data.price_stock[
                                        variant_data.price_stock &&
                                        variant_data.price_stock.length - 1
                                      ] &&
                                        variant_data.price_stock[
                                          variant_data.price_stock &&
                                          variant_data.price_stock.length - 1
                                        ].quantity) > 0,
                                    default_stock:
                                      (variant_data.price_stock[
                                        variant_data.price_stock &&
                                        variant_data.price_stock.length - 1
                                      ] &&
                                        variant_data.price_stock[
                                          variant_data.price_stock &&
                                          variant_data.price_stock.length - 1
                                        ].quantity) === 0
                                  })}
                                  key={variant_key}
                                >
                                  {
                                    variant_data.price_stock[
                                      variant_data.price_stock &&
                                      variant_data.price_stock.length - 1
                                    ].quantity
                                  }
                                </span>
                              )
                            );
                          })}
                        </td>
                        <td className="text-right">
                          {"\u20B9"}{" "}
                          {item.variants.map((variant_data, variant_key) => {
                            return (
                              varient_data[item.product_id] ===
                              variant_data.variant_id &&
                              variant_data.price_stock[
                              variant_data.price_stock &&
                              variant_data.price_stock.length - 1
                              ] &&
                              variant_data.price_stock[
                                variant_data.price_stock &&
                                variant_data.price_stock.length - 1
                              ].mrp
                            );
                          })}
                        </td>
                        <td className="text-right">
                          {"\u20B9"}{" "}
                          {item.variants.map((variant_data, variant_key) => {
                            return (
                              varient_data[item.product_id] ===
                              variant_data.variant_id &&
                              (variant_data.price_stock[variant_data.price_stock && variant_data.price_stock.length - 1] &&
                                variant_data.price_stock[variant_data.price_stock && variant_data.price_stock.length - 1].selling_price)
                            );
                          })}
                        </td>
                        <td className="text-right">
                          <Link
                            to={{
                              pathname: "/products-edit",
                              state: { data: item }
                            }}
                            className="add_btn btn"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {product_data.length > 50 && (
                <PaginationComponent
                  activePage={activePage}
                  itemsCountPerPage={50}
                  totalItemsCount={
                    search_keyword ? searched_data.length : product_data.length
                  }
                  pageRangeDisplayed={5}
                  handlePageChange={this.handlePageChange}
                />
              )}
              {/* used to apply pagination on the page */}
            </div>
          ) : (
              <div className="no_data_found">
                {!show_class &&
                  <h2>
                    <i
                      className="fa fa-exclamation-triangle"
                      aria-hidden="true"
                    ></i>
                  </h2>}
                {!search_keyword ? (
                  !show_class &&
                  <h3>No Product Found</h3>
                ) : (
                    <React.Fragment>
                      <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>No Data Found would you like to add product</h3>
                      <button
                        type="button"
                        className='btn rounded btn-dark grn-btn'
                        onClick={e =>
                          this.addProduct(
                            e,
                            "product_page",
                            search_keyword,
                            barcoded
                          )
                        }
                      >
                        Add
                  </button>
                    </React.Fragment>
                  )}
              </div>
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    product_list_unpublished: store.products.product_list_unpublished
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUnpublishedProducts: params => dispatch(getUnpublishedProducts(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
