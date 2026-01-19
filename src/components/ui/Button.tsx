"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "amber";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: "default" | "full";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-terracotta text-white
    shadow-premium hover:shadow-premium-lg
    hover:brightness-110 active:brightness-95
  `,
  secondary: `
    bg-gradient-sage text-white
    shadow-premium hover:shadow-premium-lg
    hover:brightness-110 active:brightness-95
  `,
  amber: `
    bg-gradient-amber text-white
    shadow-premium hover:shadow-premium-lg
    hover:brightness-110 active:brightness-95
  `,
  outline: `
    border-2 border-[var(--accent-primary)] text-[var(--accent-primary)]
    hover:bg-[var(--accent-primary)]/10 active:bg-[var(--accent-primary)]/20
  `,
  ghost: `
    text-[var(--foreground-muted)]
    hover:bg-[var(--color-light-gray)]/50 hover:text-[var(--foreground)]
    active:bg-[var(--color-light-gray)]
  `,
  danger: `
    bg-gradient-to-br from-red-500 to-red-600 text-white
    shadow-premium hover:shadow-premium-lg
    hover:brightness-110 active:brightness-95
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
  xl: "px-8 py-4 text-lg gap-3",
};

const roundedStyles = {
  default: "rounded-xl",
  full: "rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded = "default",
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          font-semibold tracking-wide
          transition-all duration-300 ease-out
          focus:outline-none focus-ring
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${roundedStyles[rounded]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

// Icon Button variant for compact icon-only buttons
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon: React.ReactNode;
  label: string; // For accessibility
}

const iconSizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      isLoading = false,
      icon,
      label,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-label={label}
        className={`
          inline-flex items-center justify-center
          rounded-xl
          transition-all duration-300 ease-out
          focus:outline-none focus-ring
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${iconSizeStyles[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default Button;
