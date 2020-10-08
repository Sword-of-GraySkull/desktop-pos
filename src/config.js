// export const API_URL = "http://13.127.107.19";
// export const API_URL = "https://testing.pogo91.com";
export const API_URL = "https://app.pogo91.com";
// export const API_URL = "http://ec2-13-126-54-21.ap-south-1.compute.amazonaws.com/";
export const NODE_API_URL = "https://bill.pogo91.com/api/";
const token = localStorage.getItem("token");

let axios_config = {};

// if (token && token !== undefined && token !== null && token !== "null") {
  axios_config = {
    headers: {
      Authorization: "Token " + token
    }
  };
// }
// 
export const axiosConfig = axios_config;
