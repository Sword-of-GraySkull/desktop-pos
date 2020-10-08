import { API_URL, NODE_API_URL } from "../config";
import axios from "axios";
import jwt from "jsonwebtoken";
// new login flow

export function newLoginOtp(params) {
  var paramsData = {};
  for (var pair of params.entries()) {
    paramsData[pair[0]] = pair[1];
  }
  let data = {
    type: "post",
    url: `${API_URL}/api/registration/web-otp-login/`,
    params: paramsData
  };

  var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `NEW_LOGIN_OTP`,
    //  payload: axios.post(`${API_URL}/api/registration/web-otp-login/`, params)
    payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function newConfirmLoginOtp(params) {
  let data = {
    type: "get",
    url: `${API_URL}/api/registration/otp-verification/?phone_number=${params.mobile}&&otp=${params.otp}`
  };

  var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `NEW_CONFIRM_LOGIN_OTP`,
    // payload: axios.get(
    //   `${API_URL}/api/registration/otp-verification/?phone_number=${params.mobile}&&otp=${params.otp}`
    // )
    payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function loginUser(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/store/login/`,
  //   params: params
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `LOGIN_USER`,
    payload: axios.post(API_URL + "/api/store/login/", params)
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function registerUser(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/store/register/`,
  //   params: params
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `REGISTER_USER`,
    payload: axios.post(API_URL + "/api/store/register/", params)
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function AddRegisterProduct(params) {
  return {
    type: `ADD_REGISTER_PRODUCT`,
    payload: axios.post(API_URL + "/api/registration/v2/add-product-all/", params)
  };
}

export function getOtp(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/otp/?phone_number=${params}`
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_OTP`,
    payload: axios.get(`${API_URL}/api/store/otp/?phone_number=${params}`)
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function resendOtp(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/v2/reset-password/?phone_number=${params}`
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `RESEND_OTP`,
    payload: axios.get(
      `${API_URL}/api/product/v2/reset-password/?phone_number=${params}`
    )
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getStoreList() {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/business-type/`
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_STORE_LIST`,
    payload: axios.get(`${API_URL}/api/store/business-type/`)
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function terms() {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/common/agreement/`
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `TERMS`,
    payload: axios.get(API_URL + "/api/common/agreement/")
    // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function regiCategory(params) {
  return {
    type: `REGI_CATEGORY`,
    payload: axios.get(`${API_URL}/api/registration/category/?business_type=${params}`)
  };
}

export function allCategoryProduct(params) {
  return {
    type: `ALL_CATEGORY_PRO`,
    payload: axios.get(`${API_URL}/api/product/master-add-product/?store_id=${params.store_id}&&page=${params.page}`, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    })
  };
}

export function categoryProduct(params) {
  return {
    type: `CATEGORY_PRO`,
    payload: axios.get(`${API_URL}/api/registration/category-product/?cat_id=${params.cat_id}&&page=${params.page}`, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token")
      }
    })
  };
}
