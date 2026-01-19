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
  | "egg"
  | "terracotta"
  | "sage"
  | "amber";

type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  glow?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-light-gray)] text-[var(--foreground-muted)]",
  primary: "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]",
  secondary: "bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]",
  terracotta: "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30",
  sage: "bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/30",
  amber: "bg-[var(--accent-tertiary)]/15 text-[var(--accent-tertiary)] border border-[var(--accent-tertiary)]/30",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  danger: "bg-red-500/15 text-red-600 dark:text-red-400",
  veg: "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/40",
  "non-veg": "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/40",
  egg: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/40",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[10px]",
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--foreground-muted)]",
  primary: "bg-[var(--accent-primary)]",
  secondary: "bg-[var(--accent-secondary)]",
  terracotta: "bg-[var(--accent-primary)]",
  sage: "bg-[var(--accent-secondary)]",
  amber: "bg-[var(--accent-tertiary)]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
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
      glow = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const glowStyle = glow
      ? variant === "terracotta" || variant === "primary"
        ? "shadow-[0_0_12px_rgba(196,112,75,0.3)]"
        : variant === "sage" || variant === "secondary"
        ? "shadow-[0_0_12px_rgba(135,168,120,0.3)]"
        : variant === "amber"
        ? "shadow-[0_0_12px_rgba(212,168,83,0.3)]"
        : ""
      : "";

    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center gap-1.5
          font-semibold rounded-full
          transition-all duration-200
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glowStyle}
          ${className}
        `}
        {...props}
      >
        {dot && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse-soft`}
          />
        )}
        {children}
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
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

  const iconColors = {
    veg: "border-green-600 bg-green-600",
    "non-veg": "border-red-600 bg-red-600",
    egg: "border-yellow-600 bg-yellow-600",
  };

  return (
    <Badge variant={type} size={size}>
      <span className={`w-2 h-2 rounded-sm border ${iconColors[type]}`} />
      {labels[type]}
    </Badge>
  );
};

// Spice level badge with visual flame indicators
interface SpiceBadgeProps {
  level: 1 | 2 | 3 | 4 | 5;
  size?: BadgeSize;
  showLabel?: boolean;
}

export const SpiceBadge = ({ level, size = "sm", showLabel = true }: SpiceBadgeProps) => {
  const labels = ["Mild", "Light", "Medium", "Hot", "Very Hot"];
  const colors = [
    "bg-green-500/15 text-green-600 dark:text-green-400",
    "bg-lime-500/15 text-lime-600 dark:text-lime-400",
    "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
    "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    "bg-red-500/15 text-red-600 dark:text-red-400",
  ];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${colors[level - 1]} ${sizeStyles[size]}`}
    >
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-[10px] transition-opacity ${
              i < level ? "opacity-100" : "opacity-20"
            }`}
          >
            🔥
          </span>
        ))}
      </span>
      {showLabel && <span>{labels[level - 1]}</span>}
    </span>
  );
};

// Cuisine Badge with color coding
interface CuisineBadgeProps {
  cuisine: string;
  color?: string;
  size?: BadgeSize;
}

export const CuisineBadge = ({ cuisine, color = "#C4704B", size = "sm" }: CuisineBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${sizeStyles[size]}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}40`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {cuisine}
    </span>
  );
};

// Time Badge
interface TimeBadgeProps {
  minutes: number;
  size?: BadgeSize;
}

export const TimeBadge = ({ minutes, size = "sm" }: TimeBadgeProps) => {
  const variant = minutes <= 15 ? "success" : minutes <= 30 ? "warning" : "default";

  return (
    <Badge variant={variant} size={size}>
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
      {minutes} min
    </Badge>
  );
};

export default Badge;
