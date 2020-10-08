import React, { Component } from "react";
import database from "../../database";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ModalPopup } from "../../helper/ModalPopup";
import { LoaderFunc } from "../../helper/LoaderFunc";
import InfiniteScroll from "react-infinite-scroller";
import {
  getInvoice,
  getInvoiceDetails,
  sendInvoice,
  cancelInvoice,
  searchInvoice,
  generateBilling,
  addCustomer,
  customers
} from "../../actions/settings";
import {} from "../../actions/settings";
import { getProducts } from "../../actions/products";
import moment from "moment";
import { toaster } from "../../helper/Toaster";
import ViewInvoice from "./ViewInvoice";
import ViewOfflineInvoice from "./ViewOfflineInvoice";
import { RightSideBar } from "../Dashboard/RightSideBar";
import { API_URL } from "../../config";
import axios from "axios";

let flag = true;
let customer_add_flag = false;
let customer_list_flag = false;
let send_invoice_flag = false;
let cancel_flag = false;
let product_flag = false;
let callFromFlag = false;
let response = {};
export class InvoiceHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_keyword: "",
      selected_flag: "completed",
      selected_class: "completed",
      holded_data: [],
      offline_data: [],
      view_offline_data: {},
      originalInvoiceList: [],
      invoiceList: [],
      searchedList: [],
      hasMoreItems: true,
      total_pages: 0,
      customer_name: "",
      selected_invoice_data: {},
      selected_payment_data: [],
      selected_products: [],
      selected_invoice_id: "",
      selected_cancel_invoice_id: "",
      hold_delete_flag: false,
      hold_flag: false,
      unhold_data: {},
      completed_invoice_flag: "",
      hold_obj: new RightSideBar(),
      store_name: "",
      store_phone: "",
      store_address: "",
      store_gst: "",
      store_logo: "",
      phone_on_invoice: "",
      invoice_set_print: {},
      loaderVisible: true,
      db: new database()
    };
    // this.sharePopup = this.sharePopup.bind(this)
  }
  async componentDidMount() {
    const res1 = await this.state.db.getOfflineProducts();
    if (navigator.onLine) {
      const res1 = await this.state.db.getOfflineProducts();
      if (res1 && res1.status === 200) {
        this.finalGenerateInvoice();
      }
      this.setState({ loaderVisible: true });
    }else{
      this.setState({ loaderVisible: false });
    }

    if (
      res1 &&
      (res1.status === 200 ||
        (res1.offline_product_list && res1.offline_product_list.length !== 0))
    ) {
      this.setState({ offline_data: res1.offline_product_list });
    }

    response = await this.state.db.getDatabaseCustomers();
    let param = {
      page: 1,
      store_id: localStorage.getItem("store")
    };
    this.props.getInvoice(param);
    const res = await this.state.db.getHoldProducts();
    if (
      res &&
      (res.status === 200 || (res.holded_data && res.holded_data.length !== 0))
    ) {
      this.setState({ holded_data: res.holded_data });
    }
    // used to use print setting on print html
    const res3 = await this.state.db.getStoreInvoiceSettings();
    if (res3 && res3.status === 200) {
      this.setState({
        invoice_set_print: res3.invoice_settings_data
      });
    }
    const res4 = await this.state.db.getStoreSettings();
    if (res4 && res4.status === 200) {
      this.setState({
        store_name: res4.store_settings.business_name,
        store_phone: res4.store_settings.phone_number,
        store_address: res4.store_settings.address,
        store_gst: res4.store_settings.gst,
        store_logo: res4.store_settings.logo_url,
        phone_on_invoice: res4.store_settings.phone_no_to_show_invoice
      });
    }
  }

  async UNSAFE_componentWillReceiveProps(newProps) {
    const {
      customer_response,
      customers_list,
      get_store_invoice,
      get_store_invoice_detail,
      send_invoice_response,
      cancel_invoice_response,
      product_list,
      searched_invoice
    } = newProps;

    if (customer_response.code === 200 && customer_add_flag) {
      let cust =
        customer_response.customer &&
        customer_response.customer[0] &&
        customer_response.customer[0].customer;
      this.setState({
        customer_id: cust.customer_id
      });
      this.props.customers(localStorage.getItem("store"));
      customer_list_flag = true;
      customer_add_flag = false;
    }

    if (customers_list.code === 200 && customer_list_flag) {
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
            // if (customer_payment_flag) {
            //   this.finalGenerateInvoice();
            //   customer_payment_flag = false;
            // }
          }
        }
      }
      customer_list_flag = false;
    }

    if (searched_invoice.code === 200 && !flag) {
      let invoice_data = this.state.invoiceList;
      searched_invoice.invoice.map(data => {
        return invoice_data.push(data);
      });
      let searchedList = invoice_data.filter(
        (v, i, a) => a.findIndex(t => t.invoice_id === v.invoice_id) === i
      );
      this.setState({
        invoiceList: searchedList,
        total_pages: searched_invoice.num_pages
      });
      if (searched_invoice.num_pages === 1) {
        this.setState({ hasMoreItems: false });
      }
    }
    if (get_store_invoice.code === 200 && flag) {
      let invoice_data = this.state.originalInvoiceList;
      get_store_invoice.invoice.map(data => {
        return invoice_data.push(data);
      });
      if (callFromFlag) {
        let originalInvoiceList = get_store_invoice.invoice;
        this.setState({
          originalInvoiceList,
          invoiceList: originalInvoiceList,
          total_pages: get_store_invoice.num_pages
        });
      } else {
        let originalInvoiceList = invoice_data.filter(
          (v, i, a) => a.findIndex(t => t.invoice_id === v.invoice_id) === i
        );
        this.setState({
          originalInvoiceList,
          invoiceList: originalInvoiceList,
          total_pages: get_store_invoice.num_pages
        });
      }
      if (get_store_invoice.num_pages === 1) {
        this.setState({ hasMoreItems: false });
      }
      this.setState({ loaderVisible: false });
    }
    if (get_store_invoice_detail.code === 200) {
      this.setState({
        customer_name: get_store_invoice_detail.customer,
        selected_invoice_data: get_store_invoice_detail.invoice_details,
        selected_payment_data: get_store_invoice_detail.payment_details,
        selected_products: get_store_invoice_detail.products
      });
    }
    if (send_invoice_response.code === 200 && send_invoice_flag) {
      toaster("success", send_invoice_response.message);
      this.setState({ share_popup_flag: false });
      send_invoice_flag = false;
    }
    if (cancel_invoice_response.code === 200 && cancel_flag) {
      toaster("success", cancel_invoice_response.message);
      this.setState({ completed_invoice_flag: "" });
      cancel_flag = false;
      let param = {
        page: 1,
        store_id: localStorage.getItem("store")
      };
      this.props.getInvoice(param);

      //need to empty this
      const res = await this.state.db.getDatabaseProducts();
      let data = localStorage.getItem("store");
      let params = {
        store_id: data,
        page: 1,
        is_published: 1,
        last_update: res.updated_time
        // last_update: moment().format("YYYY-MM-DD")
      };
      await this.props.getProducts(params);

      product_flag = true;
    }

    if (product_list && product_list.code === 200 && product_flag) {
      const res = await this.state.db.getDatabaseProducts();
      if (res && res.status === 200) {
        const all_product_data = await this.state.db.getDatabaseProducts();
        let data = all_product_data.product_list
          ? all_product_data.product_list
              .filter(
                item1 =>
                  !newProps.product_list.products.some(
                    item2 => item2.product_id === item1.product_id
                  )
              )
              .concat(newProps.product_list.products)
          : newProps.product_list.products;

        // above condition is applied to fulfill the update operation i.e some data already present in database next time api will give a new data and updated bersion of already present data.
        let doc = {
          _id: "productList",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          _rev: all_product_data._rev,
          product_list: data
        };
        await this.state.db.updateDatabaseProducts(doc);
      }
    }
  }

  async finalGenerateInvoice() {
    const res1 = await this.state.db.getOfflineProducts();
    const res2 = await this.state.db.getLastStoreInvoice();
    if (
      res1 &&
      (res1.status === 200 ||
        (res1.offline_product_list && res1.offline_product_list.length !== 0))
    ) {
      res1.offline_product_list.map((data, index) => {
        let invoice_number = data.local_invoice_id;
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
        let invoice_number_date_split =
          invoice_number && invoice_number.split(" ");
        let invoice_number_time_split = invoice_number_date_split[1].split("$");
        let dat=invoice_number_time_split[1].split("#")[1]
        let date = moment.utc().format("YYYY-MM-DD HH:mm:ss.SS");
        let final_invoice = date + "$" + ran_str + '#' + dat;
        var formData = new FormData();

        if (data.customer_id === "" && data.customer_number !== "") {
          var formData1 = new FormData();
          formData1.append("store_id", localStorage.getItem("store"));
          formData1.append("full_name", data.customer_name);
          formData1.append("phone_number", data.customer_number);
          formData1.append("email", "");
          formData1.append("gst_number", "");
          formData1.append("address", "");
          formData1.append("state", "");
          formData1.append("city", "");
          formData1.append("pin_code", "");
          formData1.append("allow_promotions", 0);
          customer_add_flag = true;
          //  this.props.addCustomer(formData1);
          let cust_id = "";
          axios
            .post(API_URL + "/api/customer/register/", formData1, {
              headers: {
                Authorization: "Token " + localStorage.getItem("token")
              }
            })
            .then(response => {
              if (response.data.code === 200) {
                let cust =
                  response.data.customer[0] &&
                  response.data.customer[0].customer;
                cust_id = cust.customer_id;
                formData.append("customer_id", cust_id);
                formData.append("store_id", data.store_id);

                formData.append("salesman_id", data.salesman_id);
                formData.append("sub_total", data.sub_total);
                formData.append("total_tax", data.total_tax);
                formData.append("total_discount", data.total_discount);
                formData.append("customer_gst", data.customer_gst);
                formData.append("gross_margin", data.gross_margin);
                formData.append("you_save", data.you_save);
                formData.append("billed_by", data.billed_by);
                formData.append(
                  "payment_mode",
                  JSON.stringify({ payment_mode: data.payment_mode })
                );
                formData.append("remarks", data.remarks);
                formData.append("delivery_charges", data.delivery_charges);
                formData.append("local_invoice_id", final_invoice);
                formData.append(
                  "products",
                  JSON.stringify({ product: data.products })
                );
                formData.append("total", data.total);
                formData.append("send_mail", data.send_mail);
                formData.append("send_sms", data.send_sms);
                axios
                  .post(API_URL + "/api/store/invoice/", formData, {
                    headers: {
                      Authorization: "Token " + localStorage.getItem("token")
                    }
                  })
                  .then(response1 => {
                    let off_pro_list = res1.offline_product_list;
                    let ind = res1.offline_product_list.findIndex(
                      item => item.local_invoice_id === data.local_invoice_id
                    );
                    if (response1.data.code === 200) {
                      off_pro_list.splice(ind, 1);
                      let doc = {
                        _id: "offlineProductList",
                        status: 200,
                        // updated_time: moment().format("YYYY-MM-DD"),
                        updated_time: moment
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss.SS"),
                        _rev: res1._rev,
                        offline_product_list: off_pro_list
                      };
                      this.state.db.updateDatabaseProducts(doc);
                    }
                    this.setState({ offline_data: off_pro_list });
                    axios
                      .get(API_URL + "/api/store/last-invoice/", {
                        headers: {
                          Authorization:
                            "Token " + localStorage.getItem("token")
                        }
                      })
                      .then(response2 => {
                        if (response2.data.code === 200) {
                          let doc = {
                            _id: "getLastStoreInvoice",
                            status: 200,
                            // updated_time: moment().format("YYYY-MM-DD"),
                            updated_time: moment
                              .utc()
                              .format("YYYY-MM-DD HH:mm:ss.SS"),
                            _rev: res2._rev,
                            last_invoice: response2.data.invoice
                          };
                          this.state.db.updateDatabaseProducts(doc);
                        }
                      });
                  });
              } else {
                cust_id = "";
              }

              this.props.customers(localStorage.getItem("store"));
              customer_list_flag = true;
            });
        } else {
          formData.append("customer_id", data.customer_id);
          formData.append("store_id", data.store_id);
          formData.append("salesman_id", data.salesman_id);
          formData.append("sub_total", data.sub_total);
          formData.append("total_tax", data.total_tax);
          formData.append("total_discount", data.total_discount);
          formData.append("customer_gst", data.customer_gst);
          formData.append("gross_margin", data.gross_margin);
          formData.append("you_save", data.you_save);
          formData.append("billed_by", data.billed_by);
          formData.append(
            "payment_mode",
            JSON.stringify({ payment_mode: data.payment_mode })
          );
          formData.append("remarks", data.remarks);
          formData.append("delivery_charges", data.delivery_charges);
          formData.append("local_invoice_id", final_invoice);
          formData.append(
            "products",
            JSON.stringify({ product: data.products })
          );
          formData.append("total", data.total);
          formData.append("send_mail", data.send_mail);
          formData.append("send_sms", data.send_sms);
          axios
            .post(API_URL + "/api/store/invoice/", formData, {
              headers: {
                Authorization: "Token " + localStorage.getItem("token")
              }
            })
            .then(response1 => {
              let off_pro_list = res1.offline_product_list;
              let ind = res1.offline_product_list.findIndex(
                item => item.local_invoice_id === data.local_invoice_id
              );

              if (response1.data.code === 200) {
                off_pro_list.splice(ind, 1);
                let doc = {
                  _id: "offlineProductList",
                  status: 200,
                  // updated_time: moment().format("YYYY-MM-DD"),
                  updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
                  _rev: res1._rev,
                  offline_product_list: off_pro_list
                };
                this.state.db.updateDatabaseProducts(doc);
              }
              this.setState({ offline_data: off_pro_list });
              axios
                .get(API_URL + "/api/store/last-invoice/", {
                  headers: {
                    Authorization: "Token " + localStorage.getItem("token")
                  }
                })
                .then(response2 => {
                  if (response2.data.code === 200) {
                    let doc = {
                      _id: "getLastStoreInvoice",
                      status: 200,
                      // updated_time: moment().format("YYYY-MM-DD"),
                      updated_time: moment
                        .utc()
                        .format("YYYY-MM-DD HH:mm:ss.SS"),
                      _rev: res2._rev,
                      last_invoice: response2.data.invoice
                    };
                    this.state.db.updateDatabaseProducts(doc);
                  }
                });
            });
        }
        return null;

        // this.props.generateBilling(formData);
      });
    }
  }

  loadItems(pageNumber) {
    if (pageNumber <= this.state.total_pages) {
      if (this.state.search_keyword === "") {
        let param = {
          page: pageNumber,
          store_id: localStorage.getItem("store")
        };
        this.props.getInvoice(param);
      } else {
        let params = {
          search_field: this.state.search_keyword,
          page: pageNumber
        };
        this.props.searchInvoice(params);
      }
    } else {
      this.setState({ hasMoreItems: false });
    }
  }
  handleTab = name => {
    if (name === "completed") {
      this.setState({
        selected_flag: "completed",
        selected_class: "completed"
      });
    } else if (name === "hold") {
      this.setState({ selected_flag: "hold", selected_class: "hold" });
    } else if (name === "offline") {
      this.setState({ selected_flag: "offline", selected_class: "offline" });
    }
  };

  handleChange = (e, name) => {
    let reg = /^[0-9]{0,10}$/;

    if (name === "share_number" && reg.test(e.target.value) === false) {
      return;
    }
    if (name === "search_keyword") {
      if (
        name === "search_keyword" &&
        (e.target.value.length > 0 || e.target.value.length === 0)
      ) {
        let params = {
          search_field: e.target.value,
          page: 1
        };
        this.props.searchInvoice(params);
        if (this.scroll) {
          this.scroll.pageLoaded = 0;
        }
        this.setState({ invoiceList: [] });
        flag = false;
      }
    }
    this.setState({ [name]: e.target.value });
  };
  clearSearchProducts = () => {
    this.setState({
      search_keyword: "",
      invoiceList: this.state.originalInvoiceList,
      hasMoreItems: true
    });
    // this.scroll.pageLoaded = 0;
    flag = true;
  };

  modalClose = () => {
    this.setState({
      completed_invoice_flag: ""
    });
  };

  openPopup = (e, data, name) => {
    if (name === "completed") {
      this.setState({
        completed_invoice_flag: name,
        selected_invoice_id: data.invoice_id,
        selected_cancel_invoice_id: data.id
      });
      let params = {
        store_id: localStorage.getItem("store"),
        invoice_id: data.invoice_id
      };
      this.props.getInvoiceDetails(params);
      callFromFlag = false;
    } else if (name === "offline") {
      this.setState({
        completed_invoice_flag: "offline",
        view_offline_data: data
      });
    }
  };
  modalHoldClose = data => {
    if (data === "unhold") {
      this.setState({
        hold_flag: false
      });
    } else if (data === "delete") {
      this.setState({
        hold_delete_flag: false
      });
    }
  };

  modalShareClose = () => {
    this.setState({
      share_popup_flag: false
    });
  };
  sharePopup = (e, id, name) => {
    if (response && response.status === 200) {
      if (name === "whatsapp") {
        this.setState({ shared_by: true });
      } else if (name === "email") {
        this.setState({ shared_by: false });
      }
      let customer_list = response.customers_list.customer;
      let selected_customer = customer_list.find(
        data => data.customer.customer_id === id
      );
      this.setState({
        share_popup_flag: true,
        share_number: selected_customer
          ? selected_customer.customer.phone_number
          : "",
        share_email: selected_customer ? selected_customer.customer.email : ""
      });
    }
  };
  keyDownWhatsappEmail = e => {
    if (e.key === "Enter") {
      this.sendInvoiceFunc();
    }
  };
  sendInvoiceFunc = () => {
    const {
      selected_invoice_id,
      share_number,
      share_email,
      shared_by
    } = this.state;
    var formData = new FormData();
    if (
      (shared_by && share_number !== "") ||
      (!shared_by && share_email !== "")
    ) {
      if (
        !shared_by &&
        share_email !== "" &&
        !share_email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)
      ) {
        toaster("error", "Email ID is not valid");
        return;
      }
      if (!shared_by) {
        formData.append("store_id", localStorage.getItem("store"));
        formData.append("invoice_id", selected_invoice_id);
        formData.append("phone_number", share_number);
        formData.append("email", share_email);
        this.props.sendInvoice(formData);
        send_invoice_flag = true;
      } else {
        if (share_number !== "" && !share_number.match(/^[0-9]{10,}$/)) {
          toaster("error", "Mobile number must contain 10 digits.");
          return;
        }
        let text = window.encodeURIComponent(
          `Your Invoice #${this.state.selected_invoice_data.invoice_id}\nDear ${
            this.state.customer_name !== ""
              ? this.state.customer_name
              : "Customer"
          },\nThank you for shopping with ${localStorage.getItem(
            "store_legal_name"
          )}\nHere is your invoice link.\nInvoice URL:${
            this.state.selected_invoice_data.bill_url
          }\n\nRegards\nPogo91\nOn Behalf of ${localStorage.getItem(
            "store_legal_name"
          )}`
        );
        window.open(
          `https://api.whatsapp.com/send?phone=91${share_number}&text=${text}`,
          "_blank"
        );
      }
    } else {
      toaster("error", "Please fill the field.");
    }
  };

  cancelInvoice = () => {
    let param = {
      invoice_id: this.state.selected_cancel_invoice_id
    };
    this.props.cancelInvoice(param);
    cancel_flag = true;
    callFromFlag = true;
  };

  openholdDelete = (e, id) => {
    this.setState({ hold_delete_flag: true, hold_delete_id: id });
  };

  async deleteHoldInvoice() {
    const res = await this.state.db.getHoldProducts();
    if (
      res &&
      (res.status === 200 || (res.holded_data && res.holded_data.length !== 0))
    ) {
      let holdData = res.holded_data;
      if (holdData.length === 1) {
        let data = await this.state.db.deleteDoc(res);
        if (data && data.ok) {
          const res2 = await this.state.db.getHoldProducts();
          if (
            res2 &&
            (res2.status === 200 ||
              (res2.holded_data && res2.holded_data.length !== 0))
          ) {
            this.setState({
              holded_data: res2.holded_data,
              hold_delete_flag: false
            });
          } else {
            this.setState({ holded_data: [], hold_delete_flag: false });
          }
        }
      } else {
        let index = holdData.findIndex(
          data => data.invoice_id === this.state.hold_delete_id
        );
        holdData.splice(index, 1);
        let doc = {
          _id: "holdData",
          status: 200,
          _rev: res._rev,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          holded_data: holdData
        };
        let res1 = await this.state.db.updateDatabaseProducts(doc);
        if (res1 && res1.ok) {
          const res2 = await this.state.db.getHoldProducts();
          if (
            res2 &&
            (res2.status === 200 ||
              (res2.holded_data && res2.holded_data.length !== 0))
          ) {
            this.setState({
              holded_data: res2.holded_data,
              hold_delete_flag: false
            });
          }
        }
      }
    }
  }

  unholdData = (e, data) => {
    this.setState({ hold_flag: true, unhold_data: data });
  };
  async unHoldInvoice() {
    this.state.hold_obj.addToHold();
    const res = await this.state.db.getAddedProducts();

    if (res && res.status === 200) {
      let doc = {
        _id: "addedProductList",
        status: 200,
        _rev: res._rev,
        products: this.state.unhold_data.holded_reverse_data
      };
      await this.state.db.updateDatabaseProducts(doc);
    }
    const res1 = await this.state.db.getHoldProducts();
    if (res1 && res1.status === 200) {
      let database_holded_data = res1.holded_data;
      let index = database_holded_data.findIndex(
        data => data.invoice_id === this.state.unhold_data.invoice_id
      );
      if (index !== -1) {
        database_holded_data.splice(index, 1);
      }
      let doc = {
        _id: "holdData",
        status: 200,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        holded_data: database_holded_data,
        _rev: res1._rev
      };
      let data = await this.state.db.updateDatabaseProducts(doc);
      if (data && data.ok) {
        this.componentDidMount();
      }
    }

    this.setState({ hold_flag: false });
    this.props.history.push("/billing");
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
      selected_flag,
      selected_class,
      completed_invoice_flag,
      hasMoreItems,
      invoiceList,
      holded_data,
      offline_data,
      hold_delete_flag,
      search_keyword,
      hold_flag,
      loaderVisible
    } = this.state;
    return (
      <div className="products_main_content ">
        <LoaderFunc visible={loaderVisible} />
        <div className="billing_products_wrap">
          <div className="d-flex justify-content-between ">
            <h3>Invoice</h3>
            {completed_invoice_flag === "" && (
              <div className="d-flex justify-content-center h-100 top-right">
                <div className="searchbar">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search_input"
                    name="search_keyword"
                    autoComplete="off"
                    value={search_keyword}
                    onChange={e => this.handleChange(e, "search_keyword")}
                    // onKeyPress={this.onKeyPress}
                  />

                  <Link
                    to="#"
                    className="search_icon"
                    onClick={e => this.clearSearchProducts(e)}
                  >
                    <i
                      // className="fa fa-search"
                      className="fa fa-times"
                    ></i>
                  </Link>
                </div>
              </div>
            )}
            {completed_invoice_flag !== "" && (
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-dark grn-btn"
                  onClick={e => this.modalClose(e)}
                >
                  Back
                </button>
              </div>
            )}
          </div>
          {completed_invoice_flag === "" && (
            <div>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <span
                    className={
                      selected_class === "completed"
                        ? "product_list_class nav-link active"
                        : "product_list_class nav-link"
                    }
                    onClick={() => this.handleTab("completed")}
                  >
                    {" "}
                    Completed
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={
                      selected_class === "hold"
                        ? "product_list_class nav-link active"
                        : "product_list_class nav-link"
                    }
                    onClick={() => this.handleTab("hold")}
                  >
                    Hold
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className={
                      selected_class === "offline"
                        ? "product_list_class nav-link active"
                        : "product_list_class nav-link"
                    }
                    onClick={() => this.handleTab("offline")}
                  >
                    Offline
                  </span>
                </li>
              </ul>

              {selected_flag === "completed" && (
                <div className="inc-tab inc_completed-tab">
                  {invoiceList.length !== 0 ? (
                    <div className="row">
                      <div
                        className="col-12 col-md-12"
                        style={{ height: "900px", overflow: "auto" }}
                        ref={ref => (this.scrollParentRef = ref)}
                      >
                        <InfiniteScroll
                          pageStart={1}
                          loadMore={this.loadItems.bind(this)}
                          hasMore={hasMoreItems}
                          loader={
                            <div className="loader" key={0}>
                              Loading ...
                            </div>
                          }
                          useWindow={false}
                          initialLoad={false}
                          // ref={scroll => {
                          //   this.scroll = scroll;
                          // }}
                          getScrollParent={() => this.scrollParentRef}
                        >
                          <div className="row">
                            {invoiceList.map((data, index) => {
                              return (
                                <div
                                  className="col-sm-12 col-lg-6 invoice_list border-bottom"
                                  key={index}
                                  style={{cursor: 'pointer'}}
                                  onClick={e =>
                                    this.openPopup(e, data, "completed")
                                  }
                                >
                                  <h4 className="mb-1 d-flex justify-content-between">
                                    <span>
                                      Bill: <b>#{data.invoice_id}</b>
                                    </span>
                                    <small>
                                      {moment(data.created_date).format(
                                        "DD-MMM-YYYY"
                                      )}
                                    </small>
                                  </h4>
                                  <div className="row">
                                    <div className="col-10">
                                      <span className="text-capitalize">
                                        {data.customer !== null
                                          ? data.customer.first_name
                                          : "customer"}
                                      </span>
                                      <br />
                                      <span>Total:{this.ConvertToDecimal(data.sub_total)}</span>
                                    </div>
                                    <div className="col-2 d-flex align-items-end justify-content-center">
                                      {data.is_deleted ? (
                                        <span className="badge  p-2">
                                          Cancelled
                                        </span>
                                      ) : (
                                        <span className="badge  p-2">
                                          Completed
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </InfiniteScroll>
                      </div>
                    </div>
                  ) : navigator.onLine ? (
                    <div className="no_data_found">
                      {/* <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>No Data Found</h3> */}
                    </div>
                  ) : (
                    <div className="no_data_found">
                      <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>Please connect to internet to view invoice history</h3>
                    </div>
                  )}
                </div>
              )}
              {selected_flag === "hold" && (
                <div className="inc-tab inc_hold-tab">
                  {holded_data.length !== 0 ? (
                    <ul className="row">
                      {holded_data.map((data, index) => {
                        return (
                          <li className="border-bottom p-2 col-6">
                            <div className="d-flex justify-content-between align-items-center">
                              <div
                                className="py-1 w-100"
                                style={{cursor: 'pointer'}}
                                onClick={e => this.unholdData(e, data)}
                              >
                                <h4 className="m-0">
                                  <b>Offline Invoice #{data.invoice_id}</b>{" "}
                                  {/* <span className="text-capitalize">
                                        {data.customer_name
                                          ? data.customer_name
                                          : "Customer"}
                                      </span> */}
                                </h4>
                                <span>
                                  {moment(data.created_date).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </span>
                              </div>
                              <div className="">
                                {/* <span className="badge p-2">On Hold</span> */}
                                <i
                                  className="fa fa-trash-o"
                                  aria-hidden="true"
                                  onClick={e =>
                                    this.openholdDelete(e, data.invoice_id)
                                  }
                                ></i>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="no_data_found">
                      <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </div>
              )}
              {selected_flag === "offline" && (
                <div className="inc-tab inc_hold-tab">
                  {offline_data.length !== 0 ? (
                    <ul className="row">
                      {offline_data.map((data, index) => {
                        return (
                          <li className="border-bottom p-2 col-6">
                            <div
                              className="d-flex justify-content-between align-items-center"
                              onClick={e => this.openPopup(e, data, "offline")}
                            >
                              <div className="py-1 w-100">
                                <h4 className="m-0">
                                  <b>Invoice</b>-
                                  {data.local_invoice_id.split("_")[1]}{" "}
                                  <span className="text-capitalize">
                                    {data.customer_name
                                      ? data.customer_name
                                      : "Customer"}
                                  </span>
                                </h4>
                                <span>
                                  {moment(data.created_date).format(
                                    "DD-MMM-YYYY"
                                  )}
                                </span>
                              </div>
                              <div className="">
                                <span className="badge p-2">
                                  Waiting for connection
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="no_data_found">
                      <h2>
                        <i
                          className="fa fa-exclamation-triangle"
                          aria-hidden="true"
                        ></i>
                      </h2>
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </div>
              )}

              {hold_flag && (
                <ModalPopup
                  className="hold-delete-flag unhold_invoice"
                  popupOpen={hold_flag}
                  popupHide={() => this.modalHoldClose("unhold")}
                  // title="Invoice"
                  content={
                    <div className="">
                      <h4 className="text-dark text-center mb-3">
                        Are you sure you want to unhold this invoice?
                      </h4>
                      <div className="d-flex justify-content-center mt-2">
                        <button
                          className="btn add_btn mr-2"
                          onClick={() => this.unHoldInvoice()}
                        >
                          Yes
                        </button>
                        <button
                          className="btn add_btn"
                          onClick={() => this.modalHoldClose("unhold")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  }
                />
              )}

              {hold_delete_flag && (
                <ModalPopup
                  className="hold-delete-flag unhold_invoice"
                  popupOpen={hold_delete_flag}
                  popupHide={() => this.modalHoldClose("delete")}
                  // title="Invoice"
                  content={
                    <div className="">
                      <h4 className="text-dark text-center mb-3">
                        Are you sure to delete this invoice?
                      </h4>
                      <div className="d-flex justify-content-center mt-2">
                        <button
                          className="btn add_btn mr-2"
                          onClick={() => this.deleteHoldInvoice()}
                        >
                          Yes
                        </button>
                        <button
                          className="btn add_btn"
                          onClick={() => this.modalHoldClose("delete")}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  }
                />
              )}
            </div>
          )}
          {completed_invoice_flag === "completed" && (
            <ViewInvoice
              state={this.state}
              handleChange={this.handleChange}
              sendInvoiceFunc={this.sendInvoiceFunc}
              sharePopup={this.sharePopup}
              modalShareClose={this.modalShareClose}
              cancelInvoice={this.cancelInvoice}
              keyDownWhatsappEmail={this.keyDownWhatsappEmail}
            />
          )}
          {completed_invoice_flag === "offline" && (
            <ViewOfflineInvoice state={this.state} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    get_store_invoice: store.settings.get_store_invoice,
    get_store_invoice_detail: store.settings.get_store_invoice_detail,
    send_invoice_response: store.settings.send_invoice_response,
    cancel_invoice_response: store.settings.cancel_invoice_response,
    searched_invoice: store.settings.searched_invoice,
    product_list: store.products.product_list,
    customers_list: store.settings.customers_list,
    customer_response: store.settings.customer_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    generateBilling: params => dispatch(generateBilling(params)),
    getInvoice: params => dispatch(getInvoice(params)),
    getInvoiceDetails: params => dispatch(getInvoiceDetails(params)),
    sendInvoice: params => dispatch(sendInvoice(params)),
    cancelInvoice: params => dispatch(cancelInvoice(params)),
    getProducts: params => dispatch(getProducts(params)),
    searchInvoice: params => dispatch(searchInvoice(params)),
    addCustomer: params => dispatch(addCustomer(params)),
    customers: params => dispatch(customers(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHistory);
