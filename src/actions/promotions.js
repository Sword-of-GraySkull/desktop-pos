// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";
export function availablePromotions() {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/promotions/list/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `AVAILABLE_PROMOTIONS`,
       payload: axios.get(`${API_URL}/api/promotions/list/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function promotionsDetails(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/promotions/details/?promotion_id=${params.promotion_id}&days=${params.days}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `PROMOTION_DETAILS`,
       payload: axios.get(`${API_URL}/api/promotions/details/?promotion_id=${params.promotion_id}&days=${params.days}`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function submitPromotion(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/promotions/send-promo-sms/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SUBMIT_PROMOTION`,
       payload: axios.post(`${API_URL}/api/promotions/send-promo-sms/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
