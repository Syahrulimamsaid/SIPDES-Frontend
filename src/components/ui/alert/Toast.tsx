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
  const isDark =
    typeof window !== "undefined" &&
    (document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark");

  const toastOptions = {
    icon,
    duration,
    position,
    ...(isDark
      ? {
          style: {
            borderRadius: "12px",
            background: "#1e293b", // slate-800
            color: "#f8fafc", // slate-50
            border: "1px solid #334155", // slate-700
          },
        }
      : {}),
  };

  switch (variant) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast(message, { ...toastOptions, icon: icon || "⚠️" });
      break;
    case "info":
      toast(message, { ...toastOptions, icon: icon || "ℹ️" });
      break;
  }
};
