import React, { Component } from "react";
import { connect } from "react-redux";
import {v4 as uuid} from "uuid";
import moment from "moment";
import { submitQuery, commNumber } from "../../actions/support";
import { toaster } from "../../helper/Toaster";
import { LoaderFunc } from "../../helper/LoaderFunc";
import { Overlay, Tooltip } from "react-bootstrap";
let queryflag = false;
export class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      comm_number: "",
      show: false,
      target: "",
      loaderVisible: false
    };
  }
  componentDidMount() {
    this.props.commNumber();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { query_response, comm_num_response } = newProps;
    if (query_response && query_response.code === 200 && queryflag) {
      toaster("success", query_response.message);
      this.setState({ loaderVisible: false });
      this.setState({query: ''})
      queryflag = false;
    } else if (query_response && query_response.code !== 200 && queryflag) {
      toaster("error", query_response.message);
    }
    if (comm_num_response && comm_num_response.phone_number) {
      this.setState({ comm_number: comm_num_response.phone_number });
    }
  }

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  handleQuery = () => {
    const { query } = this.state;
    if (query === "") {
      return toaster("error", "Please enter some query.");
    }
    var formData = new FormData();
    formData.append("store_id", localStorage.getItem("store"));
    formData.append("query", query);
    formData.append("is_resolved", false);
    formData.append("created_date", moment().format());
    formData.append("ticket_id", uuid.v4());
    if (navigator.onLine) {
      this.props.submitQuery(formData);
      this.setState({ loaderVisible: true });
      queryflag = true;
    } else {
      toaster("warning", "Please connect to internet to complete this action");
    }
  };

  callWhatsapp = () => {
    window.open(
      // `https://api.whatsapp.com/send?phone=91${this.state.comm_number}`,
      `https://api.whatsapp.com/send?phone=919354775965`,
      "_blank"
    );
  };

  handleInfoMouseEnter = e => {
    this.setState({ target: e.target, show: true });
  };

  handleInfoMouseLeave = e => {
    this.setState({ show: false });
  };
  render() {
    const { query, show, target,loaderVisible } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        <LoaderFunc visible={loaderVisible} />
        {/* {this.props.isLoading && <LoaderFunc />} */}
        <div className="heading d-flex align-items-center justify-content-between mb-3">
          <h3 className="m-0">Support</h3>
          <div className="right_socila">
            <i
              className="fa fa-whatsapp  ml-2"
              aria-hidden="true"
              onClick={() => this.callWhatsapp()}
            />
            <a href="tel:1800 103 3191">
              <i
                className="fa fa-phone ml-2"
                aria-hidden="true"
                onMouseEnter={this.handleInfoMouseEnter}
                onMouseLeave={this.handleInfoMouseLeave}
              />{" "}
            </a>{" "}
            {/* don't remove space otherwise give warning */}
          </div>
          <Overlay show={show} target={target} placement="left">
            <Tooltip id="popover-contained">
              {/* Please make a call on: {comm_number} */}
              Please make a call on: 1800 103 3191
            </Tooltip>
          </Overlay>
        </div>
        <div className="w-100 support_blok">
          <div className="form-group">
            <label className="pb-1 mb-2">Enter message here</label>
            <textarea
              className="form-control w-100"
              name="query"
              autoFocus
              value={query}
              onChange={e => this.handleChange(e, "query")}
            ></textarea>
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="add_btn btn w-auto"
              onClick={() => this.handleQuery()}
            >
              Log Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    query_response: store.support.query_response,
    comm_num_response: store.support.comm_num_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    submitQuery: params => dispatch(submitQuery(params)),
    commNumber: () => dispatch(commNumber())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
