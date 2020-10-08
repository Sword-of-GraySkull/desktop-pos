import React, { Component } from "react";
import { connect } from "react-redux";
import { terms } from "../../actions/login";
import ReactHtmlParser from 'react-html-parser';
export class TermCondition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      terms: {}
    };
  }
  componentDidMount() {
    this.props.terms();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const { term_data } = newProps;
    if (term_data && term_data.code === 200) {
      this.setState({ terms: term_data["agreement-data"][0] });
    }
  }

  render() {
    const { terms } = this.state;
    return (
      <div className="storeSetting-form w-100 h-100 p-30 relative_ht">
        <div className="heading">
          <h3>Terms and Conditions</h3>
        </div>
        {ReactHtmlParser(terms.description)}
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    term_data: store.login.term_data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    terms: () => dispatch(terms())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TermCondition);
