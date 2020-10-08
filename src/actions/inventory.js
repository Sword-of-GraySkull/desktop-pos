// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";
export function viewGRN(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/grn-list/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `VIEW_GRN`,
       payload: axios.get(
         `${API_URL}/api/product/grn-list/`, {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function viewSpecificGRN(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/grn-details/?grn_id=${params.grn_id}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `VIEW_SPECIFIC_GRN`,
       payload: axios.get(
         `${API_URL}/api/product/grn-details/?grn_id=${params.grn_id}`, {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function createGRN(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/product/grn/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `CREATE_GRN`,
       payload: axios.post(`${API_URL}/api/product/grn/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function submitWastage(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/add-on/wastage`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `WASTAGE`,
       payload: axios.post(`${API_URL}/api/add-on/wastage`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
