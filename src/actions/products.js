// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";
export function getProducts(params) {
  if (params.last_update) {
    // let data = {
    //   type: "get",
    //   url: `${API_URL}/api/v2/product/mobile-new/?page=${params.page}&is_published=${params.is_published}&last_update=${params.last_update}&store_id=${params.store_id}`,
    //   headers: {
    //     headers: {
    //       Authorization: "Token " + localStorage.getItem("token")
    //     }
    //   }
    // };
  
    // var final_data = jwt.sign(data, "qwertyuiop");
    return {
      type: `GET_PRODUCTS`,
         payload: axios.get(
           `${API_URL}/api/v2/product/mobile-new/?page=${params.page}&is_published=${params.is_published}&last_update=${params.last_update}&store_id=${params.store_id}`,
           {
             headers: {
               Authorization: "Token " + localStorage.getItem("token")
             }
           }
         )
       // payload: axios.post(`${NODE_API_URL}`, final_data)
    };
  } else {
    // let data = {
    //   type: "get",
    //   url: `${API_URL}/api/v2/product/mobile-new/?page=${params.page}&is_published=${params.is_published}&store_id=${params.store_id}`,
    //   headers: {
    //     headers: {
    //       Authorization: "Token " + localStorage.getItem("token")
    //     }
    //   }
    // };
  
    // var final_data = jwt.sign(data, "qwertyuiop");
    return {
      type: `GET_PRODUCTS`,
         payload: axios.get(
           `${API_URL}/api/v2/product/mobile-new/?page=${params.page}&is_published=${params.is_published}&store_id=${params.store_id}`,
           {
             headers: {
               Authorization: "Token " + localStorage.getItem("token")
             }
           }
         )
       // payload: axios.post(`${NODE_API_URL}`, final_data)
    };
  }
}

export function getUnpublishedProducts(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/v2/product/desktop/?page=${params.page}&is_published=${params.is_published}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
    return {
      type: `GET_PRODUCTS_UNPUBLISHED`,
         payload: axios.get(
           `${API_URL}/api/v2/product/desktop/?page=${params.page}&is_published=${params.is_published}`,
           {
             headers: {
               Authorization: "Token " + localStorage.getItem("token")
             }
           }
         )
       // payload: axios.post(`${NODE_API_URL}`, final_data)
    };
}
  //  api/v2/product/mobile-new
export function addProduct(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/v2/product/add-product/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ADD_PRODUCT`,
       payload: axios.post(`${API_URL}/api/v2/product/add-product/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
export function updateProduct(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/v2/product/update-product/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `UPDATE_PRODUCT`,
       payload: axios.post(`${API_URL}/api/v2/product/update-product/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function uploadImage(params) {
  // let data = {
  //   type: "post",
  //   url: `${API_URL}/api/product/update-others/`,
  //   params: params,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `UPLOAD_IMAGE`,
       payload: axios.post(`${API_URL}/api/product/update-others/`, params, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
export function getProductType(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/get-product-type/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_PRODUCT_TYPE`,
       payload: axios.get(
         `${API_URL}/api/product/get-product-type/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getTax() {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/tax/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_TAX`,
       payload: axios.get(`${API_URL}/api/product/tax/`, {
         headers: {
           Authorization: "Token " + localStorage.getItem("token")
         }
       })
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function getHSN(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/hsn/?search=${params.search_product}&hsn_code=${params.hsn_code}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `GET_HSN`,
       payload: axios.get(
         `${API_URL}/api/product/hsn/?search=${params.search_product}&hsn_code=${params.hsn_code}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
