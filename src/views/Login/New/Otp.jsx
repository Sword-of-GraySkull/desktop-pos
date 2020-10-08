import React, { Component } from "react";
// import Countdown from "react-countdown";
import { Link } from "react-router-dom";
export default class Otp extends Component {
  // renderer = ({ hours, minutes, seconds, completed }) => {
  //   if (completed) {
  //     // Render a completed state
  //     return (
  //       <span onClick={() => this.props.resentCode()}>
  //         Resent verification Code{" "}
  //       </span>
  //     );
  //   } else {
  //     // Render a countdown
  //     return (
  //       <span>
  //         <span>Resent verification Code </span>
  //         {minutes}:{seconds}
  //       </span>
  //     );
  //   }
  // };

  render() {
    const {
      state,
      handleChange,
      changeTab,
      // resentCode,
      confirmOtp,
      onKeyPress
    } = this.props;
    const { otp, mobile, loader2 } = state;
    return (
      <div className="form_data">
        {/* <div onKeyDown={e => registerHandler("enter", e)}>  */}
        <span>Enter the 6-digit verifiication code sent to +91-{mobile}</span>
        <div>
          <Link to="#" onClick={() => changeTab('otp')}>
            Change Number?
          </Link>
        </div>
        <div className="form-group">
          <input
            className="form-control mobile_input"
            type="text"
            autoFocus
            placeholder="OTP"
            name="otp"
            autoComplete="off"
            onChange={e => handleChange(e, "otp")}
            value={otp}
            onKeyPress={e => onKeyPress(e, "otp")}
          />
        </div>

        <span
          onClick={() => this.props.resentCode()}
          className="position-relative"
          style={{
            top: "-6px"
          }}
        >
          <Link to="#">Resend Verification Code </Link>
        </span>
        {/* <Countdown date={Date.now() + 4000} renderer={this.renderer} /> */}
        <button
          type="button"
          className="btn login_btn "
          onClick={e => confirmOtp(e)}
        >
          Submit
          {loader2 && <i class="fa fa-spinner fa-pulse fa-spin  fa-fw"></i>}
        </button>

        {/* </div> */}
      </div>
    );
  }
}
