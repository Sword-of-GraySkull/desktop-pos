import React, { Component } from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


export  class LoaderFunc extends Component {
  render() {
    return (
      <div>
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          className="Loader_Class"
          visible={this.props.visible}
          //  timeout={3000} //3 secs
        />
      </div>
    );
  }
}
