import Dashboard from "../views/Dashboard/Dashboard";
// import Test from "../views/Dashboard/Test";
import Products from "../views/Products/Products";
import EditProducts from "../views/Products/EditProducts";
import AddProducts from "../views/Products/AddProducts";
import SettingsDetails from "../views/StoreSettings/SettingsDetails";
import StoreSettings from "../views/StoreSettings/StoreSettings";
import BillingSettings from "../views/StoreSettings/BillingSettings";
import ProductTypes from "../views/StoreSettings/ProductTypes";
import Payments from "../views/StoreSettings/Payments";
import InvoiceSettings from "../views/StoreSettings/InvoiceSettings";
import MswipeSettings from "../views/StoreSettings/MswipeSettings";
import HardwareSettings from "../views/StoreSettings/HardwareSettings";
import Customers from "../views/Customers/Customers";
import InvoiceHistory from "../views/InvoiceHistory/InvoiceHistory";
import Reports from "../views/Reports/Reports";
import SalesReport from "../views/Reports/SalesReport";
import InventoryReport from "../views/Reports/InventoryReport";
import CustomerReport from "../views/Reports/CustomerReport";
import Inventory from "../views/Inventory/Inventory";
import AddGrn from "../views/Inventory/AddGrn";
import ViewGrn from "../views/Inventory/ViewGrn";
import Wastage from "../views/Inventory/Wastage";
import WastageSecond from "../views/Inventory/WastageSecond";
import SendPromotion from "../views/SendPromotion/SendPromotion";
import Promotions from "../views/SendPromotion/Promotions";
import Support from "../views/Support/Support";
import OnlineStore from "../views/OnlineStore/OnlineStore";
import FAQ from "../views/Support/FAQ";
// import Credits from "../views/Other/Credits";
// import Subscription from "../views/Subscription/Subscription";
// import Coins from "../views/Coins/Coins";

const InnerRoutes = [
  {
    path: "/billing",
    component: Dashboard,
    name: "Create Invoices",
    icon: "billing_icon"
  },

  // {
  //   path: "/test",
  //   component: Test,
  //   name: "test",
  //   icon: "billing_icon"
  // },

  {
    path: "/invoice-history",
    component: InvoiceHistory,
    name: "Invoice History"
  },

  {
    path: "/products",
    component: Products,
    name: "Manage Products"
  },

  {
    path: "/products-add",
    component: AddProducts
  },

  {
    path: "/products-edit",
    component: EditProducts
  },

  {
    path: "/inventory",
    component: Inventory,
    name: "Stock Management"
  },
  {
    path: "/inventory/add-grn",
    component: AddGrn
  },
  {
    path: "/inventory/view-grn",
    component: ViewGrn
  },
  {
    path: "/inventory/wastage",
    component: Wastage
  },
  {
    path: "/inventory/wastage-second",
    component: WastageSecond
  },

  {
    path: "/customers",
    component: Customers,
    name: "Customers"
  },

  {
    path: "/online-store",
    component: OnlineStore,
    name: "Online Store"
  },

  {
    path: "/online-store/order-details",
    component: OrderDetails,
  },

  {
    path: "/send-promotion",
    component: SendPromotion,
    name: "Send Promotions"
  },

  {
    path: "/send-promotion/promotions",
    component: Promotions
  },

  {
    path: "/settings",
    component: SettingsDetails,
    name: "Settings & Details"
  },

  {
    path: "/settings/store-details",
    component: StoreSettings
  },
  {
    path: "/settings/store-billing",
    component: BillingSettings
  },
  {
    path: "/settings/store-product-types",
    component: ProductTypes
  },
  {
    path: "/settings/store-payments",
    component: Payments
  },
  {
    path: "/settings/store-invoice",
    component: InvoiceSettings
  },
  {
    path: "/settings/store-mswipe",
    component: MswipeSettings
  },
  {
    path: "/settings/store-hardware",
    component: HardwareSettings
  },

  {
    path: "/support",
    component: Support,
    name: "Support & Feedback"
  },
  {
    path: "/reports",
    component: Reports,
    name: "Reports"
  },
  {
    path: "/reports/sales-report",
    component: SalesReport
  },
  {
    path: "/reports/report-inventory",
    component: InventoryReport
  },
  {
    path: "/reports/customer-report",
    component: CustomerReport
  },
  // {
  //   path: "/subscription",
  //   component: Subscription,
  //   name: "Subscription"
  // },

  // {
  //   path: "/coins",
  //   component: Coins,
  //   name: "Coins"
  // },

  // {
  //   path: "/credits",
  //   component: Credits,
  //   name: "Credits"
  // },

  {
    path: "/FAQ",
    component: FAQ,
    name: "FAQ"
  },

  { redirect: true, path: "/", to: "/billing" }
];
export default InnerRoutes;
