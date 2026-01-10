"use client";

import Link from "next/link";
import { Recipe, CUISINE_INFO } from "@/types/recipe";
import { Card } from "@/components/ui/Card";
import { DietBadge, SpiceBadge, Badge } from "@/components/ui/Badge";
import { Clock, Users, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  showCuisine?: boolean;
}

export const RecipeCard = ({ recipe, showCuisine = true }: RecipeCardProps) => {
  const totalTime = recipe.prepTime + recipe.cookTime;
  const cuisineInfo = CUISINE_INFO[recipe.cuisine];

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card hoverable clickable className="h-full">
        {/* Image/Gradient Header */}
        <div
          className="h-32 sm:h-40 relative"
          style={{
            background: `linear-gradient(135deg, ${cuisineInfo?.color || "#f97316"}, ${cuisineInfo?.color || "#f97316"}99)`,
          }}
        >
          {/* Quick badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {recipe.isQuickMeal && (
              <Badge variant="success" size="sm">
                Quick
              </Badge>
            )}
            {recipe.isOnePot && (
              <Badge variant="default" size="sm">
                One-Pot
              </Badge>
            )}
          </div>

          {/* Diet badge */}
          <div className="absolute top-2 right-2">
            <DietBadge type={recipe.dietType} size="sm" />
          </div>

          {/* Recipe icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-white/30" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
            {recipe.name}
          </h3>
          {recipe.nameLocal && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {recipe.nameLocal}
            </p>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2 mb-3">
            {recipe.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings}
            </span>
            <SpiceBadge level={recipe.spiceLevel} size="sm" />
          </div>

          {/* Cuisine tag */}
          {showCuisine && cuisineInfo && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Badge variant="primary" size="sm">
                {cuisineInfo.name}
              </Badge>
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
    <Card hoverable clickable className="flex items-center gap-4 p-3">
      {/* Color indicator */}
      <div
        className="w-2 h-16 rounded-full flex-shrink-0"
        style={{ backgroundColor: cuisineInfo?.color || "#f97316" }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {recipe.name}
          </h4>
          <DietBadge type={recipe.dietType} size="sm" />
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span>{cuisineInfo?.name}</span>
          <span>{totalTime} min</span>
          <span>{recipe.difficulty}</span>
        </div>
      </div>

      {/* Spice level */}
      <SpiceBadge level={recipe.spiceLevel} size="sm" />
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={`/recipes/${recipe.id}`}>{content}</Link>;
};

export default RecipeCard;
