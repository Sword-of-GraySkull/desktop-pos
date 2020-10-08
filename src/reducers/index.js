/****
- Defines Root Reducer for App
- Combines all the reducer and export as a single reducer
*/

import { combineReducers } from "redux";

import login_reducer from "./login";
import product_reducer from "./products";
import settings_reducer from "./settings";
import report_reducer from "./report";
import inventory_reducer from "./inventory";
import promotions_reducer from "./promotions";
import support_reducer from "./support";
import common_reducer from "./common";

export default combineReducers({
  login: login_reducer,
  products: product_reducer,
  settings: settings_reducer,
  report: report_reducer,
  inventory: inventory_reducer,
  promotions: promotions_reducer,
  support: support_reducer,
  common: common_reducer
});
