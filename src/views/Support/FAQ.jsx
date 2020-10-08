import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from 'react-router-dom'
import { getFaq } from "../../actions/support";
export class FAQ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      faq: []
    };
  }
  componentDidMount() {
    this.props.getFaq();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { faq_list } = newProps;

    if (faq_list && faq_list.code === 200) {
      this.setState({ faq: faq_list.faqs });
    }
  }

  render() {
    const { faq } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30 relative_ht">
        <div className="heading">
          <h3>FAQ's</h3>
        </div>
        {navigator.onLine ? (
          faq.length !== 0 ? (
            <div id="accordion" className="faq_block pb-1 mb-4">
              {faq.map((data, index) => {
                return (
                  <div key={index} className="w-100 mb-3">
                    <div
                      className="card-header collapsed w-100 d-flex justify-content-between align-items-center"
                      data-toggle="collapse"
                      data-target={"#faq_" + index}
                      aria-expanded="true"
                      aria-controls={"#faq_" + index}
                    >
                      <span>{data.name}</span>
                      <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    </div>

                    <div
                      id={"faq_" + index}
                      className="collapse pr-1 pl-2"
                      aria-labelledby="headingOne"
                      data-parent="#accordion"
                    >
                      <div className="card-body mt-3 p-3 box_shadow">
                        <pre>{data.value}</pre>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no_data_found">
              <span>
                <i className="fa fa-exclamation-triangle" aria-hidden="true" />
              </span>
              <h3>No Questions Found</h3>
            </div>
          )
        ) : (
          <div className="no_data_found">
            <h2>
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </h2>
            <h3>Please connect to internet to access FAQ's</h3>
          </div>
        )}

        <a className="still_link" href="tel:1800 103 3191">
          {localStorage.getItem("Login")
            ? "Still Need Help? Contact Us"
            : "Still Need Help? Call me @ +91 9354775965"}
        </a>
        {/* <Link className="still_link" to='/support'>Still Need Help? Contact Us</Link> */}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    faq_list: store.support.faq_list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFaq: () => dispatch(getFaq())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQ);
