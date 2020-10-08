import React, { Component } from "react";
import { connect } from "react-redux";
export class HardwareSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {}
  UNSAFE_componentWillReceiveProps(newProps) {}

  render() {
    return <div className=""></div>;
  }
}

const mapStateToProps = store => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HardwareSettings);
