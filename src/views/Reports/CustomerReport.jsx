import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroller";
import {
  addedCustomerReport,
  notVisitedCustomerReport,
  topSpenderCustomerReport
} from "../../actions/report";
import { Link } from 'react-router-dom'
import moment from "moment";

export class CustomerReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_flag: true,
      selected_class: true,
      customer_added: 0,
      notVisitedCustomer: [],
      topSpender: [],
      total_notv_page: 0,
      total_top_page: 0,
      hasMoreNotvItems: true,
      hasMoreTopItems: true
    };
  }
  componentDidMount() {
    let params = {
      store_id: localStorage.getItem("store"),
      added_days: moment().daysInMonth()
    };
    this.props.addedCustomerReport(params);
    let params1 = {
      store_id: localStorage.getItem("store"),
      page: 1
    };
    this.props.notVisitedCustomerReport(params1);
    let params2 = {
      store_id: localStorage.getItem("store"),
      page: 1,
      days: 30
    };
    this.props.topSpenderCustomerReport(params2);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      added_customer_report,
      not_visited_customer_report,
      spender_customer_report
    } = newProps;
    if (added_customer_report && added_customer_report.code === 200) {
      this.setState({
        customer_added: added_customer_report["customers-added-in-days"]
      });
    }
    if (
      not_visited_customer_report &&
      not_visited_customer_report.code === 200 
    ) {
      let notVisitedCustomer1 = this.state.notVisitedCustomer;
      not_visited_customer_report["inactive-customers"].map(data => {
        return(notVisitedCustomer1.push(data))
      });
      let notVisitedCustomer = notVisitedCustomer1.filter(
        (v, i, a) => a.findIndex(t => t.phone === v.phone) === i
      );
      this.setState({
        notVisitedCustomer: notVisitedCustomer,
        total_notv_page: not_visited_customer_report["pages-count"]
      });
      if (not_visited_customer_report["pages-count"] === 1) {
        this.setState({ hasMoreNotvItems: false });
      }
    }
    if (
      spender_customer_report &&
      spender_customer_report.code === 200 
    ) {
      let topSpender1 = this.state.topSpender;
      spender_customer_report["top-spenders-by-cost"].map(data => {
        return(topSpender1.push(data))
      });
      let topSpender = topSpender1.filter(
        (v, i, a) => a.findIndex(t => t.customer_id === v.customer_id) === i
      );
      this.setState({
        topSpender: topSpender,
        total_top_page: spender_customer_report["pages-count"]
      });
      if (spender_customer_report["pages-count"] === 1) {
        this.setState({ hasMoreTopItems: false });
      }
    }
  }

  handleTab = name => {
    if (name === "not_visited") {
      this.setState({ selected_flag: true, selected_class: true });
    } else if (name === "top_spenders") {
      this.setState({ selected_flag: false, selected_class: false });
    }
  };

  loadNotvItems(pageNumber) {
    if (pageNumber <= this.state.total_notv_page) {
      let params = {
        store_id: localStorage.getItem("store"),
        page: pageNumber
      };

      this.props.notVisitedCustomerReport(params);

    } else {
      this.setState({ hasMoreNotvItems: false });
    }
  }

  loadTopItems(pageNumber) {
    if (pageNumber <= this.state.total_top_page) {
      let params = {
        store_id: localStorage.getItem("store"),
        page: pageNumber,
        days: 30
      };
      this.props.topSpenderCustomerReport(params);

    } else {
      this.setState({ hasMoreTopItems: false });
    }
  }

  render() {
    const {
      selected_class,
      selected_flag,
      hasMoreNotvItems,
      hasMoreTopItems,
      customer_added,
      notVisitedCustomer,
      topSpender
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
              Customer
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-12 col-md-5 mb-2">
            <div className="salesReport_dt d-flex">
              <p className="w-100 m-0 pr-2">
                <small>Customers Added This Month </small>
                <br />
                {customer_added}
              </p>
              <div className="icon icon-shape bg-white  rounded-circle shadow">
                <i className="fa fa-users" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <ul className="nav nav-tabs mt-2">
          <li className="nav-item">
            <span
              className={selected_class ? "nav-link active" : "nav-link"}
              onClick={() => this.handleTab("not_visited")}
            >
              Not visited in last 30 days
            </span>
          </li>
          <li className="nav-item">
            <span
              className={!selected_class ? "nav-link active" : "nav-link"}
              onClick={() => this.handleTab("top_spenders")}
            >
              Top Spenders
            </span>
          </li>
        </ul>
        <div className="tab-content">
          {selected_flag ? (
            <div
              className="pt-2  customer_scroll_notv"
              
              ref={ref => (this.scrollParentRef = ref)}
            >
              <InfiniteScroll
                pageStart={1}
                loadMore={this.loadNotvItems.bind(this)}
                hasMore={hasMoreNotvItems}
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
                  {notVisitedCustomer.map((data, index) => {
                    return (
                      <li className="d-flex p-2 border-bottom" key={index}>
                        <label className="w-50 h5 m-0">
                          {data.name ? data.name : "Test"}
                        </label>
                        <span className="w-50">{data.phone}</span>
                      </li>
                    );
                  })}
                </ul>
              </InfiniteScroll>
            </div>
          ) : (
            <ul className="pt-2 customer_scroll_top">
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
                {/* <ul> */}
                  {topSpender.map((data, index) => {
                    return (
                      <li className="d-flex p-2 border-bottom" key={index}>
                        <label className="w-50 h6 m-0">
                          {data.name ? data.name : "Test"}
                        </label>
                        <span className="w-50">
                          {data.customer_total_purchase_cost}
                        </span>
                      </li>
                    );
                  })}
                {/* </ul> */}
              </InfiniteScroll>
            </ul>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    added_customer_report: store.report.added_customer_report,
    not_visited_customer_report: store.report.not_visited_customer_report,
    spender_customer_report: store.report.spender_customer_report
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addedCustomerReport: params => dispatch(addedCustomerReport(params)),
    notVisitedCustomerReport: params =>
      dispatch(notVisitedCustomerReport(params)),
    topSpenderCustomerReport: params =>
      dispatch(topSpenderCustomerReport(params))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerReport);
