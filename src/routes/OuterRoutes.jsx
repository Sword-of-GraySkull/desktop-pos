// import React from "react";
//new login
import Login from "../views/Login/New/Login";
import Otp from "../views/Login/New/Otp";
// import Register from "../views/Login/New/Register";


// import Login from "../views/Login/Login";
import ForgotPassword from "../views/Login/ForgotPassword";
import ConfirmPassword from "../views/Login/ConfirmPassword";
// import Register from "../views/Register/Register";
import TermConditions from "../views/Conditions/TermConditions";
import PrivacyPolicy from "../views/Conditions/PrivacyPolicy";
import FAQ from "../views/Support/FAQ";
const OuterRoutes = [
  {
    path: "/",
    component: Login
  },
  {
    path: "/otp",
    component: Otp
  },
  // {
  //   path: "/register",
  //   component: Register
  // },
  // {
  //   path: "/",
  //   component: Login
  // },
  {
    path: "/forgot-password",
    component: ForgotPassword
  },
  {
    path: "/confirm-password",
    component: ConfirmPassword
  },
  // {
  //   path: "/register",
  //   component: Register
  // },

  {
    path: "/terms",
    component: TermConditions
  },
  {
    path: "/privacy-policy",
    component: PrivacyPolicy
  },

  {
    path: "/FAQ",
    component: FAQ,
    name: "FAQ"
  },
  { redirect: true, path: "/", to: "/" }
];
export default OuterRoutes;