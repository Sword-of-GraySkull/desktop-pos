import React, { Component } from "react";
import { connect } from "react-redux";
import { ModalPopup } from "../../helper/ModalPopup";
import moment from "moment";
import { API_URL } from "../../config";
import PrintComponents from "react-print-components";
export class PrintData extends Component {
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
      selected_invoice_data,
      selected_payment_data,
      selected_products,
      customer_name,
      customer_number,
      store_name,
      store_phone,
      store_address,
      store_gst,
      store_logo,
      phone_on_invoice,
      invoice_set_print
    } = state;
    let selected_products1 = state.selected_products;
    let combined_tax = {};
    selected_products1.map(data => {
      if (data.tax_percentage !== 0) {
        if (combined_tax[data.tax_percentage] === undefined) {
          combined_tax[data.tax_percentage] = [];
        }
        combined_tax[data.tax_percentage].push(data.sub_total);
      }
      return null;
    });
    //   let total_tax = 0;
    //   selected_product.map(data => {
    //     data.variants.map((item, key) => {
    //       item.price_stock.map(inner => {
    //         total_tax =
    //           total_tax + inner.original_selling_price * (data.tax / 100);
    //       });
    //     });
    //   });
    return (
      <div>
        {invoice_set_print.print_size === "0" && (
          <table
            style={{
              width: "290px",
              fontFamily: "Arial",
              marginLeft: "-30px",
              marginRight: "10px"
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: "0px" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <th
                                  style={{
                                    padding: "0px 0px 3px",
                                    textAlign: "center",
                                    fontSize: "18px",
                                    fontWeight: "600"
                                  }}
                                >
                                  {store_name}
                                </th>
                              </tr>
                              {store_address !== "null" && (
                                <tr>
                                  <td
                                    style={{
                                      padding: "0px 10px 2px",
                                      textAlign: "center",
                                      fontSize: "18px",
                                      fontWeight: "600"
                                    }}
                                  >
                                    {store_address}
                                  </td>
                                </tr>
                              )}
                              {phone_on_invoice === "0" ? (
                                <tr>
                                  <td
                                    style={{
                                      padding: "0px",
                                      textAlign: "center",
                                      fontSize: "16px",
                                      fontWeight: "600"
                                    }}
                                  >
                                    {store_phone}
                                  </td>
                                </tr>
                              ) : (
                                  <tr>
                                    <td
                                      style={{
                                        padding: "0px",
                                        textAlign: "center",
                                        fontSize: "16px",
                                        fontWeight: "600"
                                      }}
                                    >
                                      {phone_on_invoice}
                                    </td>
                                  </tr>
                                )}
                              <tr>
                                <td
                                  style={{
                                    padding: "0px",
                                    textAlign: "center",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                  }}
                                >
                                  Invoice No.:{" "}
                                  <span>
                                    {selected_invoice_data.invoice_id}
                                  </span>
                                </td>
                              </tr>
                              {store_gst && (
                                <tr>
                                  <td
                                    style={{
                                      padding: "0px",
                                      textAlign: "center",
                                      fontSize: "16px",
                                      fontWeight: "600"
                                    }}
                                  >
                                    GST No.: <span>{store_gst}</span>
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}
                                >
                                  {customer_name !== "" &&
                                    invoice_set_print.customer_name && (
                                      <label
                                        style={{
                                          padding: "8px 5px 3px 25px",
                                          textAlign: "left",
                                          fontSize: "16px",
                                          fontWeight: "600"
                                        }}
                                      >
                                        {customer_name}
                                      </label>
                                    )}
                                  {customer_name !== "" &&
                                    invoice_set_print.customer_phone && (
                                      <label
                                        style={{
                                          padding: "8px 5px 3px",
                                          textAlign: "right",
                                          fontSize: "16px",
                                          fontWeight: "600"
                                        }}
                                      >
                                        {customer_name}
                                      </label>
                                    )}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style={{
                                    padding: "0px",
                                    textAlign: "right",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                  }}
                                >
                                  Date:{" "}
                                  {moment(
                                    selected_invoice_data.created_date
                                  ).format("DD/MM/YYYY HH:mm")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th
                                  style={{
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderBottom: "1px dashed #000",
                                    padding: "3px 5px 5px"
                                  }}
                                />
                                <th
                                  style={{
                                    width: "10%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderBottom: "1px dashed #000",
                                    padding: "3px 5px 5px",
                                    textAlign: "right"
                                  }}
                                >
                                  QTY
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderBottom: "1px dashed #000",
                                    padding: "3px 5px 5px",
                                    textAlign: "right"
                                  }}
                                >
                                  Price
                                </th>
                                <th
                                  style={{
                                    width: "10%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderBottom: "1px dashed #000",
                                    padding: "3px 5px 5px",
                                    textAlign: "right"
                                  }}
                                >
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody
                              style={{
                                width: "290px",
                                fontFamily: "Arial",
                                color: "#000000",
                                padding: "0 10px",
                                marginLeft: "5px"
                              }}
                            >
                              {selected_products.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        width: "100%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        padding: "3px 5px 1px 25px",
                                        textAlign: "left",
                                        wordBreak: 'break-all'
                                      }}
                                    >
                                      {data.size.toUpperCase() === "REGULAR"
                                        ? data.product_name
                                        : `${data.product_name}, ${data.size}`}
                                    </td>
                                    <td
                                      style={{
                                        width: "10%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        padding: "3px 5px 1px",
                                        textAlign: "right"
                                      }}
                                    >
                                      {this.ConvertToDecimal(data.quantity)}
                                    </td>
                                    <td
                                      style={{
                                        width: "10%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        padding: "3px 8px 1px 2px",
                                        textAlign: "right"
                                      }}
                                    >
                                      {this.ConvertToDecimal(data.selling_price)}
                                    </td>
                                    <td
                                      style={{
                                        width: "10%",
                                        fontSize: "16px",
                                        fontWeight: "500",
                                        padding: "3px 8px 1px 2px",
                                        textAlign: "right"
                                      }}
                                    >
                                      {this.ConvertToDecimal(data.sub_total)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    width: "70%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderTop: "1px dashed #000",
                                    padding: "8px 5px 3px 25px"
                                  }}
                                >
                                  Total
                                </td>
                                <td
                                  style={{
                                    width: "30%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderTop: "1px dashed #000",
                                    padding: "8px 5px 3px",
                                    textAlign: "right"
                                  }}
                                >
                                  {"\u20B9"}
                                  {selected_invoice_data.sub_total && this.ConvertToDecimal(selected_invoice_data.sub_total)}
                                </td>
                              </tr>
                              {selected_invoice_data.delivery_charges !== 0 && (
                                <tr>
                                  <td
                                    style={{
                                      width: "70%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px 25px"
                                    }}
                                  >
                                    Other Charges
                                  </td>
                                  <td
                                    style={{
                                      width: "30%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px",
                                      textAlign: "right"
                                    }}
                                  >
                                    {"\u20B9"}
                                    {selected_invoice_data.delivery_charges && this.ConvertToDecimal(selected_invoice_data.delivery_charges)}
                                  </td>
                                </tr>
                              )}
                              {selected_invoice_data.total_discount !== 0 && (
                                <tr>
                                  <td
                                    style={{
                                      width: "70%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px 25px"
                                    }}
                                  >
                                    Discount(%)
                                  </td>
                                  <td
                                    style={{
                                      width: "30%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px",
                                      textAlign: "right"
                                    }}
                                  >
                                    {this.ConvertToDecimal(
                                      (100 *
                                        selected_invoice_data.total_discount) /
                                      selected_invoice_data.sub_total
                                    )}
                                    %
                                  </td>
                                </tr>
                              )}
                              {selected_invoice_data.total_discount !== 0 && (
                                <tr>
                                  <td
                                    style={{
                                      width: "70%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px 25px"
                                    }}
                                  >
                                    Discount Amount
                                  </td>
                                  <td
                                    style={{
                                      width: "30%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "3px 5px 0px",
                                      textAlign: "right"
                                    }}
                                  >
                                    {"\u20B9"}
                                    {selected_invoice_data.total_discount && this.ConvertToDecimal(selected_invoice_data.total_discount)}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td
                                  style={{
                                    width: "70%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    padding: "3px 5px 0px 25px"
                                  }}
                                >
                                  Final Amount
                                </td>
                                <td
                                  style={{
                                    width: "30%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    padding: "3px 5px 0px",
                                    textAlign: "right"
                                  }}
                                >
                                  {"\u20B9"}
                                  {selected_invoice_data.total && this.ConvertToDecimal(selected_invoice_data.total)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td
                                  colSpan={2}
                                  style={{
                                    padding: "8px 5px 3px",
                                    textAlign: "right",
                                    borderTop: "1px dashed #000",
                                    fontSize: "16px",
                                    fontWeight: "600"
                                  }}
                                >
                                  You saved: {"\u20B9"}
                                  {selected_invoice_data.you_save && this.ConvertToDecimal(selected_invoice_data.you_save)}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  colSpan={2}
                                  style={{
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    borderTop: "1px dashed #000",
                                    borderBottom: "1px dashed #000",
                                    verticalAlign: "top",
                                    padding: "3px 5px 3px 25px"
                                  }}
                                >
                                  Payment Mode
                                </td>
                              </tr>
                              {selected_payment_data.map((data, index) => {
                                return (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        width: "70%",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        borderBottom: "1px dashed #000",
                                        padding: "3px 5px 3px 25px",
                                        textAlign: "left"
                                      }}
                                    >
                                      <span> {data.payment_mode}</span>
                                    </td>
                                    <td
                                      style={{
                                        width: "30%",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        borderBottom: "1px dashed #000",
                                        padding: "3px 5px 3px",
                                        textAlign: "right"
                                      }}
                                    >
                                      <span> {"\u20B9"}{this.ConvertToDecimal(data.amount)}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                {selected_invoice_data.total_tax !== 0 && (
                                  <td style={{ padding: 3 }} colSpan={4}>
                                    <table style={{ width: "100%" }}>
                                      <tbody>
                                        <tr>
                                          <td
                                            style={{
                                              width: "70%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "8px 5px 3px 25px"
                                            }}
                                          >
                                            Total Tax
                                          </td>
                                          <td
                                            style={{
                                              width: "30%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "8px 5px 3px",
                                              textAlign: "right"
                                            }}
                                          >
                                            {" "}
                                            {"\u20B9"}
                                            {selected_invoice_data.total_tax &&
                                              this.ConvertToDecimal(
                                                selected_invoice_data.total_tax
                                              )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              width: "70%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "3px 5px 3px 25px"
                                            }}
                                          >
                                            Total Cgst
                                          </td>
                                          <td
                                            style={{
                                              width: "30%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "3px 5px",
                                              textAlign: "right"
                                            }}
                                          >
                                            {"\u20B9"}
                                            {selected_invoice_data.total_tax &&
                                              this.ConvertToDecimal(
                                                selected_invoice_data.total_tax /
                                                2
                                              )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            style={{
                                              width: "70%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "3px 5px 3px 25px"
                                            }}
                                          >
                                            Total sgst
                                          </td>
                                          <td
                                            style={{
                                              width: "30%",
                                              fontSize: "16px",
                                              fontWeight: "600",
                                              padding: "3px 5px",
                                              textAlign: "right"
                                            }}
                                          >
                                            {"\u20B9"}
                                            {selected_invoice_data.total_tax &&
                                              this.ConvertToDecimal(
                                                selected_invoice_data.total_tax /
                                                2
                                              )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                )}
                              </tr>
                              {invoice_set_print.invoice_footer && (
                                <tr>
                                  <td
                                    colSpan={2}
                                    style={{
                                      width: "100%",
                                      fontSize: "16px",
                                      fontWeight: "600",
                                      padding: "35px 5px 3px",
                                      textAlign: "center"
                                    }}
                                  >
                                    {invoice_set_print.invoice_footer_text}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td
                                  colSpan={2}
                                  style={{
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    padding: "3px 5px 15px",
                                    textAlign: "center"
                                  }}
                                >
                                  Thank You Visit Again!!
                                </td>
                              </tr>

                              <tr>
                                <td
                                  colSpan={2}
                                  style={{
                                    width: "100%",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    padding: "3px 5px 15px",
                                    textAlign: "center"
                                  }}
                                >
                                  Powered By www.pogo91.com
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {invoice_set_print.print_size === "1" && (
          <table>
            <tbody>
              <tr>
                <td className="p-z">
                  <table className="t-width">
                    <tbody>
                      <tr>
                        <td className="p-z">
                          <table className="t-width">
                            <tbody>
                              <tr>
                                <th className="style-name">{store_name}</th>
                              </tr>
                              {store_address !== "null" && (
                                <tr>
                                  <td className="style-address">
                                    {store_address}
                                  </td>
                                </tr>
                              )}
                              {phone_on_invoice === "0" ? (
                                <tr>
                                  <td className="style-phone">
                                    PH NO: {store_phone}
                                  </td>
                                </tr>
                              ) : (
                                  <tr>
                                    <td className="style-phone">
                                      PH NO: {phone_on_invoice}
                                    </td>
                                  </tr>
                                )}

                              <tr>
                                <td className="style-phone">
                                  GST NO: {store_gst}
                                </td>
                              </tr>
                              <tr>
                                <td className="style-invoice">
                                  Invoice No.:{" "}
                                  <span>
                                    {selected_invoice_data.invoice_id}
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                {customer_name !== "" &&
                                  invoice_set_print.customer_name && (
                                    <td className="customer_name">
                                      {customer_name}
                                    </td>
                                  )}
                                {customer_name !== "" &&
                                  invoice_set_print.customer_phone && (
                                    <td className="customer_number">
                                      {customer_name}
                                    </td>
                                  )}
                              </tr>
                              <tr>
                                <td className="date">
                                  Date:{" "}
                                  {moment(
                                    selected_invoice_data.created_date
                                  ).format("DD/MM/YYYY HH:mm")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-z">
                          <table className="t-width">
                            <thead>
                              <tr>
                                <th className="th-main" />
                                <th className="quantity">QTY</th>
                                {invoice_set_print.show_mrp_on_bill && (
                                  <th className="mrp">MRP</th>
                                )}
                                <th className="price">Price</th>
                                <th className="amount">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="product-wrap">
                              {selected_products.map((data, index) => {
                                return (
                                  <tr>
                                    <td className="data-product">
                                      {data.size.toUpperCase() === "REGULAR"
                                        ? data.product_name
                                        : `${data.product_name}, ${data.size}`}
                                    </td>
                                    <td className="data-quantity">
                                      {this.ConvertToDecimal(data.quantity)}
                                    </td>
                                    {invoice_set_print.show_mrp_on_bill && (
                                      <td className="data-mrp">{this.ConvertToDecimal(data.mrp)}</td>
                                    )}
                                    <td className="data-selling">
                                      {this.ConvertToDecimal(data.selling_price)}
                                    </td>
                                    <td className="data-mrp-one">
                                      {this.ConvertToDecimal(data.sub_total)}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-z">
                          <table className="t-width">
                            <tr>
                              <td className="td-main">
                                <table className="t-100">
                                  <tbody>
                                    <tr>
                                      <td className="td-main-inner">Total</td>
                                      <td className="total-wrap">
                                        {"\u20B9"}
                                        {selected_invoice_data.sub_total && this.ConvertToDecimal(selected_invoice_data.sub_total)}
                                      </td>
                                    </tr>
                                    {selected_invoice_data.delivery_charges !==
                                      0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Other Charges
                                        </td>
                                          <td className="delivery_charges">
                                            {"\u20B9"}
                                            {
                                              selected_invoice_data.delivery_charges && this.ConvertToDecimal(selected_invoice_data.delivery_charges)
                                            }
                                          </td>
                                        </tr>
                                      )}
                                    {selected_invoice_data.total_discount !==
                                      0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Discount(%)
                                        </td>
                                          <td className="delivery_charges">
                                            {this.ConvertToDecimal(
                                              (100 *
                                                selected_invoice_data.total_discount) /
                                              selected_invoice_data.sub_total
                                            )}
                                          %
                                        </td>
                                        </tr>
                                      )}
                                    {selected_invoice_data.total_discount !==
                                      0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Discount Amount
                                        </td>
                                          <td className="delivery_charges">
                                            {"\u20B9"}
                                            {selected_invoice_data.total_discount && this.ConvertToDecimal(selected_invoice_data.total_discount)}
                                          </td>
                                        </tr>
                                      )}

                                    <tr>
                                      <td className="other-charge">
                                        Final Amount
                                      </td>
                                      <td className="delivery_charges">
                                        {"\u20B9"}
                                        {selected_invoice_data.total && this.ConvertToDecimal(selected_invoice_data.total)}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td className="right-main">
                                <table className="t-100">
                                  <tbody>
                                    <tr>
                                      <td className="total_tax_main">
                                        Total Tax
                                      </td>
                                      <td className="wrap-fourty">
                                        {"\u20B9"}
                                        {selected_invoice_data.total_tax &&
                                          this.ConvertToDecimal(
                                            selected_invoice_data.total_tax
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="wrap-sixty">Total Cgst</td>
                                      <td className="wrap-fourty">
                                        {"\u20B9"}
                                        {selected_invoice_data.total_tax &&
                                          this.ConvertToDecimal(
                                            selected_invoice_data.total_tax / 2
                                          )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="wrap-sixty">Total sgst</td>
                                      <td className="wrap-fourty">
                                        {"\u20B9"}
                                        {selected_invoice_data.total_tax &&
                                          this.ConvertToDecimal(
                                            selected_invoice_data.total_tax / 2
                                          )}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="date"
                        >
                          You saved: {"\u20B9"}
                          {selected_invoice_data.you_save && this.ConvertToDecimal(selected_invoice_data.you_save)}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-z">
                          <table className="t-width">
                            <tbody>
                              <tr>
                                <td className="payment_mode" colSpan={2}>
                                  Payment Mode
                                </td>
                              </tr>
                              {selected_payment_data.map(inner => {
                                return (
                                  <tr>
                                    <td className="inner-payment">
                                      <span> {inner.payment_mode}</span>
                                    </td>
                                    <td className="inner-amount">
                                      <span>{"\u20B9"}{this.ConvertToDecimal(inner.amount)}</span>
                                    </td>
                                  </tr>
                                );
                              })}

                              {invoice_set_print.invoice_footer && (
                                <tr>
                                  <td className="invoice_set_print" colSpan={2}>
                                    {invoice_set_print.invoice_footer_text}
                                  </td>
                                </tr>
                              )}

                              <tr>
                                <td className="thanks" colSpan={2}>
                                  Thank You Visit Again!!
                                </td>
                              </tr>
                              <tr>
                                <td className="thanks" colSpan={2}>
                                  Powered By www.pogo91.com
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {invoice_set_print.print_size === "2" && (
          <table style={{ width: "1500px", fontFamily: "Arial" }}>
            <tbody>
              <tr>
                <td style={{ padding: "0px" }}>
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: "0px" }} colspan="3">
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td>
                                  {store_logo !== "" && store_logo !== null ? (
                                    <img
                                      src={store_logo}
                                      alt="logo"
                                      style={{
                                        borderRadius: "100px",
                                        width: "200px",
                                        height: "200px"
                                      }}
                                    />
                                  ) : (
                                      <img
                                        src="images/fev.png"
                                        alt="logo"
                                        style={{
                                          borderRadius: "100px",
                                          width: "200px",
                                          height: "200px"
                                        }}
                                      />
                                    )}
                                </td>
                                <td>
                                  <strong style={{ fontSize: "42px" }}>
                                    {store_name}
                                  </strong>

                                  {store_address !== "null" && (
                                    <label
                                      style={{
                                        display: "block",
                                        fontSize: "28px"
                                      }}
                                    >
                                      {store_address}
                                    </label>
                                  )}
                                  {store_gst && (
                                    <label
                                      style={{
                                        display: "block",
                                        fontSize: "24px"
                                      }}
                                    >
                                      <strong>Gst no: &nbsp; </strong>
                                      {store_gst}
                                    </label>
                                  )}
                                  <label
                                    style={{
                                      display: "block",
                                      fontSize: "24px"
                                    }}
                                  >
                                    <strong>Invoice No: &nbsp; </strong>
                                    {selected_invoice_data.invoice_id}
                                  </label>
                                  {phone_on_invoice === "0" ? (
                                    store_phone && (
                                      <label
                                        style={{
                                          display: "block",
                                          fontSize: "24px"
                                        }}
                                      >
                                        <strong>Phone no:&nbsp;</strong>
                                        {store_phone}
                                      </label>
                                    )
                                  ) : (
                                      <label
                                        style={{
                                          display: "block",
                                          fontSize: "24px"
                                        }}
                                      >
                                        <strong>Phone no:&nbsp;</strong>
                                        {phone_on_invoice}
                                      </label>
                                    )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0px" }} colspan="3">
                          <table style={{ width: "100%" }}>
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    paddingTop: "12px",
                                    paddingBottom: "12px"
                                  }}
                                >
                                  <p style={{ margin: "0" }}>
                                    <strong
                                      style={{ width: 100, fontSize: "18px" }}
                                    >
                                      Order Date:
                                    </strong>{" "}
                                    <label style={{ fontSize: "18px" }}>
                                      {moment(
                                        selected_invoice_data.created_date
                                      ).format("DD/MM/YYYY HH:mm")}
                                    </label>
                                  </p>{" "}
                                </td>

                                <td
                                  style={{
                                    paddingTop: "12px",
                                    paddingBottom: "12px",
                                    textAlign: "right"
                                  }}
                                >
                                  {customer_name !== "" &&
                                    invoice_set_print.customer_name && (
                                      <p style={{ margin: "0 0 3px" }}>
                                        <strong>Customer Name:&nbsp;</strong>{" "}
                                        {customer_name}
                                      </p>
                                    )}
                                  {customer_number !== "" &&
                                    invoice_set_print.customer_phone && (
                                      <p style={{ margin: "0 0 3px" }}>
                                        <strong>Customer Ph no:</strong>{" "}
                                        {customer_number}
                                      </p>
                                    )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: "0px" }} colspan="3">
                          <table style={{ width: "100%", textAlign: "center" }}>
                            <thead>
                              <tr style={{ backgroundColor: "#ccc" }}>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  S.No
                                </th>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Description
                                </th>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Qty
                                </th>
                                {invoice_set_print.show_mrp_on_bill && (
                                  <th style={{ border: "1px solid #afafaf" }}>
                                    MRP
                                  </th>
                                )}
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Rate
                                </th>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Tax%
                                </th>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Tax amount
                                </th>
                                <th style={{ border: "1px solid #afafaf" }}>
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selected_products.map((data, index) => {
                                return (
                                  <tr>
                                    <td style={{ border: "1px solid #afafaf" }}>
                                      {index + 1}
                                    </td>
                                    <td
                                      width="600px"
                                      style={{ border: "1px solid #afafaf" }}
                                    >
                                      <strong
                                        style={{
                                          display: "block",
                                          paddingBottom: 5
                                        }}
                                      >
                                        {data.size.toUpperCase() === "REGULAR"
                                          ? data.product_name
                                          : `${data.product_name}, ${data.size}`}
                                      </strong>
                                      {data.product_description !== "" && (
                                        <span>
                                          <br />
                                          {data.product_description}
                                        </span>
                                      )}
                                      {data.store_product_mapping.hsn_code && (
                                        <span>
                                          HSN:{" "}
                                          {data.store_product_mapping.hsn_code}
                                        </span>
                                      )}{" "}
                                      {data.imei_number && (
                                        <span>IMEI: {data.imei_number}</span>
                                      )}
                                      {data.serial_number && (
                                        <span>
                                          Serial No: {data.serial_number}
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      style={{ border: "1px solid #afafaf" }}
                                      valign="top"
                                    >
                                      {this.ConvertToDecimal(data.quantity)}
                                    </td>
                                    {invoice_set_print.show_mrp_on_bill && (
                                      <td
                                        style={{ border: "1px solid #afafaf" }}
                                        valign="top"
                                      >
                                        {this.ConvertToDecimal(data.mrp)}
                                      </td>
                                    )}
                                    <td
                                      style={{ border: "1px solid #afafaf" }}
                                      valign="top"
                                    >
                                      {this.ConvertToDecimal(data.selling_price)}
                                    </td>
                                    <td
                                      style={{ border: "1px solid #afafaf" }}
                                      valign="top"
                                    >
                                      {data.tax_percentage}
                                    </td>
                                    <td
                                      style={{ border: "1px solid #afafaf" }}
                                      valign="top"
                                    >
                                      {data.selling_price *
                                        (data.tax_percentage / 100)}
                                    </td>
                                    <td
                                      style={{ border: "1px solid #afafaf" }}
                                      valign="top"
                                    >
                                      {this.ConvertToDecimal(data.sub_total)}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td
                                  style={{ borderTop: "1px solid #afafaf" }}
                                  colSpan={2}
                                />
                                <td
                                  bgcolor="#ccc"
                                  valign="top"
                                  colSpan={6}
                                  style={{ textAlign: "right" }}
                                >
                                  <strong
                                    >
                                  You saved: {"\u20B9"}
                                  {selected_invoice_data.you_save && this.ConvertToDecimal(selected_invoice_data.you_save)}</strong>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #b2b2b2" }}>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th>
                                  <strong>Tax Details</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Total Tax</td>
                                <td>
                                  {selected_invoice_data.total_tax &&
                                    this.ConvertToDecimal(
                                      selected_invoice_data.total_tax
                                    )}
                                </td>
                              </tr>
                              <tr>
                                <td>Total Cgst</td>
                                <td>
                                  {selected_invoice_data.total_tax &&
                                    this.ConvertToDecimal(
                                      selected_invoice_data.total_tax / 2
                                    )}
                                </td>
                              </tr>
                              <tr>
                                <td>Total sgst</td>
                                <td>
                                  {selected_invoice_data.total_tax &&
                                    this.ConvertToDecimal(
                                      selected_invoice_data.total_tax / 2
                                    )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th>
                                  <strong>Billing Details</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Total</td>
                                <td>
                                  {"\u20B9"}
                                  {selected_invoice_data.sub_total && this.ConvertToDecimal(selected_invoice_data.sub_total)}
                                </td>
                              </tr>
                              {selected_invoice_data.total_discount !== 0 && (
                                <tr>
                                  <td>Discount(%)</td>
                                  <td>
                                    {this.ConvertToDecimal(
                                      (100 *
                                        selected_invoice_data.total_discount) /
                                      selected_invoice_data.sub_total
                                    )}
                                    %
                                  </td>
                                </tr>
                              )}
                              {selected_invoice_data.total_discount !== 0 && (
                                <tr>
                                  <td>Discount Amount</td>
                                  <td>
                                    {"\u20B9"}
                                    {selected_invoice_data.total_discount && this.ConvertToDecimal(selected_invoice_data.total_discount)}
                                  </td>
                                </tr>
                              )}
                              {selected_invoice_data.delivery_charges !== 0 && (
                                <tr>
                                  <td>Other Charges</td>
                                  <td>
                                    {"\u20B9"}
                                    {selected_invoice_data.delivery_charges && this.ConvertToDecimal(selected_invoice_data.delivery_charges)}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td>Final Amount</td>
                                <td>
                                  {"\u20B9"}
                                  {selected_invoice_data.total && this.ConvertToDecimal(selected_invoice_data.total)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td style={{ padding: "0px" }}>
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th>
                                  <strong>Payment Method</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {selected_payment_data.map(inner => {
                                return (
                                  <tr>
                                    <td>{inner.payment_mode}</td>
                                    <td>{"\u20B9"}{this.ConvertToDecimal(inner.amount)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      {invoice_set_print.invoice_footer && (
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              marginTop: "100px",
                              fontSize: "22px",
                              fontWeight: "500"
                            }}
                            colspan="3"
                          >
                            {invoice_set_print.invoice_footer_text}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td
                          style={{
                            textAlign: "center",
                            fontSize: "22px",
                            fontWeight: "500"
                          }}
                          colspan="3"
                        >
                          Thank You Visit Again!!
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            textAlign: "center",
                            fontSize: "22px",
                            fontWeight: "500"
                          }}
                          colspan="3"
                        >
                          Powered By www.pogo91.com
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
class ViewInvoice extends Component {
  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };
  // UNSAFE_componentWillMount(){
  //   const { state } = this.props;
  //   let selected_products = state.selected_products
  //   let combined_tax={}
  //   selected_products.map(data=>{
  //     if(combined_tax[data.tax_percentage] !== undefined){
  //     combined_tax[data.tax_percentage]=[]
  //     }
  //     combined_tax[data.tax_percentage].push(data)
  //   })
  //   this.setState({
  //     customer_name: state.customer_name,
  //     selected_invoice_data: state.selected_invoice_data,
  //     selected_payment_data: state.selected_payment_data,
  //     selected_products: state.selected_products,
  //     share_popup_flag: state.share_popup_flag,
  //     share_email: state.share_email,
  //     share_number: state.share_number,
  //     shared_by: state.shared_by
  //   })
  // }

  render() {
    const { state } = this.props;
    const {
      customer_name,
      selected_invoice_data,
      selected_payment_data,
      selected_products,
      share_popup_flag,
      share_email,
      share_number,
      shared_by
    } = state;
    let selected_products1 = state.selected_products;
    let combined_tax = {};
    selected_products1.map(data => {
      if (data.tax_percentage !== 0) {
        if (combined_tax[data.tax_percentage] === undefined) {
          combined_tax[data.tax_percentage] = [];
        }
        combined_tax[data.tax_percentage].push(data.tax_value);
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
                        Invoice Number: {selected_invoice_data.invoice_id}
                      </span>
                      {customer_name && (
                        <span>Customer Name: {customer_name}</span>
                      )}
                    </td>
                    <td>
                      <span>Payment Mode:</span>
                      {selected_payment_data.map((data, index) => {
                        return (
                          <span key={index}>
                            {data.payment_mode}: {"\u20B9"}
                            {this.ConvertToDecimal(data.amount)}
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
                    {selected_products.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <span>
                              {data.size.toUpperCase() === "REGULAR"
                                ? data.product_name
                                : `${data.product_name}, ${data.size}`}
                            </span>
                            {/* <span>HSN Code: {}</span> */}
                            {data.tax_percentage !== 0 && (
                              <span>GST: {data.tax_percentage}%</span>
                            )}
                            {data.store_product_mapping.hsn_code !== 0 &&
                              data.store_product_mapping.hsn_code !== "" &&
                              data.store_product_mapping.hsn_code !== null && (
                                <span>
                                  HSN: {data.store_product_mapping.hsn_code}
                                </span>
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
                          <td>{this.ConvertToDecimal(data.quantity)}</td>
                          <td>
                            {"\u20B9"}
                            {this.ConvertToDecimal(data.sub_total)}
                          </td>
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
                        {"\u20B9"}
                        {selected_invoice_data.sub_total && this.ConvertToDecimal(selected_invoice_data.sub_total)}
                      </td>
                    </tr>
                    {selected_invoice_data.delivery_charges !== 0 && (
                      <tr>
                        <td>Other charges:</td>
                        <td className="text-right">
                          {"\u20B9"}
                          {selected_invoice_data.delivery_charges}
                        </td>
                      </tr>
                    )}
                    {selected_invoice_data.total_discount !== 0 && (
                      <tr>
                        <td>Discount(%):</td>

                        <td className="text-right">
                          {this.ConvertToDecimal(
                            (100 * selected_invoice_data.total_discount) /
                            selected_invoice_data.sub_total
                          )}
                          %
                        </td>
                      </tr>
                    )}

                    {selected_invoice_data.total_discount !== 0 && (
                      <tr>
                        <td>Discount:</td>

                        <td className="text-right">
                          {"\u20B9"}
                          {selected_invoice_data.total_discount}{" "}
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td>
                        Order Total<small className="pl-1">(Inc of tax)</small>
                      </td>
                      <td className="text-right">
                        {"\u20B9"}
                        {selected_invoice_data.total && this.ConvertToDecimal(selected_invoice_data.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {selected_invoice_data.you_save > 0 && (
                <span className="invoice-saved-data">
                  You Saved: {"\u20B9"}
                  {selected_invoice_data.you_save && this.ConvertToDecimal(selected_invoice_data.you_save)} on this order
                </span>
              )}
              {selected_invoice_data.total_tax !== 0 && (
                <span className="text-center d-block">Tax details</span>
              )}
              {selected_invoice_data.total_tax !== 0 && (
                <table className="table table-bordered invoice_view_table">
                  <tbody>
                    <tr>
                      <td>
                        Total Tax: {"\u20B9"}
                        {selected_invoice_data.total_tax &&
                          this.ConvertToDecimal(
                            selected_invoice_data.total_tax
                          )}
                      </td>
                      <td>
                        Total CGST: {"\u20B9"}
                        {selected_invoice_data.total_tax &&
                          this.ConvertToDecimal(
                            selected_invoice_data.total_tax / 2
                          )}
                      </td>
                      <td>
                        Total SGST: {"\u20B9"}
                        {selected_invoice_data.total_tax &&
                          this.ConvertToDecimal(
                            selected_invoice_data.total_tax / 2
                          )}
                      </td>
                    </tr>
                    {Object.entries(combined_tax).map(([index, data]) => {
                      return (
                        <tr key={index}>
                          <td>
                            {"\u20B9"}
                            {this.ConvertToDecimal(
                              (data).reduce((a, b) => a + b, 0))}
                            @{index}%
                          </td>
                          <td>
                            CGST: {"\u20B9"}
                            {this.ConvertToDecimal(
                              (data.reduce((a, b) => a + b, 0)) / 2
                            )}
                          </td>
                          <td>
                            SGST: {"\u20B9"}
                            {this.ConvertToDecimal(
                                (data.reduce((a, b) => a + b, 0)) / 2
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
              <span className="text-right d-block">
                Date:{" "}
                {moment(selected_invoice_data.created_date).format(
                  "DD-MM-YYYY"
                )}
              </span>
            </div>
          </div>
          {!selected_invoice_data.is_deleted && (
            <div className="d-flex justify-content-end mt-2 mb-4">
              <div className="share_lst w-100 d-flex align-items-center justify-content-between">
                <button
                  className="btn add_btn mr-2 w-auto"
                  onClick={() => this.props.cancelInvoice()}
                >
                  Cancel Invoice
                </button>
                <div>
                  <button
                    className="btn add_btn mr-2"
                    data-toggle="collapse"
                    data-target="#shareId"
                  >
                    {" "}
                    Share
                  </button>
                  <PrintComponents
                    copyStyles={false}
                    trigger={
                      <button
                        className="btn add_btn mr-2"
                        id="my-custom-button"
                      >
                        <i className="fa fa-print" aria-hidden="true" />
                          Print
                        </button>
                    }
                  >
                    <PrintData state={state} />
                  </PrintComponents>
                </div>
                <div id="shareId" className="lst collapse">
                  <i
                    className="fa fa-whatsapp"
                    aria-hidden="true"
                    onClick={e =>
                      this.props.sharePopup(
                        e,
                        selected_invoice_data.customer,
                        "whatsapp"
                      )
                    }
                  />
                  <i
                    className="fa fa-envelope"
                    aria-hidden="true"
                    onClick={e =>
                      this.props.sharePopup(
                        e,
                        selected_invoice_data.customer,
                        "email"
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {share_popup_flag && (
          <ModalPopup
            className="share-invoice-sms-email-flag"
            popupOpen={share_popup_flag}
            popupHide={this.props.modalShareClose}
            title="Share Invoice"
            content={
              <div className="">
                {shared_by ? (
                  <input
                    type="text"
                    className="form-control"
                    name={share_number}
                    placeholder="Enter Phone Number"
                    value={share_number}
                    onChange={e => this.props.handleChange(e, "share_number")}
                    onKeyDown={e => this.props.keyDownWhatsappEmail(e)}
                  />
                ) : (
                    <input
                      type="text"
                      className="form-control"
                      name={share_email}
                      placeholder="Enter Email"
                      value={share_email}
                      onChange={e => this.props.handleChange(e, "share_email")}
                      onKeyDown={e => this.props.keyDownWhatsappEmail(e)}
                    />
                  )}

                <button
                  className="btn add-btn custom_btn mt-2 mx-auto d-block"
                  onClick={() => this.props.sendInvoiceFunc()}
                >
                  Send
                </button>
              </div>
            }
          />
        )}
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
export default connect(mapStateToProps, mapDispatchToProps)(ViewInvoice);
