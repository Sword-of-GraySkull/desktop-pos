import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();
var toastId = "";
export const toaster = (type, msg) => {
  if (!toast.isActive(toastId)) {
    switch (type) {
      case "success":
        return (toastId = toast.success(msg));

      case "error":
        return (toastId = toast.error(msg));

      case "warning":
        return (toastId = toast.warning(msg));

      default:
    }
  }
};
