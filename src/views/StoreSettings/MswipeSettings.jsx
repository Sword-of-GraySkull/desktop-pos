import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
export class MswipeSettings extends Component {
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
          {/* <h3>Mswipe Settings</h3> */}

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link to="/settings">Settings</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Mswipe Settings
              </li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-12 col-lg-11">
            <div className="w-100">
              <div className="row">
                <div className="col-6 form-group">
                  <label htmlFor="user_id">User-Id</label>
                  <input
                    type="text"
                    className="form-control"
                    id="user_id"
                    value=""
                    readOnly
                  />
                </div>
                <div className="col-6 form-group">
                  <label htmlFor="pass">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="pass"
                    value=""
                    readOnly
                  />
                </div>
              </div>
              <div className="d-flex w-100 mt-4">
                <input
                  type="button"
                  className="btn add_btn ml-auto"
                  value="Save"
                />
              </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MswipeSettings);
