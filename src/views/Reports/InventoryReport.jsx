import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import {
  inventoryReport,
  topSellingReport,
  outOfStockReport
} from "../../actions/report";

export class InventoryReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_flag: true,
      selected_class: true,
      unSoldProduct: 0,
      topSellingProduct: [],
      outStockReport: [],
      total_top_page: 0,
      total_out_page: 0,
      hasMoreTopItems: true,
      hasMoreOutItems: true
    };
  }
  componentDidMount() {
    let params = {
      store_id: localStorage.getItem("store")
    };
    this.props.inventoryReport(params);
    let params1 = {
      store_id: localStorage.getItem("store"),
      page: 1,
      start_date: moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD")
    };
    this.props.topSellingReport(params1);
    let params2 = {
      store_id: localStorage.getItem("store"),
      page: 1
    };
    this.props.outOfStockReport(params2);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { inventory_report, top_selling_report, out_stock_report } = newProps;
    if (inventory_report && inventory_report.code === 200) {
      this.setState({
        unSoldProduct: inventory_report["unsold-products-cp-in-days"]
      });
    }
    if (top_selling_report && top_selling_report.code === 200) {
      let topSellingProduct1 = this.state.topSellingProduct;
      top_selling_report["top-selling"].map(data => {
        return (topSellingProduct1.push(data))
      });
      let topSellingProduct = topSellingProduct1.filter(
        (v, i, a) => a.findIndex(t => t.product_id === v.product_id) === i
      );
      this.setState({
        topSellingProduct,
        total_top_page: top_selling_report["pages-count"]
      });
      if (top_selling_report["pages-count"] === 1) {
        this.setState({ hasMoreTopItems: false });
      }
    }
    if (out_stock_report && out_stock_report.code === 200) {
      let outStockReport1 = this.state.outStockReport;
      out_stock_report["stock-out-data"].map(data => {
        return (outStockReport1.push(data))
      });
      let outStockReport = outStockReport1.filter(
        (v, i, a) => a.findIndex(t => t.product_id === v.product_id) === i
      );
      this.setState({
        outStockReport,
        total_out_page: out_stock_report["pages-count"]
      });
      if (out_stock_report["pages-count"] === 1) {
        this.setState({ hasMoreOutItems: false });
      }
    }
  }

  loadTopItems(pageNumber) {
    if (pageNumber <= this.state.total_top_page) {
      let params = {
        store_id: localStorage.getItem("store"),
        page: pageNumber,
        start_date: moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD")
      };
      this.props.topSellingReport(params);
    } else {
      this.setState({ hasMoreTopItems: false });
    }
  }

  loadOutItems(pageNumber) {
    if (pageNumber <= this.state.total_out_page) {
      let params = {
        store_id: localStorage.getItem("store"),
        page: pageNumber
      };
      this.props.outOfStockReport(params);
    } else {
      this.setState({ hasMoreOutItems: false });
    }
  }

  handleTab = name => {
    if (name === "top_selling") {
      this.setState({ selected_flag: true, selected_class: true });
    } else if (name === "out_stock") {
      this.setState({ selected_flag: false, selected_class: false });
    }
  };

  render() {
    const {
      selected_class,
      selected_flag,
      unSoldProduct,
      topSellingProduct,
      outStockReport,
      hasMoreTopItems,
      hasMoreOutItems
    } = this.state;
    return (
      <div className="billing_products_wrap w-100 h-100 p-30">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link to="/reports">Report</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Inventory
            </li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-12 col-md-6 col-lg-5 mb-2 offset-lg-1">
            <div className="salesReport_dt d-flex">
              <p className="w-100 m-0 pr-2">
                <small>Total Inventory </small>
                <br />
                $2,50,01,000.96
              </p>
              <div className="icon icon-shape bg-white  rounded-circle shadow">
                <i className="fa fa-bar-chart" aria-hidden="true"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-5 mb-2">
            <div className="salesReport_dt d-flex">
              <p className=" w-100 m-0 pr-2">
                <small>Products not sold in last 30 days</small>
                <br />
                {unSoldProduct.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
              <div className="icon icon-shape bg-white  rounded-circle shadow">
                <i className="fa fa-area-chart" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col-12">
            <ul className="nav nav-tabs mt-2">
              <li className="nav-item">
                <span
                  className={selected_class ? "nav-link active" : "nav-link"}
                  onClick={() => this.handleTab("top_selling")}
                >
                  Top Selling Products List
                </span>
              </li>
              <li className="nav-item">
                <span
                  className={!selected_class ? "nav-link active" : "nav-link"}
                  onClick={() => this.handleTab("out_stock")}
                >
                  Product out of Stock
                </span>
              </li>
            </ul>
            <div className="tab-content">
              {selected_flag ? (

                topSellingProduct.length !== 0 ? (
                  <div
                    className="pt-2 inventory_scroll_top"
                    ref={ref => (this.scrollParentRef = ref)}
                  >
                    <InfiniteScroll
                      pageStart={1}
                      loadMore={this.loadTopItems.bind(this)}
                      hasMore={hasMoreTopItems}
                      loader={
                        <div className="loader" key={0}>
                          Loading ...
                      </div>
                      }
                      useWindow={false}
                      initialLoad={false}
                      getScrollParent={() => this.scrollParentRef}
                    >
                      <ul>
                        {topSellingProduct.map((data, index) => {
                          return (
                            <li className="d-flex p-2 border-bottom" key={index}>
                              <label className="w-50 h6 m-0">
                                {data.name}
                                <br />
                                <small className="text-danger">Qty Sold</small>
                              </label>
                              <span className="w-50 h5 m-0 text-right">
                                {data.sold_quantity}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </InfiniteScroll>
                  </div>
                ) : (
                    <div className="no_data_found">
                      <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>No Product Found</h3>
                    </div>
                  )
              ) : (outStockReport.length !== 0 ? (
                <ul
                  className="pt-2 inventory_scroll_out"
                  ref={ref => (this.scrollParentRef = ref)}
                >
                  <InfiniteScroll
                    pageStart={1}
                    loadMore={this.loadOutItems.bind(this)}
                    hasMore={hasMoreOutItems}
                    loader={
                      <div className="loader" key={0}>
                        Loading ...
                      </div>
                    }
                    useWindow={false}
                    initialLoad={false}
                    getScrollParent={() => this.scrollParentRef}
                  >
                    {/* <ul> */}
                    {outStockReport.map((data, index) => {
                      return (
                        <li className="d-flex p-2 border-bottom" key={index}>
                          <label className="w-100 h6 m-0">{data.name}</label>
                        </li>
                      );
                    })}
                    {/* </ul> */}
                  </InfiniteScroll>

                </ul>
              ) : (
                  <div className="no_data_found">
                    <h2>
                      <i
                        className="fa fa-exclamation-triangle"
                        aria-hidden="true"
                      ></i>
                    </h2>
                    <h3>No Product Found</h3>
                  </div>
                )
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    inventory_report: store.report.inventory_report,
    top_selling_report: store.report.top_selling_report,
    out_stock_report: store.report.out_stock_report
  };
};

const mapDispatchToProps = dispatch => {
  return {
    inventoryReport: params => dispatch(inventoryReport(params)),
    topSellingReport: params => dispatch(topSellingReport(params)),
    outOfStockReport: params => dispatch(outOfStockReport(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InventoryReport);
