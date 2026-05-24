import toast from "react-hot-toast";

export class ToastHelper {
  static successToast(message: string) {
    toast.success(message);
  }
  static errorToast(message: string) {
    toast.error(message);
  }
}
