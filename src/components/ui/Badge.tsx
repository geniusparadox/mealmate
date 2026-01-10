"use client";

import { HTMLAttributes, forwardRef } from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "veg"
  | "non-veg"
  | "egg";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  primary: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  secondary: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  danger: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  veg: "bg-green-100 text-green-700 border border-green-500",
  "non-veg": "bg-red-100 text-red-700 border border-red-500",
  egg: "bg-yellow-100 text-yellow-700 border border-yellow-500",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-gray-500",
  primary: "bg-orange-500",
  secondary: "bg-green-500",
  success: "bg-emerald-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  veg: "bg-green-500",
  "non-veg": "bg-red-500",
  egg: "bg-yellow-500",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "default",
      size = "md",
      dot = false,
      removable = false,
      onRemove,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
          />
        )}
        {children}
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = "Badge";

// Diet type badge component
interface DietBadgeProps {
  type: "veg" | "non-veg" | "egg";
  size?: BadgeSize;
}

export const DietBadge = ({ type, size = "sm" }: DietBadgeProps) => {
  const labels = {
    veg: "Veg",
    "non-veg": "Non-Veg",
    egg: "Egg",
  };

  return (
    <Badge variant={type} size={size}>
      <span
        className={`w-2 h-2 rounded-sm border ${
          type === "veg"
            ? "border-green-600 bg-green-600"
            : type === "non-veg"
            ? "border-red-600 bg-red-600"
            : "border-yellow-600 bg-yellow-600"
        }`}
      />
      {labels[type]}
    </Badge>
  );
};

// Spice level badge
interface SpiceBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: BadgeSize;
}

export const SpiceBadge = ({ level, size = "sm" }: SpiceBadgeProps) => {
  const labels = ["Mild", "Light", "Medium", "Hot", "Very Hot"];
  const colors = [
    "bg-green-100 text-green-700",
    "bg-lime-100 text-lime-700",
    "bg-yellow-100 text-yellow-700",
    "bg-orange-100 text-orange-700",
    "bg-red-100 text-red-700",
  ];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full ${colors[level - 1]} ${sizeStyles[size]}`}
    >
      {"🌶️".repeat(level)}
      <span className="ml-0.5">{labels[level - 1]}</span>
    </span>
  );
};

export default Badge;
