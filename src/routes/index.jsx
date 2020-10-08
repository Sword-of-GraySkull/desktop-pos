import React from "react";
import OuterRoutes from "./OuterRoutes";
import InnerRoutes from "./InnerRoutes";
import LeftSideBar from "../helper/LeftSideBar";
import database from "../database";
import { connect } from "react-redux";
// import Footer from "../helper/Footer";
import { Route, Switch, Redirect } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      db: new database(),
      token: '',
      generate_bill: false,
      permission: true
    };
  }
  async UNSAFE_componentWillMount() {
    const res = await this.state.db.getLoginDetails();
    if (res && res.status === 200) {
      localStorage.setItem("token", res.loginDetails.token);
      localStorage.setItem("Login", res.loginDetails.Login);
      localStorage.setItem("store", res.loginDetails.store);
      localStorage.setItem("logged_user", res.loginDetails.logged_user);
      localStorage.setItem("logged_user_id", res.loginDetails.logged_user_id);
      localStorage.setItem("store_legal_name", res.loginDetails.store_legal_name);
      this.setState({token: res.loginDetails.token})
    }
  }
  UNSAFE_componentWillReceiveProps(newProps){
    const {generate_bill_data, access_permission}=newProps
    if(generate_bill_data && generate_bill_data.code === 200){
      this.setState({generate_bill: generate_bill_data.bill_status})
    }
    if(access_permission && access_permission.code === 200){
      this.setState({permission: access_permission.permission_status})
    }
  }
  render() {
    const {generate_bill, permission}=this.state
    return (
      <div>
        {isMobileOnly ? (
          <div className="mobile-content"> 
               <div className="mobile-inner-content">  
                <div className="tick-1">
                 <img src="/logo.png" alt="Pogo 91"/>
                </div>

              <h2> This App is Unavailable on Mobile </h2> </div></div>

                
        ) : !localStorage.getItem("Login") ? (
          <Switch>
            {OuterRoutes.map((prop, key) => {
              if (prop.redirect)
                return <Redirect from={prop.path} to={prop.to} key={key} />;
              return (
                <Route
                  exact
                  path={prop.path}
                  component={prop.component}
                  key={key}
                />
              );
            })}
          </Switch>
        ) : (
          <div className="full-height full-width">
            <div className="main_page d-flex align-items-start">
              {permission && (!generate_bill && <LeftSideBar {...this.props} />)}
              <Switch>
                {InnerRoutes.map((prop, key) => {
                  if (prop.redirect)
                    return <Redirect from={prop.path} to={prop.to} key={key} />;
                  return (
                    <Route
                      exact
                      path={prop.path}
                      component={prop.component}
                      key={key}
                    />
                  );
                })}
              </Switch>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    generate_bill_data: store.common.generate_bill_data,
    access_permission: store.common.access_permission
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // callGenerateBill: () => dispatch(callGenerateBill())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Routes);
