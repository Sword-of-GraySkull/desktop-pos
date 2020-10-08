import React, { Component } from "react";

export default class FirstRegister extends Component {
  render() {
    const { state, handleChange, handleOtp } = this.props;
    const { mobile, name, password } = state;
    return (
      <div className="form_data">
        {/* <div onKeyDown={e => registerHandler("enter", e)}>  */}

        <div className="form-group">
          <input
            className="form-control mobile_input"
            type="text"
            placeholder="Mobile Number"
            name="mobile"
            autocomplete="new-password"
            onChange={e => handleChange(e, "mobile")}
            value={mobile}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control user_input"
            type="text"
            placeholder="Name"
            name="name"
            autocomplete="new-password"
            onChange={e => handleChange(e, "name")}
            value={name}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control password_input"
            type="Password"
            placeholder="Password"
            name="password"
            autocomplete="new-password"
            onChange={e => handleChange(e, "password")}
            value={password}
          />
        </div>

        <button
          type="submit"
          className="btn login_btn "
          onClick={e => handleOtp(e)}
        >
          Next
        </button>

        {/* </div> */}
      </div>
    );
  }
}
