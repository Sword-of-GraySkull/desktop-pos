import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
export class SecondPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: 0,
      credits: 0,
      data: "",
      used_credits: 0,
      character_credit: 0,
      character: 0,
      id: 1,
      days: 30,
      betweenTimeFlag: true,
      disableClass: true
    };
  }
  componentDidMount() {
    var time = moment(),
      beforeTime = moment("09:00:00 am", "hh:mm:ss a"),
      afterTime = moment("09:00:00 pm", "hh:mm:ss a");
    if (time.isBetween(beforeTime, afterTime)) {
      this.setState({ betweenTimeFlag: true });
    } else {
      this.setState({ betweenTimeFlag: false });
    }
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { state } = newProps;
    this.setState({
      customer: state.total_customer,
      credits: state.available_credits,
      id: state.id
    });
  }
  handleChange = (e, name, id) => {
    if(name === 'days'){
      this.props.handleFunc(e, id, e.target.value)
      this.setState({[name]: e.target.value})
      return;
    }
    if(e.target.value.length > 16){
      this.setState({disableClass: false})
    }
    this.setState({
      [name]: e.target.value,
      character: e.target.value.length,
      character_credit: Math.ceil(e.target.value.length / 153),
      used_credits: this.state.customer * (Math.ceil(e.target.value.length / 153))
      
    });
  };
  sendPromotions = () => {
    if(this.state.character < 16){
      toaster('error', 'Enter aleast 16 characters to send promotions.')
      return;
    }
    this.props.props.history.push({
      pathname: "/send-promotion/promotions",
      state: { state: this.state }
    });
  };

  render() {
    const {
      customer,
      credits,
      data,
      used_credits,
      character_credit,
      character,
      betweenTimeFlag,
      id,
      days,
      disableClass
    } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="form-group col-md-6">
            <label>Tags</label>
            <input
              type="text"
              className="form-control w-100"
              placeholder="<CustomerName>=First Name of the Customer"
              disabled
            />
          </div>
          {id === 2 && (
            <div className="form-group col-md-6">
              <label>Select Date Range</label>
              <select className="form-control" value={days} onChange={(e)=>this.handleChange(e, 'days', id)}>
                <option value={15} >
                  Last 15 Days
                  {moment()
                    .subtract(15, "days")
                    .format("DD MMM")}{" "}
                  - {moment().format("DD MMM")}
                </option>
                <option value={30}>
                  Last 30 Days
                  {moment()
                    .subtract(30, "days")
                    .format("DD MMM")}{" "}
                  - {moment().format("DD MMM")}
                </option>
                <option value={45}>
                  Last 45 Days
                  {moment()
                    .subtract(45, "days")
                    .format("DD MMM")}{" "}
                  - {moment().format("DD MMM")}
                </option>
                <option value={30}>Custom Date Range</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Type SMS</label>
          <textarea
            className="form-control w-100"
            name="data"
            placeholder="For example, Dear <CustomerName>, get flat 5% off on Real Juice at Shop & Save Mart"
            value={data}
            onChange={e => this.handleChange(e, "data")}
          ></textarea>
          <div className="d-flex justify-content-between align-items-center mt-1 mb-0 text-muted">
            <span className="h6 small m-0">153 characters = 1 CREDIT</span>
            {character !== 0 && (
              <span className="h6 small m-0">
                {character} Charcter = {character_credit} credit
              </span>
            )}
          </div>
        </div>

        <div className="row">
          <div className="form-group col-md-4">
            <label className="w-100">Total Customers:</label>
            <span>{customer}</span>
          </div>
          <div className="form-group col-md-4">
            <label className="w-100">Available Credits:</label>
            <span>{credits}</span>
          </div>
          <div className="form-group col-md-4">
            <label className="w-100">Total Credit used:</label>
            <span>{used_credits}</span>
          </div>
        </div>
        {betweenTimeFlag ? (
          credits >= used_credits ? (
            <button
              className={disableClass ? "add_btn btn disabled_next" : "add_btn btn"}
              type="button"
              onClick={() => this.sendPromotions()}
            >
              {" "}
              Next{" "}
            </button>
          ) : (
            <button className="add_btn btn" type="button">
              {" "}
              Recharge{" "}
            </button>
          )
        ) : (
          <div className='btn btn-secondary time_message_div '>
            Send promotional message is not allowed between 9 PM to 9 AM
          </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SecondPage);
