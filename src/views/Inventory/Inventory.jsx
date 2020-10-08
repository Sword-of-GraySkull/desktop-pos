import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
export class Inventory extends Component {
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
          <h3>Inventory</h3>
        </div>
        <div className="row">
          <div className="col-12 pl-2 pt-md-2">
            <ul className="settings_lsts">
              <li>
                <Link to="/inventory/add-grn">
                  <img className="img-flude" src="images/shop.svg" alt="" />
                  <p>Stock In</p>
                </Link>
              </li>
              <li>
                <Link to="/inventory/view-grn">
                  <img className="img-flude" src="images/bill.svg" alt="" />
                  <p>Stock In History</p>
                </Link>
              </li>

              <li>
                <Link to="/inventory/wastage">
                  <img className="img-flude" src="images/bill.svg" alt="" />
                  <p>Wastage</p>
                </Link>
              </li>
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
)(Inventory);
