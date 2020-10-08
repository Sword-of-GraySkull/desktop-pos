import React, { Component } from "react";
import { connect } from "react-redux";
import database from "../../database";
import {
  availablePromotions,
  promotionsDetails
} from "../../actions/promotions";
import SecondPage from "./SecondPage";
export class SendPromotion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new database(),
      avail_promotions: [],
      total_customer: 0,
      available_credits: 0,
      days: 30,
      id: 1
    };
  }
  componentDidMount() {
    this.props.availablePromotions();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { avail_promotions_report, promotion_details } = newProps;
    if (avail_promotions_report && avail_promotions_report.code === 200) {
      this.setState({ avail_promotions: avail_promotions_report.promotions });
    }

    if (promotion_details && promotion_details.code === 200) {
      this.setState({
        total_customer: promotion_details.total_customer,
        available_credits: promotion_details.available_credit
      });
    }
  }
  handleFunc = (e, id, days) => {
    if (id === 1) {
      let params = {
        promotion_id: id
      };
      this.props.promotionsDetails(params);
    } else if (id === 2) {
      let params = {
        promotion_id: id,
        days: days
      };
      this.props.promotionsDetails(params);
    }
    this.setState({ id: id });
  };

  render() {
    const { avail_promotions } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30">
        {/* {this.props.isLoading && <LoaderFunc />} */}
        <div className="heading">
          <h3>Send Promotions</h3>
        </div>
        {navigator.onLine ? (
          <div id="accordion" className="sPromotion pb-1">
            {avail_promotions.map((data, index) => {
              return (
                <div className="w-100 border p-3 mb-3" key={index}>
                  <div
                    className="card-header border-0 w-100"
                    data-toggle="collapse"
                    data-target={"#acco_" + data.id}
                    aria-expanded="true"
                    aria-controls={"#acco_" + data.id}
                    onClick={e => this.handleFunc(e, data.id, 30)}
                  >
                    <p className="m-0">
                      <span>{data.name}</span>
                      <br />
                      {data.description}
                    </p>
                  </div>

                  <div
                    id={"acco_" + data.id}
                    className="collapse px-1"
                    aria-labelledby="headingOne"
                    data-parent="#accordion"
                  >
                    <div className="card-body mt-3 p-3 box_shadow">
                      <SecondPage
                        state={this.state}
                        props={this.props}
                        handleFunc={this.handleFunc}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no_data_found">
            <h2>
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </h2>
            <h3>Please connect to internet to view invoice history</h3>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    avail_promotions_report: store.promotions.avail_promotions_report,
    promotion_details: store.promotions.promotion_details,
    isLoading: store.promotions.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    availablePromotions: () => dispatch(availablePromotions()),
    promotionsDetails: params => dispatch(promotionsDetails(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendPromotion);
