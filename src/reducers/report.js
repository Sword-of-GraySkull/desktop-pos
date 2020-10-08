export default function report_reducer(
  state = {
    all_home_report: [],
    sales_report: [],
    inventory_report: [],
    top_selling_report: {},
    out_stock_report: [],
    added_customer_report: [],
    not_visited_customer_report: [],
    spender_customer_report: []
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {

    case "ALL_HOME_REPORT_PENDING":
      return { ...state, isLoading: true, error: null, all_home_report: [] };
    case "ALL_HOME_REPORT_FULFILLED":
      return { ...state, isLoading: false, all_home_report: action.payload.data };
    case "ALL_HOME_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };


    case "SALES_REPORT_PENDING":
      return { ...state, isLoading: true, error: null, sales_report: [] };
    case "SALES_REPORT_FULFILLED":
      return { ...state, isLoading: false, sales_report: action.payload.data };
    case "SALES_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "INVENTORY_REPORT_PENDING":
      return { ...state, isLoading: true, error: null, inventory_report: [] };
    case "INVENTORY_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        inventory_report: action.payload.data
      };
    case "INVENTORY_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "TOP_SELLING_REPORT_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        top_selling_report: {}
      };
    case "TOP_SELLING_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        top_selling_report: action.payload.data
      };
    case "TOP_SELLING_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

      case "OUT_OF_STOCK_REPORT_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        out_stock_report: []
      };
    case "OUT_OF_STOCK_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        out_stock_report: action.payload.data
      };
    case "OUT_OF_STOCK_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ADDED_CUSTOMER_REPORT_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        added_customer_report: []
      };
    case "ADDED_CUSTOMER_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        added_customer_report: action.payload.data
      };
    case "ADDED_CUSTOMER_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "NOT_VISITED_CUSTOMER_REPORT_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        not_visited_customer_report: []
      };
    case "NOT_VISITED_CUSTOMER_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        not_visited_customer_report: action.payload.data
      };
    case "NOT_VISITED_CUSTOMER_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "TOP_SPENDER_CUSTOMER_REPORT_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        spender_customer_report: []
      };
    case "TOP_SPENDER_CUSTOMER_REPORT_FULFILLED":
      return {
        ...state,
        isLoading: false,
        spender_customer_report: action.payload.data
      };
    case "TOP_SPENDER_CUSTOMER_REPORT_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
