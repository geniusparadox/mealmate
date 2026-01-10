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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                transition-all duration-200 min-w-[60px]
                ${
                  isActive
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-500 dark:text-gray-400"
                }
              `}
            >
              <div
                className={`
                  p-1.5 rounded-lg transition-colors
                  ${isActive ? "bg-orange-100 dark:bg-orange-900/30" : ""}
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
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
    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default BottomNavigation;
