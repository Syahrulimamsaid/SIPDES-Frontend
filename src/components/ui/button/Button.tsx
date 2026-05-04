import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline" | "success"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  type?: "button" | "submit" | "reset";
}
const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}) => {
  const sizeClasses = {
    sm: "px-4 py-2.5 text-sm",
    md: "px-5 py-3 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-md hover:bg-brand-600 hover:shadow-lg active:scale-[0.98] disabled:bg-brand-300",
    success:
      "bg-green-500 text-white shadow-md hover:bg-green-600 hover:shadow-lg active:scale-[0.98] disabled:bg-green-300",
    outline:
      "bg-white text-gray-700 border border-brand-500 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl   /* lebih cocok dengan card (2xl feel) */
        font-medium
        transition-all duration-200 ease-in-out
        transform
        focus:outline-none focus:ring-2 focus:ring-[#90E0EF] focus:ring-offset-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed opacity-50 hover:scale-100" : "hover:-translate-y-px"}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};



export default Button;
