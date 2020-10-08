export default function settings_reducer(
  state = {
    token: localStorage.getItem("Login")
      ? localStorage.getItem("Login")
      : false,
    error: null,
    isLoading: false,
    billingIsLoading: false,
    store_settings: {},
    image_response: {},
    store_payment: {},
    store_invoice: {},
    customers_list: {},
    customer_response: {},
    edit_customer_response: {},
    get_store_invoice: {},
    invoice_settings_list: {},
    invoice_settings_response: {},
    searched_invoice: {},
    get_store_invoice_detail: {},
    last_invoice: {},
    state_list: {},
    city_list: {},
    generate_billing_response: {},
    edit_store_settings: {},
    payment_response: {},
    invoice_response: {},
    send_invoice_response: {},
    cancel_invoice_response: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };
  switch (action.type) {
    case "STORE_SETTINGS_PENDING":
      return { ...state, isLoading: true, error: null, store_settings: {} };
    case "STORE_SETTINGS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        store_settings: action.payload.data
      };
    case "STORE_SETTINGS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "UPLOAD_STORE_IMAGE_PENDING":
      return { ...state, isLoading: true, error: null, image_response: {} };
    case "UPLOAD_STORE_IMAGE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        image_response: action.payload.data
      };
    case "UPLOAD_STORE_IMAGE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "EDIT_STORE_SETTINGS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        edit_store_settings: {}
      };
    case "EDIT_STORE_SETTINGS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        edit_store_settings: action.payload.data
      };
    case "EDIT_STORE_SETTINGS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "STORE_PAYMENT_MODE_PENDING":
      return { ...state, isLoading: true, error: null, store_payment: {} };
    case "STORE_PAYMENT_MODE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        store_payment: action.payload.data
      };
    case "STORE_PAYMENT_MODE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "STORE_INVOICE_TYPE_PENDING":
      return { ...state, isLoading: true, error: null, store_invoice: {} };
    case "STORE_INVOICE_TYPE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        store_invoice: action.payload.data
      };
    case "STORE_INVOICE_TYPE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "SEARCH_INVOICE_PENDING":
      return { ...state, isLoading: true, error: null, searched_invoice: {} };
    case "SEARCH_INVOICE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        searched_invoice: action.payload.data
      };
    case "SEARCH_INVOICE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_INVOICE_SETTINGS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        invoice_settings_list: {}
      };
    case "GET_INVOICE_SETTINGS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        invoice_settings_list: action.payload.data
      };
    case "GET_INVOICE_SETTINGS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "SAVE_INVOICE_SETTINGS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        invoice_settings_response: {}
      };
    case "SAVE_INVOICE_SETTINGS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        invoice_settings_response: action.payload.data
      };
    case "SAVE_INVOICE_SETTINGS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_INVOICE_PENDING":
      return { ...state, isLoading: true, error: null, get_store_invoice: {} };
    case "GET_INVOICE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        get_store_invoice: action.payload.data
      };
    case "GET_INVOICE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_INVOICE_DEATIL_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        get_store_invoice_detail: {}
      };
    case "GET_INVOICE_DEATIL_FULFILLED":
      return {
        ...state,
        isLoading: false,
        get_store_invoice_detail: action.payload.data
      };
    case "GET_INVOICE_DEATIL_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_LAST_INVOICE_PENDING":
      return { ...state, isLoading: true, error: null, last_invoice: {} };
    case "GET_LAST_INVOICE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        last_invoice: action.payload.data
      };
    case "GET_LAST_INVOICE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "SEND_INVOICE_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        send_invoice_response: {}
      };
    case "SEND_INVOICE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        send_invoice_response: action.payload.data
      };
    case "SEND_INVOICE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "CANCEL_INVOICE_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        cancel_invoice_response: {}
      };
    case "CANCEL_INVOICE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        cancel_invoice_response: action.payload.data
      };
    case "CANCEL_INVOICE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "CUSTOMERS_PENDING":
      return { ...state, isLoading: true, error: null, customers_list: {} };
    case "CUSTOMERS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        customers_list: action.payload.data
      };
    case "CUSTOMERS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ADD_CUSTOMER_PENDING":
      return { ...state, isLoading: true, error: null, customer_response: {} };
    case "ADD_CUSTOMER_FULFILLED":
      return {
        ...state,
        isLoading: false,
        customer_response: action.payload.data
      };
    case "ADD_CUSTOMER_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "UPDATE_CUSTOMER_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        edit_customer_response: {}
      };
    case "UPDATE_CUSTOMER_FULFILLED":
      return {
        ...state,
        isLoading: false,
        edit_customer_response: action.payload.data
      };
    case "UPDATE_CUSTOMER_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "STATE_API_PENDING":
      return { ...state, isLoading: true, error: null, state_list: {} };
    case "STATE_API_FULFILLED":
      return {
        ...state,
        isLoading: false,
        state_list: action.payload.data
      };
    case "STATE_API_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "CITY_API_PENDING":
      return { ...state, isLoading: true, error: null, city_list: {} };
    case "CITY_API_FULFILLED":
      return {
        ...state,
        isLoading: false,
        city_list: action.payload.data
      };
    case "CITY_API_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GENERATE_BILLING_PENDING":
      return {
        ...state,
        billingIsLoading: true,
        error: null,
        generate_billing_response: {}
      };
    case "GENERATE_BILLING_FULFILLED":
      return {
        ...state,
        billingIsLoading: false,
        generate_billing_response: action.payload.data
      };
    case "GENERATE_BILLING_REJECTED":
      return { ...state, billingIsLoading: false, error: _error };

    case "EDIT_PAYMENT_METHODS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        payment_response: {}
      };
    case "EDIT_PAYMENT_METHODS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        payment_response: action.payload.data
      };
    case "EDIT_PAYMENT_METHODS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "EDIT_INVOICE_METHODS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        invoice_response: {}
      };
    case "EDIT_INVOICE_METHODS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        invoice_response: action.payload.data
      };
    case "EDIT_INVOICE_METHODS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
