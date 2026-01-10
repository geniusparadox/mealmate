"use client";

import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "filled";
  hoverable?: boolean;
  clickable?: boolean;
}

const variantStyles = {
  default: "bg-white dark:bg-gray-800 shadow-sm",
  elevated: "bg-white dark:bg-gray-800 shadow-lg",
  outlined: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  filled: "bg-gray-50 dark:bg-gray-900",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      hoverable = false,
      clickable = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-xl overflow-hidden
          ${variantStyles[variant]}
          ${hoverable ? "transition-shadow duration-200 hover:shadow-lg" : ""}
          ${clickable ? "cursor-pointer" : ""}
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
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${className}`}
        {...props}
      >
        {children || (
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
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
    <div ref={ref} className={`p-4 ${className}`} {...props}>
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
      className={`px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export default Card;
