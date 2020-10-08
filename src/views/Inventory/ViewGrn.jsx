import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { viewGRN, viewSpecificGRN } from "../../actions/inventory";
import moment from "moment";
export class ViewGrn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grnList: [],
      viewGrnProducts: [],
      grn_details: {},
      showFlag: true
    };
  }
  componentDidMount() {
    let params = {
      store_id: localStorage.getItem("store")
    };
    this.props.viewGRN(params);
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { view_grn_list, view_grn } = newProps;
    if (view_grn_list && view_grn_list.code === 200) {
      this.setState({ grnList: view_grn_list.grn });
    }

    if (view_grn && view_grn.code === 200) {
      this.setState({ viewGrnProducts: view_grn.grn_products });
    }
  }

  handleClick = (e, data) => {
    let params = {
      grn_id: data.grn_id
    };
    this.props.viewSpecificGRN(params);
    this.setState({ showFlag: false, grn_details: data });
  };

  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };

  render() {
    const { grnList, showFlag, viewGrnProducts, grn_details } = this.state;
    return (
      <div className="w-100 h-100 p-30">
        <div className="d-flex justify-content-between">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/inventory">Inventory</Link>
              </li>
              {showFlag ? (
                <li className="breadcrumb-item active" aria-current="page">
                  GRN View
                </li>
              ) : (
                <li className="breadcrumb-item active" aria-current="page">
                  GRN Details
                </li>
              )}
            </ol>
          </nav>
          {!showFlag && (
            <div className="d-flex ml-auto">
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-dark grn-btn"
                  onClick={() => this.setState({ showFlag: true })}
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
        {navigator.onLine ? (
          showFlag ? (
            <div className="grn-view">
              {grnList.map((data, key) => {
                return (
                  <div
                    className="grn-parts"
                    key={key}
                    onClick={e => this.handleClick(e, data)}
                  >
                    <div className="grn-num">
                      <span>
                        <strong>#{data.grn_id}</strong> - {"\u20B9"}
                        {data.final_amount}
                      </span>
                      <span>
                        {moment(data.created_date).format("YYYY-MM-DD")}
                      </span>
                    </div>
                    <div className="grn-created">
                      Created By: {localStorage.getItem("logged_user")}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grn-box">
              <div className="grn-detail-box">
                <div className="detail-row">
                  <span>
                    <b>#{grn_details.grn_id}</b>
                  </span>
                  <span>
                    <b>
                      {moment(grn_details.created_date).format("YYYY-MM-DD")}
                    </b>
                  </span>
                </div>
                <div className="detail-row">
                  <span>Created By: {localStorage.getItem("logged_user")}</span>
                </div>
                <div className="detail-row">
                  <span>Subtotal (inc. of tax): </span>
                  <span>
                    {"\u20B9"}
                    {grn_details.sub_total}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Total GST:</span>
                  <span>
                    {"\u20B9"}
                    {this.ConvertToDecimal(
                      grn_details.total_cgst +
                        grn_details.total_sgst +
                        grn_details.total_igst
                    )}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Cash Discount: </span>
                  <span>
                    {"\u20B9"}
                    {grn_details.discount}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Freight: </span>
                  <span>
                    {"\u20B9"}
                    {grn_details.freight_charges}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Total Amount: </span>
                  <span>
                    {"\u20B9"}
                    {grn_details.final_amount}
                  </span>
                </div>
              </div>

              <div className="grn-list-box">
                <div className="list-hdg">
                  <h1>GRN Product List</h1>
                </div>
                {viewGrnProducts.map((data, index) => {
                  return (
                    <div className="grn-wrapper" key={index}>
                      <div className="grn-list-inner">
                        <h1 className="list-sb-hdg">
                          {data.product_name}, {data.variant_name}
                        </h1>
                        <div className="inner-list2">
                          <span>Cost: {data.cost_price}</span>
                          <span>MRP: {data.mrp}</span>
                          <span>SP: {data.selling_price}</span>
                          <span>Qty: {data.quantity}</span>
                          <span>GST(%): {data.tax_percent}</span>
                          <span>
                            GST: {this.ConvertToDecimal(data.cgst + data.sgst)}
                          </span>
                        </div>
                      </div>
                      {data.expiry_date !== null && (
                        <span className="grn_batch_expiry">
                          <strong>Expiry:</strong> {data.expiry_date}
                        </span>
                      )}
                      {data.batch_number !== '' && (
                      <span className="grn_batch_expiry">
                        <strong>Batch No.:</strong> {data.batch_number}
                      </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="no_data_found">
            <h2>
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </h2>
            <h3>Please connect to internet to view stock in history</h3>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    view_grn_list: store.inventory.view_grn_list,
    view_grn: store.inventory.view_grn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    viewGRN: params => dispatch(viewGRN(params)),
    viewSpecificGRN: params => dispatch(viewSpecificGRN(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewGrn);
