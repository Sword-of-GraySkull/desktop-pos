import React, { Component } from "react";
// import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import database from "../database";
import InnerRoutes from "../routes/InnerRoutes";
import { ModalPopup } from "./ModalPopup";
import { toaster } from "./Toaster";
import {
  storeSettings
} from "../actions/settings";
let store_flag = false
class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: new database(),
      activeClass:
        localStorage.getItem("activeClass") !== null
          ? JSON.parse(localStorage.getItem("activeClass"))
          : true,
      store_name: "",
      store_phone: "",
      store_image: "images/fev.png",
      modal_flag: false
    };
  }
  async componentDidMount() {
    const res1 = await this.state.db.getStoreSettings();
    if (res1 && res1.status === 200) {
      this.setState({
        store_name: res1.store_settings.business_name,
        store_phone: res1.store_settings.phone_number,
        store_image: res1.store_settings.logo_url
          ? res1.store_settings.logo_url
          : "images/fev.png"
      });
    } else {
      let data = localStorage.getItem("store");
      let params = {
        store_id: data
      };
      store_flag = true
      this.props.storeSettings(params);
    }
  }
  async UNSAFE_componentWillReceiveProps(newProps) {
    const { store_settings } = newProps;
    if (store_settings.code === 200 && store_flag) {
      this.setState({
        store_name: store_settings.store.business_name,
        store_phone: store_settings.store.phone_number,
        store_image: store_settings.store.show_images
          ?  store_settings.store.show_images
          : "images/fev.png"
      });
      store_flag = false
    }
    const res1 = await this.state.db.getStoreSettings();
    if (res1 && res1.status === 200) {
      this.setState({
        store_name: res1.store_settings.business_name,
        store_phone: res1.store_settings.phone_number,
        store_image: res1.store_settings.logo_url
          ? res1.store_settings.logo_url
          : "images/fev.png"
      });
    }
  }

  activeRoute(routeName) {
    return window.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  async openModal() {
    const res = await this.state.db.getOfflineProducts();
    if (
      res &&
      (res.status === 200 &&
        (res.offline_product_list && res.offline_product_list.length !== 0))
    ) {
      toaster(
        "error",
        "Unable to log out, as offline data is present in local database."
      );
    } else {
      this.setState({ modal_flag: true });
    }
  }
  toggleClass = () => {
    localStorage.setItem("activeClass", !this.state.activeClass);
    this.setState({ activeClass: !this.state.activeClass });
  };

  modalClose = () => {
    this.setState({ modal_flag: false });
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
      activeClass,
      store_image,
      modal_flag
    } = this.state;
    return (
      <div
        className={
          activeClass ? "left_sidebar active" : "left_sidebar inactive"
        }
      >
        <div className="logo_div">
          <div className="menu_toggle" onClick={e => this.toggleClass(e)}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </div>
          <div className="site_logo">
            <Link to="/settings/store-details">
              <img src={store_image} alt="logo" />
              {/* <span>{store_name}</span>
              <span>{store_phone}</span> */}
            </Link>
          </div>
        </div>
        <div className="main_menu">
          <ul>
            {/* <li>
              <NavLink className="" to="#" activeClassName="activeClass">
                <i className="home_icon" />
                <span className="">Home</span>
              </NavLink>
            </li> */}
            {InnerRoutes.map((prop, key) => {
              return (
                prop.name && (
                  <li className={this.activeRoute(prop.path)} key={key}>
                    <Link to={prop.path}>
                      <i className="billing_icon" />
                      {/* <i className={prop.icon} /> */}
                      <span>{prop.name}</span>
                    </Link>
                  </li>
                )
              );
            })}
            {/* <li><a href="#"><i className="home_icon"></i><span>Home</span></a></li> */}
            {/* <li className={this.activeRoute("/billing")}>
              <Link to="/billing">
                <i className="billing_icon" />
                <span>Billing</span>
              </Link>
            </li>
            <li className={this.activeRoute("/products")}>
              <Link to="/products">
                <i className="billing_icon" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="setting_icon" />
                <span>Settings</span>
              </Link>
            </li> */}
            <li onClick={e => this.openModal(e)} className="logOut">
              {" "}
              <i className="fa fa-sign-out" aria-hidden="true" />
              <span>Log Out</span>
            </li>
          </ul>
        </div>
        <ModalPopup
          className="hold-delete-flag unhold_invoice log_out"
          popupOpen={modal_flag}
          popupHide={this.modalClose}
          // title="Invoice"
          content={
            <div className="">
              <h4 className="text-dark text-center mb-3">
                Are you sure you want to log out?
              </h4>
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="btn add_btn mr-2"
                  onClick={() => this.handleLogOut()}
                >
                  Yes
                </button>
                <button
                  className="btn add_btn"
                  onClick={() => this.modalClose()}
                >
                  No
                </button>
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

// export default LeftSideBar;
const mapStateToProps = store => {
  return {
    store_settings: store.settings.store_settings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeSettings: params => dispatch(storeSettings(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSideBar);