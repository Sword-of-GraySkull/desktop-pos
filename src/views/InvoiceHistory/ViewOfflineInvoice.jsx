import React, { Component } from "react";
import { connect } from "react-redux";
class ViewOfflineInvoice extends Component {
  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };

  render() {
    const { state } = this.props;
    const {
      customer_name
    } = state;
    const { view_offline_data } = state;
    let view_offline_data1 = state.view_offline_data;
    let combined_tax = {};
    view_offline_data1.products.map(data => {
      if (data.tax_percentage !== 0) {
        if (combined_tax[data.tax_percentage] === undefined) {
          combined_tax[data.tax_percentage] = [];
        }
        combined_tax[data.tax_percentage].push(data.selling_price * data.quantity);
      }
      return null;
    });
    return (
      <div className="">
        <div className="item_vw-pop">
          <div className="">
            <div className="p-3 mb-3">
              <table className="table table-bordered invoice_view_table">
                <tbody>
                  <tr>
                    <td>
                      <span>
                        Invoice Number: {view_offline_data.local_invoice_id.split('_')[1]}
                      </span>
                      {customer_name && (
                        <span>Customer Name: {customer_name}</span>
                      )}
                    </td>
                    <td>
                      <span>Payment Mode:</span>
                      {view_offline_data.payment_mode.map((data, index) => {
                        return (
                          <span key={index}>
                            {data.payment_mode}: {"\u20B9"}
                            {data.amount}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="">
                <table className="table table-bordered invoice_view_table">
                  <thead>
                    <tr>
                      <th>Products Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view_offline_data.products.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <span>
                              {data.variant_name.toUpperCase() === "REGULAR"
                                ? data.product_name
                                : `${data.product_name}, ${data.variant_name}`}
                            </span>
                            {/* <span>HSN Code: {}</span> */}
                            {data.tax_percentage !== 0 && (
                              <span>GST: {data.tax_percentage}%</span>
                            )}
                            {data.hsn_code !== 0 && data.hsn_code !== "" && (
                              <span>HSN: {data.hsn_code}</span>
                            )}
                          </td>
                          <td>
                            <span>
                              SP:&nbsp; &nbsp;{"\u20B9"}
                              {data.selling_price}
                            </span>
                            <span className="text-danger">
                              MRP: {"\u20B9"}
                              {data.mrp}
                            </span>
                          </td>
                          <td>{data.quantity}</td>
                          <td>{'\u20B9'}{data.selling_price * data.quantity}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="item_lst_foot w-100">
                <table className="table table-bordered invoice_view_table">
                  <tbody>
                    <tr>
                      <td>Order SubTotal:</td>
                      <td className="text-right">
                        {'\u20B9'}{view_offline_data.sub_total}
                      </td>
                    </tr>
                    {view_offline_data.delivery_charges !== '' && (
                      <tr>
                        <td>Delivery charges:</td>
                        <td className="text-right">
                          {view_offline_data.delivery_charges}
                        </td>
                      </tr>
                    )}
                    {view_offline_data.total_discount !== 0 && (
                      <tr>
                        <td>Discount(%):</td>

                        <td className="text-right">
                          {this.ConvertToDecimal(
                            (100 * view_offline_data.total_discount) /
                            (view_offline_data.sub_total - 100)
                          )}{" "}
                        </td>
                      </tr>
                    )}

                    {view_offline_data.total_discount !== 0 && (
                      <tr>
                        <td>Discount:</td>

                        <td className="text-right">
                          {'\u20B9'}{view_offline_data.total_discount}{" "}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td>
                        Order Total<small className="pl-1">(Inc of tax)</small>
                      </td>
                      <td className="text-right">{'\u20B9'}{view_offline_data.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* {view_offline_data.total > 0 && (
                <span className="invoice-saved-data">
                  You Saved: {"\u20B9"}{this.ConvertToDecimal(view_offline_data.total)} on this order
                </span>
              )} */}
              {view_offline_data.total_tax !== 0 && (
                <span className="text-center d-block">Tax details</span>
              )}
              {view_offline_data.total_tax !== 0 && (
                <table className="table table-bordered invoice_view_table">
                  <tbody>
                    <tr>
                      <td>
                        Total Tax: {"\u20B9"}
                        {view_offline_data.total_tax &&
                          this.ConvertToDecimal(
                            view_offline_data.total_tax
                          )}
                      </td>
                      <td>
                        Total CGST: {"\u20B9"}
                        {view_offline_data.total_tax &&
                          this.ConvertToDecimal(
                            view_offline_data.total_tax / 2
                          )}
                      </td>
                      <td>
                        Total SGST: {"\u20B9"}
                        {view_offline_data.total_tax &&
                          this.ConvertToDecimal(
                            view_offline_data.total_tax / 2
                          )}
                      </td>
                    </tr>
                    {Object.entries(combined_tax).map(([index, data]) => {
                      return (
                        <tr key={index}>
                          <td>
                            {"\u20B9"}
                            {this.ConvertToDecimal(
                              data.reduce((a, b) => a + b, 0) /
                              ((100 + parseInt(index)) / 100)
                            )}
                            @{index}%
                          </td>
                          <td>
                            CGST: {"\u20B9"}
                            {this.ConvertToDecimal(
                              data.reduce((a, b) => a + b, 0) -
                              data.reduce((a, b) => a + b, 0) *
                              (100 / (100 + parseInt(index)))
                            ) / 2}
                          </td>
                          <td>
                            SGST: {"\u20B9"}
                            {this.ConvertToDecimal(
                              data.reduce((a, b) => a + b, 0) -
                              data.reduce((a, b) => a + b, 0) *
                              (100 / (100 + parseInt(index)))
                            ) / 2}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewOfflineInvoice);
