import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { Link } from "react-router-dom";
import { ModalPopup } from "../../helper/ModalPopup";
import BarcodeReader from "react-barcode-reader";
import { toaster } from "../../helper/Toaster";
import { API_URL } from "../../config";
import axios from "axios";
import {
  accountPermission
} from "../../actions/common";
import {
  getProducts,
  getTax,
  getProductType,
  updateProduct
} from "../../actions/products";
import {
  storeSettings,
  storePaymentMode,
  storeInvoiceType,
  customers,
  getLastStoreInvoice,
  stateApi,
  getInvoiceSettings
} from "../../actions/settings";
import RightSideBar from "./RightSideBar";
import database from "../../database";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import * as _ from "lodash";
import convert from "convert-units";
import InfiniteScroll from "react-infinite-scroller";
import { isTablet } from "react-device-detect";
let update_flag = false;
let store_setings_flag = false;
let store_invoice_flag = false;
let get_store_invoice_flag = false;
let invoice_settings_flag = false;
let store_payment_flag = false;
let customer_flag = false;
let tax_flag = false;
let state_flag = false;
let product_type_flag = false;
let loader_data = "";
let loader_value = 0;
let displayed_loader_value = 0;
let added_product_array = [];
let total_weight_quantity = [];
var permission = true
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show_images: true,
      db: new database(), // create object of database present in database.js
      product_data: [], //contain all database products
      varient_data: [], //contain first variant of every product
      paginated_data: [], //contain paginated data
      searched_data: [], // contain searched data
      barcoded_searched_data: [],
      barcode_normal_flag: false,
      barcode_flag: false, // used to open popup if no barcode product found
      loader_state_flag: false, //used to run loader while loading data
      activePage: 1,
      starting_index: 0,
      last_index: 50,
      weight_flag: false, //related to weight popup
      stock_flag: false, //related to multiple price stock
      selected_product: {},
      db_added_products: [],
      edit_products: [],
      added_product_data_stock: {},
      selected_weight_unit: [],
      weight_value: [], //input fied in weight popup
      weight_value_input: [],
      add_modification_flag: false,
      add_imei_flag: false,
      modified_product: {},
      modified_key: "",
      tax_data: [],
      hasMoreItems: true,
      numPages: 0,
      selected_flag: true, //used to select tab i.e list or barcode bydefault is list
      selected_class: true,
      activeClass: isTablet ? false : true, //used to toggle right side bar on tablet,
      search_keyword: '',
      store_name: "",
      store_phone: "",
      store_address: "",
      store_gst: "",
      store_logo: "",
      phone_on_invoice: "",
      invoice_set_print: {},
      loaderVisible: true,
      generate_popup_flag: false,
      permission_flag: true
    };
    this.initialState = { ...this.state };
    // new database().deleteDatabase();
    this.minusProduct = this.minusProduct.bind(this);
    this.addedProduct = this.addedProduct.bind(this);
    this.handleScan = this.handleScan.bind(this);
  }

  async componentDidMount() {

    await axios.get(`${API_URL}/accounts/validity/`, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    }).then(response => {
      if (response.data.code === 200) {
        permission = response.data.data
        // this.setState({ permission_flag: response.data.data })
      }
    })
    if (permission) {
      if (navigator.onLine) {
        this.setState({ loaderVisible: true });
      } else {
        this.setState({ loaderVisible: false });
      }
      if (this.props.location && this.props.location.state) {
        if (this.props.location.state.barcoded) {
          this.setState({ selected_flag: false, selected_class: false });
        } else {
          this.setState({ selected_flag: true, selected_class: true });
        }
      }

      // it indicates that productlist doc  is present in database
      const res = await this.state.db.getDatabaseProducts();
      if (res && res.status === 200) {
        if (localStorage.getItem("store")) {
          let data = localStorage.getItem("store");
          let params = {
            store_id: data,
            page: 1,
            is_published: 1,
            // last_update: res.updated_time
            last_update: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS")
            // last_update: moment().format("YYYY-MM-DD")
          };
          // call product with updated time
          await this.props.getProducts(params);
        }

        // used to display data on print section
        const res2 = await this.state.db.getStoreSettings();
        if (res2 && res2.status === 200) {
          this.setState({
            show_images: res2.store_settings.show_images, // used to get show image response to show images on dashboard
            store_name: res2.store_settings.business_name,
            store_phone: res2.store_settings.phone_number,
            store_address: res2.store_settings.address,
            store_gst: res2.store_settings.gst,
            store_logo: res2.store_settings.logo_url,
            phone_on_invoice: res2.store_settings.phone_no_to_show_invoice
          });
        }
        // used to use print setting on print html
        const res3 = await this.state.db.getStoreInvoiceSettings();
        if (res3 && res3.status === 200) {
          this.setState({
            invoice_set_print: res3.invoice_settings_data
          });
        }

      } else {
        this.setState({ loader_state_flag: true });


        if (localStorage.getItem("store")) {
          // call tax api
          this.props.getTax();
          tax_flag = true;
          // call last invoice to add data in invoice id
          await this.props.getLastStoreInvoice(localStorage.getItem("store"));
          get_store_invoice_flag = true;

          //store invoice settings
          await this.props.getInvoiceSettings();
          invoice_settings_flag = true;
          // provide type for product type dropdown
          this.props.getProductType(localStorage.getItem("store"));
          product_type_flag = true;
          this.props.stateApi();
          state_flag = true;
          let data = localStorage.getItem("store");
          let params = {
            store_id: data
          };
          store_setings_flag = true;
          loader_data = "fetch store settings";
          // call store detail api
          await this.props.storeSettings(params);

          store_payment_flag = true;
          loader_data = "fetch store payment";
          // call payment method api
          await this.props.storePaymentMode(data);

          store_invoice_flag = true;
          loader_data = "fetch store invoice type";
          //  call email, sms, whatsapp option
          await this.props.storeInvoiceType(data);
          customer_flag = true;
          loader_data = "fetch customer";
          // call customer list
          await this.props.customers(data);
          let params1 = {
            store_id: data,
            page: 1,
            is_published: 1
          };
          loader_data = "fetch products";
          // call complete product list
          await this.props.getProducts(params1);
        }
      }
    } else {
      this.setState({ permission_flag: false })
      this.setState({ loaderVisible: false });
      this.props.accountPermission(false);
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const { starting_index, last_index } = this.state;
    let loader_flag = this.state.loader_state_flag;
    const {
      tax_data,
      last_invoice,
      invoice_settings_list,
      store_settings,
      store_invoice,
      store_payment,
      customers_list,
      product_list,
      state_list,
      product_type,
      update_response,
      generate_bill_data,
      access_permission
    } = newProps;
    if (access_permission && access_permission.code === 200) {
      this.setState({ permission_flag: access_permission.permission_status })
    }
    if (
      generate_bill_data &&
      generate_bill_data.code === 200
    ) {
      this.setState({ generate_popup_flag: generate_bill_data.bill_status });
    }
    // used to display data on print section
    const res2 = await this.state.db.getStoreSettings();
    if (res2 && res2.status === 200) {
      this.setState({
        show_images: res2.store_settings.show_images, // used to get show image response to show images on dashboard
        store_name: res2.store_settings.business_name,
        store_phone: res2.store_settings.phone_number,
        store_address: res2.store_settings.address,
        store_gst: res2.store_settings.gst,
        store_logo: res2.store_settings.logo_url,
        phone_on_invoice: res2.store_settings.phone_no_to_show_invoice
      });
    }
    // used to use print setting on print html
    const res3 = await this.state.db.getStoreInvoiceSettings();
    if (res3 && res3.status === 200) {
      this.setState({
        invoice_set_print: res3.invoice_settings_data
      });
    }
    
    if (update_response && update_response.code === 200 && update_flag) {
      toaster("success", update_response.message);
      const res = await this.state.db.getDatabaseProducts();
      if (localStorage.getItem("store")) {
        let data = localStorage.getItem("store");
        this.setState({ add_modification_flag: false });
        let params = {
          store_id: data,
          page: 1,
          is_published: 1,
          last_update: res.updated_time
          // last_update:moment.utc().format("YYYY-MM-DD HH:mm:ss.SS")
          // last_update: "2019-09-05 17:00:00.000000",
        };
        update_flag = false;
        await this.props.getProducts(params);
      }
    } else if (update_response && update_response.code === 400 && update_flag) {
      toaster("error", update_response.message);
      update_flag = false;
    }
    // provide all tax list
    if (tax_data && tax_data.code === 200 && tax_flag) {
      loader_data = "get tax data";
      let doc = {
        _id: "getTax",
        status: 200,
        tax_data: tax_data.tax
      };
      tax_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 5;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
      this.setState({
        tax_data: tax_data.tax
      });
      this.setState({ loaderVisible: false });
    } else {
      let res1 = await this.state.db.getTax();
      if (res1 && res1.status === 200) {
        this.setState({
          tax_data: res1.tax_data
        });
      }
    }
    if (state_list && state_list.code === 200 && state_flag) {
      loader_data = "get state list";
      let doc = {
        _id: "getState",
        status: 200,
        state_data: state_list.state
      };
      state_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 7;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }

    if (
      invoice_settings_list &&
      invoice_settings_list.code === 200 &&
      invoice_settings_flag
    ) {
      loader_data = "get invoice settings";
      this.setState({
        invoice_set_print: invoice_settings_list.print_settings
      });
      let doc = {
        _id: "storeInvoiceSettings",
        status: 200,
        invoice_settings_data: invoice_settings_list.print_settings
      };
      invoice_settings_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 10;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }

    if (product_type && product_type.code === 200 && product_type_flag) {
      loader_data = "get product type";
      let doc = {
        _id: "getProductType",
        status: 200,
        product_types: newProps.product_type.store_product_types
      };
      product_type_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 8;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }

    // used to store the last invocie
    if (last_invoice.code === 200 && get_store_invoice_flag) {
      const res = await this.state.db.getLastStoreInvoice();
      if (res) {
        let doc = {
          _id: "getLastStoreInvoice",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          _rev: res._rev,
          last_invoice: last_invoice.invoice
        };
        get_store_invoice_flag = false;
        await this.state.db.updateDatabaseProducts(doc);
      } else {
        let doc = {
          _id: "getLastStoreInvoice",
          status: 200,
          // updated_time: moment().format("YYYY-MM-DD"),
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          last_invoice: last_invoice.invoice
        };
        get_store_invoice_flag = false;
        await this.state.db.addDatabase(doc);
      }
    }
    // used to store the store setting data
    if (store_settings.code === 200 && store_setings_flag) {
      loader_data = "configure store settings";
      this.setState({
        show_images: store_settings.store.show_images,
        store_name: store_settings.store.business_name,
        store_phone: store_settings.store.phone_number,
        store_address: store_settings.store.address,
        store_gst: store_settings.store.gst,
        store_logo: store_settings.store.logo_url,
        phone_on_invoice: store_settings.phone_no_to_show_invoice
      });
      let doc = {
        _id: "storeSettings",
        status: 200,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_settings: store_settings.store
      };
      store_setings_flag = false; //it should be above await for proper operation
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 5;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }
    // used to store the store invoice data i.e. email, sms, whatsapp option
    if (store_invoice.code === 200 && store_invoice_flag) {
      loader_data = "configure store invoice";
      let doc = {
        _id: "storeInvoice",
        status: 200,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_invoice: store_invoice
      };
      store_invoice_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 5;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }

    // used to store the store payment data
    if (store_payment.code === 200 && store_payment_flag) {
      loader_data = "configure store payment";
      let doc = {
        _id: "storePayment",
        status: 200,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        store_payment: store_payment.products
      };
      store_payment_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 4;
      displayed_loader_value = Math.round(loader_value);
      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }
    // used to store the customer data
    if (customers_list.code === 200 && customer_flag) {
      let doc = {
        _id: "customerList",
        status: 200,
        // updated_time: moment().format("YYYY-MM-DD"),
        updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
        customers_list: customers_list
      };
      customer_flag = false;
      await this.state.db.addDatabase(doc);
      loader_value = loader_value + 6;
      displayed_loader_value = Math.round(loader_value);

      loader_flag = true;
      this.setState({ loader_state_flag: loader_flag });
    }
    // used to store the product data
    if (product_list.code === 200) {
      const res = await this.state.db.getDatabaseProducts();
      if (res && res.status === 200) {
        let data = [];
        data = _.cloneDeep(newProps.product_list.products);
        res.product_list.map(async item1 => {
          let item =
            newProps.product_list.products &&
            newProps.product_list.products.find(
              item2 => item2.product_id === item1.product_id
            );
          if (item === undefined) {
            await data.push(item1);
          }
          return null;
        });
        let doc = {
          _id: "productList",
          status: 200,
          updated_time: res.updated_time,
          _rev: res._rev,
          product_list: data
        };
        await this.state.db.updateDatabaseProducts(doc);
      } else {
        let doc = {
          _id: "productList",
          status: 200,
          updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
          product_list: newProps.product_list.products
        };

        if (newProps.product_list.num_pages === 1) {
          loader_value = loader_value + 50;
          displayed_loader_value = Math.round(loader_value);
          if (loader_value === 100) {
            loader_flag = false;
            loader_data = "configuring data";
            setTimeout(() => {
              this.setState({ loader_state_flag: loader_flag });
            }, 1000);
            // used to revome loader once completed
          }
        } else {
          loader_value = loader_value + 50 / newProps.product_list.num_pages;
          displayed_loader_value = Math.round(loader_value);
        }
        // loader_flag = true;
        // this.setState({ loader_state_flag: loader_flag });
        await this.state.db.addDatabase(doc);

        for (var i = 2; i <= newProps.product_list.num_pages; i++) {
          let params = {
            store_id: localStorage.getItem("store"),
            page: i,
            is_published: 1
          };

          loader_value = loader_value + 50 / newProps.product_list.num_pages;
          displayed_loader_value = Math.round(loader_value);
          loader_flag = true;
          this.setState({ loader_state_flag: loader_flag });
          const res1 = await this.state.db.getDatabaseProducts();
          let data = [];

          data = _.cloneDeep(newProps.product_list.products);
          res1.product_list &&
            res1.product_list.map(async item1 => {
              let item =
                newProps.product_list.products &&
                newProps.product_list.products.find(
                  item2 => item2.product_id === item1.product_id
                );
              if (item === undefined) {
                await data.push(item1);
              }
              return null;
            });

          let doc = {
            _id: "productList",
            status: 200,
            updated_time: res.updated_time,
            _rev: res._rev,
            product_list: data
          };
          await this.state.db.updateDatabaseProducts(doc);
          await this.props.getProducts(params);
          if (i === newProps.product_list.num_pages) {
            loader_value = Math.round(loader_value);
            let temp_value = 100 - loader_value;
            loader_value = loader_value + temp_value;

            if (loader_value === 100) {
              loader_flag = false;
              loader_data = "configuring data";
              setTimeout(() => {
                this.setState({ loader_state_flag: false });
              }, 1000);
              // used to revome loader once completed
            }
            const res2 = await this.state.db.getDatabaseProducts();
            let data = [];

            data = _.cloneDeep(newProps.product_list.products);
            res2.product_list &&
              res2.product_list.map(async item1 => {
                let item =
                  newProps.product_list.products &&
                  newProps.product_list.products.find(
                    item2 => item2.product_id === item1.product_id
                  );
                if (item === undefined) {
                  await data.push(item1);
                }
                return null;
              });

            let doc = {
              _id: "productList",
              status: 200,
              updated_time: res.updated_time,
              _rev: res._rev,
              product_list: data
            };
            await this.state.db.updateDatabaseProducts(doc);
          }
        }
      }
      this.setState({ loaderVisible: false });
    }

    let product_data = await this.state.db.getDatabaseProducts();
    if (product_data && product_data.status === 200 && !loader_flag) {
      let varient_data = this.state.varient_data;
      let data = [];
      const res = await this.state.db.getAddedProducts();
      if (res && res.status === 200) {
        this.setState({
          db_added_products: res.products,
          barcoded_searched_data: res.products
        });

        product_data.product_list.map((item, key) => {
          let added_product =
            res.products &&
            res.products.find(x => x.product_id === item.product_id);
          return item.variants.map((data, variant_key) => {
            let added_product_variant =
              added_product &&
              added_product.variants.find(
                x => x.variant_id === data.variant_id
              );
            data.total_quantity = added_product_variant
              ? added_product_variant.total_quantity
              : 0;
            data.serial_number = added_product_variant
              ? added_product_variant.serial_number
              : "";
            data.imei_number = added_product_variant
              ? added_product_variant.imei_number
              : "";
            data.price_stock.map((stock, stock_key) => {
              stock.added_quantity = added_product_variant
                ? added_product_variant.price_stock[stock_key] &&
                added_product_variant.price_stock[stock_key].added_quantity
                : 0;
              stock.other = added_product_variant
                ? added_product_variant.price_stock[stock_key] &&
                added_product_variant.price_stock[stock_key].other
                : false;
              stock.unit = stock.other
                ? added_product_variant
                  ? added_product_variant.price_stock[stock_key] &&
                  added_product_variant.price_stock[stock_key].unit
                  : "gram"
                : "gram";

              stock.original_selling_price = added_product_variant
                ? added_product_variant.price_stock[stock_key] &&
                added_product_variant.price_stock[stock_key]
                  .original_selling_price
                : stock.selling_price;
              stock.original_mrp = added_product_variant
                ? added_product_variant.price_stock[stock_key] &&
                added_product_variant.price_stock[stock_key].original_mrp
                : stock.mrp;
              stock.original_cost_price = added_product_variant
                ? added_product_variant.price_stock[stock_key] &&
                added_product_variant.price_stock[stock_key]
                  .original_cost_price
                : stock.cost_price;
              return null;
            });
            return null;
          });
        });
      } else {
        product_data.product_list.map(item => {
          return item.variants.map(data => {
            data.total_quantity = 0;
            data.serial_number = "";
            data.imei_number = "";
            return data.price_stock.map(stock => {
              stock.added_quantity = 0;
              stock.other = false;
              stock.unit = "";
              stock.original_selling_price = stock.selling_price;
              stock.original_mrp = stock.mrp;
              stock.original_cost_price = stock.cost_price;
              return null;
            });
          });
        });
      }

      product_data.product_list.map((item, key) => {
        // provide data if is_published
        if (item.variants.length !== 0) {
          // provide data if product type service(3)
          if (item.product_type === 3) {
            varient_data[item.product_id] =
              item.variants[0] && item.variants[0].variant_id;
            data.push(item);
          } else {
            if (item.track_inventory) {
              if (item.product_type === 2) {
                // provide data if product type weighted(2)
                let inner_item = [];
                let inner_item1 = [];
                item.variants.map(data1 => {
                  let price_stock = data1.price_stock.filter(
                    item => item.weight > 0
                  );
                  if (price_stock.length > 0) {
                    data1.price_stock = price_stock;
                    inner_item.push(data1);
                  }
                  return null;
                });
                inner_item.map(data1 => {
                  let price_stock = data1.price_stock.filter(
                    item => item.quantity > 0
                  );
                  if (price_stock.length > 0) {
                    data1.price_stock = price_stock;
                    inner_item1.push(data1);
                  }
                  return null;
                });
                // inner_item1 indicates if quantity > 0 and inner_item indicates if weight > 0
                if (
                  (item.allow_below_zero || inner_item1.length !== 0) &&
                  inner_item.length !== 0
                ) {
                  // add only those variants whose quantity > 0
                  item.variants = inner_item;
                  // used to select first variant by default
                  varient_data[item.product_id] =
                    item.variants[0] && item.variants[0].variant_id;
                  data.push(item);
                } else {
                  item.flag_for_quantity = true;
                  varient_data[item.product_id] =
                    item.variants[0] && item.variants[0].variant_id;
                  data.push(item);
                }
              } else if (item.product_type === 1 || item.product_type === 4) {
                if (item.allow_below_zero) {
                  varient_data[item.product_id] =
                    item.variants[0] && item.variants[0].variant_id;
                  data.push(item);
                } else {
                  // let inner_item = item.variants.filter(t =>
                  //   t.price_stock.every(c => c.quantity > 0)
                  // );
                  let inner_item = [];
                  item.variants.map(data1 => {
                    let price_stock = data1.price_stock.filter(
                      item => item.quantity > 0
                    );
                    if (price_stock.length > 0) {
                      data1.price_stock = price_stock;
                      inner_item.push(data1);
                    }
                    return null;
                  });

                  if (inner_item.length !== 0) {
                    // add only those variants whose quantity > 0
                    item.variants = inner_item;
                    // used to select first variant by default
                    varient_data[item.product_id] =
                      item.variants[0] && item.variants[0].variant_id;
                    data.push(item);
                  } else {
                    item.flag_for_quantity = true;
                    varient_data[item.product_id] =
                      item.variants[0] && item.variants[0].variant_id;
                    data.push(item);
                  }
                }
              }
            } else {
              varient_data[item.product_id] =
                item.variants[0] && item.variants[0].variant_id;
              data.push(item);
            }
          }
        }
        return null;
      });
      // provide paginated data from 0 to 50
      let paginated_data = data.filter(
        (data, idx) => idx >= starting_index && idx < last_index
      );
      const res1 = await this.state.db.getEditProducts();

      if (res1 && res1.status === 200) {
        added_product_array = res1.products;

        let doc = {
          _id: "editProductList",
          status: 200,
          _rev: res1._rev,
          products: product_data.product_list
        };
        await this.state.db.updateDatabaseProducts(doc);
        this.setState({
          edit_products: product_data.product_list
        });
      } else {
        let doc = {
          _id: "editProductList",
          status: 200,
          products: product_data.product_list
        };
        await this.state.db.addDatabase(doc);
        this.setState({
          edit_products: product_data.product_list
        });
      }

      this.setState({
        product_data: data,
        paginated_data: paginated_data,
        numPages: Math.ceil(paginated_data.length / 50),
        varient_data: varient_data
      });
      // append database data in state variable.
    }
  }

  // calls when variant switches
  changeVariant = (e, selected_product_id, selected_variant_data) => {
    let varient_data = this.state.varient_data;
    varient_data[selected_product_id] = selected_variant_data.variant_id;

    this.setState({
      varient_data: varient_data
    });
  };

  async handleChange(e, name, data, key) {
    let reg = /^[0-9]{0,10}$/;
    if (reg.test(e.target.value) === false) {
      return;
    }
    let local_data = this.state.selected_flag
      ? this.state.paginated_data.find(x => x.product_id === data.product_id)
      : this.state.barcoded_searched_data.find(
        x => x.product_id === data.product_id
      );
    if (name === "s.price") {
      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].original_selling_price = e.target.value ? parseInt(e.target.value) : 0;

      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].selling_price = e.target.value ? parseInt(e.target.value) : 0;
    } else if (name === "gst") {
      local_data.tax_id = e.target.value;
    }

    const res1 = await this.state.db.getEditProducts();

    if (
      res1 &&
      (res1.status === 200 || (res1.products && res1.products.length !== 0))
    ) {
      added_product_array = res1.products;
      let index = added_product_array.findIndex(
        x => x.product_id === local_data.product_id
      );

      if (index !== -1) {
        added_product_array[index] = local_data;
      } else {
        added_product_array.push(local_data);
      }
      let doc = {
        _id: "editProductList",
        status: 200,
        _rev: res1._rev,
        products: added_product_array
      };
      await this.state.db.updateDatabaseProducts(doc);
      this.setState({
        edit_products: added_product_array
        // barcoded_searched_data: barcode_data
      });
    }

    const res = await this.state.db.getAddedProducts();

    if (res && res.status === 200) {
      added_product_array = res.products;
      let index = added_product_array.findIndex(
        x => x.product_id === local_data.product_id
      );

      if (index !== -1) {
        added_product_array[index] = local_data;
      } else {
        added_product_array.push(local_data);
      }
      let doc = {
        _id: "addedProductList",
        status: 200,
        _rev: res._rev,
        products: added_product_array
      };
      await this.state.db.updateDatabaseProducts(doc);
    }
  }

  selectWeight = (
    e,
    name,
    stock,
    stock_key,
    selected_only_product,
    variant_key
  ) => {
    let weight_value = this.state.weight_value;
    let selected_weight_unit = this.state.selected_weight_unit;
    let weight_value_input = this.state.weight_value_input;
    let added_product_data_stock = this.state.added_product_data_stock;
    let local_weight = e.target.value ? Number(e.target.value) : 0;

    if (name === "weight_value") {
      if (
        Number(e.target.value) === 250 ||
        parseInt(e.target.value) === 500 ||
        Number(e.target.value) === 750
      ) {
        local_weight = convert(local_weight)
          .from("g")
          .to("kg");
      }
      if (
        added_product_data_stock.product_type !== 3 &&
        added_product_data_stock.track_inventory &&
        !added_product_data_stock.allow_below_zero &&
        local_weight >=
        added_product_data_stock.variants[variant_key].price_stock[stock_key]
          .quantity
      ) {
        return toaster("error", "Quantity can't be greater than stock");
      }
      weight_value[stock_key] = e.target.value ? Number(e.target.value) : 0;
      weight_value_input[stock.id] = local_weight;
      selected_weight_unit[stock_key] = "kg";
      total_weight_quantity[stock_key] = local_weight;
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].added_quantity = local_weight;

      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].other = false;
      added_product_data_stock.variants[
        variant_key
      ].total_quantity = added_product_data_stock.variants[
        variant_key
      ].price_stock
        .map(data => data.added_quantity)
        .reduce((a, c) => a + c);
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].unit = "";
      this.setState({
        weight_value: weight_value,
        weight_value_input: weight_value_input,
        added_product_data_stock: added_product_data_stock,
        selected_weight_unit: selected_weight_unit
      });
    } else if (name === "weight_value_input") {
      let reg = /(^([0-9]{0,7})([0-9]{0}|[.][0-9]{0,2}))$/;
      if (reg.test(e.target.value) === false) {
        return;
      }
      selected_weight_unit[stock_key] = "gram";
      if (selected_weight_unit[stock_key] === "gram") {
        local_weight = convert(local_weight)
          .from("g")
          .to("kg");
      }

      if (
        added_product_data_stock.product_type !== 3 &&
        added_product_data_stock.track_inventory &&
        !added_product_data_stock.allow_below_zero &&
        local_weight >=
        added_product_data_stock.variants[variant_key].price_stock[stock_key]
          .quantity
      ) {
        return toaster("error", "Quantity can't be greater than stock");
      }

      total_weight_quantity[stock_key] = local_weight;
      weight_value_input[stock.id] = e.target.value ? e.target.value : "";

      weight_value[stock_key] = 0;

      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].added_quantity = local_weight;
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].other = true;
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].unit = "gram";

      added_product_data_stock.variants[
        variant_key
      ].total_quantity = added_product_data_stock.variants[
        variant_key
      ].price_stock
        .map(data => data.added_quantity)
        .reduce((a, c) => a + c);
      this.setState({
        weight_value_input: weight_value_input,
        weight_value: weight_value,
        selected_weight_unit: selected_weight_unit,
        added_product_data_stock: added_product_data_stock
      });
    } else if (name === "selected_weight_unit") {
      if (this.state.weight_value_input[stock.id] === 0) {
        return;
      }
      selected_weight_unit[stock_key] = e.target.value;
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].unit = e.target.value;
      let local_weight = this.state.weight_value_input[stock.id]
        ? Number(this.state.weight_value_input[stock.id])
        : 0;
      if (e.target.value === "gram") {
        local_weight = convert(local_weight)
          .from("g")
          .to("kg");
      }
      if (
        added_product_data_stock.product_type !== 3 &&
        added_product_data_stock.track_inventory &&
        !added_product_data_stock.allow_below_zero &&
        local_weight >=
        added_product_data_stock.variants[variant_key].price_stock[stock_key]
          .quantity
      ) {
        return toaster("error", "Quantity can't be greater than stock");
      }
      total_weight_quantity[stock_key] = local_weight;
      added_product_data_stock.variants[variant_key].price_stock[
        stock_key
      ].added_quantity = local_weight;
      added_product_data_stock.variants[
        variant_key
      ].total_quantity = added_product_data_stock.variants[
        variant_key
      ].price_stock
        .map(data => data.added_quantity)
        .reduce((a, c) => a + c);

      this.setState({
        weight_value_input: weight_value_input,
        selected_weight_unit: selected_weight_unit,
        added_product_data_stock: added_product_data_stock
      });
    }
  };

  // calls when user hit add or increment button in billing
  async addedProduct(e, data, variant, variant_key, barcoded_added_data) {
    if (data.product_type !== 2) {
      // calls when type is not weighted
      if (variant.price_stock && variant.price_stock.length > 1) {
        // call when product has multiple price stock
        let added_quantity = this.state.added_quantity;
        // add quantity of all price stock in array
        added_quantity = variant.price_stock.map(
          (data1, key) => data1.added_quantity
        );
        const res1 = await this.state.db.getAddedProducts();

        let local_selected_data = [];
        if (
          res1 &&
          (res1.status === 200 || (res1.products && res1.products.length !== 0))
        ) {
          local_selected_data = res1.products.find(
            x => x.product_id === data.product_id
          );
        }
        let added_product_data_stock =
          local_selected_data === undefined || local_selected_data.length === 0
            ? _.cloneDeep(data)
            : _.cloneDeep(local_selected_data);
        if (barcoded_added_data) {
          variant.barcoded_data = true;
        }
        let selected_data = {
          product: data,
          selected_variant: variant,
          variant_key: variant_key
        };

        this.setState({
          stock_flag: true, //open mutiple stock popup
          selected_product: selected_data,
          added_quantity: added_quantity,
          added_product_data_stock: added_product_data_stock
        });
      } else {
        // calls when product has only one price stock
        if (
          data.product_type !== 3 &&
          data.track_inventory &&
          !data.allow_below_zero &&
          variant.price_stock[
            variant.price_stock && variant.price_stock.length - 1
          ].added_quantity >=
          variant.price_stock[
            variant.price_stock && variant.price_stock.length - 1
          ].quantity
        ) {
          return toaster("error", "Quantity can't be greater than stock");
        }
        // used to update value on dashboard
        let product_data = this.state.product_data;
        let local_selected_data = product_data.find(
          x => x.product_id === data.product_id
        );
        let local_data = local_selected_data.variants[variant_key];
        // used to update value on cart
        let clone_product_data = _.cloneDeep(data);
        let cloned_data = clone_product_data.variants[variant_key];
        if (barcoded_added_data) {
          cloned_data.barcoded_data = true;
          clone_product_data.db_added_date = moment
            .utc()
            .format("YYYY-MM-DD HH:mm:ss.SS");
        }
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].added_quantity =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity + 1;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].selling_price =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_selling_price *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].mrp =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_mrp *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].cost_price =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_cost_price *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.total_quantity = cloned_data.total_quantity + 1;

        const res = await this.state.db.getAddedProducts();

        if (
          res &&
          (res.status === 200 || (res.products && res.products.length !== 0))
        ) {
          added_product_array = res.products;
          let index = added_product_array.findIndex(
            x => x.product_id === clone_product_data.product_id
          );

          if (index !== -1) {
            added_product_array[index] = clone_product_data;
          } else {
            added_product_array.push(clone_product_data);
          }
          let doc = {
            _id: "addedProductList",
            status: 200,
            _rev: res._rev,
            products: added_product_array
          };
          let status = await this.state.db.updateDatabaseProducts(doc);
          if (status.ok) {
            local_data.price_stock[
              local_data.price_stock && local_data.price_stock.length - 1
            ].added_quantity =
              cloned_data.price_stock[
                cloned_data.price_stock && cloned_data.price_stock.length - 1
              ].added_quantity;
            local_data.total_quantity = cloned_data.total_quantity;
          }
        } else {
          added_product_array = [];
          added_product_array.push(clone_product_data);
          let doc = {
            _id: "addedProductList",
            status: 200,
            products: added_product_array
          };
          let status = await this.state.db.addDatabase(doc);
          if (status.ok) {
            local_data.price_stock[
              local_data.price_stock && local_data.price_stock.length - 1
            ].added_quantity =
              cloned_data.price_stock[
                cloned_data.price_stock && cloned_data.price_stock.length - 1
              ].added_quantity;
            local_data.total_quantity = cloned_data.total_quantity;
          }
        }

        this.setState({
          product_data: this.state.product_data,
          db_added_products: added_product_array,
          barcoded_searched_data: added_product_array,
          search_keyword: ""
        });
      }
    } else {
      // calls when type is not weighted
      if (barcoded_added_data) {
        variant.barcoded_data = true;
      }
      let selected_data = {
        product: data,
        selected_variant: variant,
        variant_key: variant_key
      };
      let weight_value_input = [];
      let selected_weight_unit = [];
      let weight_value = [];
      const res1 = await this.state.db.getAddedProducts();
      let local_selected_data = [];
      if (
        res1 &&
        (res1.status === 200 || (res1.products && res1.products.length !== 0))
      ) {
        local_selected_data = res1.products.find(
          x => x.product_id === data.product_id
        );
      }
      let added_product_data_stock =
        local_selected_data === undefined || local_selected_data.length === 0
          ? _.cloneDeep(data)
          : _.cloneDeep(local_selected_data);

      // used to show value in input field in weight popup
      variant.price_stock.map((data1, key) => {
        weight_value_input[data1.id] =
          data1.added_quantity !== 0 ? data1.added_quantity : "";
        total_weight_quantity[key] = data1.added_quantity;
        selected_weight_unit[key] = "kg";
        return null;
      });
      this.setState({
        weight_flag: true, //open weight popup
        total_weight_quantity: total_weight_quantity,
        selected_product: selected_data,
        weight_value: weight_value,
        weight_value_input: weight_value_input,
        added_product_data_stock: added_product_data_stock,
        selected_weight_unit: selected_weight_unit
      });
    }
  }

  // calls when click on minus in billing
  async minusProduct(e, data, variant, variant_key) {
    if (data.product_type !== 2) {
      if (variant.price_stock && variant.price_stock.length > 1) {
        // call when product has multiple price stock
        let added_quantity = this.state.added_quantity;
        // add quantity of all price stock in array
        added_quantity = variant.price_stock.map(
          (data1, key) => data1.added_quantity
        );
        const res1 = await this.state.db.getAddedProducts();

        let local_selected_data = [];
        if (
          res1 &&
          (res1.status === 200 || (res1.products && res1.products.length !== 0))
        ) {
          local_selected_data = res1.products.find(
            x => x.product_id === data.product_id
          );
        }
        let added_product_data_stock =
          local_selected_data === undefined || local_selected_data.length === 0
            ? _.cloneDeep(data)
            : _.cloneDeep(local_selected_data);
        let selected_data = {
          product: data,
          selected_variant: variant,
          variant_key: variant_key
        };
        this.setState({
          stock_flag: true, //open mutiple stock popup
          selected_product: selected_data,
          added_quantity: added_quantity,
          added_product_data_stock: added_product_data_stock
        });
      } else {
        // used to update value on dashboard
        let product_data = this.state.product_data;
        let local_selected_data = product_data.find(
          x => x.product_id === data.product_id
        );
        let local_data = local_selected_data.variants[variant_key];

        // used to update value on cart
        let clone_product_data = _.cloneDeep(data);
        let cloned_data = clone_product_data.variants[variant_key];

        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].added_quantity =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity - 1;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].selling_price =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_selling_price *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].mrp =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_mrp *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.price_stock[
          cloned_data.price_stock && cloned_data.price_stock.length - 1
        ].cost_price =
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].original_cost_price *
          cloned_data.price_stock[
            cloned_data.price_stock && cloned_data.price_stock.length - 1
          ].added_quantity;
        cloned_data.total_quantity = cloned_data.total_quantity - 1;

        const res = await this.state.db.getAddedProducts();
        if (
          res &&
          (res.status === 200 || (res.products && res.products.length !== 0))
        ) {
          added_product_array = res.products;
          let index = added_product_array.findIndex(
            x => x.product_id === clone_product_data.product_id
          );
          if (index !== -1) {
            let quantities = clone_product_data.variants.map(
              a => a.total_quantity
            );
            if (quantities.every(item => item === 0)) {
              added_product_array.splice(index, 1);
            } else {
              added_product_array[index] = clone_product_data;
            }
          } else {
            added_product_array.push(clone_product_data);
          }

          let doc = {
            _id: "addedProductList",
            status: 200,
            _rev: res._rev,
            products: added_product_array
          };
          let status = await this.state.db.updateDatabaseProducts(doc);

          if (status.ok) {
            local_data.price_stock[
              local_data.price_stock && local_data.price_stock.length - 1
            ].added_quantity =
              cloned_data.price_stock[
                cloned_data.price_stock && cloned_data.price_stock.length - 1
              ].added_quantity;
            local_data.total_quantity = cloned_data.total_quantity;
          }
        } else {
          added_product_array = [];
          added_product_array.push(clone_product_data);
          let doc = {
            _id: "addedProductList",
            status: 200,
            products: added_product_array
          };
          let status = await this.state.db.addDatabase(doc);

          if (status.ok) {
            local_data.price_stock[
              local_data.price_stock && local_data.price_stock.length - 1
            ].added_quantity =
              cloned_data.price_stock[
                cloned_data.price_stock && cloned_data.price_stock.length - 1
              ].added_quantity;
            local_data.total_quantity = cloned_data.total_quantity;
          }
        }

        this.setState({
          product_data: this.state.product_data,
          db_added_products: added_product_array,
          barcoded_searched_data: added_product_array
        });
      }
    } else {
      let selected_data = {
        product: data,
        selected_variant: variant,
        variant_key: variant_key
      };
      let weight_value_input = [];
      let selected_weight_unit = [];
      let weight_value = [];
      const res1 = await this.state.db.getAddedProducts();
      let local_selected_data = [];
      if (
        res1 &&
        (res1.status === 200 || (res1.products && res1.products.length !== 0))
      ) {
        local_selected_data = res1.products.find(
          x => x.product_id === data.product_id
        );
      }
      let added_product_data_stock =
        local_selected_data === undefined || local_selected_data.length === 0
          ? _.cloneDeep(data)
          : _.cloneDeep(local_selected_data);

      // used to show value in input field in weight popup
      variant.price_stock.map((data1, key) => {
        weight_value_input[data1.id] = data1.added_quantity;
        total_weight_quantity[key] = data1.added_quantity;
        selected_weight_unit[key] = "kg";
        return null;
      });
      this.setState({
        weight_flag: true, //open weight popup
        selected_product: selected_data,
        total_weight_quantity: total_weight_quantity,
        weight_value: weight_value,
        weight_value_input: weight_value_input,
        added_product_data_stock: added_product_data_stock,
        selected_weight_unit: selected_weight_unit
      });
    }
  }

  // call when click on add and plus in stock poup
  addedStockPrice = (
    e,
    stock,
    stock_key,
    selected_only_product,
    variant_key
  ) => {
    // quantity of all price stock in array
    let added_quantity = this.state.added_quantity;
    let added_product_data_stock = this.state.added_product_data_stock;

    if (
      added_product_data_stock.product_type !== 3 &&
      added_product_data_stock.track_inventory &&
      !added_product_data_stock.allow_below_zero &&
      added_product_data_stock.variants[variant_key].price_stock[stock_key]
        .added_quantity >=
      added_product_data_stock.variants[variant_key].price_stock[stock_key]
        .quantity
    ) {
      return toaster("error", "Quantity can't be greater than stock");
    }
    added_quantity[stock_key] = added_quantity[stock_key] + 1;
    added_product_data_stock.variants[variant_key].price_stock[
      stock_key
    ].added_quantity =
      added_product_data_stock.variants[variant_key].price_stock[stock_key]
        .added_quantity + 1;

    added_product_data_stock.variants[variant_key].total_quantity =
      added_product_data_stock.variants[variant_key].total_quantity + 1;
    this.setState({
      added_quantity: added_quantity,
      added_product_data_stock: added_product_data_stock
    });
  };

  // call when click on minus in stock poup
  minusStockPrice = (
    e,
    stock,
    stock_key,
    selected_only_product,
    variant_key
  ) => {
    let added_quantity = this.state.added_quantity;
    let added_product_data_stock = this.state.added_product_data_stock;
    added_quantity[stock_key] = added_quantity[stock_key] - 1;

    added_product_data_stock.variants[variant_key].price_stock[
      stock_key
    ].added_quantity =
      added_product_data_stock.variants[variant_key].price_stock[stock_key]
        .added_quantity - 1;

    added_product_data_stock.variants[variant_key].total_quantity =
      added_product_data_stock.variants[variant_key].total_quantity - 1;
    this.setState({
      added_quantity: added_quantity,
      added_product_data_stock: added_product_data_stock
    });
  };
  // calls when click submit button in stock popup
  async addDataPrice(e) {
    var selected_product = this.state.selected_product;
    var added_quantity = this.state.added_quantity;
    var added_product_data_stock = this.state.added_product_data_stock;

    selected_product.selected_variant.price_stock.map(
      (p, c) => (p.added_quantity = added_quantity[c])
    );
    added_product_data_stock.variants.map(item => {
      if (
        item.variant_id === selected_product.selected_variant.variant_id &&
        selected_product.selected_variant.barcoded_data
      ) {
        item.barcoded_data = true;
      }
      return item.price_stock.map((data, i) => {
        return selected_product.selected_variant.price_stock.map((p, c) => {
          if (p.id === data.id && data.added_quantity !== 0) {
            data.selling_price = p.original_selling_price * data.added_quantity;
            data.mrp = p.original_mrp * data.added_quantity;
            data.cost_price = p.original_cost_price * data.added_quantity;
          }
          return null;
        });
      });
    });
    // add all values in arrayand provide addition
    selected_product.selected_variant.total_quantity = this.state.added_quantity.reduce(
      (a, c) => a + c
    );

    const res = await this.state.db.getAddedProducts();

    if (
      res &&
      (res.status === 200 || (res.products && res.products.length !== 0))
    ) {
      added_product_array = res.products;
      let index = added_product_array.findIndex(
        x => x.product_id === added_product_data_stock.product_id
      );
      if (index !== -1) {
        added_product_array[index] = added_product_data_stock;
      } else {
        if (
          (selected_product.selected_variant &&
            selected_product.selected_variant.total_quantity) !== 0
        ) {
          added_product_array.push(added_product_data_stock);
        }
      }
      //  used to remove product from database if quantity is zero
      let zero_quant_pro = added_product_data_stock.variants.every(
        c => c.total_quantity === 0
      );
      if (zero_quant_pro && index !== -1) {
        added_product_array.splice(index, 1);
      }
      let doc = {
        _id: "addedProductList",
        status: 200,
        _rev: res._rev,
        products: added_product_array
      };
      await this.state.db.updateDatabaseProducts(doc);
    } else {
      added_product_array = [];
      if (
        !selected_product.selected_variant.price_stock.every(
          data => data.added_quantity === 0
        )
      ) {
        if (
          (selected_product.selected_variant &&
            selected_product.selected_variant.total_quantity) !== 0
        ) {
          added_product_array.push(added_product_data_stock);
        }
        let doc = {
          _id: "addedProductList",
          status: 200,
          products: added_product_array
        };
        await this.state.db.addDatabase(doc);
      }
    }

    let product_data = this.state.product_data;
    let index = product_data.findIndex(
      x => x.product_id === added_product_data_stock.product_id
    );

    if (index !== -1) {
      product_data[index].variants.map(item => {
        if (item.variant_id === selected_product.selected_variant.variant_id) {
          item.total_quantity = this.state.added_quantity.reduce(
            (a, c) => a + c
          );
        }
        return item.price_stock.map((data, i) => {
          return selected_product.selected_variant.price_stock.map((p, c) => {
            if (p.id === data.id) {
              data.added_quantity = added_quantity[i];
            }
            return null;
          });
        });
      });
    }
    this.setState({
      product_data: product_data,
      selected_product: selected_product,
      stock_flag: false,
      db_added_products: added_product_array,
      barcoded_searched_data: added_product_array,
      search_keyword: ""
    });
  }

  // calls when click submit button in weight popup
  async addWeightPrice(e) {
    var selected_product = this.state.selected_product;
    // add quantity value by dividing 1000 i.e to convert it to grams
    var added_product_data_stock = this.state.added_product_data_stock;
    selected_product.selected_variant.price_stock.map((p, c) => {
      p.added_quantity = total_weight_quantity[c];
      p.unit = this.state.selected_weight_unit[c];
      return null;
    });

    added_product_data_stock.variants.map(item => {
      if (
        item.variant_id === selected_product.selected_variant.variant_id &&
        selected_product.selected_variant.barcoded_data
      ) {
        item.barcoded_data = true;
      }
      item.price_stock.map((data, i) => {
        return selected_product.selected_variant.price_stock.map((p, c) => {
          if (p.id === data.id && data.added_quantity !== 0) {
            let local_weight = convert(data.added_quantity)
              .from("kg")
              .to("g");
            data.selling_price =
              (p.original_selling_price / data.weight) * local_weight;
            data.mrp = (p.original_mrp / data.weight) * local_weight;
            data.cost_price =
              (p.original_cost_price / data.weight) * local_weight;
          }
          return null;
        });
      });
      return null;
    });

    selected_product.selected_variant.total_quantity =
      total_weight_quantity.length !== 0 &&
      total_weight_quantity.reduce((a, b) => a + b);

    const res = await this.state.db.getAddedProducts();

    if (
      res &&
      (res.status === 200 || (res.products && res.products.length !== 0))
    ) {
      added_product_array = res.products;
      let index = added_product_array.findIndex(
        x => x.product_id === added_product_data_stock.product_id
      );
      if (index !== -1) {
        added_product_array[index] = added_product_data_stock;
      } else {
        added_product_array.push(added_product_data_stock);
      }
      //  used to remove product from database if quantity is zero
      let zero_quant_pro = added_product_data_stock.variants.every(
        c => c.total_quantity === 0
      );
      if (zero_quant_pro && index !== -1) {
        added_product_array.splice(index, 1);
      }
      let doc = {
        _id: "addedProductList",
        status: 200,
        _rev: res._rev,
        products: added_product_array
      };
      await this.state.db.updateDatabaseProducts(doc);
    } else {
      added_product_array = [];
      if (
        !selected_product.selected_variant.price_stock.every(
          data => data.added_quantity === 0
        )
      ) {
        added_product_array.push(added_product_data_stock);
        let doc = {
          _id: "addedProductList",
          status: 200,
          products: added_product_array
        };
        await this.state.db.addDatabase(doc);
      }
    }
    let product_data = this.state.product_data;
    let index = product_data.findIndex(
      x => x.product_id === added_product_data_stock.product_id
    );
    if (index !== -1) {
      product_data[index].variants.map(item => {
        if (item.variant_id === selected_product.selected_variant.variant_id) {
          item.total_quantity =
            total_weight_quantity.length !== 0 &&
            total_weight_quantity.reduce((a, b) => a + b);
        }

        item.price_stock.map((data, i) => {
          return selected_product.selected_variant.price_stock.map((p, c) => {
            if (p.id === data.id) {
              data.added_quantity = total_weight_quantity[i];
            }
            return null;
          });
        });
        return null;
      });
    }
    this.setState({
      product_data: product_data,
      selected_product: selected_product,
      weight_flag: false,
      db_added_products: added_product_array,
      search_keyword: ""
    });
  }

  modalClose = (e, name) => {
    if (name === "weight_popup") {
      this.setState({
        weight_flag: false
      });
    } else if (name === "imei_serial_popup") {
      this.setState({
        add_imei_flag: false,
        modified_product: {}
      });
    } else if (name === "stock_popup") {
      this.setState({
        stock_flag: false
      });
    } else if (name === "add_modification_popup") {
      this.setState({
        add_modification_flag: false,
        modified_product: {}
      });
    } else if (name === "barcode_popup") {
      this.setState({
        barcode_flag: false
      });
    }
  };

  openAddedChangeFunc = (e, data, variant_key) => {
    this.setState({
      add_modification_flag: true,
      modified_product: data
    });
  };

  openIMEI = (e, data, variant_key) => {
    this.setState({
      add_imei_flag: true,
      modified_product: data,
      modified_key: variant_key
    });
  };

  handleElectronic = (e, name, data) => {
    let local_data = this.state.selected_flag
      ? this.state.paginated_data.find(x => x.product_id === data.product_id)
      : this.state.barcoded_searched_data.find(
        x => x.product_id === data.product_id
      );
    if (name === "serial") {
      if (/^[0-9 a-zA-Z]{0,10}$/.test(e.target.value) === false) {
        return;
      }
      local_data.variants[this.state.modified_key].serial_number =
        e.target.value;
    } else if (name === "imei") {
      if (/^[0-9]{0,15}$/.test(e.target.value) === false) {
        return;
      }
      local_data.variants[this.state.modified_key].imei_number = e.target.value;
    }
    this.setState({ modified_product: local_data });
  };

  handleEdit = (e, name, data, key) => {
    let local_data = this.state.selected_flag
      ? this.state.paginated_data.find(x => x.product_id === data.product_id)
      : this.state.barcoded_searched_data.find(
        x => x.product_id === data.product_id
      );
    if (name === "s.price") {
      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].original_selling_price = e.target.value ? parseInt(e.target.value) : 0;

      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].selling_price = e.target.value ? parseInt(e.target.value) : 0;
    } else if (name === "c.price") {
      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].original_cost_price = e.target.value ? parseInt(e.target.value) : 0;

      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].cost_price = e.target.value ? parseInt(e.target.value) : 0;
    } else if (name === "m.price") {
      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].original_mrp = e.target.value ? parseInt(e.target.value) : 0;

      local_data.variants[key].price_stock[
        local_data.variants[key].price_stock &&
        local_data.variants[key].price_stock.length - 1
      ].mrp = e.target.value ? parseInt(e.target.value) : 0;
    } else if (name === "tax") {
      local_data.tax_id = e.target.value;
    } else if (name === "hsn_code") {
      local_data.hsn_code = e.target.value;
    } else if (name === "barcode") {
      local_data.variants[key].barcode = e.target.value;
    } else if (name === "track_inventory") {
      let value = JSON.parse(e.target.value);
      local_data.track_inventory = !value;
    } else if (name === "allow_below_zero") {
      let value = JSON.parse(e.target.value);
      local_data.allow_below_zero = !value;
    }
    this.setState({ modified_product: local_data });
  };

  addEdit(e) {
    let edited_pro = this.state.modified_product;
    let data_stock = {};
    let data_variant = {};
    let stock = [];
    let variant = [];
    edited_pro.variants.map(data => {
      return data.price_stock.map(inner_data => {
        let variant_data = {
          name: data.name,
          barcode: data.barcode,
          weight: data.weight,
          stock: inner_data.quantity ? parseInt(inner_data.quantity) : 0,
          cost: inner_data.cost_price ? inner_data.cost_price : 0,
          selling: inner_data.selling_price ? inner_data.selling_price : 0,
          mrp: inner_data.mrp ? inner_data.mrp : 0,
          id: inner_data.variant_id,
          stock_id: inner_data.id
        };
        stock.push(variant_data);

        data_variant = { variant };
        data_stock = { stock };
        return null;
      });
    });
    var formData = new FormData();
    formData.append("store_id", localStorage.getItem("store"));
    formData.append("product_id", edited_pro.product_id);
    // formData.append("created_date", moment().format("YYYY-MM-DD"));
    formData.append("product_name", edited_pro.product_name);
    formData.append("product_type", edited_pro.product_type);

    formData.append("variant", JSON.stringify(data_variant));
    formData.append("stock", JSON.stringify(data_stock));
    formData.append("hsn_code", edited_pro.hsn_code);
    formData.append("tax_id", edited_pro.tax_id);
    formData.append("track_inventory", edited_pro.track_inventory ? 1 : 0);
    formData.append("allow_below_zero", edited_pro.allow_below_zero ? 1 : 0);
    formData.append("description", edited_pro.product_description);
    // .toString() used here to convert array of search keyword to comma separated string
    formData.append("search_tag", edited_pro.search_keyword.toString());

    formData.append(
      "send_low_stock_alert",
      edited_pro.send_low_stock_alert ? 1 : 0
    );
    formData.append(
      "price_change_at_billing",
      edited_pro.allow_price_change ? 1 : 0
    );

    formData.append("allow_discount", edited_pro.allow_discount ? 1 : 0);
    formData.append("published", edited_pro.is_published ? 1 : 0);

    this.props.updateProduct(formData);
    update_flag = true;
  }

  async addSerialImei(e) {
    const res1 = await this.state.db.getEditProducts();

    if (
      res1 &&
      (res1.status === 200 || (res1.products && res1.products.length !== 0))
    ) {
      added_product_array = res1.products;
      let index = added_product_array.findIndex(
        x => x.product_id === this.state.modified_product.product_id
      );

      if (index !== -1) {
        added_product_array[index] = this.state.modified_product;
      } else {
        added_product_array.push(this.state.modified_product);
      }
      let doc = {
        _id: "editProductList",
        status: 200,
        _rev: res1._rev,
        products: added_product_array
      };
      await this.state.db.updateDatabaseProducts(doc);
      this.setState({
        edit_products: added_product_array,
        add_imei_flag: false,
        add_modification_flag: false
        // barcoded_searched_data: barcode_data
      });
    }
  }

  async handleScan(data, barcode) {
    //this is used when product search through barcode in list tab so no need to add just list the products
    this.setState({ search_keyword: data });
    let barcoded_data_flag = [];
    this.state.product_data.map(async (item, key) => {
      let barcoded_data = item.variants.filter(
        t => t.barcode.toLowerCase() === data.toLowerCase()
      );
      let data1 = item.variants.filter(
        t =>
          t.name.toLowerCase() === data.toLowerCase() ||
          t.barcode.toLowerCase() === data.toLowerCase()
      );
      if (
        item.product_name
          .toLowerCase()
        === data.toLowerCase() ||
        (item.search_keyword !== null &&
          item.search_keyword
            .toLowerCase()
          === data.toLowerCase()) ||
        data1.length !== 0
        // ||
        // item.sku_code.toLowerCase().includes(search_keyword.toLowerCase())
        // provide data on basis of product name, barcode, varaint name, sku code, search keyword
      ) {
        barcoded_data_flag.push(item);
      }
      if (barcoded_data.length > 0) {
        let local_selected_data = [];
        const res1 = await this.state.db.getAddedProducts();
        if (
          res1 &&
          (res1.status === 200 || (res1.products && res1.products.length !== 0))
        ) {
          local_selected_data = res1.products.find(
            x => x.product_id === item.product_id
          );
        }
        let product_data1 =
          local_selected_data === undefined || local_selected_data.length === 0
            ? _.cloneDeep(item)
            : _.cloneDeep(local_selected_data);
        let index = product_data1.variants.findIndex(
          x => x.variant_id === barcoded_data[0].variant_id
        );
        await this.addedProduct(
          "e",
          product_data1,
          barcoded_data[0],
          index,
          true
        );
      }
    });
    let data_flag = barcoded_data_flag.map(n => n.length === 0);
    if (!data_flag.includes(false)) {
      this.setState({ barcode_flag: true });
    }
  }

  handleSearch = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  keyData = (e, name) => {
    if (name === "search_keyword") {
      if (e.key === "Enter") {
        if (
          e.target.value.charAt(0).toUpperCase() !==
          e.target.value.charAt(0).toLowerCase()
        ) {
          this.setState({ barcode_normal_flag: false });
        } else {
          this.setState({ barcode_normal_flag: true });
        }
        this.handleScan(e.target.value);
      } else {
        this.searchProducts(e.target.value);
      }
    }
  };

  async searchProducts(data) {
    const { product_data, selected_flag, db_added_products } = this.state;
    let searched_data = [];
    let search_keyword = data;
    if (search_keyword) {
      // data varaiable contain data on the basis of variant name and barcode
      if (selected_flag) {
        product_data.map((item, key) => {
          let data1 = item.variants.filter(
            t =>
              t.name.toLowerCase().includes(search_keyword.toLowerCase()) ||
              t.barcode.toLowerCase().includes(data.toLowerCase())
          );
          if (
            item.product_name
              .toLowerCase()
              .includes(search_keyword.toLowerCase()) ||
            (item.search_keyword !== null &&
              item.search_keyword
                .toLowerCase()
                .includes(search_keyword.toLowerCase())) ||
            data1.length !== 0
            // ||
            // item.sku_code.toLowerCase().includes(search_keyword.toLowerCase())
            // provide data on basis of product name, barcode, varaint name, sku code, search keyword
          ) {
            searched_data.push(item);
          }
          return null;
        });
        searched_data = searched_data.filter(
          (data, idx) => idx >= 0 && idx < 50
        );
        // provide data from 0 to 50
        this.setState({
          paginated_data: searched_data,
          searched_data,
          activePage: 1
        });
      } else {
        product_data.map((item, key) => {
          let data1 = item.variants.filter(t =>
            t.barcode.toLowerCase().startsWith(search_keyword.toLowerCase())
          );
          if (
            data1.length !== 0
            // provide data on basis of barcode
          ) {
            searched_data.push(item);
          }
          return null;
        });
        this.setState({
          barcoded_searched_data: searched_data,
          searched_data,
          activePage: 1
        });
      }
    } else {
      // calls when hit empty search
      if (selected_flag) {
        let product_data1 = product_data.filter(
          (data, idx) => idx >= 0 && idx < 50
        );
        this.setState({
          paginated_data: product_data1,
          activePage: 1,
          numPages: Math.ceil(product_data1.length / 50)
        });
      } else {
        let product_data1 = db_added_products.filter(
          (data, idx) => idx >= 0 && idx < 50
        );
        this.setState({
          barcoded_searched_data: db_added_products,
          activePage: 1,
          numPages: Math.ceil(product_data1.length / 50)
        });
      }
    }
  }

  clearSearchProducts = () => {
    const { selected_flag, product_data, db_added_products } = this.state;
    if (selected_flag) {
      let product_data1 = product_data.filter(
        (data, idx) => idx >= 0 && idx < 50
      );
      this.setState({
        search_keyword: "",
        paginated_data: product_data1,
        activePage: 1,
        numPages: Math.ceil(product_data1.length / 50)
      });
    } else {
      let product_data1 = db_added_products.filter(
        (data, idx) => idx >= 0 && idx < 50
      );
      this.setState({
        search_keyword: "",
        barcoded_searched_data: db_added_products,
        activePage: 1,
        numPages: Math.ceil(product_data1.length / 50)
      });
    }
  };

  async rerenderParentCallback() {
    this.componentDidMount();
    const res1 = await this.state.db.getAddedProducts();
    var paginated_data = this.state.paginated_data;
    if (
      res1 &&
      (res1.status === 200 || (res1.products && res1.products.length !== 0))
    ) {
      paginated_data.map((data, key) => {
        return res1.products.map(item => {
          if (data.product_id === item.product_id) {
            return data.variants.map((var_data, var_key) => {
              return item.variants.map((var_item, item_key) => {
                if (item_key === var_key) {
                  var_data.price_stock.map((price_data, price_key) => {
                    return var_item.price_stock.map(
                      (price_item, price_item_key) => {
                        if (price_key === price_item_key) {
                          paginated_data[key].variants[var_key].total_quantity =
                            var_item.total_quantity;
                          paginated_data[key].variants[var_key].price_stock[
                            price_key
                          ].added_quantity = price_item.added_quantity;
                        }
                        return null;
                      }
                    );
                  });
                }
                return null;
              });
            });
          }
          return null;
        });
      });
      this.setState({ paginated_data: paginated_data });
    }
  }

  async refreshParentOnDelete() {
    this.setState({ loaderVisible: true });
    const res = await this.state.db.getDatabaseProducts();
    if (localStorage.getItem("store")) {
      let data = localStorage.getItem("store");
      let params = {
        store_id: data,
        page: 1,
        is_published: 1,
        last_update: res.updated_time
      };
      this.props.getProducts(params);
    }
    let doc = {
      _id: "productList",
      status: 200,
      updated_time: moment.utc().format("YYYY-MM-DD HH:mm:ss.SS"),
      // updated_time: res.updated_time,
      _rev: res._rev,
      product_list: res.product_list
    };
    await this.state.db.updateDatabaseProducts(doc);
    const res1 = await this.state.db.getEditProducts();
    await this.state.db.deleteDoc(res1);
    this.setState(this.initialState);
    await this.props.getLastStoreInvoice(localStorage.getItem("store"));
    get_store_invoice_flag = true;
    if (!navigator.onLine) {
      this.setState({ loaderVisible: false });
    }
  }

  loadItems(pageNumber) {
    const { product_data, search_keyword, searched_data } = this.state;
    let activePagetemp = pageNumber;
    // if page =1, start = (1-1) * 50 = 0, end =0+49=49, if page = 5, start =(5-1)*50=200, end= 200+49=249
    let startingIndextemp = (pageNumber - 1) * 50;
    let lastIndextemp = startingIndextemp + 49;
    let numPages = 0;

    if (search_keyword) {
      // call when pagination apply on searched data
      this.setState({
        activePage: activePagetemp,
        starting_index: 0,
        last_index: lastIndextemp
      });
      let product_data1 = searched_data.filter(
        (data, idx) => idx >= 0 && idx < lastIndextemp
      );
      numPages = Math.ceil(product_data1.length / 50);
      this.setState({ paginated_data: product_data1, numPages: numPages });
    } else {
      this.setState({
        activePage: activePagetemp,
        starting_index: 0,
        last_index: lastIndextemp
      });
      let product_data1 = product_data.filter(
        (data, idx) => idx >= 0 && idx < lastIndextemp
      );
      numPages = Math.ceil(product_data1.length / 50);
      this.setState({ paginated_data: product_data1, numPages: numPages });
    }
    if (pageNumber !== numPages) {
      this.setState({ hasMoreItems: false });
    }
  }
  // perform change tab functionality
  handleTab = name => {
    if (name === "list") {
      this.setState(
        {
          selected_flag: true,
          selected_class: true
        },
        () => {
          this.clearSearchProducts();
        }
      );
    } else if (name === "barcode") {
      // if barcode tab slected search bar should be focused
      this.refs.search && this.refs.search.focus();
      this.setState(
        {
          selected_flag: false,
          selected_class: false
        },
        () => {
          this.clearSearchProducts();
        }
      );
    }
  };

  toggleRightBar = () => {
    this.setState({ activeClass: !this.state.activeClass });
  };

  addProduct = (e, redirect, keyword, barcoded) => {
    this.props.history.push({
      pathname: "/products-add",
      state: { redirected: redirect, keyword: keyword, barcoded: barcoded }
    });
  };
  ConvertToDecimal = num => {
    let num1 = num.toString(); //If it's not already a String
    let num2 = num1.split(".");
    let num3 = num2[1] ? num1.slice(".", num1.indexOf(".") + 3) : num2[0];
    // let num3 = num1.slice('.', num1.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(num3); //If you need it back as a Number
  };
  async handleLogOut() {
    const res = await this.state.db.deleteDatabase();
    if (res && res.ok) {
      localStorage.clear();
      window.location.href = "/";
      // this.props.history.push('/')
    }
  }

  render() {
    const {
      show_images,
      search_keyword,
      product_data,
      varient_data,
      paginated_data,
      loader_state_flag,
      weight_flag,
      stock_flag,
      selected_product,
      weight_value,
      weight_value_input,
      added_quantity,
      selected_weight_unit,
      add_modification_flag,
      modified_product,
      tax_data,
      add_imei_flag,
      selected_class,
      selected_flag,
      activeClass,
      barcoded_searched_data,
      barcode_flag,
      barcode_normal_flag,
      edit_products,
      loaderVisible,
      generate_popup_flag,
      permission_flag
    } = this.state;
    barcoded_searched_data.sort(function (a, b) {
      return new Date(b.db_added_date) - new Date(a.db_added_date);
    });
    let all_product_list = selected_flag
      ? paginated_data
      : barcoded_searched_data;
    return (
      <Fragment>
        <LoaderFunc visible={loaderVisible} />
        {permission_flag ?
          <Fragment>

            {loader_state_flag && (
              <div className="bg_overlay">
                <CircularProgressbarWithChildren value={loader_value}>
                  <h3 className="text-muted">{loader_data}</h3>
                  {displayed_loader_value}%
            </CircularProgressbarWithChildren>
              </div>
            )}
            {/* <LeftSideBar /> */}
            {/* <div className="main_content"> */}
            {!generate_popup_flag &&
              <div className="products_main_content">
                <BarcodeReader onScan={e => this.handleScan(e)} />
                <div className="d-flex w-100 search_box_outer">
                  <i
                    className="fa fa-shopping-cart checkout_icon"
                    onClick={() => this.toggleRightBar()}
                  ></i>
                  <div className="product_search_box searchbar d-flex">
                    {/* {selected_flag && ( */}
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Search..."
                      className="form-control search_input w-100 pt-2 pb-2"
                      name="search_keyword"
                      value={search_keyword}
                      ref="search"
                      onChange={e => this.handleSearch(e, "search_keyword")}
                      onKeyUp={e => this.keyData(e, "search_keyword")}
                    />
                    {/* )} */}
                    {/* {!selected_flag && (
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Search..."
                  className="form-control search_input w-100 pt-2 pb-2"
                  name="search_keyword"
                  autoComplete="new-password"
                  value={search_keyword}
                  // ref="search"
                  onChange={e => this.handleSearch(e, "search_keyword")}
                  onKeyPress={e=> this.keyData(e, 'search_keyword')}
                  // onChange={e => search_keyword && this.handleScan}
                />
              )} */}
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
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <span
                      className={
                        selected_class
                          ? "product_list_class nav-link active"
                          : "product_list_class nav-link"
                      }
                      onClick={() => this.handleTab("list")}
                    >
                      {" "}
                      <i className="fa fa-list" aria-hidden="true"></i> List
              </span>
                  </li>
                  <li className="nav-item">
                    <span
                      className={
                        !selected_class
                          ? "product_list_class nav-link active"
                          : "product_list_class nav-link"
                      }
                      onClick={() => this.handleTab("barcode")}
                    >
                      <i className="fa fa-barcode" aria-hidden="true"></i> Barcode
              </span>
                  </li>
                </ul>
                <div className="billing_products_wrap">
                  {all_product_list.length !== 0 ? (
                    <div
                      className="pro_table table-responsive"
                      ref={ref => (this.scrollParentRef = ref)}
                    >
                      <InfiniteScroll
                        pageStart={1}
                        loadMore={this.loadItems.bind(this)}
                        hasMore={this.state.hasMoreItems}
                        loader={
                          <div className="loader" key={0}>
                            Loading ...
                    </div>
                        }
                        useWindow={false}
                        // initialLoad={false}
                        getScrollParent={() => this.scrollParentRef}
                      >
                        <table
                          className="table billing_prodcuts"
                          id="table_accordion"
                        >
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>MRP</th>
                              <th>Selling Price</th>
                              <th className="text-right"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {all_product_list.map((data, key) => {
                              return product_data.map((item, key) => {
                                return (
                                  item.product_id === data.product_id && (
                                    <React.Fragment key={item.product_id}>
                                      <tr>
                                        <td>
                                          <div className="d-flex b_product">
                                            {show_images && (
                                              <div className="product_img">
                                                {item.image_url ? (
                                                  <img
                                                    src={item.image_url}
                                                    alt="product"
                                                  />
                                                ) : (
                                                    <img
                                                      src="images/product.svg"
                                                      alt="product"
                                                    />
                                                  )}
                                              </div>
                                            )}
                                            <div className="product_info">
                                              <h5>
                                                {item.variants.map(
                                                  (variant_data, variant_key) => {
                                                    return (
                                                      varient_data[
                                                      item.product_id
                                                      ] === variant_data.variant_id &&
                                                      item.product_name +
                                                      "," +
                                                      " " +
                                                      variant_data.name
                                                    );
                                                  }
                                                )}
                                              </h5>
                                              <ul className="p_varients">
                                                {item.variants.map(
                                                  (variant_data, variant_key) => {
                                                    return (
                                                      item.variants.length !== 1 && (
                                                        <li key={variant_key}>
                                                          <label>
                                                            <input
                                                              type="radio"
                                                              name="varient_data"
                                                              value={
                                                                varient_data[
                                                                item.product_id
                                                                ]
                                                              }
                                                              onChange={e =>
                                                                this.changeVariant(
                                                                  e,
                                                                  item.product_id,
                                                                  variant_data
                                                                )
                                                              }
                                                            />

                                                            <span
                                                              className={
                                                                varient_data[
                                                                  item.product_id
                                                                ] ===
                                                                  variant_data.variant_id
                                                                  ? "checked"
                                                                  : "********"
                                                              }
                                                            >
                                                              {variant_data.name}
                                                            </span>
                                                          </label>
                                                        </li>
                                                      )
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            </div>
                                          </div>
                                          {/* <i
                                      className="fa fa-chevron-down"
                                      aria-hidden="true"
                                      data-toggle="collapse"
                                      data-target={"#pro_" + item.product_id}
                                    ></i> */}
                                        </td>
                                        <td className="text-right">
                                          {"\u20B9"}
                                          {item.variants.map(
                                            (variant_data, variant_key) => {
                                              return (
                                                varient_data[item.product_id] ===
                                                variant_data.variant_id &&
                                                variant_data.price_stock[
                                                variant_data.price_stock &&
                                                variant_data.price_stock.length -
                                                1
                                                ] &&
                                                variant_data.price_stock[
                                                  variant_data.price_stock &&
                                                  variant_data.price_stock.length -
                                                  1
                                                ].mrp
                                              );
                                            }
                                          )}
                                        </td>
                                        <td className="text-right">
                                          {"\u20B9"}
                                          {item.variants.map(
                                            (variant_data, variant_key) => {
                                              return (
                                                varient_data[item.product_id] ===
                                                variant_data.variant_id &&
                                                variant_data.price_stock[
                                                variant_data.price_stock &&
                                                variant_data.price_stock.length -
                                                1
                                                ] &&
                                                variant_data.price_stock[
                                                  variant_data.price_stock &&
                                                  variant_data.price_stock.length -
                                                  1
                                                ].selling_price
                                              );
                                            }
                                          )}
                                        </td>
                                        <td className="text-right">
                                          {item.variants.map(
                                            (variant_data, variant_key) => {
                                              return (
                                                varient_data[item.product_id] ===
                                                variant_data.variant_id &&
                                                (variant_data.total_quantity > 0 ? (
                                                  <div key={variant_data.variant_id}>
                                                    <div className="b_product_qnty">
                                                      <button
                                                        className="sub"
                                                        onClick={e =>
                                                          this.minusProduct(
                                                            e,
                                                            item,
                                                            variant_data,
                                                            variant_key
                                                          )
                                                        }
                                                      >
                                                        -
                                                </button>
                                                      <input
                                                        type="texPag"
                                                        id="2"
                                                        value={
                                                          variant_data.total_quantity
                                                        }
                                                        min="1"
                                                        max="100"
                                                        readOnly
                                                      />
                                                      <button
                                                        className="add"
                                                        onClick={e =>
                                                          this.addedProduct(
                                                            e,
                                                            item,
                                                            variant_data,
                                                            variant_key
                                                          )
                                                        }
                                                      >
                                                        +
                                                </button>
                                                    </div>
                                                    {item.product_type !== 3 && (
                                                      <span
                                                        className={classnames({
                                                          stock_red:
                                                            (variant_data.price_stock[
                                                              variant_data.price_stock &&
                                                              variant_data
                                                                .price_stock
                                                                .length - 1
                                                            ] &&
                                                              variant_data
                                                                .price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ].quantity) < 0,
                                                          stock_green:
                                                            (variant_data.price_stock[
                                                              variant_data.price_stock &&
                                                              variant_data
                                                                .price_stock
                                                                .length - 1
                                                            ] &&
                                                              variant_data
                                                                .price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ].quantity) > 0,
                                                          default_stock:
                                                            (variant_data.price_stock[
                                                              variant_data.price_stock &&
                                                              variant_data
                                                                .price_stock
                                                                .length - 1
                                                            ] &&
                                                              variant_data
                                                                .price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ].quantity) === 0
                                                        })}
                                                        key={variant_key}
                                                      >
                                                        {item.flag_for_quantity
                                                          ? "Out of Stock"
                                                          : `Stock:
                                                    ${this.ConvertToDecimal(variant_data.price_stock[
                                                            variant_data.price_stock &&
                                                            variant_data.price_stock
                                                              .length - 1
                                                          ] &&
                                                            variant_data.price_stock[
                                                              variant_data.price_stock &&
                                                              variant_data
                                                                .price_stock
                                                                .length - 1
                                                            ].quantity)}`}
                                                      </span>
                                                    )}
                                                  </div>
                                                ) : (
                                                    <div key={variant_data.variant_id}>
                                                      {item.flag_for_quantity ? (
                                                        <button
                                                          className="add_btn btn"
                                                          disabled
                                                        >
                                                          Add
                                                        </button>
                                                      ) : (
                                                          <button
                                                            className="add_btn btn"
                                                            onClick={e =>
                                                              this.addedProduct(
                                                                e,
                                                                item,
                                                                variant_data,
                                                                variant_key
                                                              )
                                                            }
                                                          >
                                                            Add
                                                          </button>
                                                        )}

                                                      {item.product_type !== 3 && (
                                                        <span
                                                          className={classnames({
                                                            stock_red:
                                                              (variant_data.price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ] &&
                                                                variant_data
                                                                  .price_stock[
                                                                  variant_data.price_stock &&
                                                                  variant_data
                                                                    .price_stock
                                                                    .length - 1
                                                                ].quantity) < 0,
                                                            stock_green:
                                                              (variant_data.price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ] &&
                                                                variant_data
                                                                  .price_stock[
                                                                  variant_data.price_stock &&
                                                                  variant_data
                                                                    .price_stock
                                                                    .length - 1
                                                                ].quantity) > 0,
                                                            default_stock:
                                                              (variant_data.price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ] &&
                                                                variant_data
                                                                  .price_stock[
                                                                  variant_data.price_stock &&
                                                                  variant_data
                                                                    .price_stock
                                                                    .length - 1
                                                                ].quantity) === 0
                                                          })}
                                                          key={variant_key}
                                                        >
                                                          {item.flag_for_quantity
                                                            ? "Out of Stock"
                                                            : `Stock:
                                                        ${this.ConvertToDecimal(variant_data
                                                              .price_stock[
                                                              variant_data.price_stock &&
                                                              variant_data
                                                                .price_stock
                                                                .length - 1
                                                            ] &&
                                                              variant_data
                                                                .price_stock[
                                                                variant_data.price_stock &&
                                                                variant_data
                                                                  .price_stock
                                                                  .length - 1
                                                              ].quantity)}`}
                                                        </span>
                                                      )}
                                                    </div>
                                                  ))
                                              );
                                            }
                                          )}
                                        </td>
                                      </tr>

                                      <tr className="drop_row">
                                        <td colSpan="4">
                                          <i
                                            className="fa fa-chevron-down"
                                            aria-hidden="true"
                                            data-toggle="collapse"
                                            data-target={"#pro_" + item.product_id}
                                          ></i>
                                        </td>
                                      </tr>

                                      {edit_products.map((data, key) => {
                                        return data.variants.map(
                                          (inner_item, inner_key) => {
                                            return (
                                              item.product_id === data.product_id &&
                                              inner_item.variant_id ===
                                              varient_data[item.product_id] && (
                                                <tr
                                                  id={"pro_" + item.product_id}
                                                  className="collapse"
                                                  data-parent="#table_accordion"
                                                  key={inner_key}
                                                >
                                                  <td colSpan="6">
                                                    <div className="row">
                                                      <div className="col-12 col-md-6 d-flex justify-content-center align-items-center flex-column">
                                                        <button
                                                          className="add_btn btn"
                                                          onClick={e =>
                                                            this.openAddedChangeFunc(
                                                              e,
                                                              data,
                                                              inner_key
                                                            )
                                                          }
                                                        >
                                                          Edit Product
                                                  </button>
                                                        <br />
                                                        {data.product_type === 4 && (
                                                          <button
                                                            className="add_btn btn"
                                                            onClick={e =>
                                                              this.openIMEI(
                                                                e,
                                                                data,
                                                                inner_key
                                                              )
                                                            }
                                                          >
                                                            Add IMEI/S.No.
                                                          </button>
                                                        )}
                                                      </div>
                                                      <div className="col-12 col-md-6">
                                                        <div className="form-group row">
                                                          <label className="col-6 text-right">
                                                            S.Price:
                                                    </label>
                                                          <input
                                                            type="text"
                                                            autoComplete="off"
                                                            className="form-control text-right col-6"
                                                            value={
                                                              inner_item.price_stock[
                                                              inner_item.price_stock &&
                                                              inner_item
                                                                .price_stock
                                                                .length - 1
                                                              ] &&
                                                              inner_item.price_stock[
                                                                inner_item.price_stock &&
                                                                inner_item
                                                                  .price_stock
                                                                  .length - 1
                                                              ].original_selling_price
                                                            }
                                                            name={
                                                              inner_item.price_stock[
                                                              inner_item.price_stock &&
                                                              inner_item
                                                                .price_stock
                                                                .length - 1
                                                              ] &&
                                                              inner_item.price_stock[
                                                                inner_item.price_stock &&
                                                                inner_item
                                                                  .price_stock
                                                                  .length - 1
                                                              ].original_selling_price
                                                            }
                                                            onChange={e =>
                                                              this.handleChange(
                                                                e,
                                                                "s.price",
                                                                item,
                                                                inner_key
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                        <div className="form-group row">
                                                          <label className="col-6 text-right">
                                                            GST({data.tax}%):
                                                    </label>
                                                          {/* <select
                                                      className="form-control text-right col-6"
                                                      value={data.tax_id}
                                                      onChange={e =>
                                                        this.handleChange(
                                                          e,
                                                          "gst",
                                                          item,
                                                          inner_key
                                                        )
                                                      }
                                                    >
                                                      {tax_data.map(
                                                        (option, key) => (
                                                          <option
                                                            value={option.id}
                                                            key={key}
                                                          >
                                                            {option.name}
                                                          </option>
                                                        )
                                                      )}
                                                    </select> */}
                                                          <label className="col-6 text-right pr-0">
                                                            {"\u20B9"}
                                                            {this.ConvertToDecimal(
                                                              inner_item.price_stock[
                                                              inner_item.price_stock &&
                                                              inner_item
                                                                .price_stock
                                                                .length - 1
                                                              ] &&
                                                              inner_item
                                                                .price_stock[
                                                                inner_item.price_stock &&
                                                                inner_item
                                                                  .price_stock
                                                                  .length - 1
                                                              ]
                                                                .original_selling_price -
                                                              (inner_item
                                                                .price_stock[
                                                                inner_item.price_stock &&
                                                                inner_item
                                                                  .price_stock
                                                                  .length - 1
                                                              ] &&
                                                                inner_item
                                                                  .price_stock[
                                                                  inner_item.price_stock &&
                                                                  inner_item
                                                                    .price_stock
                                                                    .length - 1
                                                                ]
                                                                  .original_selling_price *
                                                                (100 /
                                                                  (100 +
                                                                    data.tax)))
                                                            )}
                                                          </label>
                                                        </div>
                                                        <div className="form-group row mb-0">
                                                          <label className="col-6 text-right">
                                                            Total:
                                                    </label>
                                                          <label className="col-6 text-right pr-0">
                                                            {inner_item.price_stock[
                                                              inner_item.price_stock &&
                                                              inner_item.price_stock
                                                                .length - 1
                                                            ] &&
                                                              inner_item.price_stock[
                                                                inner_item.price_stock &&
                                                                inner_item
                                                                  .price_stock
                                                                  .length - 1
                                                              ]
                                                                .original_selling_price}
                                                          </label>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )
                                            );
                                          }
                                        );
                                      })}
                                    </React.Fragment>
                                  )
                                );
                              });
                            })}
                          </tbody>
                        </table>
                      </InfiniteScroll>
                    </div>
                  ) : selected_flag ? (
                    <div className="no_data_found">

                      {/* {!search_keyword ? (
                    //   <h2>
                    //   <i
                    //     className="fa fa-exclamation-triangle"
                    //     aria-hidden="true"
                    //   ></i>
                    // </h2>
                    // <h3>No Product Found</h3>
                    // <h3></h3>
                  ) : ( */}{search_keyword && (
                        <div>
                          <h2>
                            <i
                              className="fa fa-exclamation-triangle"
                              aria-hidden="true"
                            ></i>
                          </h2>
                          <h3>No Product Found</h3>
                          {/* <button
                      type="button"
                      onClick={e =>
                        this.addProduct(
                          e,
                          "billing_page",
                          search_keyword,
                          false
                        )
                      }
                    >
                      Add
                    </button> */}
                        </div>
                      )}
                    </div>
                  ) : (
                        <div className="no_data_found">
                          <h2>
                            <i className="fa fa-barcode" aria-hidden="true"></i>
                          </h2>
                          {!search_keyword ? (
                            <h3>Please scan a barcode to get started</h3>
                          ) : (
                              <h3>No Product Found</h3>
                            )
                            // : (
                            //   <div>
                            //     <h3>No Product Found, Would you like to add.</h3>
                            //     <button
                            //       type="button"
                            //       onClick={e =>
                            //         this.addProduct(e, "billing_page", search_keyword, true)
                            //       }
                            //     >
                            //       Add
                            //     </button>
                            //   </div>
                            // )
                          }
                        </div>
                      )}
                </div>

                {barcode_flag && (
                  <ModalPopup
                    className="add-imei-flag"
                    popupOpen={barcode_flag}
                    popupHide={e => this.modalClose(e, "barcode_popup")}
                    // title="Confirmation"
                    content={
                      <div className="">
                        <h4 className="text-dark text-center mb-3">
                          No Product Found, Would you like to add.
                  </h4>
                        <div className="d-flex justify-content-center mt-2">
                          <button
                            className="btn add_btn mr-2"
                            onClick={e =>
                              this.addProduct(
                                e,
                                "billing_page",
                                search_keyword,
                                barcode_normal_flag
                              )
                            }
                          >
                            Yes
                    </button>
                          <button
                            className="btn add_btn"
                            onClick={e => this.modalClose(e, "barcode_popup")}
                          >
                            No
                    </button>
                        </div>
                      </div>
                    }
                  />
                )}

                {weight_flag && (
                  <ModalPopup
                    className="weight-flag prd_model_box"
                    popupOpen={weight_flag}
                    popupHide={e => this.modalClose(e, "weight_popup")}
                    title="Enter Weight"
                    content={
                      <div>
                        <div className="d-flex mb-2">
                          {selected_product.product.image_url ? (
                            <img
                              src={selected_product.product.image_url}
                              alt="product"
                              className="product_model_img mr-2"
                            />
                          ) : (
                              <img
                                src="images/product.svg"
                                alt="product"
                                className="product_model_img mr-2"
                              />
                            )}{" "}
                          <span className="px-2">
                            {" "}
                            {selected_product.product.product_name}
                          </span>
                        </div>
                        <table className="table table-hover table-bordered">
                          <thead className="thead-light">
                            <tr>
                              <th>Cost Price</th>
                              <th>MRP</th>
                              <th>Selling Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected_product.selected_variant.price_stock.map(
                              (stock_item, stock_key) => {
                                return (
                                  <tr>
                                    <td>{stock_item.original_cost_price}</td>
                                    <td>{stock_item.original_mrp}</td>
                                    <td>{stock_item.original_selling_price}</td>
                                    <td>
                                      <ul className="weight-lst">
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="weight_value"
                                              value={250}
                                              checked={
                                                weight_value[stock_key] === 250
                                              }
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "weight_value",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />

                                            <span>250 gm</span>
                                          </label>
                                        </li>
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="weight_value"
                                              value={500}
                                              checked={
                                                weight_value[stock_key] === 500
                                              }
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "weight_value",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />

                                            <span>500 gm</span>
                                          </label>
                                        </li>
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="weight_value"
                                              value={750}
                                              checked={
                                                weight_value[stock_key] === 750
                                              }
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "weight_value",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />

                                            <span>750 gm</span>
                                          </label>
                                        </li>
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="weight_value"
                                              value={1}
                                              checked={weight_value[stock_key] === 1}
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "weight_value",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />

                                            <span>1 Kg</span>
                                          </label>
                                        </li>
                                      </ul>
                                      <ul className="weight-lst">
                                        <li>
                                          <input
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Enter weight (in grams)"
                                            className="form-control"
                                            name="weight_value_input"
                                            value={weight_value_input[stock_item.id]}
                                            onChange={e =>
                                              this.selectWeight(
                                                e,
                                                "weight_value_input",
                                                stock_item,
                                                stock_key,
                                                selected_product.product,
                                                selected_product.variant_key
                                              )
                                            }
                                          />
                                        </li>
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="selected_weight_unit"
                                              value="gram"
                                              checked={
                                                selected_weight_unit[stock_key] ===
                                                "gram"
                                              }
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "selected_weight_unit",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />

                                            <span>gm</span>
                                          </label>
                                        </li>
                                        <li>
                                          <label>
                                            <input
                                              type="checkbox"
                                              name="selected_weight_unit"
                                              value="kg"
                                              checked={
                                                selected_weight_unit[stock_key] ===
                                                "kg"
                                              }
                                              onChange={e =>
                                                this.selectWeight(
                                                  e,
                                                  "selected_weight_unit",
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            />
                                            <span>Kg</span>
                                          </label>
                                        </li>
                                      </ul>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                        <p className="mb-0 text-center">
                          <button
                            onClick={e => {
                              this.addWeightPrice(e);
                            }}
                            className="btn"
                          >
                            submit
                    </button>
                        </p>
                      </div>
                    }
                  />
                )}
                {stock_flag && (
                  <ModalPopup
                    className="stock-flag"
                    popupOpen={stock_flag}
                    popupHide={e => this.addDataPrice(e)}
                    title="Multiple Price Found"
                    content={
                      <div>
                        <div className="d-flex mb-2">
                          {selected_product.product.image_url ? (
                            <img
                              src={selected_product.product.image_url}
                              alt="product"
                              className="product_model_img mr-2"
                            />
                          ) : (
                              <img
                                src="images/product.svg"
                                alt="product"
                                className="product_model_img mr-2"
                              />
                            )}{" "}
                          <span>{selected_product.product.product_name}</span>
                        </div>
                        <table className="table table-hover table-bordered">
                          <thead className="thead-light">
                            <tr>
                              <th>Cost Price</th>
                              <th>MRP</th>
                              <th>Selling Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected_product.selected_variant.price_stock.map(
                              (stock_item, stock_key) => {
                                return (
                                  <tr>
                                    <td>{stock_item.original_cost_price}</td>
                                    <td>{stock_item.original_mrp}</td>
                                    <td>{stock_item.original_selling_price}</td>

                                    <td>
                                      <div>
                                        {added_quantity[stock_key] > 0 ? (
                                          <div className="b_product_qnty">
                                            <button
                                              className="sub"
                                              onClick={e =>
                                                this.minusStockPrice(
                                                  e,
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            >
                                              -
                                    </button>
                                            <input
                                              type="texPag"
                                              id="2"
                                              value={added_quantity[stock_key]}
                                              min="1"
                                              max="100"
                                              disabled
                                            />
                                            <button
                                              className="add"
                                              onClick={e =>
                                                this.addedStockPrice(
                                                  e,
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            >
                                              +
                                    </button>
                                          </div>
                                        ) : (
                                            <button
                                              className="add_btn btn"
                                              onClick={e =>
                                                this.addedStockPrice(
                                                  e,
                                                  stock_item,
                                                  stock_key,
                                                  selected_product.product,
                                                  selected_product.variant_key
                                                )
                                              }
                                            >
                                              Add
                                            </button>
                                          )}
                                        <div>Stock: {stock_item.quantity}</div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                        {/* <p className="mb-0 text-center">
                    <button
                      className="btn"
                      onClick={e => {
                        this.addDataPrice(e);
                      }}
                    >
                      submit
                    </button>
                  </p> */}
                      </div>
                    }
                  />
                )}

                {add_modification_flag && (
                  <ModalPopup
                    className="add-modification-flag"
                    popupOpen={add_modification_flag}
                    popupHide={e => this.modalClose(e, "add_modification_popup")}
                    title={modified_product.product_name}
                    content={
                      <div>
                        <table className="table table-hover table-bordered">
                          <thead className="thead-light">
                            <tr>
                              {modified_product.product_type !== 3 && (
                                <th>Current Stock</th>
                              )}
                              <th>Cost</th>
                              <th>S.Price( Inc. GST)</th>
                              <th>MRP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modified_product.variants.map(
                              (inner_item, inner_key) => {
                                return (
                                  inner_item.variant_id ===
                                  varient_data[modified_product.product_id] &&
                                  inner_item.price_stock &&
                                  inner_item.price_stock.map(
                                    (stock_data, stock_key) => {
                                      return (
                                        <tr>
                                          {modified_product.product_type !== 3 && (
                                            <td>{stock_data.quantity}</td>
                                          )}
                                          <td>{stock_data.original_cost_price}</td>
                                          <td>
                                            <input
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                              name={stock_data.original_selling_price}
                                              value={
                                                stock_data.original_selling_price
                                              }
                                              placeholder="Enter Selling Price"
                                              onChange={e =>
                                                this.handleEdit(
                                                  e,
                                                  "s.price",
                                                  modified_product,
                                                  inner_key
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <input
                                              type="text"
                                              autoComplete="off"
                                              className="form-control"
                                              name={stock_data.original_mrp}
                                              value={stock_data.original_mrp}
                                              placeholder="Enter MRP Price"
                                              onChange={e =>
                                                this.handleEdit(
                                                  e,
                                                  "m.price",
                                                  modified_product,
                                                  inner_key
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )
                                );
                              }
                            )}
                          </tbody>
                        </table>
                        <div className="w-100">
                          {modified_product.variants.map((inner_item, inner_key) => {
                            return (
                              inner_item.variant_id ===
                              varient_data[modified_product.product_id] && (
                                <div>
                                  <label>Product Barcode</label>
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control"
                                    name={inner_item.barcode}
                                    value={inner_item.barcode}
                                    placeholder=""
                                    onChange={e =>
                                      this.handleEdit(
                                        e,
                                        "barcode",
                                        modified_product,
                                        inner_key
                                      )
                                    }
                                  />
                                </div>
                              )
                            );
                          })}
                          <div className="d-flex justify-content-between w-100 mt-3 dashboard_check">
                            <div className="w-100">
                              <label
                                className="custom-control-label"
                                for="trackInventory"
                              >
                                Track Inventory
                        </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                onChange={e =>
                                  this.handleEdit(
                                    e,
                                    "track_inventory",
                                    modified_product
                                  )
                                }
                                checked={modified_product.track_inventory}
                                value={modified_product.track_inventory}
                                className="custom-control-input"
                                id="trackInventory"
                              />
                              <label
                                className="custom-control-label"
                                for="trackInventory"
                              ></label>
                            </div>
                          </div>
                          {modified_product.track_inventory && (
                            <div className="d-flex justify-content-between w-100 mt-3 dashboard_check">
                              <div className="w-100">
                                <label
                                  className="custom-control-label"
                                  for="allowZero"
                                >
                                  Allow Quantity Below Zero
                          </label>
                              </div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  type="checkbox"
                                  onChange={e =>
                                    this.handleEdit(
                                      e,
                                      "allow_below_zero",
                                      modified_product
                                    )
                                  }
                                  checked={modified_product.allow_below_zero}
                                  value={modified_product.allow_below_zero}
                                  className="custom-control-input"
                                  id="allowZero"
                                />
                                <label
                                  className="custom-control-label"
                                  for="allowZero"
                                ></label>
                              </div>
                            </div>
                          )}
                          <div className="row mt-3">
                            <div className="form-group col-12 col-md-6">
                              <label>TAX/GST</label>
                              <select
                                className="form-control"
                                value={modified_product.tax_id}
                                onChange={e =>
                                  this.handleEdit(e, "tax", modified_product)
                                }
                              >
                                {tax_data.map(option => (
                                  <option value={option.id}>{option.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-12 col-md-6">
                              <label>HSN CODE</label>
                              <div className="input-group">
                                <input
                                  type="text"
                                  autoComplete="off"
                                  className="form-control"
                                  placeholder="Enter HSN Code"
                                  name={modified_product.hsn_code}
                                  value={modified_product.hsn_code}
                                  onChange={e =>
                                    this.handleEdit(e, "hsn_code", modified_product)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn add-btn custom_btn mt-2 mx-auto d-block"
                          onClick={e => {
                            this.addEdit(e);
                          }}
                        >
                          submit
                  </button>
                      </div>
                    }
                  />
                )}

                {add_imei_flag && (
                  <ModalPopup
                    className="add-imei-flag"
                    popupOpen={add_imei_flag}
                    popupHide={e => this.modalClose(e, "imei_serial_popup")}
                    title="ADD IMEI & SERIAL NUMBER"
                    content={
                      <div>
                        <p>{modified_product.product_name}</p>
                        {modified_product.variants.map((inner_item, inner_key) => {
                          return (
                            inner_item.variant_id ===
                            varient_data[modified_product.product_id] && (
                              <div>
                                <div className="imei_container">
                                  <div className="form-group row mb-0">
                                    <label className="col-6 ">IMEI</label>
                                    <label className="col-6 ">
                                      <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        name={inner_item.imei_number}
                                        value={inner_item.imei_number}
                                        placeholder=""
                                        onChange={e =>
                                          this.handleElectronic(
                                            e,
                                            "imei",
                                            modified_product
                                          )
                                        }
                                      />
                                    </label>
                                  </div>

                                  <div className="form-group row mb-0">
                                    <label className="col-6 ">Product Serial</label>
                                    <label className="col-6 ">
                                      <input
                                        type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        name={inner_item.serial_number}
                                        value={inner_item.serial_number}
                                        placeholder=""
                                        onChange={e =>
                                          this.handleElectronic(
                                            e,
                                            "serial",
                                            modified_product,
                                            inner_key
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
                                </div>
                                <p className="mb-0 text-center">
                                  <button
                                    className="add_btn btn"
                                    onClick={e => {
                                      this.addSerialImei(e);
                                    }}
                                  >
                                    submit
                            </button>
                                </p>
                              </div>
                            )
                          );
                        })}
                      </div>
                    }
                  />
                )}
              </div>}
            {activeClass && (
              <RightSideBar
                state={this.state}
                props={this.props}
                history={this.props.history}
                minusProduct={this.minusProduct}
                addedProduct={this.addedProduct}
                last_invoice={this.props.last_invoice}
                rerenderParentCallback={e => this.rerenderParentCallback(e)}
                refreshParentOnDelete={e => this.refreshParentOnDelete(e)}
              />
            )}
          </Fragment>
          :
          <div className='permission_data'>
            <img src='images/permission.png' alt='permission'/>
            <h3>You didn't purchase the desktop version</h3>
            <button
              className="btn add_btn mr-2"
              onClick={() => this.handleLogOut()}
            >
              Log Out
            </button>
          </div>
        }
      </Fragment>
    );
  }
}
const mapStateToProps = store => {
  return {
    generate_bill_data: store.common.generate_bill_data,
    product_list: store.products.product_list,
    store_settings: store.settings.store_settings,
    last_invoice: store.settings.last_invoice,
    invoice_settings_list: store.settings.invoice_settings_list,
    store_payment: store.settings.store_payment,
    store_invoice: store.settings.store_invoice,
    customers_list: store.settings.customers_list,
    state_list: store.settings.state_list,
    tax_data: store.products.tax_data,
    product_type: store.products.product_type,
    isLoading: store.settings.billingIsLoading,
    update_response: store.products.update_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    accountPermission: params => dispatch(accountPermission(params)),
    getProducts: params => dispatch(getProducts(params)),
    storeSettings: params => dispatch(storeSettings(params)),
    getLastStoreInvoice: params => dispatch(getLastStoreInvoice(params)),
    getInvoiceSettings: () => dispatch(getInvoiceSettings()),
    storePaymentMode: params => dispatch(storePaymentMode(params)),
    storeInvoiceType: params => dispatch(storeInvoiceType(params)),
    customers: params => dispatch(customers(params)),
    stateApi: params => dispatch(stateApi(params)),
    getTax: () => dispatch(getTax()),
    getProductType: params => dispatch(getProductType(params)),
    updateProduct: params => dispatch(updateProduct(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
