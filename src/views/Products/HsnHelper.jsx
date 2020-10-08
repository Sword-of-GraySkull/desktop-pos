import React, { Component } from "react";

class HsnHelper extends Component {
  render() {
    const {
      search_hsn_input,
      hsn_selector,
      hsn_data,
      handleChange,
      onKeyPress,
      handleHSNChange,
      getHSNCode,
      handleClick,
      closeHSNHelper
    } = this.props;
    return (
      <div className="billing_products_wrap hsn_code_wrap">
        <div className="d-flex justify-content-between ">
          <h3>HSN CODE</h3>
          <div className="d-flex ml-auto">
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                className="btn btn-dark ml-1"
                onClick={e => closeHSNHelper(e)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="card w-100 p-3 mb-3">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="input-group mb-3">
                <input
                  className="search_input form-control"
                  type="text"
                  name="search_hsn_input"
                  placeholder="Search..."
                  value={search_hsn_input}
                  onChange={e => handleChange(e, "search_hsn_input")}
                  onKeyPress={e => onKeyPress(e, "add_hsn")}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={e => getHSNCode(e)}
                  >
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="form-group">
                <label>Search using: </label>
                <div className="row">
                  <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="hsn_selector"
                        value="product category"
                        id="product_category"
                        checked={hsn_selector === "product category"}
                        onClick={e => handleClick(e, "hsn_selector")}
                      />
                      <label
                        className="custom-control-label"
                        for="product_category"
                      >
                        Product category
                      </label>
                    </div>
                  </div>

                  <div className="col-12 col-sm-5 col-md-4 col-lg-3">
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        id="hsn_code"
                        name="hsn_selector"
                        value="hsn code"
                        checked={hsn_selector === "hsn code"}
                        onClick={e => handleClick(e, "hsn_selector")}
                      />
                      <label className="custom-control-label" for="hsn_code">
                        HSN code
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="small m-0 bg-light p-1">
            <b>Disclaimer:</b> We are helping you to provide with the best
            possible HSN Code list. We are not responsible for any wrong HSN
            Code mapping.
          </p>
        </div>
        {hsn_data.length !== 0 && (
          <div className="card w-100 p-3 mb-3">
            <div className="row">
              <div className="col-12">
                <ul className="hsn_data-list">
                  {hsn_data.map((data, key) => {
                    return (
                      <li
                        value={data.hsn_code}
                        onClick={e => handleHSNChange(e, "hsn_code")}
                      >
                        {data.hsn_code_type}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default HsnHelper;
