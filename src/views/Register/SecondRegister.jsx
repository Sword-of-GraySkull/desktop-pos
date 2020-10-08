import React, { Component } from "react";

export default class SecondRegister extends Component {
  render() {
    const { state, handleChange, changeTab, resentCode, getList } = this.props;
    const { otp, mobile } = state;
    return (
      <div className="form_data">
        {/* <div onKeyDown={e => registerHandler("enter", e)}>  */}

        <div className="form-group">
          <input
            className="form-control mobile_input"
            type="text"
            placeholder="OTP"
            name="otp"
            autocomplete="new-password"
            onChange={e => handleChange(e, "otp")}
            value={otp}
          />
        </div>
        <span>Enter the 6-digit verifiication code sent to {mobile}</span>
        <span onClick={() => changeTab()}>change number?</span>
        <span onClick={() => resentCode()}>Resent verification Code</span>
        <button
          type="button"
          className="btn login_btn "
          onClick={e => getList(e)}
        >
          Next
        </button>

        {/* </div> */}
      </div>
    );
  }
}
