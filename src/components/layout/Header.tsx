"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ChefHat,
  UtensilsCrossed,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Decide", icon: ChefHat, description: "Find your meal" },
  { href: "/recipes", label: "Recipes", icon: UtensilsCrossed, description: "Browse collection" },
  { href: "/meal-plan", label: "Meal Plan", icon: Calendar, description: "Weekly planning" },
  { href: "/nutrition", label: "Nutrition", icon: BarChart3, description: "Track health" },
  { href: "/preferences", label: "Settings", icon: Settings, description: "Your preferences" },
];

export const Header = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`
        sticky top-0 z-40 transition-all duration-300
        ${scrolled
          ? "glass shadow-premium-lg"
          : "bg-[var(--background)]/80 backdrop-blur-sm"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-terracotta rounded-2xl flex items-center justify-center shadow-premium-lg transition-transform duration-300 group-hover:scale-105">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-amber rounded-full flex items-center justify-center animate-pulse-soft">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-[var(--foreground)] tracking-tight">
                Meal<span className="gradient-text">Mate</span>
              </h1>
              <p className="text-xs text-[var(--foreground-muted)] -mt-0.5 font-medium">
                Culinary inspiration awaits
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                    transition-all duration-300 group
                    ${
                      isActive
                        ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--color-light-gray)]/50"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent-primary)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`
              md:hidden p-2.5 rounded-xl transition-all duration-300
              ${mobileMenuOpen
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                : "text-[var(--foreground-muted)] hover:bg-[var(--color-light-gray)]/50"
              }
            `}
          >
            <div className="relative w-6 h-6">
              <X className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} />
              <Menu className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 py-3 space-y-1 bg-[var(--background-secondary)] border-t border-[var(--color-light-gray)]">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium
                  transition-all duration-300 animate-slide-up
                  ${
                    isActive
                      ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                      : "text-[var(--foreground-muted)] hover:bg-[var(--color-light-gray)]/50 hover:text-[var(--foreground)]"
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center
                  ${isActive ? "bg-[var(--accent-primary)]/20" : "bg-[var(--color-light-gray)]/50"}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="block">{item.label}</span>
                  <span className="text-xs text-[var(--foreground-muted)] font-normal">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
