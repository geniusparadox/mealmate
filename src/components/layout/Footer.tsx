"use client";

import { Heart, ChefHat } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="hidden md:block bg-[var(--background-secondary)] border-t border-[var(--color-light-gray)]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-terracotta rounded-xl flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--foreground)]">
              Meal<span className="gradient-text">Mate</span>
            </span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse-soft" />
            <span>for food lovers everywhere</span>
          </div>

          {/* Stats & Copyright */}
          <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
            <span className="hidden lg:inline px-3 py-1 rounded-full bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]">
              175+ recipes
            </span>
            <span className="hidden lg:inline px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
              Indian & World cuisines
            </span>
            <span>&copy; {new Date().getFullYear()} MealMate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
