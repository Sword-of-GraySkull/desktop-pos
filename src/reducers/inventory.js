export default function inventory_reducer(
  state = {
    view_grn_list: [],
    view_grn: [],
    wastage_response: {},
    grn_response: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {
    case "VIEW_GRN_PENDING":
      return { ...state, isLoading: true, error: null, view_grn_list: [] };
    case "VIEW_GRN_FULFILLED":
      return { ...state, isLoading: false, view_grn_list: action.payload.data };
    case "VIEW_GRN_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "VIEW_SPECIFIC_GRN_PENDING":
      return { ...state, isLoading: true, error: null, view_grn: [] };
    case "VIEW_SPECIFIC_GRN_FULFILLED":
      return { ...state, isLoading: false, view_grn: action.payload.data };
    case "VIEW_SPECIFIC_GRN_REJECTED":
      return { ...state, isLoading: false, error: _error };

      case "CREATE_GRN_PENDING":
      return { ...state, isLoading: true, error: null, grn_response: {} };
    case "CREATE_GRN_FULFILLED":
      return { ...state, isLoading: false, grn_response: action.payload.data };
    case "CREATE_GRN_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "WASTAGE_PENDING":
      return { ...state, isLoading: true, error: null, wastage_response: {} };
    case "WASTAGE_FULFILLED":
      return {
        ...state,
        isLoading: false,
        wastage_response: action.payload.data
      };
    case "WASTAGE_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
