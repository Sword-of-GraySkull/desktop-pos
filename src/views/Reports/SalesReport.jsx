import React, { Component } from "react";
import { connect } from "react-redux";
import { salesReport } from "../../actions/report";
import moment from "moment";
import { Link } from "react-router-dom";
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
// import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
export class SalesReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_option: "today",
      start_date: moment(),
      end_date: moment(),
      sales: {},
      datePickerIsOpen: false,
      focusedInput: "startDate"
    };
  }
  componentDidMount() {
    let params = {
      store_id: localStorage.getItem("store"),
      // start_date: start_date,
      // end_date: end_date
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD")
    };
    this.props.salesReport(params);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { sales_report } = newProps;

    if (sales_report && sales_report.code === 200) {
      this.setState({
        sales: sales_report
      });
    }
  }

  handleClick = (e, name) => {
    if (e.target.value === "today") {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: moment().format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
    } else if (e.target.value === "yesterday") {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD"),
        end_date: moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
    } else if (e.target.value === "week") {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: moment()
          .startOf("isoWeek")
          .format("YYYY-MM-DD"),
        end_date: moment()
          .endOf("isoWeek")
          .format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
    } else if (e.target.value === "month") {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: moment()
          .startOf("month")
          .format("YYYY-MM-DD"),
        end_date: moment()
          .endOf("month")
          .format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
    } else if (e.target.value === "thirtydays") {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: moment()
          .subtract(30, "days")
          .format("YYYY-MM-DD"),
        end_date: moment().format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
    } else if (e.target.value === "daterange") {
      this.setState({ datePickerIsOpen: !this.state.datePickerIsOpen });
    }
    this.setState({ [name]: e.target.value });
  };

  closeModal = () => {
    this.setState({ datePickerIsOpen: false });
  };

  handleDateChange = (e,startDate, endDate) => {
    this.setState({ start_date: e.start, end_date: e.end });
    if (e.start !== null && e.end !== null) {
      let params = {
        store_id: localStorage.getItem("store"),
        start_date: e.start.format("YYYY-MM-DD"),
        end_date: e.end.format("YYYY-MM-DD")
      };
      this.props.salesReport(params);
      this.setState({ datePickerIsOpen: false });
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
      selected_option,
      start_date,
      end_date,
      sales,
      datePickerIsOpen
    } = this.state;
    const customVal = moment.range(this.state.start_date,this.state.end_date)
    
    return (
      <div className="w-100 h-100 p-30">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link to="/reports">Report</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Sales
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-12">
            <label className="h5 mb-2">Choose Date Range:</label>
            <ul className="row data_lst-view">
              <li className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="todayCheck"
                    name="dataRange"
                    value="today"
                    checked={selected_option === "today"}
                    onChange={e => this.handleClick(e, "selected_option")}
                  />
                  <label className="custom-control-label" htmlFor="todayCheck">
                    Today
                    <br />
                    <span>{moment().format("DD MMM")}</span>
                  </label>
                </div>
              </li>
              <li className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="yesterCheck"
                    name="dataRange"
                    value="yesterday"
                    checked={selected_option === "yesterday"}
                    onChange={e => this.handleClick(e, "selected_option")}
                  />
                  <label className="custom-control-label" htmlFor="yesterCheck">
                    Yesterday
                    <br />
                    <span>
                      {moment()
                        .subtract(1, "days")
                        .format("DD MMM")}
                    </span>
                  </label>
                </div>
              </li>
              <li className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="currentWeekCheck"
                    name="dataRange"
                    value="week"
                    checked={selected_option === "week"}
                    onChange={e => this.handleClick(e, "selected_option")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="currentWeekCheck"
                  >
                    Current Week
                    <br />
                    {/* <span>01 Oct - 07 Oct</span> */}
                    <span>
                      {moment()
                        .startOf("isoWeek")
                        .format("DD MMM")}{" "}
                      -{" "}
                      {moment()
                        .endOf("isoWeek")
                        .format("DD MMM")}
                    </span>
                  </label>
                </div>
              </li>
              <li className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="currentMonthCheck"
                    name="dataRange"
                    value="month"
                    checked={selected_option === "month"}
                    onChange={e => this.handleClick(e, "selected_option")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="currentMonthCheck"
                  >
                    Current Month
                    <br />
                    {/* <span>01 {moment().format('MMM')} - 07 Oct</span> */}
                    <span>
                      {moment()
                        .startOf("month")
                        .format("DD MMM")}{" "}
                      -{" "}
                      {moment()
                        .endOf("month")
                        .format("DD MMM")}
                    </span>
                  </label>
                </div>
              </li>
              <li className="col-12 col-sm-6 col-lg-4 mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="lastDaysCheck"
                    name="dataRange"
                    value="thirtydays"
                    checked={selected_option === "thirtydays"}
                    onChange={e => this.handleClick(e, "selected_option")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="lastDaysCheck"
                  >
                    Last 30 Days
                    <br />
                    <span>
                      {moment()
                        .subtract(30, "days")
                        .format("DD MMM")}{" "}
                      - {moment().format("DD MMM")}
                    </span>
                  </label>
                </div>
              </li>
              <li className="col-12 col-sm-6 col-lg-4 dropdown mb-3">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    className="custom-control-input"
                    id="customDataRangeCheck"
                    name="dataRange"
                    value="daterange"
                    checked={selected_option === "daterange"}
                    onClick={e => this.handleClick(e, "selected_option")}
                    //don't change to onchange to remove warning because it disable click 2nd time
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customDataRangeCheck"
                  >
                    Custom Date Range
                    <br />
                    <span>
                      {start_date && start_date.format("YYYY-MM-DD")}-
                      {end_date && end_date.format("YYYY-MM-DD")}
                    </span>
                  </label>
                </div>

                {datePickerIsOpen && (
                  <div className="dropdown-menu">
                    {/* <DateRangePicker
                      // startDate={this.state.start_date}
                      // startDateId="your_unique_start_date_id"
                      // endDate={this.state.end_date}
                      // endDateId="your_unique_end_date_id"
                      // readOnly={true}
                      // numberOfMonths={1}
                      // minimumNights={0}
                      // keepOpenOnDateSelect={true}
                      ranges={[{
                        startDate: this.state.start_date,
                        endDate: this.state.end_date,
                        key: 'selection',
                      }]}
                      onChange={({ startDate, endDate }) =>
                        this.handleDateChange(startDate, endDate)
                      }
                      // focusedInput={this.state.focusedInput}
                      // onFocusChange={focusedInput =>
                      //   this.setState({ focusedInput })
                      // }
                    /> */}
                    <DateRangePicker
                      value={customVal}
                      maximumDate={moment()}
                      onSelect={(e) =>
                        this.handleDateChange(e)
                      }
                      singleDateRange={true}
                    />
                  </div>
                )}
              </li>
            </ul>
            <hr />

            <div className="row mb-4">
              <div className="col-12 col-md-3 col-lg-3 mt-2">
                <div className="salesReport_dt d-flex">
                  <p className="w-100 m-0 pr-2">
                    {selected_option === "today" && <small>Today's Sale</small>}
                    {selected_option === "yesterday" && (
                      <small>Yesterday's Sale</small>
                    )}
                    {selected_option === "week" && (
                      <small>Current Week Sale</small>
                    )}
                    {selected_option === "month" && (
                      <small>Current Month Sale</small>
                    )}
                    {selected_option === "thirtydays" && (
                      <small>Last 30 days Sale</small>
                    )}
                    {selected_option === "daterange" && (
                      <small> Date Range's Sale</small>
                    )}

                    <br />
                    {"\u20B9"}
                    {sales.total_sale && sales.total_sale.today_sale
                      ? sales.total_sale && sales.total_sale.today_sale
                      : 0}
                  </p>
                  {/*<div className="icon icon-shape bg-white  rounded-circle shadow">
                    <i className="fa fa-bar-chart" aria-hidden="true"></i>
                  </div>*/}
                </div>
              </div>
              <div className="col-12 col-md-3 col-lg-3 mt-2">
                <div className="salesReport_dt d-flex">
                  <p className=" w-100 m-0 pr-2">
                    <small>Avg.Basket Size</small>
                    <br />
                    {"\u20B9"}
                    {sales.total_transactions !== 0 &&
                    sales.total_transactions !== undefined
                      ? (this.ConvertToDecimal((sales.total_sale && sales.total_sale.today_sale
                          ? sales.total_sale && sales.total_sale.today_sale
                          : 0) /
                        (sales.total_transactions
                          ? sales.total_transactions
                          : 0)))
                      : 0}
                  </p>
                  {/*<div className="icon icon-shape bg-white  rounded-circle shadow">
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                  </div>*/}
                </div>
              </div>
              <div className="col-12 col-md-3 col-lg-3 mt-2">
                <div className="salesReport_dt d-flex">
                  <p className=" w-100 m-0 pr-2">
                    <small>Total Transactions</small>
                    <br />
                    {sales.total_transactions ? sales.total_transactions : 0}
                  </p>
                  {/*<div className="icon icon-shape bg-white  rounded-circle shadow">
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                  </div>*/}
                </div>
              </div>
              <div className="col-12 col-md-3 col-lg-3 mt-2">
                <div className="salesReport_dt d-flex">
                  <p className=" w-100 m-0 pr-2">
                    <small>Gross Margin</small>
                    <br />
                    {"\u20B9"}
                    {sales.gross_margine && sales.gross_margine.gross_margine
                      ? sales.gross_margine && sales.gross_margine.gross_margine
                      : 0}
                  </p>
                  {/* <div className="icon icon-shape bg-white  rounded-circle shadow">
                    <i className="fa fa-area-chart" aria-hidden="true"></i>
                  </div>*/}
                </div>
              </div>
            </div>

            {sales.payment && sales.payment.length !== 0 && (
              <div className="row">
                <div className="col-12">
                  <label className="h6 mb-1">
                    Payment Collection by Payment Modes:
                  </label>
                </div>

                {sales.payment &&
                  sales.payment.map((data, key) => (
                    <div className="col-12 col-md-3 col-lg-3 mt-2" key={key}>
                      <div className="salesReport_dt d-flex">
                        <p className="w-100 m-0 pr-2">
                          <small>{data.payment_mode}</small>
                          <br />
                          {"\u20B9"}
                          {data.sum}
                        </p>
                        {/*<div className="icon icon-shape bg-white  rounded-circle shadow">
                        <i className="fa fa-bar-chart" aria-hidden="true"></i>
                      </div>*/}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    sales_report: store.report.sales_report
  };
};

const mapDispatchToProps = dispatch => {
  return {
    salesReport: params => dispatch(salesReport(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalesReport);
