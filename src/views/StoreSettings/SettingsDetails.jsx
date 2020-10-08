import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
export class SettingsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(newProps) {}

  render() {
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <div className="heading">
          <h3>Settings</h3>
        </div>
        <div className="row">
          <div className="col-12 pl-2 pt-md-2">
            <ul className="settings_lsts">
              <li>
                <Link to="/settings/store-details">
                  <img className="img-flude" src="images/shop.svg" alt="" />
                  <p>Store Details</p>
                </Link>
              </li>
              <li>
                <Link to="/settings/store-billing">
                  <img className="img-flude" src="images/bill.svg" alt="" />
                  <p>Billing Settings</p>
                </Link>
              </li>
              {/* <li>
                    <Link to ='/settings/store-product-types'>
                    <img className="img-flude" src="images/file.svg" alt="" />
                    <p>Products Types</p>
                    </Link>
                    </li> */}
              <li>
                <Link to="/settings/store-payments">
                  <img className="img-flude" src="images/coins.svg" alt="" />
                  <p>Payments</p>
                </Link>
              </li>
              <li>
                <Link to="/settings/store-invoice">
                  <img className="img-flude" src="images/invoice.svg" alt="" />
                  <p>Invoice</p>
                </Link>
              </li>
              {/* <li>
                <Link to="/settings/store-mswipe">
                  <img className="img-flude" src="images/contract.svg" alt="" />
                  <p>Mswipe Settings</p>
                </Link>
              </li> */}
              {/* <li>
                <Link to="/settings/store-hardware">
                  <img className="img-flude" src="images/settings.svg" alt="" />
                  <p>Hardware Setting</p>
                </Link>
              </li> */}
            </ul>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsDetails);
