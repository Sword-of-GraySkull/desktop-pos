export default function common_reducer(
  state = {
    access_permisiion: {},
    generate_bill_data: false,
    credit_data: {},
    charge_details: {},
    coin_history: {},
    coin_response: {},
    add_on_subscription: {},
    active_subscription: {},
    buy_subscription: {}
  },
  action
) {
  let _error = {
    message: "Failed! Please try again Later.",
    status: false
  };

  switch (action.type) {

    case "ACCOUNT_PERMISSION":
      return {
        ...state,
        access_permission: action.payload.data
      };

    case "GENERATE_BILL":
      return {
        ...state,
        generate_bill_data: action.payload.data
      };



    case "CREDITS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        credit_data: {}
      };
    case "CREDITS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        credit_data: action.payload.data
      };
    case "CREDITS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "COINS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        charge_details: {}
      };
    case "COINS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        charge_details: action.payload.data
      };
    case "COINS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "COINS_HISTORY_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        coin_history: {}
      };
    case "COINS_HISTORY_FULFILLED":
      return {
        ...state,
        isLoading: false,
        coin_history: action.payload.data
      };
    case "COINS_HISTORY_REJECTED":
      return { ...state, isLoading: false, error: _error };

      case "ADD_COINS_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        coin_response: {}
      };
    case "ADD_COINS_FULFILLED":
      return {
        ...state,
        isLoading: false,
        coin_response: action.payload.data
      };
    case "ADD_COINS_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ADD_ON_SUBSCRIPTION_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        add_on_subscription: {}
      };
    case "ADD_ON_SUBSCRIPTION_FULFILLED":
      return {
        ...state,
        isLoading: false,
        add_on_subscription: action.payload.data
      };
    case "ADD_ON_SUBSCRIPTION_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "ACTIVE_SUBSCRIPTION_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        active_subscription: {}
      };
    case "ACTIVE_SUBSCRIPTION_FULFILLED":
      return {
        ...state,
        isLoading: false,
        active_subscription: action.payload.data
      };
    case "ACTIVE_SUBSCRIPTION_REJECTED":
      return { ...state, isLoading: false, error: _error };

    case "BUY_PLAN_PENDING":
      return {
        ...state,
        isLoading: true,
        error: null,
        buy_subscription: {}
      };
    case "BUY_PLAN_FULFILLED":
      return {
        ...state,
        isLoading: false,
        buy_subscription: action.payload.data
      };
    case "BUY_PLAN_REJECTED":
      return { ...state, isLoading: false, error: _error };

    default:
  }

  return state;
}
