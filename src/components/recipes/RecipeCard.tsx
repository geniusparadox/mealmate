"use client";

import Link from "next/link";
import { Recipe, CUISINE_INFO } from "@/types/recipe";
import { Card } from "@/components/ui/Card";
import { DietBadge, SpiceBadge, Badge, CuisineBadge } from "@/components/ui/Badge";
import { Clock, Users, ChefHat, Zap, Utensils, ArrowRight } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  showCuisine?: boolean;
  variant?: "default" | "compact" | "featured";
}

export const RecipeCard = ({ recipe, showCuisine = true, variant = "default" }: RecipeCardProps) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const cuisineInfo = CUISINE_INFO[recipe.cuisine];

  if (variant === "featured") {
    return (
      <Link href={`/recipes/${recipe.id}`} className="block group">
        <Card hoverable clickable className="h-full overflow-hidden" glow="terracotta">
          {/* Image/Gradient Header - larger for featured */}
          <div
            className="h-48 sm:h-56 relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${cuisineInfo?.color || "#C4704B"}, ${cuisineInfo?.color || "#C4704B"}dd)`,
            }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 pattern-food" />
            </div>

            {/* Quick badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {recipe.isQuickMeal && (
                <Badge variant="success" size="sm" className="backdrop-blur-sm bg-emerald-500/90 border-0">
                  <Zap className="w-3 h-3" />
                  Quick
                </Badge>
              )}
              {recipe.isOnePot && (
                <Badge variant="default" size="sm" className="backdrop-blur-sm bg-white/90 text-[var(--foreground)]">
                  <Utensils className="w-3 h-3" />
                  One-Pot
                </Badge>
              )}
            </div>

            {/* Diet badge */}
            <div className="absolute top-3 right-3">
              <DietBadge type={recipe.dietType} size="sm" />
            </div>

            {/* Recipe icon with animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                <ChefHat className="w-10 h-10 text-white/60" />
              </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Title */}
            <h3 className="font-bold text-lg text-[var(--foreground)] line-clamp-1 mb-1 group-hover:text-[var(--accent-primary)] transition-colors">
              {recipe.name}
            </h3>
            {recipe.nameLocal && (
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-1 italic">
                {recipe.nameLocal}
              </p>
            )}

            {/* Description */}
            <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mt-3 mb-4">
              {recipe.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--background-secondary)]">
                <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                {totalTime} min
              </span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--background-secondary)]">
                <Users className="w-4 h-4 text-[var(--accent-secondary)]" />
                {recipe.servings} servings
              </span>
              <SpiceBadge level={recipe.spiceLevel} size="sm" showLabel={false} />
            </div>

            {/* Cuisine tag */}
            {showCuisine && cuisineInfo && (
              <div className="mt-4 pt-4 border-t border-[var(--color-light-gray)]/50 flex items-center justify-between">
                <CuisineBadge cuisine={cuisineInfo.name} color={cuisineInfo.color} size="sm" />
                <span className="text-sm text-[var(--accent-primary)] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View recipe
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            )}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="block group">
      <Card hoverable clickable className="h-full overflow-hidden">
        {/* Image/Gradient Header */}
        <div
          className="h-32 sm:h-40 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${cuisineInfo?.color || "#C4704B"}, ${cuisineInfo?.color || "#C4704B"}cc)`,
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white" />
            <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white" />
          </div>

          {/* Quick badges */}
          <div className="absolute top-2.5 left-2.5 flex gap-1.5">
            {recipe.isQuickMeal && (
              <Badge variant="success" size="xs" className="backdrop-blur-sm bg-emerald-500/90 border-0">
                <Zap className="w-2.5 h-2.5" />
                Quick
              </Badge>
            )}
            {recipe.isOnePot && (
              <Badge variant="default" size="xs" className="backdrop-blur-sm bg-white/90 text-[var(--foreground)]">
                One-Pot
              </Badge>
            )}
          </div>

          {/* Diet badge */}
          <div className="absolute top-2.5 right-2.5">
            <DietBadge type={recipe.dietType} size="xs" />
          </div>

          {/* Recipe icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-7 h-7 text-white/50" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-[var(--foreground)] line-clamp-1 mb-0.5 group-hover:text-[var(--accent-primary)] transition-colors">
            {recipe.name}
          </h3>
          {recipe.nameLocal && (
            <p className="text-xs text-[var(--foreground-muted)] line-clamp-1 italic">
              {recipe.nameLocal}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mt-2 mb-3">
            {recipe.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              {totalTime}m
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-light-gray)]" />
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
              {recipe.servings}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-light-gray)]" />
            <SpiceBadge level={recipe.spiceLevel} size="xs" showLabel={false} />
          </div>

          {/* Cuisine tag */}
          {showCuisine && cuisineInfo && (
            <div className="mt-3 pt-3 border-t border-[var(--color-light-gray)]/50">
              <CuisineBadge cuisine={cuisineInfo.name} color={cuisineInfo.color} size="xs" />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

// Compact version for lists
interface RecipeListItemProps {
  recipe: Recipe;
  onClick?: () => void;
}

export const RecipeListItem = ({ recipe, onClick }: RecipeListItemProps) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const cuisineInfo = CUISINE_INFO[recipe.cuisine];

  const content = (
    <Card hoverable clickable className="flex items-center gap-4 p-4 group">
      {/* Color indicator with icon */}
      <div
        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform"
        style={{ backgroundColor: `${cuisineInfo?.color || "#C4704B"}20` }}
      >
        <ChefHat
          className="w-6 h-6"
          style={{ color: cuisineInfo?.color || "#C4704B" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-[var(--foreground)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
            {recipe.name}
          </h4>
          <DietBadge type={recipe.dietType} size="xs" />
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-[var(--foreground-muted)]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {totalTime}m
          </span>
          <span className="hidden sm:inline">{cuisineInfo?.name}</span>
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
      </div>

      {/* Spice level & Arrow */}
      <div className="flex items-center gap-3">
        <SpiceBadge level={recipe.spiceLevel} size="xs" showLabel={false} />
        <ArrowRight className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
      </div>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick} className="cursor-pointer">{content}</div>;
  }

  return <Link href={`/recipes/${recipe.id}`}>{content}</Link>;
};

export default RecipeCard;
