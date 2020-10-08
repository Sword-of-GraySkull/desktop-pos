export default function login_reducer(
  state = {
    token: null,
    error: null,
    isLoading: false,
    login_response: {},
    register_response: {},
    otp_response: {},
    resend_response: {},
    store_list: {},
    term_data: {},
    category_data: {},
    category_product_data: {},
    register_product_response: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };
  switch (action.type) {
    //new login
    case "NEW_LOGIN_OTP_PENDING":
      return { ...state, isLoading: true, error: null, login_response: {} };
    case "NEW_LOGIN_OTP_FULFILLED":
      return {
        ...state,
        isLoading: false,
        login_response: action.payload.data
      };
    case "NEW_LOGIN_OTP_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "NEW_CONFIRM_LOGIN_OTP_PENDING":
      return { ...state, isLoading: true, error: null, otp_response: {} };
    case "NEW_CONFIRM_LOGIN_OTP_FULFILLED":
      return {
        ...state,
        isLoading: false,
        otp_response: action.payload.data
      };
    case "NEW_CONFIRM_LOGIN_OTP_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "LOGIN_USER_PENDING":
      return { ...state, isLoading: true, error: null, login_response: {} };
    case "LOGIN_USER_FULFILLED":
      if (action.payload.data.code === 200) {
        // localStorage.setItem("token", action.payload.data.token);
        // localStorage.setItem("Login", "success");
        // localStorage.setItem(
        //   "store",
        //   action.payload.data && action.payload.data.store_id
        // );
        // localStorage.setItem(
        //   "logged_user",
        //   action.payload.data && action.payload.data.name
        // );
        // localStorage.setItem(
        //   "logged_user_id",
        //   action.payload.data && action.payload.data.user_id
        // );
        // localStorage.setItem(
        //   "store_legal_name",
        //   action.payload.data && action.payload.data.store_legal_name
        // );
      }
      return {
        ...state,
        isLoading: false,
        login_response: action.payload.data
      };
    case "LOGIN_USER_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "REGISTER_USER_PENDING":
      return { ...state, isLoading: true, error: null, register_response: {} };
    case "REGISTER_USER_FULFILLED":
      return {
        ...state,
        isLoading: false,
        register_response: action.payload.data
      };
    case "REGISTER_USER_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ADD_REGISTER_PRODUCT_PENDING":
      return { ...state, isLoading: true, error: null, register_product_response: {} };
    case "ADD_REGISTER_PRODUCT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        register_product_response: action.payload.data
      };
    case "ADD_REGISTER_PRODUCT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_OTP_PENDING":
      return { ...state, isLoading: true, error: null, otp_response: {} };
    case "GET_OTP_FULFILLED":
      return {
        ...state,
        isLoading: false,
        otp_response: action.payload.data
      };
    case "GET_OTP_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "RESEND_OTP_PENDING":
      return { ...state, isLoading: true, error: null, resend_response: {} };
    case "RESEND_OTP_FULFILLED":
      return {
        ...state,
        isLoading: false,
        resend_response: action.payload.data
      };
    case "RESEND_OTP_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_STORE_LIST_PENDING":
      return { ...state, isLoading: true, error: null, store_list: {} };
    case "GET_STORE_LIST_FULFILLED":
      return {
        ...state,
        isLoading: false,
        store_list: action.payload.data
      };
    case "GET_STORE_LIST_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "TERMS_PENDING":
      return { ...state, isLoading: true, error: null, term_data: {} };
    case "TERMS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        term_data: action.payload.data
      };
    case "TERMS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "REGI_CATEGORY_PENDING":
      return { ...state, isLoading: true, error: null, category_data: {} };
    case "REGI_CATEGORY_FULFILLED":
      return {
        ...state,
        isLoading: false,
        category_data: action.payload.data
      };
    case "REGI_CATEGORY_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "CATEGORY_PRO_PENDING":
      return { ...state, isLoading: true, error: null, category_product_data: {} };
    case "CATEGORY_PRO_FULFILLED":
      return {
        ...state,
        isLoading: false,
        category_product_data: action.payload.data
      };
    case "CATEGORY_PRO_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ALL_CATEGORY_PRO_PENDING":
      return { ...state, isLoading: true, error: null, category_product_data: {} };
    case "ALL_CATEGORY_PRO_FULFILLED":
      return {
        ...state,
        isLoading: false,
        category_product_data: action.payload.data
      };
    case "ALL_CATEGORY_PRO_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
