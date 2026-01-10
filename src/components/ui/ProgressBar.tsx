"use client";

import { HTMLAttributes, forwardRef } from "react";

type ProgressVariant = "default" | "success" | "warning" | "danger" | "gradient";
type ProgressSize = "sm" | "md" | "lg";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  labelPosition?: "inside" | "outside" | "top";
  animated?: boolean;
}

const variantStyles: Record<ProgressVariant, string> = {
  default: "bg-orange-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  gradient: "bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500",
};

const sizeStyles: Record<ProgressSize, { bar: string; label: string }> = {
  sm: { bar: "h-1.5", label: "text-xs" },
  md: { bar: "h-2.5", label: "text-sm" },
  lg: { bar: "h-4", label: "text-base" },
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      variant = "default",
      size = "md",
      showLabel = false,
      labelPosition = "outside",
      animated = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    // Auto-determine variant based on percentage if using default
    const effectiveVariant =
      variant === "default"
        ? percentage > 100
          ? "danger"
          : percentage >= 80
          ? "success"
          : percentage >= 50
          ? "warning"
          : "default"
        : variant;

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {showLabel && labelPosition === "top" && (
          <div className="flex justify-between mb-1">
            <span className={`${sizeStyles[size].label} text-gray-600 dark:text-gray-400`}>
              Progress
            </span>
            <span className={`${sizeStyles[size].label} font-medium text-gray-900 dark:text-white`}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        <div className="relative">
          <div
            className={`w-full ${sizeStyles[size].bar} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}
          >
            <div
              className={`
                ${sizeStyles[size].bar}
                ${variantStyles[effectiveVariant]}
                rounded-full transition-all duration-500 ease-out
                ${animated ? "animate-pulse" : ""}
              `}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          {showLabel && labelPosition === "inside" && size === "lg" && (
            <span
              className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference"
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {showLabel && labelPosition === "outside" && (
          <span
            className={`${sizeStyles[size].label} mt-1 block text-right font-medium text-gray-700 dark:text-gray-300`}
          >
            {value} / {max}
          </span>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

// Circular Progress
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  label?: React.ReactNode;
}

export const CircularProgress = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = "default",
  showLabel = true,
  label,
}: CircularProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const strokeColors: Record<ProgressVariant, string> = {
    default: "#f97316",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
    gradient: "#f97316",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
          {label && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
