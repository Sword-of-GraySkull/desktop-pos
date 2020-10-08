import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { allHomeReport } from "../../actions/report";
export class Reports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      home_data: {}
    };
  }
  componentDidMount() {
    this.props.allHomeReport();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const {all_home_report} = newProps;

    if (all_home_report && all_home_report.code === 200) {
      this.setState({
        home_data: all_home_report
      });
    }
  }

  render() {
    const { home_data } = this.state;
    return (
      <div className="w-100 h-100 p-30">
        <div className="heading">
          <h3>Reports</h3>
        </div>
        <div className="row">
          <Link
            to="/reports/sales-report"
            className="col-12 col-sm-6 col-lg-4 mb-4"
          >
            <div className="card card-stats m-0 bg-gradient-info">
              <div className="card-body">
                <div className="row flex-nowrap">
                  <div className="col">
                    <h5 className="card-title text-uppercase mb-0">
                      Today's Sale
                    </h5>
                    <span className="h2 font-weight-bold mb-0">
                      {'\u20B9'}
                      {(home_data.today_sale && home_data.today_sale.today_sale) ? (home_data.today_sale && home_data.today_sale.today_sale) : 0}
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-white  rounded-circle shadow">
                      <i className="fa fa-bar-chart" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <p className="mt-3 mb-0 text-white text-sm">
                  <span className="text-nowrap">Sales Report</span>
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/reports/report-inventory"
            className="col-12 col-sm-6 col-lg-4 mb-4"
          >
            <div className="card card-stats m-0 bg-gradient-success">
              <div className="card-body">
                <div className="row flex-nowrap">
                  <div className="col">
                    <h5 className="card-title text-uppercase mb-0">
                      Stock In Hand
                    </h5>
                    <span className="h2 font-weight-bold mb-0">
                      {'\u20B9'}{(home_data.stock_in_hand && home_data.stock_in_hand.inventory_cost) ? (home_data.stock_in_hand && home_data.stock_in_hand.inventory_cost) : 0}
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-white rounded-circle shadow">
                      <i className="fa fa-line-chart" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <p className="mt-3 mb-0 text-white text-sm">
                  <span className="text-nowrap">Inventory Reports</span>
                </p>
              </div>
            </div>
          </Link>
          <Link
            to="/reports/customer-report"
            className="col-12 col-sm-6 col-lg-4 mb-4"
          >
            <div className="card card-stats m-0 bg-gradient-danger">
              <div className="card-body">
                <div className="row flex-nowrap">
                  <div className="col">
                    <h5 className="card-title text-uppercase mb-0">
                      Total Customers
                    </h5>
                    <span className="h2 font-weight-bold mb-0">
                      {home_data.total_customer ? home_data.total_customer : 0}
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-white rounded-circle shadow">
                      <i className="fa fa-users" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <p className="mt-3 mb-0 text-white text-sm">
                  <span className="text-nowrap">Customer Report</span>
                </p>
              </div>
            </div>
          </Link>
          {/* <div className="col-12 col-sm-6 col-lg-4 mb-4">
            <div className="card card-stats m-0 bg-gradient-warning">
              <div className="card-body">
                <div className="row flex-nowrap">
                  <div className="col">
                    <h5 className="card-title text-uppercase mb-0">
                      Inventory Purchased
                    </h5>
                    <span className="h2 font-weight-bold mb-0">
                      Comming Soon
                    </span>
                  </div>
                  <div className="col-auto">
                    <div className="icon icon-shape bg-white rounded-circle shadow">
                      <i className="fa fa-money" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
                <p className="mt-3 mb-0 text-white text-sm">
                  <span className="text-nowrap">Purchase Reports</span>
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    all_home_report: store.report.all_home_report
  };
};

const mapDispatchToProps = dispatch => {
  return {
    allHomeReport: () => dispatch(allHomeReport())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Reports);
