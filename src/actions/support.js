// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";
export function getFaq(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/common/faq/`
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_FAQ`,
       payload: axios.get(`${API_URL}/api/common/faq/`)
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function commNumber(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/common/customer-support/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `COMM_NUMBER`,
       payload: axios.get(`${API_URL}/api/common/customer-support/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function submitQuery(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/common/support-query/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SUBMIT_QUERY`,
       payload: axios.post(`${API_URL}/api/common/support-query/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
