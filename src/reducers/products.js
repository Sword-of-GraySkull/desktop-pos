export default function product_reducer(
  state = {
    token: null,
    error: null,
    isLoading: false,
    product_list: {},
    product_list_unpublished: {},
    tax_data: {},
    hsn_data: {},
    add_response: {},
    update_response: {},
    uploaded_image: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {
    case "GET_PRODUCTS_PENDING":
      return { ...state, isLoading: true, error: null, product_list: {} };
    case "GET_PRODUCTS_FULFILLED":
      return { ...state, isLoading: false, product_list: action.payload.data };
    case "GET_PRODUCTS_REJECTED":
      return { ...state, isLoading: false, error: _error };

      case "GET_PRODUCTS_UNPUBLISHED_PENDING":
        return { ...state, isLoading: true, error: null, product_list_unpublished: {} };
      case "GET_PRODUCTS_UNPUBLISHED_FULFILLED":
        return { ...state, isLoading: false, product_list_unpublished: action.payload.data };
      case "GET_PRODUCTS_UNPUBLISHED_REJECTED":
        return { ...state, isLoading: false, error: _error };

    case "ADD_PRODUCT_PENDING":
      return { ...state, isLoading: true, error: null, add_response: {} };
    case "ADD_PRODUCT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        add_response: action.payload.data
      };
    case "ADD_PRODUCT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "UPDATE_PRODUCT_PENDING":
      return { ...state, isLoading: true, error: null, update_response: {} };
    case "UPDATE_PRODUCT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        update_response: action.payload.data
      };
    case "UPDATE_PRODUCT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "UPLOAD_IMAGE_PENDING":
      return { ...state, isLoading: true, error: null, uploaded_image: {} };
    case "UPLOAD_IMAGE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        uploaded_image: action.payload.data
      };
    case "UPLOAD_IMAGE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_PRODUCT_TYPE_PENDING":
      return { ...state, isLoading: true, error: null, product_type: {} };
    case "GET_PRODUCT_TYPE_FULFILLED":
      return { ...state, isLoading: false, product_type: action.payload.data };
    case "GET_PRODUCT_TYPE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_TAX_PENDING":
      return { ...state, isLoading: true, error: null, tax_data: {} };
    case "GET_TAX_FULFILLED":
      return { ...state, isLoading: false, tax_data: action.payload.data };
    case "GET_TAX_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "GET_HSN_PENDING":
      return { ...state, isLoading: true, error: null, hsn_data: {} };
    case "GET_HSN_FULFILLED":
      return { ...state, isLoading: false, hsn_data: action.payload.data };
    case "GET_HSN_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
