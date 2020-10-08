// import { API_URL, NODE_API_URL } from "../config";
import { API_URL } from "../config";
import axios from "axios";
// import jwt from "jsonwebtoken";



export function allHomeReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/reports/home/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ALL_HOME_REPORT`,
       payload: axios.get(
         `${API_URL}/api/reports/home/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}




export function salesReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/reports/sales-report-details/?start_date=${params.start_date}&end_date=${params.end_date}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `SALES_REPORT`,
       payload: axios.get(
         `${API_URL}/api/reports/sales-report-details/?start_date=${params.start_date}&end_date=${params.end_date}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function inventoryReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-inventory-report-dashboard/`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `INVENTORY_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-inventory-report-dashboard/`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function topSellingReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-inventory-report-product-sell-quantity-new/?page=${params.page}&start_date=${params.start_date}&end_date=${params.end_date}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `TOP_SELLING_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-inventory-report-product-sell-quantity-new/?page=${params.page}&start_date=${params.start_date}&end_date=${params.end_date}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function outOfStockReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-inventory-report-stock-out/?page=${params.page}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `OUT_OF_STOCK_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-inventory-report-stock-out/?page=${params.page}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function addedCustomerReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-customer-report-dashboard/?customers_added_days=${params.added_days}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `ADDED_CUSTOMER_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-customer-report-dashboard/?customers_added_days=${params.added_days}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function notVisitedCustomerReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-customer-report-active-inactive-since/?page=${params.page}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `NOT_VISITED_CUSTOMER_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-customer-report-active-inactive-since/?page=${params.page}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}

export function topSpenderCustomerReport(params) {
  // let data = {
  //   type: "get",
  //   url: `${API_URL}/api/product/store-customer-report-top-spenders/?page=${params.page}&days=${params.days}`,
  //   headers: {
  //     headers: {
  //       Authorization: "Token " + localStorage.getItem("token")
  //     }
  //   }
  // };

  // var final_data = jwt.sign(data, "qwertyuiop");
  return {
    type: `TOP_SPENDER_CUSTOMER_REPORT`,
       payload: axios.get(
         `${API_URL}/api/product/store-customer-report-top-spenders/?page=${params.page}&days=${params.days}`,
         {
           headers: {
             Authorization: "Token " + localStorage.getItem("token")
           }
         }
       )
     // payload: axios.post(`${NODE_API_URL}`, final_data)
  };
}
