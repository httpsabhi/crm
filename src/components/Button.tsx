import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      className = "",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseClasses = twMerge(
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
      "disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer",
      fullWidth ? "w-full" : "",
      className
    );

    const sizeClasses = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
    }[size];

    const variantClasses = {
      primary:
        "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md",
      secondary:
        "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 shadow-sm hover:shadow-md",
      outline:
        "border border-indigo-300 bg-transparent hover:bg-indigo-50 text-indigo-600",
      ghost: "bg-transparent hover:bg-indigo-50 text-indigo-600",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
    }[variant];

    return (
      <button
        ref={ref}
        className={twMerge(baseClasses, sizeClasses, variantClasses)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;