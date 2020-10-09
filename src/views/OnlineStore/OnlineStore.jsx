import React, { Component } from "react";
import { Link } from "react-router-dom";

class OnlineStore extends Component {
  // constructor(props) {
  //     super(props);
  // }

  render() {
    return (
      <div className="online-store w-100 h-100">
        <div className="w-100 text-right p-2">
          {/* b class is for bold */}
          <button className="btn-del b br-50">Delete Selected</button>
        </div>
        <div className="online-box w-100">
          <p>Search order using</p>
          <div className="row">
            <div className="col-sm-6 mx-auto">
              <label>Order Number</label>
              <br></br>
              <input className="online-input"></input>
            </div>
            <div className="col-sm-6 mx-auto">
              <label>Order Status</label>
              <br></br>
              <select className="online-input p-1">
                <option>ALL</option>
                <option>SUCCESS</option>
                <option>PENDING</option>
              </select>
            </div>
          </div>
        </div>
        <div className="online-box w-100">
          <table className="table table-bordered">
            <thead>
              <tr>
                <td>Order Number</td>
                <td>Customer Details</td>
                <td>Order Amount</td>
                <td>Status</td>
                <td>Date and Time</td>
                <td>Edit</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">3</td>
                <td>Ankit Kushwala, homes 121, Sector 121, Noida, 201301</td>
                <td className="text-right">Rs1500</td>
                <td>Pending</td>
                <td>
                  01-MAY-2020<br></br>10.00 AM
                </td>
                <td>
                  <Link to="online-store/order-details">
                    <button className="btn-view">View</button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default OnlineStore;
