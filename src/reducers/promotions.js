export default function promotions_reducer(
  state = {
    avail_promotions_report: {},
    promotion_details: {},
    promotion_response:{}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {
    case "AVAILABLE_PROMOTIONS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        avail_promotions_report: {}
      };
    case "AVAILABLE_PROMOTIONS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        avail_promotions_report: action.payload.data
      };
    case "AVAILABLE_PROMOTIONS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "PROMOTION_DETAILS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        promotion_details: {}
      };
    case "PROMOTION_DETAILS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        promotion_details: action.payload.data
      };
    case "PROMOTION_DETAILS_REJECTED":
      return { ...state, isLoading: false, error: _error };

      case "SUBMIT_PROMOTION_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        promotion_response: {}
      };
    case "SUBMIT_PROMOTION_FULFILLED":
      return {
        ...state,
        isLoading: false,
        promotion_response: action.payload.data
      };
    case "SUBMIT_PROMOTION_REJECTED":
      return { ...state, isLoading: false, error: _error };
    default:
  }

  return state;
}
