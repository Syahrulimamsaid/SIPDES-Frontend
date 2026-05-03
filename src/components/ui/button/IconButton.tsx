import { ReactNode } from "react";

interface IconButtonProps {
  size?: "sm" | "md";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon: ReactNode;
  ariaLabel?: string;
}

const IconButton = ({
  icon,
  size = "md",
  onClick,
  className = "",
  disabled = false,
  ariaLabel,
}: IconButtonProps) => {
  const sizeClasses = {
    sm: "p-2 text-sm",
    md: "p-2.5 text-base",
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-lg transition
        ${sizeClasses[size]}
        ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"}
        ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
