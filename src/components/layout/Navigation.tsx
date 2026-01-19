"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  UtensilsCrossed,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Decide", icon: ChefHat },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed },
  { href: "/meal-plan", label: "Plan", icon: Calendar },
  { href: "/nutrition", label: "Nutrition", icon: BarChart3 },
  { href: "/preferences", label: "Settings", icon: Settings },
];

// Bottom navigation for mobile devices
export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--color-light-gray)]/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                transition-all duration-300 min-w-[60px]
                ${
                  isActive
                    ? "text-[var(--accent-primary)]"
                    : "text-[var(--foreground-muted)]"
                }
              `}
            >
              <div
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isActive
                    ? "bg-[var(--accent-primary)]/15 scale-110"
                    : "hover:bg-[var(--color-light-gray)]/50"
                  }
                `}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-105" : ""}`} />
              </div>
              <span className={`text-xs font-semibold transition-colors ${isActive ? "" : "opacity-70"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// Breadcrumb Navigation
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-[var(--color-light-gray)]">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[var(--accent-primary)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--foreground)] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default BottomNavigation;
