import React, { Component } from "react";
import database from "../../database";
import classnames from "classnames";
import { connect } from "react-redux";
import { LoaderFunc } from "../../helper/LoaderFunc";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import { ModalPopup } from "../../helper/ModalPopup";
import {
  addCustomer,
  updateCustomer,
  customers,
  generateBilling
} from "../../actions/settings";
import {
  callGenerateBill
} from "../../actions/common";
import { API_URL } from "../../config";
import convert from "convert-units";
// import PrintData from "./PrintData";
import PrintComponents from "react-print-components";
let customer_add_flag = false;
let generate_bill_flag = false;
let customer_payment_flag = false;

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
      print_invoice_id,
      store_name,
      store_phone,
      store_address,
      store_gst,
      store_logo,
      phone_on_invoice,
      selected_product,
      discount_on,
      subtotal,
      otherCharges,
      applied_discount,
      selected_payment_method,
      total,
      customer_number,
      customer_name,
      invoice_set_print,
      discount_type,
      discount
    } = state;
    let total_tax = 0;
    let total_save_selling = 0
    let total_save_mrp = 0
    let mrp_dis = 0
    selected_product.map(data => {
      return data.variants.map((item, key) => {
        return item.price_stock.map(inner => {
          if (inner.added_quantity > 0) {
            let last_selling_price = (discount_on === "MRP"
              ? inner.original_mrp
              : inner.original_selling_price);
            let last_quantity = (data.product_type === 2
              ? inner.added_quantity /
              convert(inner.weight)
                .from("g")
                .to("kg")
              : inner.added_quantity)
            let selling_for_tax = (last_selling_price * last_quantity)
            let save_selling = inner.selling_price
            let save_mrp = inner.mrp
            if (data.allow_discount) {
              if (discount_type === "per") {
                selling_for_tax = selling_for_tax - (selling_for_tax * (discount / 100))
                save_selling = save_selling - (save_selling * (discount / 100))
                save_mrp = save_mrp - (save_mrp * (discount / 100))
                mrp_dis = mrp_dis + save_mrp * (discount / 100)
              } else if (discount_type === "rup") {
                let dis = discount / (selected_product.length)
                selling_for_tax = selling_for_tax - dis
                save_selling = save_selling - dis
                save_mrp = save_mrp - dis
                mrp_dis = mrp_dis + dis
              }
            }

            total_save_selling = total_save_selling + save_selling
            total_save_mrp = total_save_mrp + save_mrp
            total_tax =
              this.ConvertToDecimal(total_tax +
                (selling_for_tax -
                  selling_for_tax * (100 / (100 + data.tax))));
          }
          return null;
        });
      });
    });
    let save_amount = discount_on === "MRP" ? mrp_dis : total_save_mrp - total_save_selling;
    return (
      <div>
        {invoice_set_print.print_size === "0" && (
          <table
            style={{ width: "290px", fontFamily: "Arial", marginLeft: "-30px", marginRight: "10px" }}
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
                                    padding: "0px",
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
                                    {print_invoice_id}
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
                                  {customer_number !== "" &&
                                    invoice_set_print.customer_phone && (
                                      <label
                                        style={{
                                          padding: "8px 5px 3px",
                                          textAlign: "right",
                                          fontSize: "16px",
                                          fontWeight: "600"
                                        }}
                                      >
                                        {customer_number}
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
                                  Date: {moment().format("DD/MM/YYYY HH:mm")}
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
                            <tbody>
                              {selected_product.map((data, index) => {
                                return data.variants.map((item, key) => {
                                  return item.price_stock.map(inner => {
                                    return (
                                      inner.added_quantity > 0 && (
                                        <tr key={inner.id}>
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
                                            {item.name.toUpperCase() ===
                                              "REGULAR"
                                              ? data.product_name
                                              : `${data.product_name}, ${item.name}`}
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

                                            {(data.product_type === 2
                                              ? this.ConvertToDecimal(inner.added_quantity /
                                                convert(inner.weight)
                                                  .from("g")
                                                  .to("kg"))
                                              : this.ConvertToDecimal(inner.added_quantity))}
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
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.original_mrp)
                                              : this.ConvertToDecimal(inner.original_selling_price)}
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
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.mrp)
                                              : this.ConvertToDecimal(inner.selling_price)}
                                          </td>
                                        </tr>
                                      )
                                    );
                                  });
                                });
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
                                  {"\u20B9"}{this.ConvertToDecimal(subtotal)}
                                </td>
                              </tr>
                              {otherCharges !== "" && otherCharges !== 0 && (
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
                                    {"\u20B9"}{" "}
                                    {this.ConvertToDecimal(otherCharges)}
                                  </td>
                                </tr>
                              )}
                              {applied_discount !== 0 && (
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
                                      (100 * applied_discount) / subtotal
                                    )}
                                    %
                                  </td>
                                </tr>
                              )}
                              {applied_discount !== 0 && (
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
                                    {"\u20B9"}{this.ConvertToDecimal(applied_discount)}
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
                                  {"\u20B9"}{this.ConvertToDecimal(total)}
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
                                  {this.ConvertToDecimal(save_amount)}
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
                              {selected_payment_method.map((inner, index) => {
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
                                      <span> {inner.payment_mode}</span>
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
                                      <span> {"\u20B9"}{this.ConvertToDecimal(inner.amount)}</span>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                {total_tax !== 0 && (
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
                                            {this.ConvertToDecimal(total_tax)}
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
                                            {this.ConvertToDecimal(
                                              total_tax / 2
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
                                            {this.ConvertToDecimal(
                                              total_tax / 2
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
                                    {print_invoice_id}
                                  </span>
                                </td>
                              </tr>
                              {/*<tr>
                                <td className="style-invoice">
                                  Invoice No.:{" "}
                                  <span>
                                    123
                                  </span>
                                </td>
                              </tr> */}

                              <tr>
                                {customer_name !== "" &&
                                  invoice_set_print.customer_name && (
                                    <td className="customer_name">
                                      {customer_name}
                                    </td>
                                  )}
                                {customer_number !== "" &&
                                  invoice_set_print.customer_phone && (
                                    <td className="customer_number">
                                      {customer_number}
                                    </td>
                                  )}
                              </tr>
                              <tr>
                                <td className="date">
                                  Date: {moment().format("DD/MM/YYYY HH:mm")}
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
                              {selected_product.map((data, index) => {
                                return data.variants.map((item, key) => {
                                  return item.price_stock.map(inner => {
                                    if (inner.added_quantity > 0) {
                                      return (
                                        <tr key={inner.id}>
                                          <td className="data-product">
                                            {item.name.toUpperCase() ===
                                              "REGULAR"
                                              ? data.product_name
                                              : `${data.product_name}, ${item.name}`}
                                          </td>
                                          <td className="data-quantity">
                                            {(data.product_type === 2
                                              ? this.ConvertToDecimal(inner.added_quantity /
                                                convert(inner.weight)
                                                  .from("g")
                                                  .to("kg"))
                                              : this.ConvertToDecimal(inner.added_quantity))}
                                          </td>
                                          {invoice_set_print.show_mrp_on_bill && (
                                            <td className="data-mrp">
                                              {this.ConvertToDecimal(inner.original_mrp)}
                                            </td>
                                          )}
                                          <td className="data-selling">
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.original_mrp)
                                              : this.ConvertToDecimal(inner.original_selling_price)}
                                          </td>
                                          <td className="data-mrp-one">
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.mrp)
                                              : this.ConvertToDecimal(inner.selling_price)}
                                          </td>
                                        </tr>
                                      );
                                    }
                                    return null;
                                  });
                                });
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-z">
                          <table className="t-width">
                            <tbody>
                              <tr>
                                <td className="td-main">
                                  <table className="t-100">
                                    <tbody>
                                      <tr>
                                        <td className="td-main-inner">Total</td>
                                        <td className="total-wrap">
                                          {"\u20B9"}
                                          {this.ConvertToDecimal(subtotal)}
                                        </td>
                                      </tr>
                                      {otherCharges !== "" && otherCharges !== 0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Other Charges
                                        </td>
                                          <td className="delivery_charges">
                                            {"\u20B9"}
                                            {this.ConvertToDecimal(otherCharges)}
                                          </td>
                                        </tr>
                                      )}
                                      {applied_discount !== 0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Discount(%)
                                        </td>
                                          <td className="delivery_charges">
                                            {this.ConvertToDecimal(
                                              (100 * applied_discount) / subtotal
                                            )}
                                          %
                                        </td>
                                        </tr>
                                      )}
                                      {applied_discount !== 0 && (
                                        <tr>
                                          <td className="other-charge">
                                            Discount Amount
                                        </td>
                                          <td className="delivery_charges">
                                            {"\u20B9"}
                                            {this.ConvertToDecimal(
                                              applied_discount
                                            )}
                                          </td>
                                        </tr>
                                      )}

                                      <tr>
                                        <td className="other-charge">
                                          Final Amount
                                      </td>
                                        <td className="delivery_charges">
                                          {"\u20B9"}
                                          {this.ConvertToDecimal(total)}
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
                                          {this.ConvertToDecimal(total_tax)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="wrap-sixty">Total Cgst</td>
                                        <td className="wrap-fourty">
                                          {this.ConvertToDecimal(total_tax / 2)}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="wrap-sixty">Total sgst</td>
                                        <td className="wrap-fourty">
                                          {this.ConvertToDecimal(total_tax / 2)}
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
                      <tr>
                        <td
                          className="date"
                        >
                          You saved: {"\u20B9"}
                          {this.ConvertToDecimal(save_amount)}
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
                              {selected_payment_method.map((inner, index) => {
                                return (
                                  <tr key={index}>
                                    <td className="inner-payment">
                                      <span> {inner.payment_mode}</span>
                                    </td>
                                    <td className="inner-amount">
                                      <span> {"\u20B9"}{this.ConvertToDecimal(inner.amount)}</span>
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

                                    < img
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
                                    {print_invoice_id}
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
                                    >Order Date: </strong>{" "}
                                    <label style={{ fontSize: "18px" }}>
                                      {moment().format("DD/MM/YYYY HH:mm")}
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
                                <th style={{ border: "1px solid #afafaf" }}>S.No</th>
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
                              {selected_product.map((data, index) => {
                                return data.variants.map((item, key) => {
                                  return item.price_stock.map(inner => {
                                    if (inner.added_quantity > 0) {
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
                                              {item.name.toUpperCase() === "REGULAR"
                                                ? data.product_name
                                                : `${data.product_name}, ${item.name}`}
                                            </strong>
                                            {data.product_description !== "" && (
                                              <span>
                                                <br />
                                        Description: {data.product_description}
                                                <br />
                                              </span>
                                            )}
                                            {data.hsn_code && (
                                              <span>HSN: {data.hsn_code}</span>
                                            )}{" "}
                                            {item.imei_number && (
                                              <span>IMEI: {item.imei_number}</span>
                                            )}
                                            {item.serial_number && (
                                              <span>
                                                Serial No: {item.serial_number}
                                              </span>
                                            )}
                                          </td>
                                          <td
                                            style={{ border: "1px solid #afafaf" }}
                                            valign="top"
                                          >
                                            {(data.product_type === 2
                                              ? this.ConvertToDecimal(inner.added_quantity /
                                                convert(inner.weight)
                                                  .from("g")
                                                  .to("kg"))
                                              : this.ConvertToDecimal(inner.added_quantity))}
                                          </td>
                                          {invoice_set_print.show_mrp_on_bill && (
                                            <td
                                              style={{ border: "1px solid #afafaf" }}
                                              valign="top"
                                            >
                                              {this.ConvertToDecimal(inner.original_mrp)}
                                            </td>
                                          )}
                                          <td
                                            style={{ border: "1px solid #afafaf" }}
                                            valign="top"
                                          >
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.original_mrp)
                                              : this.ConvertToDecimal(inner.original_selling_price)}
                                          </td>
                                          <td
                                            style={{ border: "1px solid #afafaf" }}
                                            valign="top"
                                          >
                                            {data.tax}
                                          </td>
                                          <td
                                            style={{ border: "1px solid #afafaf" }}
                                            valign="top"
                                          >
                                            {inner.original_selling_price *
                                              (data.tax / 100)}
                                          </td>
                                          <td
                                            style={{ border: "1px solid #afafaf" }}
                                            valign="top"
                                          >
                                            {discount_on === "MRP"
                                              ? this.ConvertToDecimal(inner.mrp)
                                              : this.ConvertToDecimal(inner.selling_price)}
                                          </td>
                                        </tr>
                                      );
                                    }
                                    return null;
                                  });
                                });
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
                                    {this.ConvertToDecimal(save_amount)}</strong>
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
                                <td>{this.ConvertToDecimal(total_tax)}</td>
                              </tr>
                              <tr>
                                <td>Total Cgst</td>
                                <td>{this.ConvertToDecimal(total_tax / 2)}</td>
                              </tr>
                              <tr>
                                <td>Total sgst</td>
                                <td>{this.ConvertToDecimal(total_tax / 2)}</td>
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
                                  {this.ConvertToDecimal(subtotal)}
                                </td>
                              </tr>
                              <tr>
                                <td>Discount(%)</td>
                                <td>
                                  {this.ConvertToDecimal(
                                    (100 * applied_discount) / subtotal
                                  )}
                                </td>
                              </tr>
                              {applied_discount !== 0 && (
                                <tr>
                                  <td>Discount Amount</td>
                                  <td>
                                    {"\u20B9"}
                                    {this.ConvertToDecimal(applied_discount)}
                                  </td>
                                </tr>
                              )}
                              {otherCharges !== "" && otherCharges !== 0 && (
                                <tr>
                                  <td>Other Charges</td>
                                  <td>
                                    {"\u20B9"}
                                    {this.ConvertToDecimal(otherCharges)}
                                  </td>
                                </tr>
                              )}
                              <tr>
                                <td>Final Amount</td>
                                <td>
                                  {"\u20B9"}
                                  {this.ConvertToDecimal(total)}
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
                              {selected_payment_method.map(inner => {
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
export class RightSideBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store_name: this.props && this.props.state && this.props.state.store_name,
      store_phone:
        this.props && this.props.state && this.props.state.store_phone,
      store_address:
        this.props && this.props.state && this.props.state.store_address,
      store_gst: this.props && this.props.state && this.props.state.store_gst,
      store_logo: this.props && this.props.state && this.props.state.store_logo,
      phone_on_invoice:
        this.props && this.props.state && this.props.state.phone_on_invoice,
      invoice_set_print:
        this.props && this.props.state && this.props.state.invoice_set_print,
      print_flag: false,
      print_invoice_id: '',

      customer_list_flag: false,
      state_data: [], //contain state list
      selected_product: [],
      total_quant: 0,
      invoice_number: "",
      invoice_date: moment().format("YYYY/MM/DD"),
      customer_name: "",
      customer_number: "",
      customer_id: "",
      customer_gst: "",
      total_gross_margin: 0,
      total_cost_price: 0,
      total_tax: 0,
      total_mrp: 0,
      total_selling_price: 0,
      discount_on: "SP",
      discount_type: "per",
      discount: "",
      applied_discount: 0,
      total_with_discount: 0,
      subtotal: 0,
      total: 0,
      otherCharges: "",
      customer_list: [],
      searched_customers: [],
      customer_flag: false,
      cart_flag: false,
      hold_flag: false,
      add_customer_name: "",
      add_customer_email: "",
      add_customer_gst: "",
      add_customer_address: "",
      add_customer_state: "",
      add_customer_city: "",
      add_customer_pin_code: "",
      add_customer_promotion: true,
      default_other_charges: false,
      default_remarks: false,
      default_email: false,
      default_sms: false,
      default_whatsapp: false,
      default_print: false,
      show_default_email: false,
      show_default_sms: false,
      show_default_whatsapp: false,
      remarks: "",
      generate_popup_flag: false,
      paymentFlag: false,
      payment_method: [],
      all_payments: [],
      selected_payment_method: [],
      pending_amount: 0,
      loaderVisible: false,
      permission: true,

      db: new database() // create object of database present in database.js
    };
  }

  async UNSAFE_componentWillMount() {
    // this.props.callGenerateBill(false);
    const res = await this.state.db.getDatabaseCustomers();
    if (res && res.status === 200) {
      let customer_list = res.customers_list.customer;
      this.setState({ customer_list: customer_list });
    }
    let res1 = await this.state.db.getState();
    if (res1 && res1.status === 200) {
      this.setState({
        state_data: res1.state_data
      });
    }
    // const res2 = await this.state.db.getStoreSettings();
    // if (res2 && res2.status === 200) {
    //   this.setState({
    //     store_name: res2.store_settings.business_name,
    //     store_phone: res2.store_settings.phone_number,
    //     store_address: res2.store_settings.address,
    //     store_gst: res2.store_settings.gst
    //   });
    // }

    // const res3 = await this.state.db.getStoreInvoiceSettings();
    // if (res3 && res3.status === 200) {
    //   this.setState({
    //     invoice_set_print: res3.invoice_settings_data
    //   });
    // }
  }
  async UNSAFE_componentWillReceiveProps() {
    this.setState({
      store_name: this.props.state && this.props.state.store_name,
      store_phone: this.props.state && this.props.state.store_phone,
      store_address: this.props.state && this.props.state.store_address,
      store_gst: this.props.state && this.props.state.store_gst,
      store_logo: this.props.state && this.props.state.store_logo,
      phone_on_invoice: this.props.state && this.props.state.phone_on_invoice,
      invoice_set_print: this.props.state && this.props.state.invoice_set_print,
    });
    // if (this.props.last_invoice.code === 200) {
    //   const res = await this.state.db.getLastStoreInvoice();
    //   if (res && res.status === 200) {
    //     let doc = {
    //       _id: "getLastStoreInvoice",
    //       status: 200,
    //       updated_time: moment().format("YYYY-MM-DD"),
    //       _rev: res._rev,
    //       last_invoice: this.props.last_invoice.invoice
    //     };
    //     await this.state.db.updateDatabaseProducts(doc);
    //   } else {
    //     let doc = {
    //       _id: "getLastStoreInvoice",
    //       status: 200,
    //       updated_time: moment().format("YYYY-MM-DD"),
    //       last_invoice: this.props.last_invoice.invoice
    //     };
    //     await this.state.db.addDatabase(doc);
    //   }
    // }

    const res3 = await this.state.db.getStorePayment();
    let payment_method = [];
    if (res3 && res3.status === 200) {
      res3.store_payment.map(data => {
        let data1 = {
          name: data.name,
          is_active: data.is_active,
          value: "",
          image: data.image,
          id: data.id
        };
        payment_method.push(data1);
        return null;
      });
      this.setState({
        payment_method
      });
    }
    const res1 = await this.state.db.getStoreSettings();
    if (res1 && res1.status === 200) {
      this.setState({
        default_remarks: res1.store_settings.remarks,
        default_other_charges: res1.store_settings.delivery_charges
      });
    }
    let res2 = await this.state.db.getStoreInvoice();
    if (res2 && res2.status === 200) {
      if (res2.store_invoice && res2.store_invoice.code === 200) {
        let show_default_email =
          res2.store_invoice.store_invoice_types[0].is_published;
        let show_default_sms =
          res2.store_invoice.store_invoice_types[1].is_published;
        let show_default_whatsapp =
          res2.store_invoice.store_invoice_types[2].is_published;
        this.setState({
          show_default_email,
          show_default_sms,
          show_default_whatsapp
        });
      }
    }
    const res = await this.state.db.getAddedProducts();

    const {
      customer_response,
      customers_list,
      generate_billing_response,
      edit_customer_response,
      generate_bill_data,
      access_permission
    } = this.props;

    if (
      generate_bill_data &&
      generate_bill_data.code === 200
    ) {
      this.setState({ generate_popup_flag: generate_bill_data.bill_status });
    }
    if (
      access_permission &&
      access_permission.code === 200
    ) {
      this.setState({ permission: access_permission.permission_status });
    }
    if (
      generate_billing_response &&
      generate_billing_response.code === 200 &&
      generate_bill_flag
    ) {
      await this.props.callGenerateBill(true);
      this.setState({ loaderVisible: false, generate_popup_flag: true });

      // toaster("success", "Bill generated successfully");
      generate_bill_flag = false;
      this.setState({ print_invoice_id: generate_billing_response.invoice_id })
      if (this.state.default_whatsapp && this.state.customer_number) {
        let text = window.encodeURIComponent(
          `Dear ${
          this.state.customer_name
          },\nThank you for shopping with ${localStorage.getItem(
            "store_legal_name"
          )}\nYour total invoice amount is {'\u20B9'}${
          this.state.total
          } Click the following link to download invoice\n${
          generate_billing_response.url
          }\n\n_Bill generated by POGO91_`
        );
        window.open(
          `https://api.whatsapp.com/send?phone=91${this.state.customer_number}&text=${text}`,
          "_blank"
        );
      }

      // this.props.refreshParentOnDelete();
      if (this.state.default_print) {
        var button = document.getElementById("my-custom-button");
        button.click();
      }
    } else if (
      generate_billing_response &&
      generate_billing_response.code === 500 &&
      generate_bill_flag
    ) {
      toaster("error", generate_billing_response.message);
      this.setState({ loaderVisible: false });
      generate_bill_flag = false;
    }
    if (
      customer_response &&
      customer_response.code === 200 &&
      customer_add_flag
    ) {
      let cust =
        customer_response.customer &&
        customer_response.customer[0] &&
        customer_response.customer[0].customer;
      this.setState({
        customer_flag: false,
        customer_name: cust.first_name,
        customer_number: cust.phone_number.toString(),
        customer_id: cust.customer_id,
        customer_list_flag: false
      });
      this.props.customers(localStorage.getItem("store"));
      customer_add_flag = false;
    }

    if (
      edit_customer_response &&
      edit_customer_response.code === 200 &&
      customer_add_flag
    ) {
      toaster("success", edit_customer_response.message);
      this.setState({
        customer_number: "",
        customer_name: "",
        searched_customers: []
      });
      this.modalClose();
      this.props.customers(localStorage.getItem("store"));
      customer_add_flag = false;
    } else if (
      edit_customer_response &&
      edit_customer_response.code === 400 &&
      customer_add_flag
    ) {
      toaster("error", edit_customer_response.message);
      customer_add_flag = false;
    }
    if (customers_list && customers_list.code === 200) {
      const res1 = await this.state.db.getDatabaseCustomers();
      if (res1 && res1.status === 200) {
        let doc = {
          _id: "customerList",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          _rev: res1._rev,
          customers_list: customers_list
        };
        const res2 = await this.state.db.updateDatabaseProducts(doc);
        if (res2 && res2.ok) {
          const res3 = await this.state.db.getDatabaseCustomers();

          if (res3 && res3.status === 200) {
            let customer_list = res3.customers_list.customer;
            this.setState({
              customer_list: customer_list
              // customer_id:
              //   customer_list[customer_list.length - 1].customer.customer_id
            });
            if (customer_payment_flag) {
              this.finalGenerateInvoice();
              customer_payment_flag = false;
            }
          }
        }
      }
    }
    let selected_product = [];
    if (
      res &&
      res.status === 200 &&
      res.products &&
      res.products.length !== 0
    ) {
      let total_quant = 0;
      let subtotal = 0;
      let discounted_value = 0;
      let total_cost_price = 0;
      let total_mrp = 0;
      let total_selling_price = 0;
      let applied_discount =
        this.state.discount_type === "per" ? 0 : this.state.applied_discount;
      let otherCharges = this.state.otherCharges;
      selected_product = res.products;
      res.products.map(data => {
        return data.variants.map((item, key) => {
          return item.price_stock.map(inner => {
            if (inner.added_quantity > 0) {
              // let data1 = {
              //   product_name: data.product_name,
              //   image_url: data.image_url,
              //   product_type: data.product_type,
              //   product_id: data.product_id,
              //   variant_name: item.name,
              //   variant_id: item.variant_id,
              //   variant_key: key,
              //   total_quantity: inner.added_quantity,
              //   price_stock: inner,
              //   allow_discount: data.allow_discount,
              //   tax: data.tax
              // };

              // selected_product[data.product_id][item.variant_id]=inner
              // selected_product.push(data1);
              total_quant = total_quant + inner.added_quantity;
              total_cost_price = total_cost_price + inner.cost_price;
              total_mrp = total_mrp + inner.mrp;
              total_selling_price = total_selling_price + inner.selling_price;
              // if (data.allow_discount) {
              if (this.state.discount_on === "SP") {
                subtotal = subtotal + inner.selling_price;
                discounted_value = discounted_value + inner.selling_price;
              } else if (this.state.discount_on === "MRP") {
                subtotal = subtotal + inner.mrp;
                discounted_value = discounted_value + inner.mrp;
              }
              // }
            }
            return null;
          });
        });
      });

      let store_invoice_data = await this.state.db.getLastStoreInvoice();
      if (store_invoice_data && store_invoice_data.status === 200) {
        if (store_invoice_data.last_invoice) {
          const off_pro = await this.state.db.getOfflineProducts();
          // it indicates that productlist doc  is present in database
          if (
            off_pro &&
            off_pro.status === 200 &&
            off_pro.offline_product_list.length !== 0
          ) {
            let last_pro =
              off_pro.offline_product_list[
              off_pro.offline_product_list.length - 1
              ];
            let last_inv = last_pro.local_invoice_id;
            let last_inv_split = last_inv && last_inv.split("INV");
            let invoice_number =
              store_invoice_data.last_invoice.local_invoice_id;
            let invoice_number_split =
              invoice_number && invoice_number.split("INV");
            let incremented_invoice = invoice_number_split[1];
            if (invoice_number_split[1] >= last_inv_split[1]) {
              incremented_invoice = parseInt(invoice_number_split[1]) + 1;
            } else {
              incremented_invoice = parseInt(last_inv_split[1]) + 1;
            }
            let separator = "INV";
            let final_invoice =
              invoice_number_split[0] + separator + incremented_invoice;
            this.setState({ invoice_number: final_invoice });
          } else {
            let invoice_number =
              store_invoice_data.last_invoice.local_invoice_id;
            let invoice_number_split =
              invoice_number && invoice_number.split("INV");
            let incremented_invoice = parseInt(invoice_number_split[1]) + 1;
            let separator = "INV";
            let final_invoice =
              invoice_number_split[0] + separator + incremented_invoice;
            this.setState({ invoice_number: final_invoice });
          }
        } else {
          let ran_str = Math.random()
            .toString(11)
            .replace("0.", "");
          let invoice_number =
            moment.utc().format("YYYY-MM-DD HH:mm:ss.SS") +
            "$" +
            ran_str +
            "#" +
            localStorage.getItem("store") +
            "_INV" +
            "1";
          this.setState({ invoice_number: invoice_number });
        }
      }
      //used to set discount percentage as product added
      if (this.state.discount_type === "per") {
        let reg = /^([0-9]{0,2}([0-9]{0}|[.][0-9]{0,2})|100)$/;
        if (!reg.test(this.state.discount)) {
          return toaster(
            "error",
            "Discount percentage can't be greater than 100"
          );
        }

        applied_discount = discounted_value * (this.state.discount / 100);
      }

      this.setState({
        applied_discount,
        total_cost_price: total_cost_price,
        total_mrp: total_mrp,
        total_selling_price: total_selling_price,
        selected_product: selected_product,
        total_quant: total_quant,
        subtotal: subtotal,
        total_with_discount: subtotal - applied_discount,
        total:
          subtotal -
          applied_discount +
          (otherCharges ? parseInt(otherCharges) : 0)
      });
      // this.setPayment();
    } else {
      this.setState({
        selected_product: [],
        total_quant: 0,
        subtotal: 0,
        total_with_discount: 0,
        total: 0,
        // invoice_number: "",
        customer_name: "",
        customer_number: "",
        discount: "",
        otherCharges: "",
        remarks: "",
        // default_remarks: false,
        default_email: false,
        default_sms: false,
        default_whatsapp: false,
        default_print: false,
        selected_payment_method: [],
        discount_on: "SP",
        discount_type: "per",
        display_email: "",
        discounted_value: 0,
        applied_discount: 0
      });
    }
    if (selected_product.length === 0) {
      this.setState({ cart_flag: false });
    }
  }

  handleWhatsapp = () => {
    if (this.state.customer_number) {
      let text = window.encodeURIComponent(
        `Dear ${
        this.state.customer_name
        },\nThank you for shopping with ${localStorage.getItem(
          "store_legal_name"
        )}\nYour total invoice amount is '\u20B9'${
        this.state.total
        } Click the following link to download invoice\n${
        this.props.generate_billing_response.url
        }\n\n_Bill generated by POGO91_`
      );
      window.open(
        `https://api.whatsapp.com/send?phone=91${this.state.customer_number}&text=${text}`,
        "_blank"
      );
    } else {
      toaster("error", "No user associated with this invoice.");
    }
  };

  handleChange = (e, name) => {
    const { discount_type, customer_list } = this.state;
    let searched_customers = [];
    if (name === "discount") {
      if (
        discount_type === "per" &&
        (parseInt(e.target.value) > 100 || parseInt(e.target.value) === 0)
      ) {
        return;
      } else if (discount_type === "rup") {
        let reg = /^[0-9]{0,5}$/;
        if (reg.test(e.target.value) === false) {
          return;
        }
      }
    }
    if (name === "customer_number") {
      let reg = /^[0-9]{0,10}$/;
      if (reg.test(e.target.value) === false) {
        return;
      }
      if (e.target.value !== "") {
        searched_customers = customer_list.filter(t =>
          t.customer.phone_number.toString().startsWith(e.target.value)
        );
      } else {
        this.setState({ customer_name: "" });
      }
      this.setState({
        searched_customers: searched_customers
      });
    } else if (name === "customer_name") {
      if (e.target.value !== "") {
        searched_customers = customer_list.filter(t =>
          t.display_first_name
            .toLowerCase()
            .startsWith(e.target.value.toLowerCase())
        );
      }
      this.setState({
        searched_customers: searched_customers
      });
    }
    this.setState({ [name]: e.target.value });
  };

  handleRadio = (e, name) => {
    const { selected_product, subtotal } = this.state;

    if (name === "discount_on" && e.target.value === "SP") {
      let subtotal = 0;
      selected_product.map((data, index) => {
        return data.variants.map((item, key) => {
          return item.price_stock.map(inner => {
            if (inner.added_quantity > 0) {
              subtotal = subtotal + inner.selling_price;
            }
            return null;
          });
        });
      });
      this.setState({
        discount_type: "per",
        discount: "",
        applied_discount: 0,
        subtotal: subtotal,
        total_with_discount: subtotal,
        total: subtotal
      });
    } else if (name === "discount_on" && e.target.value === "MRP") {
      let subtotal = 0;
      selected_product.map((data, index) => {
        return data.variants.map((item, key) => {
          return item.price_stock.map(inner => {
            if (inner.added_quantity > 0) {
              subtotal = subtotal + inner.mrp;
            }
            return null;
          });
        });
      });
      this.setState({
        discount_type: "per",
        discount: "",
        applied_discount: 0,
        subtotal: subtotal,
        total_with_discount: subtotal,
        total: subtotal
      });
    }
    if (name === "discount_type") {
      this.setState({
        discount: "",
        applied_discount: 0,
        total_with_discount: subtotal,
        total: subtotal
      });
    }
    this.setState({ [name]: e.target.value }, () => {
      this.setPayment();
    });
  };

  handleMethodRadio = (e, name) => {
    if (name === "default_sms") {
      if (this.state.customer_number !== "") {
        this.setState({ default_sms: !this.state.default_sms });
      } else {
        toaster("error", "Please select user with phone number");
      }
    } else if (name === "default_email") {
      if (this.state.display_email !== "") {
        this.setState({ default_email: !this.state.default_email });
      } else {
        toaster("error", "Please select user with email address");
      }
    } else if (name === "default_whatsapp") {
      if (this.state.customer_number !== "") {
        this.setState({ default_whatsapp: !this.state.default_whatsapp });
      } else {
        toaster("error", "Please select user with phone number");
      }
    } else if (name === "default_print") {
      this.setState({ default_print: !this.state.default_print });
    }
  };

  handleDiscount = (e, name) => {
    const {
      discount_on,
      discount_type,
      selected_product,
      subtotal
    } = this.state;

    let discounted_value = 0;
    selected_product.map((data, index) => {
      return data.variants.map((item, key) => {
        return item.price_stock.map(inner => {
          if (inner.added_quantity > 0) {
            if (data.allow_discount) {
              if (discount_on === "SP") {
                discounted_value = discounted_value + inner.selling_price;
              } else if (discount_on === "MRP") {
                discounted_value = discounted_value + inner.mrp;
              }
            }
          }
          return null;
        });
      });
    });
    if (name === "discount") {
      if (discount_type === "per") {
        let applied_discount = 0;
        let reg = /^([0-9]{0,2}([0-9]{0}|[.][0-9]{0,2})|100)$/;
        if (!reg.test(e.target.value)) {
          return toaster(
            "error",
            "Discount percentage can't be greater than 100"
          );
        }
        let total_with_discount = subtotal;
        applied_discount = discounted_value * (e.target.value / 100);
        total_with_discount = subtotal - applied_discount;
        this.setState({
          applied_discount: applied_discount,
          total_with_discount: total_with_discount,
          total: total_with_discount
        });
      } else if (discount_type === "rup") {
        let applied_discount = 0;
        let total_with_discount = subtotal;
        applied_discount = e.target.value;
        if (
          applied_discount >=
          subtotal +
          (this.state.otherCharges !== ""
            ? parseInt(this.state.otherCharges)
            : 0)
        ) {
          return toaster(
            "error",
            "Discount amount should be less than total amount"
          );
        }
        total_with_discount = subtotal - applied_discount;

        this.setState({
          applied_discount: applied_discount,
          total_with_discount: total_with_discount,
          total: total_with_discount
        });
      }
    }

    if (name === "otherCharges") {
      let value = e.target.value ? parseInt(e.target.value) : 0;
      this.setState({
        total: this.state.total_with_discount + value
      });
    }
    this.setState({ [name]: e.target.value }, () => {
      this.setPayment();
    });
  };

  handleFocus = () => {
    this.setState({ customer_list_flag: true });
  };

  handleBlur = (e, name) => {
    if (name === "customer_name") {
      if (e.target.value !== "" && this.state.customer_number === "") {
        this.setState({ customer_name: "" });
        toaster("error", "Please enter phone number");
        return;
      }
    }
    if (e.target.value === "") {
      this.setState({ customer_list_flag: false });
    }
  };

  handleClick = (e, data) => {
    let customer_data = data.customer;
    this.setState({
      customer_name: customer_data.first_name,
      customer_number: customer_data.phone_number.toString(),
      customer_id: customer_data.customer_id,
      customer_gst: customer_data.gst_number,
      display_email: customer_data.email,
      customer_list_flag: false
    });
  };

  openCustomer = () => {
    this.setState({
      add_edit_flag: 1,
      customer_flag: true,
      customer_add_flag: false,
      add_customer_name: "",
      add_customer_email: "",
      add_customer_gst: "",
      add_customer_address: "",
      add_customer_state: "",
      add_customer_city: "",
      add_customer_pin_code: "",
      add_customer_promotion: true
    });
  };
  openEditCustomer = (e, data) => {
    this.setState({
      add_edit_flag: 2,
      customer_flag: true,
      customer_id: data.customer.customer_id,
      customer_number:
        data.customer.phone_number && data.customer.phone_number.toString(),
      add_customer_name: data.display_first_name,
      add_customer_email: data.customer.email,
      add_customer_gst: data.gst_number,
      add_customer_address: data.customer.address,
      add_customer_state: data.customer.state,
      add_customer_city: data.customer.city,
      add_customer_pin_code:
        data.customer.pin_code !== 0 ? data.customer.pin_code.toString() : "",
      add_customer_promotion: data.allow_promotions
    });
  };
  modalClose = () => {
    this.setState({
      add_edit_flag: 0,
      customer_flag: false,
      customer_id: "",
      customer_number: "",
      add_customer_name: "",
      add_customer_email: "",
      add_customer_gst: "",
      add_customer_address: "",
      add_customer_state: "",
      add_customer_city: "",
      add_customer_pin_code: "",
      add_customer_promotion: true
    });
    this.handleFocus();
  };

  handleCart = e => {
    this.setState({ cart_flag: true });
  };

  modalCartClose = () => {
    this.setState({
      cart_flag: false
    });
  };

  handleCustomerChange = (e, name) => {
    let reg = /^[0-9]{0,10}$/;
    if (name === "customer_number" && reg.test(e.target.value) === false) {
      return;
    } else if (name === "add_customer_name" && e.target.value.length > 20) {
      return;
    } else if (
      name === "add_customer_email" &&
      /^[0-9A-Za-z@_.-]{0,100}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_pin_code" &&
      /^[0-9]{0,6}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_gst" &&
      /^[0-9A-za-z]{0,15}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_address" &&
      /^[a-zA-Z _,0-9-]{0,50}$/.test(e.target.value) === false
    ) {
      return;
    } else if (
      name === "add_customer_city" &&
      /^[a-zA-Z _,0-9-]{0,30}$/.test(e.target.value) === false
    ) {
      return;
    }
    let value = e.target.value;
    if (name === "add_customer_gst") {
      value = e.target.value.toUpperCase();
    }
    this.setState({ [name]: value });
  };

  handleCustomerClick = (e, name) => {
    // json.parse is used here to convert string value of e.target.value to boolean
    let value = JSON.parse(e.target.value);
    this.setState({ [name]: !value });
  };

  addCustomerFunc = () => {
    const {
      customer_id,
      add_customer_name,
      customer_number,
      add_customer_email,
      add_customer_gst,
      add_customer_address,
      add_customer_state,
      add_customer_city,
      add_customer_pin_code,
      add_customer_promotion,
      add_edit_flag
    } = this.state;
    var formData = new FormData();
    if (customer_number !== "") {
      if (
        add_customer_email !== "" &&
        !add_customer_email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      ) {
        toaster("error", "Email ID is not valid");
        return;
      }
      if (customer_number !== "" && !customer_number.match(/^[0-9]{10,}$/)) {
        toaster("error", "Mobile number must contain 10 digits.");
        return;
      }
      if (
        add_customer_pin_code !== "" &&
        !add_customer_pin_code.match(/^[0-9]{6,}$/)
      ) {
        toaster("error", "Pin code must be of 6 digits.");
        return;
      }
      if (
        add_customer_gst !== "" &&
        !add_customer_gst.match(
          /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/
        )
      ) {
        toaster("error", "Please enter valid GST number");
        return;
      }
      if (navigator.onLine) {
        if (add_edit_flag === 1) {
          formData.append("store_id", localStorage.getItem("store"));
        } else if (add_edit_flag === 2) {
          formData.append("customer_id", customer_id);
        }
        formData.append("full_name", add_customer_name);
        formData.append("phone_number", customer_number);
        formData.append("email", add_customer_email);
        formData.append("gst_number", add_customer_gst);
        formData.append("address", add_customer_address);
        formData.append("state", add_customer_state);
        formData.append("city", add_customer_city);
        formData.append(
          "pin_code",
          add_customer_pin_code ? add_customer_pin_code : 0
        );
        formData.append("allow_promotions", add_customer_promotion ? 1 : 0);
        if (add_edit_flag === 1) {
          this.props.addCustomer(formData);
        } else if (add_edit_flag === 2) {
          this.props.updateCustomer(formData);
        }
        customer_add_flag = true;
      } else {
        toaster(
          "warning",
          "Please connect to internet to complete this action"
        );
      }
    } else {
      toaster("error", "Please fill phone number");
    }
  };

  modalPaymentClose = () => {
    let sum = 0;
    let payment_data = this.state.payment_method;
    this.state.payment_method.map((data, key) => {
      if (this.state.all_payments.find(el => el.id === data.id) !== undefined) {
        payment_data[key] = this.state.all_payments.find(
          el => el.id === data.id
        );
        sum = sum + data.value;
      } else {
        payment_data[key].value = "";
      }
      return null;
    });
    this.setState({
      paymentFlag: false,
      payment_method: payment_data,
      pending_amount: this.ConvertToDecimal(this.state.total - sum)
    });
  };

  openPayment = () => {
    this.setState({ paymentFlag: true });
    this.setPayment();
  };
  setPayment = () => {
    let payment_arr = this.state.selected_payment_method;
    let total = 0;
    let payment_data = this.state.payment_method;
    total = this.state.payment_method
      .slice(1)
      .map(d => (d.value ? Number(d.value) : 0))
      .reduce((prev, next) => prev + next);
    this.state.payment_method.map((data, key) => {
      if (data.id === 1) {
        // if (method_len.length === 9) {
        payment_data[key].value = this.state.total - total;
        // }
        let datpre = payment_arr.find(data => data.payment_mode === "Cash");

        let payment_data1 = {
          payment_mode: data.name,
          amount: data.value
        };
        if (datpre === undefined) {
          payment_arr.push(payment_data1);
        } else {
          let index = payment_arr.findIndex(
            data => data.payment_mode === "Cash"
          );
          payment_arr[index].amount = data.value;
        }
      }
      return null;
    });
    let total1 = payment_data
      .map(d => (d.value ? Number(d.value) : 0))
      .reduce((prev, next) => prev + next);
    this.setState({
      payment_method: payment_data,
      selected_payment_method: payment_arr,
      pending_amount: this.ConvertToDecimal(this.state.total - total1)
    });
  };

  handlePaymentMethod = (e, index) => {
    let value = 0;
    // /(^([0-9]{0,6})([0-9]{0}|[.][0-9]{0,2}))$/
    let reg = /(^([0-9]{0,7})([0-9]{0}|[.][0-9]{0,2}))$/;
    if (reg.test(e.target.value) === false) {
      return;
    }

    let data = this.state.payment_method;
    value = data
      .map(d => (d.value ? Number(d.value) : 0))
      .reduce((prev, next) => prev + next);
    let event = e.target.value ? Number(e.target.value) : 0;
    let data_value = data[index].value ? Number(data[index].value) : 0;
    value = this.ConvertToDecimal(value - data_value + event);

    if (value > this.state.total) {
      toaster("error", "Please enter valid value to complete the payment");
      return;
    }
    data[index].value = e.target.value;
    this.setState({
      payment_method: data,
      pending_amount: this.ConvertToDecimal(this.state.total - value)
    });
  };

  addPaymentMethods = () => {
    let payment_arr = [];
    let all_payments = [];
    let total_amount = 0;
    this.state.payment_method.map(data => {
      if (data.value) {
        let payment_data = {
          payment_mode: data.name,
          amount: data.value
        };
        let all_pay = {
          id: data.id,
          image: data.image,
          is_active: data.is_active,
          name: data.name,
          value: data.value
        };
        total_amount = total_amount + Number(data.value);
        payment_arr.push(payment_data);
        all_payments.push(all_pay);
      }
      return null;
    });
    if (total_amount === this.state.total) {
      this.setState({
        selected_payment_method: payment_arr,
        all_payments,
        paymentFlag: false
        // all_payments: this.state.payment_method
      });
    } else {
      toaster("error", "Need to pay complete amount");
    }
  };

  holdPopup = (e, id) => {
    this.setState({ hold_flag: true });
  };

  modalHoldClose = () => {
    this.setState({
      hold_flag: false
    });
  };

  async addToHold() {
    const { selected_product, total } = this.state;

    const res = await this.state.db.getAddedProducts();
    const res1 = await this.state.db.getHoldProducts();
    if (
      res &&
      res.status === 200 &&
      res.products &&
      res.products.length !== 0
    ) {
      if (res1 && res1.status === 200) {
        let database_holded_data = res1.holded_data;
        let data = {
          selected_product: selected_product,
          holded_reverse_data: res.products,
          total: total,
          created_date: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          invoice_id: database_holded_data[database_holded_data.length - 1]
            ? database_holded_data[database_holded_data.length - 1].invoice_id +
            1
            : 1
        };
        database_holded_data.push(data);
        let doc = {
          _id: "holdData",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          holded_data: database_holded_data,
          _rev: res1._rev
        };
        await this.state.db.updateDatabaseProducts(doc);
      } else {
        let data = {
          selected_product: selected_product,
          holded_reverse_data: res.products,
          total: total,
          created_date: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          invoice_id: 1
        };
        let database_data = [];
        database_data.push(data);
        let doc = {
          _id: "holdData",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          holded_data: database_data
        };
        await this.state.db.addDatabase(doc);
      }
    }
    this.setState({ hold_flag: false, selected_product: [] });

    let doc = {
      _id: "addedProductList",
      status: 200,
      _rev: res._rev,
      products: []
    };
    let res_data = await this.state.db.updateDatabaseProducts(doc);
    if (res_data && res_data.ok) {
      this.props && this.props.refreshParentOnDelete();
    }
  }

  async generateInvoice() {
    const { customer_list, customer_number, customer_name } = this.state;
    let payment_data = this.state.payment_method;
    let selected_payment_method = this.state.selected_payment_method;
    if (selected_payment_method.length === 0) {
      this.state.payment_method.map((data, key) => {
        if (data.id === 1 && data.value === "") {
          // if (method_len.length === 9) {
          payment_data[key].value = this.state.total;
          // }

          let payment_data1 = {
            payment_mode: data.name,
            amount: data.value
          };
          selected_payment_method.push(payment_data1);
        }
        return null;
      });
    }
    if (selected_payment_method.length === 0) {
      toaster("error", "Please select atleast one payment method");
      return;
    }
    if (customer_name !== "" && customer_number === "") {
      toaster("error", "Please enter customer mobile number");
      return;
    } else if (customer_number !== "") {
      if (customer_number !== "" && !customer_number.match(/^[0-9]{10,}$/)) {
        toaster("error", "Mobile number must contain 10 digits.");
        return;
      }

      let data = customer_list.filter(data => {
        return data.customer.phone_number === parseInt(customer_number);
      });
      if (navigator.onLine) {
        if (data.length === 0) {
          this.setState({ add_edit_flag: 1 });
          await this.addCustomerFunc();
          customer_payment_flag = true;
        } else {
          this.finalGenerateInvoice();
        }
      } else {
        this.finalGenerateInvoice();
      }
    } else if (customer_name === "" && customer_number === "") {
      this.finalGenerateInvoice();
    }
  }

  async finalGenerateInvoice() {
    const {
      selected_product,
      customer_number,
      customer_name,
      customer_id,
      customer_gst,
      selected_payment_method,
      otherCharges,
      subtotal,
      applied_discount,
      discount,
      total,
      remarks,
      default_email,
      default_sms,
      total_cost_price,
      total_with_discount,
      discount_on,
      discount_type
    } = this.state;
    let product = [];
    let total_tax = 0;

    let invoice_number = this.state.invoice_number;
    let ran_str = Math.random()
      .toString(11)
      .replace("0.", "");
    if (invoice_number.includes("undefined")) {
      invoice_number =
        moment.utc().format("YYYY-MM-DD HH:mm:ss.SS") +
        "$" +
        ran_str +
        "#" +
        localStorage.getItem("store") +
        "_INV" +
        "1";
    }
    // let invoice_number_date_split = invoice_number && invoice_number.split(" ");
    // let invoice_number_time_split = invoice_number_date_split[1].split("$");
    // let date = moment.utc().format("YYYY-MM-DD HH:mm:ss.SS");
    // let final_invoice = date + "$" + invoice_number_time_split[1];
    let final_invoice = moment.utc().format("YYYY-MM-DD HH:mm:ss.SS") +
      "$" +
      ran_str +
      "#" +
      localStorage.getItem("store") +
      "_INV" +
      "249"
    let total_save_selling = 0
    let total_save_mrp = 0
    let mrp_dis = 0
    selected_product.map(data => {
      return data.variants.map((item, key) => {
        return item.price_stock.map(inner => {
          if (inner.added_quantity > 0) {
            let last_selling_price = (discount_on === "MRP"
              ? inner.original_mrp
              : inner.original_selling_price);
            let last_quantity = (data.product_type === 2
              ? inner.added_quantity /
              convert(inner.weight)
                .from("g")
                .to("kg")
              : inner.added_quantity)
            let selling_for_tax = (last_selling_price * last_quantity)
            let save_selling = inner.selling_price
            let save_mrp = inner.mrp
            if (data.allow_discount) {
              if (discount_type === "per") {
                selling_for_tax = selling_for_tax - (selling_for_tax * (discount / 100))
                save_selling = save_selling - (save_selling * (discount / 100))
                save_mrp = save_mrp - (save_mrp * (discount / 100))
                mrp_dis = mrp_dis + save_mrp * (discount / 100)
              } else if (discount_type === "rup") {
                let dis = discount / (selected_product.length)
                selling_for_tax = selling_for_tax - dis
                save_selling = save_selling - dis
                save_mrp = save_mrp - dis
                mrp_dis = mrp_dis + dis
              }
            }

            total_save_selling = total_save_selling + save_selling
            total_save_mrp = total_save_mrp + save_mrp
            let added_product = {
              product_id: data.product_id,
              product_name: data.product_name,
              //only to use for offline variant name
              variant_name: item.name,
              mrp: inner.original_mrp,
              hsn_code: data.hsn_code,
              product_description: data.product_description,
              cost: inner.original_cost_price,
              selling_price: last_selling_price,
              pricestock_id: inner.id,
              discount: inner.mrp - inner.selling_price,
              quantity: last_quantity,
              tax_percentage: data.tax,
              tax_value:
                this.ConvertToDecimal(selling_for_tax -
                  (selling_for_tax * (100 / (100 + data.tax)))),
              gross_margin: inner.selling_price - inner.cost_price,
              variant_id: inner.variant_id,
              size: data.variant_name,
              serial_number: item.serial_number ? item.serial_number : "",
              imei: item.imei_number ? item.imei_number : ""
            };
            product.push(added_product);
            total_tax =
              this.ConvertToDecimal(total_tax +
                (selling_for_tax -
                  selling_for_tax * (100 / (100 + data.tax))));
          }
          return null;
        });
      });
    });
    let final_product = { product: product };
    let payment_mode = { payment_mode: selected_payment_method };

    let save_amount = discount_on === "MRP" ? mrp_dis : total_save_mrp - total_save_selling;

    if (navigator.onLine) {
      var formData = new FormData();
      formData.append("store_id", localStorage.getItem("store"));
      formData.append("customer_id", customer_id);
      formData.append("salesman_id", "");
      formData.append("sub_total", subtotal);
      formData.append("total_tax", total_tax);
      formData.append("total_discount", applied_discount);
      formData.append("customer_gst", customer_gst);
      formData.append("gross_margin", total_with_discount - total_cost_price);
      formData.append("you_save", save_amount);
      formData.append("billed_by", localStorage.getItem("logged_user"));
      formData.append("payment_mode", JSON.stringify(payment_mode));
      formData.append("remarks", remarks);
      formData.append("delivery_charges", otherCharges);
      formData.append("local_invoice_id", final_invoice);
      formData.append("products", JSON.stringify(final_product));
      formData.append("total", total);
      formData.append("send_mail", default_email ? 1 : 0);
      formData.append("send_sms", default_sms ? 1 : 0);
      this.props.generateBilling(formData);
      this.setState({ loaderVisible: true });
    } else {
      let data = {
        store_id: localStorage.getItem("store"),
        customer_id: customer_id,
        customer_name: customer_name,
        customer_number: customer_number,
        salesman_id: "",
        sub_total: subtotal,
        total_tax: total_tax,
        total_discount: applied_discount,
        customer_gst: customer_gst,
        gross_margin: total_with_discount - total_cost_price,
        you_save: save_amount,
        billed_by: localStorage.getItem("logged_user"),
        payment_mode: selected_payment_method,
        remarks: remarks,
        delivery_charges: otherCharges,
        local_invoice_id: final_invoice,
        products: product,
        total: total,
        send_mail: default_email ? 1 : 0,
        send_sms: default_sms ? 1 : 0
      };

      const res = await this.state.db.getOfflineProducts();
      // it indicates that productlist doc  is present in database

      if (res && res.status === 200) {
        let offline_data = res.offline_product_list;
        offline_data.push(data);
        let doc = {
          _id: "offlineProductList",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          _rev: res._rev,
          offline_product_list: offline_data
        };
        const response = await this.state.db.updateDatabaseProducts(doc);

        if (response.ok) {
          const res1 = await this.state.db.getDatabaseProducts();
          if (res1 && res1.status === 200) {
            let dta_pro = res1.product_list;
            selected_product.map(data => {
              let index = dta_pro.findIndex(
                x => x.product_id === data.product_id
              );
              data.variants.map((item, key) => {
                return item.price_stock.map(inner => {
                  return (inner.quantity =
                    inner.quantity - inner.added_quantity);
                });
              });
              if (index !== -1) {
                dta_pro[index] = data;
              }
              return null;
            });
            let doc = {
              _id: "productList",
              status: 200,
              updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
              // updated_time: res1.updated_time,
              _rev: res1._rev,
              product_list: dta_pro
            };
            await this.state.db.updateDatabaseProducts(doc);
          }
          this.setState({ generate_popup_flag: true, loaderVisible: false });
          this.props.refreshParentOnDelete();
        } else {
          toaster("error", "Something went wrong");
          this.setState({ loaderVisible: false });
        }
      } else {
        let offline_pro = [data];
        let doc = {
          _id: "offlineProductList",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          offline_product_list: offline_pro
        };
        const response = await this.state.db.addDatabase(doc);

        if (response.ok) {
          this.setState({ generate_popup_flag: true, loaderVisible: false });
          this.props.refreshParentOnDelete();
        } else {
          toaster("error", "Something went wrong");
          this.setState({ loaderVisible: false });
        }
      }
    }

    generate_bill_flag = true;
    // this.setState({ loaderVisible: true });
  }

  async generateNewInvoice() {
    const res = await this.state.db.getAddedProducts();
    this.setState({ generate_popup_flag: false })
    await this.state.db.deleteDoc(res);
    this.props.refreshParentOnDelete();
    this.props.callGenerateBill(false)
  }

  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };

  render() {
    const {
      customer_list_flag,
      selected_product,
      total_quant,
      customer_number,
      searched_customers,
      discount_on,
      discount_type,
      discount,
      applied_discount,
      subtotal,
      total,
      otherCharges,
      customer_flag,
      cart_flag,
      display_email,
      state_data,
      add_customer_name,
      add_customer_email,
      add_customer_gst,
      add_customer_address,
      add_customer_state,
      add_customer_city,
      add_customer_pin_code,
      add_customer_promotion,
      default_other_charges,
      default_remarks,
      remarks,
      default_email,
      default_sms,
      default_whatsapp,
      show_default_email,
      show_default_sms,
      show_default_whatsapp,
      default_print,
      generate_popup_flag,
      paymentFlag,
      payment_method,
      pending_amount,
      selected_payment_method,
      hold_flag,
      loaderVisible,
      permission,
      add_edit_flag
    } = this.state;
    return (
      <React.Fragment>
        <LoaderFunc visible={loaderVisible} />
        <div className={!generate_popup_flag ? "right_sidebar" : "right_sidebar bill_generate"}>
          {permission &&
            (!generate_popup_flag ?
              <div className="right_sidebar_inner">
                <div className="invoice_wrap">
                  <div className="invoice_scroll">
                    <div className="box_shadow accordion_products">
                      <div className="row align-items-center">
                        <div className="col-6">
                          <h5 className="text-success">QTY: {total_quant}</h5>
                        </div>
                        <div className="col-5 pl-md-0">
                          <h5>Products: {selected_product.length}</h5>
                        </div>
                      </div>
                    </div>

                    <div className="box_shadow mt-3 mb-3 invoice_fields">
                      <div className="row">
                        {/* <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="usr">Invoice Number</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        id="invoice_no"
                        name="invoice_number"
                        value={invoice_number}
                        // onChange={e => this.handleChange(e, "invoice_number")}
                        placeholder="ABA101"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="usr">Invoice Date</label>
                      <input
                        type="text"
                        autoComplete="off"
                        
                        className="form-control"
                        id="invoice_date"
                        name="invoice_date"
                        value={invoice_date}
                        onChange={e => this.handleChange(e, "invoice_date")}
                        placeholder="12/12/2019"
                      />
                    </div>
                  </div> */}
                        <div className="col-12">
                          <div className="form-group">
                            <label htmlFor="usr">Customer Mobile Number</label>
                            <div className="w-100 d-flex position-relative">
                              <input
                                type="text"
                                autoComplete="off"
                                className="form-control pr-4"
                                id="customer_number"
                                placeholder="e.g: 9876543210"
                                name="customer_number"
                                value={customer_number}
                                readOnly={
                                  selected_product.length === 0 ? true : false
                                }
                                onChange={e =>
                                  this.handleChange(e, "customer_number")
                                }
                                onFocus={e => this.handleFocus(e)}
                                onBlur={e => this.handleBlur(e)}
                              />
                              {customer_number !== "" && (
                                <i
                                  className="fa fa-times position-absolute"
                                  aria-hidden="true"
                                  onClick={e =>
                                    this.setState({
                                      customer_number: "",
                                      customer_name: "",
                                      searched_customers: [],
                                      customer_list_flag: false
                                    })
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="usr">Customer Name</label>
                      <input
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        id="customer_name"
                        placeholder="e.g: John"
                        name="customer_name"
                        value={customer_name}
                        onChange={e => this.handleChange(e, "customer_name")}
                        onFocus={e => this.handleFocus(e)}
                        onBlur={e => this.handleBlur(e, "customer_name")}
                      />
                    </div>
                  </div> */}
                        {(selected_product.length !== 0 && customer_list_flag) && (
                          <ul className="col-11">
                            {searched_customers.map((data, key) => {
                              return (
                                <li key={key} className="d-flex">
                                  <span
                                    onClick={e => this.handleClick(e, data)}
                                    className="w-100"
                                  >
                                    {data.display_first_name} -{" "}
                                    {data.customer.phone_number}
                                  </span>
                                  <span style={{ float: "right" }}>
                                    <i
                                      className="fa fa-pencil-square-o"
                                      aria-hidden="true"
                                      onClick={e => this.openEditCustomer(e, data)}
                                    ></i>
                                  </span>
                                </li>
                              );
                            })}
                            <li onMouseDown={e => this.openCustomer(e)}>
                              Add Customer
                      </li>
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="invoice_discount_box">
                      <ul>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-5">
                              <span>Discount On</span>
                            </div>
                            <div className="col-7">
                              <div className="discount_on">
                                <label>
                                  <input
                                    type="radio"
                                    name="discount-on"
                                    value="SP"
                                    readOnly={
                                      selected_product.length === 0 ? true : false
                                    }
                                    checked={discount_on === "SP"}
                                    onChange={e =>
                                      selected_product.length !== 0
                                        ? this.handleRadio(e, "discount_on")
                                        : undefined
                                    }
                                  />
                                  <span>Selling</span>
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name="discount-on"
                                    value="MRP"
                                    readOnly={
                                      selected_product.length === 0 ? true : false
                                    }
                                    checked={discount_on === "MRP"}
                                    onChange={e =>
                                      selected_product.length !== 0
                                        ? this.handleRadio(e, "discount_on")
                                        : undefined
                                    }
                                  />
                                  <span>MRP</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-5">
                              <span>Discount Type</span>
                            </div>
                            <div className="col-7">
                              <div className="discount_type">
                                <label>
                                  <input
                                    type="radio"
                                    name="discount_type"
                                    value="per"
                                    checked={discount_type === "per"}
                                    onChange={e =>
                                      selected_product.length !== 0
                                        ? this.handleRadio(e, "discount_type")
                                        : undefined
                                    }
                                  />
                                  <span>%</span>
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name="discount_type"
                                    value="rup"
                                    checked={discount_type === "rup"}
                                    onChange={e =>
                                      selected_product.length !== 0
                                        ? this.handleRadio(e, "discount_type")
                                        : undefined
                                    }
                                  />
                                  <span>&#8377;</span>
                                </label>
                                {/* <label>
                            <input
                              type="radio"
                              name="discount_type"
                              value="credit"
                              checked={discount_type === "credit"}
                              onChange={e =>
                                this.handleRadio(e, "discount_type")
                              }
                            />
                            <span>C</span>
                          </label> */}
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-6">
                              <span>Discount</span>
                            </div>
                            <div className="col-6">
                              <input
                                type="text"
                                autoComplete="off"
                                className="discount_input"
                                placeholder={discount_type === "per" ? "0%" : "0"}
                                name="discount"
                                readOnly={
                                  selected_product.length === 0 ? true : false
                                }
                                value={discount}
                                onChange={e => this.handleDiscount(e, "discount")}
                              />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    {default_other_charges && (
                      <div className="send_invoice mt-3 mb-3 box_shadow">
                        <div className="row">
                          <div className="col-6">
                            <span>Other Charges</span>
                          </div>
                          <div className="col-6">
                            <input
                              type="text"
                              autoComplete="off"
                              className="discount_input"
                              placeholder="Other Charges"
                              name="otherCharges"
                              readOnly={selected_product.length === 0 ? true : false}
                              value={otherCharges}
                              onChange={e => this.handleDiscount(e, "otherCharges")}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div
                      className="send_invoice mt-3 mb-3 box_shadow"
                      onClick={e =>
                        selected_product.length !== 0
                          ? this.openPayment(e)
                          : undefined
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <div className="row">
                        <div className="col-6">
                          <span>Payment Options</span>
                          <br />
                          {selected_payment_method.length !== 0 ? (
                            <small>
                              (
                              {selected_payment_method.map((data, index) => {
                                return index !== selected_payment_method.length - 1
                                  ? data.payment_mode + ", "
                                  : data.payment_mode;
                              })}
                        )
                            </small>
                          ) : (
                              <small>(Cash)</small>
                            )}
                        </div>
                        <div className="col-6">
                          <i
                            className="fa fa-plus pull-right mt-1"
                            aria-hidden="true"
                            style={{ fontSize: "16px", lineHeight: "16px" }}
                          ></i>
                        </div>
                      </div>
                    </div>
                    <div className="send_invoice mt-3 mb-3 box_shadow communication_box">
                      <div className="row px-2">
                        {show_default_email && (
                          <div className="col-3 mb-2 px-1">
                            <div
                              className={
                                this.state.display_email !== ""
                                  ? "d_flex pt-2 position-relative"
                                  : "d_flex pt-2 position-relative gr-out"
                              }
                              onClick={e =>
                                this.handleMethodRadio(e, "default_email")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="left_div w-100">
                                <h5 className="flex-wrap">
                                  <i
                                    className="fa fa-envelope-o"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <div className="w-100 text-left pt-1">Email</div>
                                </h5>
                                <small>{display_email}</small>
                              </div>
                              <label className="check_input position-absolute">
                                <input
                                  type="checkbox"
                                  name="send-invoice"
                                  value="Email"
                                  checked={default_email}
                                  readOnly
                                />
                                <span onClick={e =>
                                  this.handleMethodRadio(e, "default_email")
                                } />
                              </label>
                            </div>
                          </div>
                        )}
                        {show_default_whatsapp && (
                          <div className="col-3 mb-2 px-1">
                            <div
                              className={
                                this.state.customer_number !== ""
                                  ? "d_flex pt-2 position-relative"
                                  : "d_flex pt-2 position-relative gr-out"
                              }
                              onClick={e =>
                                this.handleMethodRadio(e, "default_whatsapp")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <div className="left_div w-100">
                                <h5 className="flex-wrap">
                                  <i
                                    className="fa fa-whatsapp"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <div className="w-100 text-left pt-1">WhatsApp</div>
                                </h5>
                                <small>{customer_number}</small>
                              </div>
                              <label className="check_input position-absolute">
                                <input
                                  type="checkbox"
                                  name="send-invoice"
                                  value="WhatsApp"
                                  checked={default_whatsapp}
                                  readOnly
                                />
                                <span onClick={e =>
                                  this.handleMethodRadio(e, "default_whatsapp")
                                } />
                              </label>
                            </div>
                          </div>
                        )}
                        {show_default_sms && (
                          <div className="col-3 mb-2 px-1">
                            <div
                              className={
                                this.state.customer_number !== ""
                                  ? "d_flex pt-2 position-relative"
                                  : "d_flex pt-2 position-relative gr-out"
                              }
                              onClick={e => this.handleMethodRadio(e, "default_sms")}
                              style={{ cursor: "pointer" }}
                            >
                              <div className="left_div w-100">
                                <h5 className="flex-wrap">
                                  <i
                                    className="fa fa-commenting-o"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  <div className="w-100 text-left pt-1">SMS</div>
                                </h5>
                                <small>{customer_number}</small>
                              </div>
                              <label className="check_input position-absolute">
                                <input
                                  type="checkbox"
                                  name="send-invoice"
                                  value="Phone"
                                  checked={default_sms}
                                  readOnly
                                />
                                <span onClick={e => this.handleMethodRadio(e, "default_sms")} />
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="col-3 mb-2 px-1">
                          <div
                            className="d_flex pt-2 position-relative"
                            onClick={e => this.handleMethodRadio(e, "default_print")}
                          >
                            <div className="left_div w-100">
                              <h5 className="flex-wrap">
                                <i className="fa fa-print" aria-hidden="true"></i>{" "}
                                <div className="w-100 text-left pt-1">Print</div>
                              </h5>
                              {/* <span>Printer Name</span> */}
                            </div>
                            <label className="check_input position-absolute">
                              <input
                                type="checkbox"
                                name="send-invoice"
                                value="print"
                                checked={default_print}

                                onChange={e => this.handleMethodRadio(e, "default_print")}
                              />
                              <span />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    {default_remarks && (
                      <div className="send_invoice mt-3 mb-3 box_shadow">
                        <div className="form-group">
                          <label htmlFor="usr">Remarks</label>
                          <textarea
                            className="form-control w-100"
                            placeholder="Add Remarks"
                            name="remarks"
                            value={remarks}
                            onChange={e => this.handleChange(e, "remarks")}
                          ></textarea>
                        </div>
                      </div>
                    )}

                    <div className="invoice_discount_box">
                      <ul>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-7">
                              <span>
                                SubTotal<small>(Inc. of all taxes)</small>
                              </span>
                            </div>
                            <div className="col-5 text-right">
                              <span>
                                {"\u20B9"}
                                {this.ConvertToDecimal(subtotal)}
                              </span>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="row align-items-center">
                            <div className="col-7">
                              <span>Discount</span>
                            </div>
                            <div className="col-5 text-right">
                              <span>
                                {"\u20B9"}
                                {this.ConvertToDecimal(applied_discount)}
                              </span>
                            </div>
                          </div>
                        </li>
                        {default_other_charges && (
                          <li>
                            <div className="row align-items-center">
                              <div className="col-7">
                                <span>Other Charges</span>
                              </div>
                              <div className="col-5 text-right">
                                <span>
                                  {"\u20B9"}
                                  {otherCharges
                                    ? this.ConvertToDecimal(otherCharges)
                                    : 0}
                                </span>
                              </div>
                            </div>
                          </li>
                        )}
                        <li>
                          <div className="row align-items-center">
                            <div className="col-7">
                              <span>Total</span>
                            </div>
                            <div className="col-5 text-right">
                              <span>
                                {"\u20B9"}
                                {this.ConvertToDecimal(total)}
                              </span>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="box_shadow mt-3 pt-0 pb-0 subtotal_box">
                      <div className="row align-items-center">
                        {selected_product.length !== 0 ? (
                          <div
                            className="col-3"
                            onClick={e => this.holdPopup(e)}
                            style={{ cursor: "pointer" }}
                          >
                            <span>
                              <i className="fa fa-heart" aria-hidden="true"></i>
                            </span>
                            <h5>HOLD</h5>
                          </div>
                        ) : (
                            <div className="col-3">
                              <span>
                                <i className="fa fa-heart" aria-hidden="true"></i>
                              </span>
                              <h5>HOLD</h5>
                            </div>
                          )}
                        {selected_product.length !== 0 ? (
                          <div
                            className="col-3"
                            onClick={e => this.handleCart(e)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="cart">
                              <i
                                className="fa fa-shopping-cart"
                                aria-hidden="true"
                              ></i>
                              <span className="badge badge-secondary">
                                {selected_product.length}
                              </span>
                            </span>
                            <h5>CART</h5>
                          </div>
                        ) : (
                            <div className="col-3">
                              <span className="cart">
                                <i
                                  className="fa fa-shopping-cart"
                                  aria-hidden="true"
                                ></i>
                                <span className="badge badge-secondary">
                                  {selected_product.length}
                                </span>
                              </span>
                              <h5>CART</h5>
                            </div>
                          )}
                        {selected_product.length !== 0 ? (
                          <div
                            className="col-6 generate_bill_div"
                            onClick={e => this.generateInvoice(e)}
                            style={{ cursor: "pointer" }}
                          >
                            <h5 className="btn_bill">Generate Bill</h5>
                          </div>
                        ) : (
                            <div className="col-6 generate_bill_div grade_out_bill">
                              <h5 className="btn_bill">Generate Bill</h5>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="billGenerated-card">
                <h2>Generate Bill</h2>
                <div className="billGenerated-card">
                  {/* <ul className="lst mb-2 row px-1"> */}
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
                      {selected_product.map((data, index) => {
                        return data.variants.map((item, key) => {
                          return item.price_stock.map(inner => {
                            if (inner.added_quantity > 0) {
                              return (
                                <tr key={inner.id}>
                                  <td>
                                    <span>
                                      {item.name.toUpperCase() === "REGULAR"
                                        ? data.product_name
                                        : `${data.product_name}, ${item.name}`}
                                    </span>
                                    {/* <span>HSN Code: {}</span> */}
                                    {data.tax !== 0 && (
                                      <span>GST: {data.tax}%</span>
                                    )}
                                    {data.hsn_code !== 0 &&
                                      data.hsn_code !== "" && (
                                        <span>HSN: {data.hsn_code}</span>
                                      )}
                                  </td>
                                  <td>
                                    <span>
                                      SP:&nbsp; &nbsp;{"\u20B9"}
                                      {inner.original_selling_price}
                                    </span>
                                    <span>
                                      MRP: {"\u20B9"}
                                      {inner.original_mrp}
                                    </span>
                                  </td>
                                  <td>{inner.added_quantity}</td>
                                  <td>
                                    {"\u20B9"}
                                    {discount_on === "MRP"
                                      ? this.ConvertToDecimal(inner.mrp)
                                      : this.ConvertToDecimal(inner.selling_price)}
                                  </td>
                                </tr>
                              );
                            }
                            return null;
                          });
                        });
                      })}
                    </tbody>
                  </table>
                  <hr />
                  <div className="row">
                    <div className="col-12 col-md-6 order-md-2">
                      <p className="mt-1 mb-0">
                        <small>Bill Details</small>
                      </p>
                      <div className="dtl row d-flex flex-wrap pr-1 bill_details justify-content-between align-items-start">
                        <p className="m-0 d-flex w-100  align-items-center  justify-content-between pb-1">
                          <span className="">
                            SubTotal<small>(inc. of all taxes)</small>
                          </span>
                          <span className="text-success">
                            {"\u20B9"}
                            {this.ConvertToDecimal(subtotal)}
                          </span>
                        </p>
                        {otherCharges && (
                          <p className="m-0 d-flex w-100 align-items-center  justify-content-between pb-1">
                            <span className="">Other Charges</span>
                            <span className="text-success">
                              {"\u20B9"}
                              {this.ConvertToDecimal(otherCharges)}
                            </span>
                          </p>
                        )}
                        {applied_discount !== 0 && (
                          <p className="m-0 d-flex w-100 align-items-center  justify-content-between pb-1">
                            <span className="">Discount </span>
                            <span className="text-success">
                              -{"\u20B9"}
                              {this.ConvertToDecimal(applied_discount)}
                            </span>
                          </p>
                        )}
                        <p className="m-0 d-flex w-100 align-items-center  justify-content-between pb-1">
                          <span className="">Order Total </span>
                          <span className="text-success">
                            {"\u20B9"}
                            {this.ConvertToDecimal(total)}
                          </span>
                        </p>
                        <hr />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 order-md-1 border-right">
                      <p className="mt-1 mb-0">
                        <small>Payment Mode</small>
                      </p>
                      <div className="row bill_details d-flex flex-wrap justify-content-between  align-items-start">
                        {selected_payment_method.map((data, index) => {
                          return (
                            <p
                              className="m-0 pb-1 d-flex  justify-content-between align-items-center w-100"
                              key={index}
                            >
                              <span className="">{data.payment_mode}</span>
                              <span className="text-success">
                                {"\u20B9"}
                                {this.ConvertToDecimal(data.amount)}
                              </span>
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <hr />
                  {remarks && (
                    <div className="remarks_show">
                      {" "}
                      <p className="mb-0 text-bold">
                        <small>Remarks:</small>
                      </p>
                      <small>{remarks}</small>
                    </div>
                  )}
                  {/* <div className="d-flex justify-content-between">
                    <span>Payment Status</span>
                    <span className="text-success">SUCCESS</span>
                  </div> */}
                </div>
                <div className="box_shadow mt-3 pt-0 pb-0 subtotal_box">
                  <div className="row align-items-center">
                    <div
                      className="col-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.handleWhatsapp()}
                    >
                      <span>
                        <i className="fa fa-share-alt" aria-hidden="true"></i>
                      </span>
                      <h5>Share</h5>
                    </div>
                    {/* <ReactToPrint
                      copyStyles={false}
                      trigger={() => (
                        <div
                          className="col-3"
                          style={{ cursor: "pointer" }}
                          id="my-custom-button"
                        >
                          <span className="cart">
                            <i className="fa fa-print" aria-hidden="true"></i>
                          </span>
                          <h5>Print</h5>
                        </div>
                      )}
                      content={() => this.componentRef}
                    /> */}
                    <PrintComponents
                      copyStyles={false}
                      trigger={
                        <div
                          className="col-3"
                          style={{ cursor: "pointer" }}
                          id="my-custom-button"

                        >
                          <span className="cart">
                            <i className="fa fa-print" aria-hidden="true"></i>
                          </span>
                          <h5>Print</h5>
                        </div>
                      }
                    >
                      <PrintData state={this.state} />
                    </PrintComponents>

                    <div className="col-6 generate_bill_div">
                      <span
                        className="btn_bill"
                        onClick={e => this.generateNewInvoice(e)}
                      >
                        Generate New Bill
                      </span>
                    </div>
                  </div>
                </div>
              </div>)}
          {customer_flag && (
            <ModalPopup
              className="customer-flag prd_model_box"
              popupOpen={customer_flag}
              popupHide={this.modalClose}
              title={add_edit_flag === 1 ? "Add Customer" : "Edit Customer"}
              content={
                <div className="w-100">
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> Phone Number*</label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="number_input"
                        placeholder="e.g: 1234567890"
                        name="customer_number"
                        value={customer_number}
                        onChange={e =>
                          this.handleCustomerChange(e, "customer_number")
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> Full Name</label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="name_input"
                        placeholder="e.g: John"
                        name="add_customer_name"
                        value={add_customer_name}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_name")
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> Email Address</label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="email_input"
                        placeholder="e.g: test@gmail.com"
                        name="add_customer_email"
                        value={add_customer_email}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_email")
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      {/* <label className="custom-lab"> Gender</label>
                <div className="gender active">
                  <label>
                    <input
                      type="radio"
                      name="add_customer_gender"
                      value="male"
                      checked={add_customer_gender === "male"}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_gender")
                      }
                    />
                    <span>Male</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="add_customer_gender"
                      value="female"
                      checked={add_customer_gender === "female"}
                      onChange={e =>
                        this.handleCustomerChange(e, "add_customer_gender")
                      }
                    />
                    <span>Female</span>
                  </label>
                </div> */}
                      <label className="custom-lab"> Gst Number</label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="gst_input"
                        placeholder="e.g: ABC1234"
                        name="add_customer_gst"
                        value={add_customer_gst}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_gst")
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> Address</label>
                      <input
                        type="textarea"
                        autoComplete="none"
                        className="address_input"
                        placeholder="Enter Address"
                        name="add_customer_address"
                        value={add_customer_address}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_address")
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> State</label>
                      <select
                        className="custom-select"
                        value={add_customer_state}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_state")
                        }
                      >
                        {add_customer_state === "" && (
                          <option value="">Select your state</option>
                        )}
                        {state_data.map((option, key) => (
                          <option value={option.name} key={key}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> City </label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="city_input"
                        name="add_customer_city"
                        placeholder="Enter City"
                        value={add_customer_city}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_city")
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="custom-lab"> Pin Code</label>
                      <input
                        type="text"
                        autoComplete="none"
                        className="pin_code_input"
                        name="add_customer_pin_code"
                        placeholder="Enter Pin Code"
                        value={add_customer_pin_code}
                        onChange={e =>
                          this.handleCustomerChange(e, "add_customer_pin_code")
                        }
                      />
                    </div>
                  </div>
                  <div className="row align-items-center">
                    <div className="col-12 col-md-9">
                      <div className="custom-control custom-checkbox subbutton mb-3">
                        <input
                          type="checkbox"
                          checked={add_customer_promotion}
                          value={add_customer_promotion}
                          onChange={e =>
                            this.handleCustomerClick(e, "add_customer_promotion")
                          }
                          className="custom-control-input"
                          id="promotion"
                        />
                        <label
                          className="custom-control-label control-active"
                          htmlFor="promotion"
                        >
                          Send Promotions{" "}
                        </label>
                      </div>
                      <span className="text-sm">
                        If disabled, you won't be able to send promotions to
                        customer
                    </span>
                    </div>
                    <div className="col-12 col-md-3 ">
                      <div className="submit-wrap d-flex justify-content-md-end">
                        <button
                          type="button"
                          className="btn add_btn"
                          onClick={e => this.addCustomerFunc(e)}
                        >
                          submit
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            />
          )}


          {hold_flag && (
            <ModalPopup
              className="hold-delete-flag unhold_invoice"
              popupOpen={hold_flag}
              popupHide={this.modalHoldClose}
              // title="Invoice"
              content={
                <div className="">
                  <h4 className="text-dark text-center mb-3">
                    Are you sure you want to hold this invoice?
                </h4>
                  <div className="d-flex justify-content-center mt-2">
                    <button
                      className="btn add_btn mr-2"
                      onClick={() => this.addToHold()}
                    >
                      Yes
                  </button>
                    <button
                      className="btn add_btn"
                      onClick={() => this.modalHoldClose()}
                    >
                      No
                  </button>
                  </div>
                </div>
              }
            />
          )}

          {paymentFlag && (
            <ModalPopup
              className="stock-flag"
              popupOpen={paymentFlag}
              popupHide={this.modalPaymentClose}
              title="Payment options"
              content={
                <div className="pay_opt-lst w-100">
                  <div className="d-flex w-100 mb-2">
                    <div className="w-50 py-1 px-2 px-md-3 border-right">
                      <h4>
                        Total<span>{this.ConvertToDecimal(total)}</span>
                      </h4>
                    </div>
                    <div className="w-50 py-1 px-2 px-md-3 border-left">
                      <h4>
                        Pending<span>{this.ConvertToDecimal(pending_amount)}</span>
                      </h4>
                    </div>
                  </div>
                  <ul className="">
                    {payment_method.map((data, index) => {
                      return (
                        <div key={index}>
                          {data.is_active !== 0 && (
                            <li className="" key={index}>
                              <div className="row form-group">
                                <label className="col-12 col-md-6">
                                  {data.name}
                                </label>
                                <div className="col-12 col-md-6">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name={data.name}
                                    placeholder={`\u20B9${"0.00"}`}
                                    value={this.ConvertToDecimal(data.value)}
                                    onChange={e =>
                                      this.handlePaymentMethod(e, index)
                                    }
                                  />
                                </div>
                              </div>
                            </li>
                          )}
                        </div>
                      );
                    })}
                  </ul>
                  <button
                    className="mx-auto mt-2 d-table add_btn btn"
                    onClick={e => this.addPaymentMethods(e)}
                  >
                    Submit
                </button>
                </div>
              }
            />
          )}

          {cart_flag && (
            <ModalPopup
              className="stock-flag"
              popupOpen={cart_flag}
              popupHide={this.modalCartClose}
              title="Cart"
              content={
                <div className="cart_lst-chk w-100">
                  <ul className="w-100">
                    {selected_product.map((data, index) => {
                      return data.variants.map((item, key) => {
                        return item.price_stock.map(inner => {
                          if (inner.added_quantity > 0) {
                            return (
                              <li className="d-flex p-2" key={index}>
                                {/* <div>
                          {" "}
                          {data.image_url ? (
                            <img
                              src={data.image_url}
                              className="product_model_img mr-2"
                              alt="product"
                            />
                          ) : (
                            <img
                              src="images/product.svg"
                              alt="product"
                              className="product_model_img mr-2"
                            />
                          )}
                        </div> */}
                                <div className="w-75">
                                  {item.name.toUpperCase() === "REGULAR" ? (
                                    <h4 className="mb-2">{data.product_name}</h4>
                                  ) : (
                                      <h4 className="mb-2">
                                        {data.product_name}, {item.name}
                                      </h4>
                                    )}
                                  <div className="d-flex">
                                    <p className="old-price m-0 w-50">
                                      MRP:{" "}
                                      <span className="line-through">
                                        {this.ConvertToDecimal(inner.mrp)}
                                      </span>
                                    </p>
                                    <p className="m-0 w-50">
                                      S.P.:{" "}
                                      <span>
                                        {this.ConvertToDecimal(
                                          inner.selling_price
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="w-25 ">
                                  <div className="b_product_qnty ml-auto mb-1">
                                    <button
                                      className="sub"
                                      onClick={e =>
                                        this.props.minusProduct(
                                          e,
                                          data,
                                          item,
                                          key
                                        )
                                      }
                                    >
                                      -
                                  </button>
                                    <input
                                      type="texPag"
                                      id="2"
                                      value={inner.added_quantity}
                                      min="1"
                                      max="100"
                                      readOnly
                                    />

                                    <button
                                      className="add"
                                      onClick={e =>
                                        this.props.addedProduct(
                                          e,
                                          data,
                                          item,
                                          key
                                        )
                                      }
                                    >
                                      +
                                  </button>
                                  </div>
                                  {data.product_type !== 3 && (
                                    <span
                                      className={classnames({
                                        stock_red: inner.quantity < 0,
                                        stock_green: inner.quantity > 0
                                      })}
                                    >
                                      Stock: {this.ConvertToDecimal(inner.quantity)}
                                    </span>
                                  )}
                                  {/* <p className="m-0 text-success text-right">
                            stock: {data.price_stock.quantity}
                          </p> */}
                                </div>
                              </li>
                            );
                          }
                          return null;
                        });
                      });
                    })}
                  </ul>
                </div>
              }
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = store => {
  return {
    generate_bill_data: store.common.generate_bill_data,
    customer_response: store.settings.customer_response,
    edit_customer_response: store.settings.edit_customer_response,
    customers_list: store.settings.customers_list,
    generate_billing_response: store.settings.generate_billing_response,
    access_permission: store.common.access_permission
  };
};

const mapDispatchToProps = dispatch => {
  return {
    customers: params => dispatch(customers(params)),
    generateBilling: params => dispatch(generateBilling(params)),
    addCustomer: params => dispatch(addCustomer(params)),
    updateCustomer: params => dispatch(updateCustomer(params)),
    callGenerateBill: (params) => dispatch(callGenerateBill(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RightSideBar);
