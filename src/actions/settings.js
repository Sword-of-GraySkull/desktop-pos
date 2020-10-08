// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";
export function storeSettings(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/store-settings/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `STORE_SETTINGS`,
       payload: axios.get(
         `${API_URL}/api/store/store-settings/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function uploadStoreImage(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/store/v1/update-logo/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `UPLOAD_STORE_IMAGE`,
       payload: axios.post(
         `${API_URL}/api/store/v1/update-logo/`, params,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function editStoreSettings(params) {
  // let data = {
  //   type: "put",
  //   url: `${API_URL}/api/store/v1/update-store/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `EDIT_STORE_SETTINGS`,
       payload: axios.put(`${API_URL}/api/store/v1/update-store/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}


export function storePaymentMode(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/payment-mode/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `STORE_PAYMENT_MODE`,
       payload: axios.get(
         `${API_URL}/api/store/payment-mode/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function storeInvoiceType(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-invoice-type-get/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `STORE_INVOICE_TYPE`,
       payload: axios.get(
         `${API_URL}/api/product/store-invoice-type-get/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function searchInvoice(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/v1/invoice-search/?search_field=${params.search_field}&page=${params.page}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SEARCH_INVOICE`,
       payload: axios.get(`${API_URL}/api/store/v1/invoice-search/?search_field=${params.search_field}&page=${params.page}`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getInvoiceSettings(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/registration/print-settings/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_INVOICE_SETTINGS`,
       payload: axios.get(
         `${API_URL}/api/registration/print-settings/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function saveInvoiceSettings(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/registration/print-settings/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SAVE_INVOICE_SETTINGS`,
       payload: axios.post(API_URL + "/api/registration/print-settings/", params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getInvoice(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/get-invoice/?page=${params.page}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_INVOICE`,
       payload: axios.get(`${API_URL}/api/store/get-invoice/?page=${params.page}`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getInvoiceDetails(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/detail-invoice/?invoice_id=${params.invoice_id}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_INVOICE_DEATIL`,
       payload: axios.get(`${API_URL}/api/store/detail-invoice/?invoice_id=${params.invoice_id}`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getLastStoreInvoice(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/last-invoice/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_LAST_INVOICE`,
       payload: axios.get(
         `${API_URL}/api/store/last-invoice/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function sendInvoice(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/product/resend-invoice-link/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SEND_INVOICE`,
       payload: axios.post(
         `${API_URL}/api/product/resend-invoice-link/`, params,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function cancelInvoice(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/v2/cancel-invoice/?invoice_id=${params.invoice_id}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `CANCEL_INVOICE`,
       payload: axios.get(
         `${API_URL}/api/store/v2/cancel-invoice/?invoice_id=${params.invoice_id}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function customers(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/customer/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `CUSTOMERS`,
       payload: axios.get(`${API_URL}/api/customer/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function addCustomer(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/customer/register/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ADD_CUSTOMER`,
       payload: axios.post(API_URL + "/api/customer/register/", params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function updateCustomer(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/customer/update/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `UPDATE_CUSTOMER`,
       payload: axios.post(API_URL + "/api/customer/update/", params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function stateApi(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/state-list/?country_id=1`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `STATE_API`,
       payload: axios.get(`${API_URL}/api/store/state-list/?country_id=1`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
export function cityApi(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/store/city-list/?state_id=${params}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `CITY_API`,
       payload: axios.get(`${API_URL}/api/store/city-list/?state_id=${params}`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function generateBilling(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/store/invoice/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GENERATE_BILLING`,
       payload: axios.post(API_URL + "/api/store/invoice/", params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function editPaymentMethods(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/product/store-payment-mode-add-update/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `EDIT_PAYMENT_METHODS`,
       payload: axios.post(
         API_URL + "/api/product/store-payment-mode-add-update/",
         params,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function editInvoiceMethods(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/product/store-invoice-type-add-update/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `EDIT_INVOICE_METHODS`,
       payload: axios.post(
         API_URL + "/api/product/store-invoice-type-add-update/",
         params,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
