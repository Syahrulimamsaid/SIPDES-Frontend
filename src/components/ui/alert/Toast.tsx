import toast, { ToastPosition } from "react-hot-toast";

interface ToastProps {
  message: string;
  variant: "success" | "error" | "warning" | "info";
  icon?: string;
  duration?: number;
  position?: ToastPosition;
}

export const Toast = ({
  message,
  variant,
  icon,
  duration = 4000,
  position = "top-right",
}: ToastProps) => {
  switch (variant) {
    case "success":
      toast.success(message, { icon, duration, position });
      break;
    case "error":
      toast.error(message, { icon, duration, position });
      break;
    case "warning":
      toast(message, { icon: icon || "⚠️", duration, position });
      break;
    case "info":
      toast(message, { icon: icon || "ℹ️", duration, position });
      break;
  }
};
