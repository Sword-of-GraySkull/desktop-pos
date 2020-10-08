import React, { Component } from "react";
import { connect } from "react-redux";
import convert from "convert-units";
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
      let total_save_selling= 0
      let total_save_mrp = 0
      let mrp_dis= 0
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
              let save_selling=inner.selling_price
              let save_mrp=inner.mrp
              if (data.allow_discount) {
                if (discount_type === "per") {
                  selling_for_tax= selling_for_tax-(selling_for_tax * (discount/100))
                  save_selling= save_selling-(save_selling * (discount/100))
                  save_mrp= save_mrp-(save_mrp * (discount/100))
                  mrp_dis=mrp_dis + save_mrp * (discount/100)
                } else if (discount_type === "rup") {
                  let dis=discount/(selected_product.length)
                  selling_for_tax= selling_for_tax-dis
                  save_selling= save_selling-dis
                  save_mrp= save_mrp-dis
                  mrp_dis=mrp_dis + dis
                }
              }
  
              total_save_selling=total_save_selling+save_selling
              total_save_mrp=total_save_mrp+save_mrp
              total_tax =
                total_tax +
                (selling_for_tax -
                  selling_for_tax * (100 / (100 + data.tax)));
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
                                    {save_amount}
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
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            className="date"
                          >
                            You saved: {"\u20B9"}
                            {save_amount}
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
                                    {save_amount}</strong>
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

export class GenerateBill extends Component {
    ConvertToDecimal = num => {
        let num1 = num.toString(); //If it's not already a String
        let num2 = num1.split(".");
        let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
        // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
        return Number(num3); //If you need it back as a Number
      };
    render() {
        const {state}= this.props.location.data
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
            add_edit_flag
          } = state;
        return (
            <div className="billGenerated-card w-100">
                <div className="billGenerated-card p-0 card_overfl w-100">
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
                      <PrintData state={state} />
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
              </div>
        )
    }
}
const mapStateToProps = store => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GenerateBill);