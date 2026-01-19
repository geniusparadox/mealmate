"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled" | "glass";
  hoverable?: boolean;
  clickable?: boolean;
  glow?: "none" | "terracotta" | "sage" | "amber";
}

const variantStyles = {
  default: "bg-[var(--background)] shadow-premium border border-[var(--color-light-gray)]/50",
  elevated: "bg-[var(--background)] shadow-premium-lg border border-[var(--color-light-gray)]/30",
  outlined: "bg-[var(--background)] border-2 border-[var(--color-light-gray)]",
  filled: "bg-[var(--background-secondary)]",
  glass: "glass",
};

const glowStyles = {
  none: "",
  terracotta: "hover:glow-terracotta",
  sage: "hover:glow-sage",
  amber: "hover:glow-amber",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      hoverable = false,
      clickable = false,
      glow = "none",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl overflow-hidden
          ${variantStyles[variant]}
          ${hoverable ? "card-hover" : ""}
          ${clickable ? "cursor-pointer" : ""}
          ${glow !== "none" ? glowStyles[glow] : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card Header
interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, icon, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-5 py-4 border-b border-[var(--color-light-gray)]/50 ${className}`}
        {...props}
      >
        {children || (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="font-semibold text-[var(--foreground)] text-lg">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = "CardHeader";

// Card Body
export const CardBody = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => {
  return (
    <div ref={ref} className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
});

CardBody.displayName = "CardBody";

// Card Footer
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`px-5 py-4 bg-[var(--background-secondary)] border-t border-[var(--color-light-gray)]/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

// Feature Card - for highlighting special content
interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: "terracotta" | "sage" | "amber";
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ children, gradient = "terracotta", className = "", ...props }, ref) => {
    const gradientStyles = {
      terracotta: "bg-gradient-terracotta",
      sage: "bg-gradient-sage",
      amber: "bg-gradient-amber",
    };

    return (
      <div
        ref={ref}
        className={`
          rounded-2xl overflow-hidden text-white
          ${gradientStyles[gradient]}
          shadow-premium-lg
          card-hover
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

export default Card;
