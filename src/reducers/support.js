export default function support_reducer(
  state = {
    faq_list: {},
    query_response: {},
    comm_num_response: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {
    case "GET_FAQ_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        faq_list: {}
      };
    case "GET_FAQ_FULFILLED":
      return {
        ...state,
        isLoading: false,
        faq_list: action.payload.data
      };
    case "GET_FAQ_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "COMM_NUMBER_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        comm_num_response: {}
      };
    case "COMM_NUMBER_FULFILLED":
      return {
        ...state,
        isLoading: false,
        comm_num_response: action.payload.data
      };
    case "COMM_NUMBER_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "SUBMIT_QUERY_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        query_response: {}
      };
    case "SUBMIT_QUERY_FULFILLED":
      return {
        ...state,
        isLoading: false,
        query_response: action.payload.data
      };
    case "SUBMIT_QUERY_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
