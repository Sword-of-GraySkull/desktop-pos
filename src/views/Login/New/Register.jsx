import React, { Component } from "react";

export default class Register extends Component {
  render() {
    const {
      state,
      handleChange,
      changeTab,
      registerHandler
    } = this.props;
    const {
      name,
      referral_code,
      selected_business,
      selected_business_name,
      business_name,
      product_flag
    } = state;
    return (
      <div className="form_data">
        <label>Select Your Business*</label>
        <div onClick={() => changeTab('choose_business')} className='choose_business'>
          {selected_business !== ""
            ? selected_business_name
            : "Choose your Business"}
        </div>
        <div className="form-group">
          <label>Name*</label>
          <input
            className="form-control user_input"
            type="text"
            placeholder="Name"
            name="name"
            autoComplete="new-password"
            onChange={e => handleChange(e, "name")}
            value={name}
          />
        </div>
        <div className="form-group">
          <label>Business Name*</label>
          <input
            className="form-control mobile_input"
            type="text"
            placeholder="Enter your Business Name"
            name="business_name"
            autoComplete="new-password"
            onChange={e => handleChange(e, "business_name")}
            value={business_name}
          />
        </div>
        <div className="form-group">
          <label>Referral Code(Optional)</label>
          <input
            className="form-control password_input"
            type="text"
            placeholder="Referral Code"
            name="referral_code"
            autoComplete="new-password"
            onChange={e => handleChange(e, "referral_code")}
            value={referral_code}
          />
        </div>
        <div className="custom-control custom-switch">
          <input
            type="checkbox"
            className="custom-control-input"
            value={product_flag}
            id='product'
            checked={product_flag}
            onChange={e => handleChange(e, "product_flag")}
          />
          <label className="custom-control-label" htmlFor='product'>
            <h4>Add my bussiness related products</h4>
            <span>Enable this to add products related to your business</span>
          </label>
        </div>

        <button
          type="button"
          className="btn login_btn "
          onClick={e => registerHandler(e)}
        >
          Next
        </button>
      </div>
    );
  }
}

