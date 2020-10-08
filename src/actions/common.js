// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";



export function accountPermission(status) {
  return {
    type: `ACCOUNT_PERMISSION`,
       payload: {data:{code: 200, permission_status: status}}
  };
}
export function callGenerateBill(status) {
  return {
    type: `GENERATE_BILL`,
    payload: {data:{code: 200, bill_status: status}}
  };
}
export function getCreditsData(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/credits/store-credit-get/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `CREDITS`,
       payload: axios.get(
         `${API_URL}/api/credits/store-credit-get/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getCoins(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/v2/api/coins/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `COINS`,
       payload: axios.get(`${API_URL}/v2/api/coins/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getCoinsHistory(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/v2/api/coins/history/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `COINS_HISTORY`,
       payload: axios.get(`${API_URL}/v2/api/coins/history/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function addCoins(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/v2/api/coins/recharge/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ADD_COINS`,
       payload: axios.post(`${API_URL}/v2/api/coins/recharge/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function addOnSubscription(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/add-on/subscription/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ADD_ON_SUBSCRIPTION`,
       payload: axios.get(`${API_URL}/api/add-on/subscription/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function activeSubscription(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/add-on/active/subscription/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ACTIVE_SUBSCRIPTION`,
       payload: axios.get(`${API_URL}/api/add-on/active/subscription/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function buySubscriptionPlan(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/add-on/buy/subscription/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };
  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `BUY_PLAN`,
       payload: axios.post(`${API_URL}/api/add-on/buy/subscription/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
