"use client";

import { Recipe } from "@/types/recipe";
import { DietBadge, SpiceBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Clock, Users, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  reasons: string[];
}

interface SmartSuggestionsProps {
  suggestions: ScoredRecipe[];
  onSelect: (recipe: Recipe) => void;
}

export const SmartSuggestions = ({
  suggestions,
  onSelect,
}: SmartSuggestionsProps) => {
  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No suggestions available. Try adjusting your filters!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-orange-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Smart Suggestions
        </h3>
      </div>

      <div className="grid gap-4">
        {suggestions.map(({ recipe, reasons }, index) => (
          <Card
            key={recipe.id}
            hoverable
            clickable
            className="overflow-hidden"
            onClick={() => onSelect(recipe)}
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image placeholder or gradient */}
              <div
                className={`w-full sm:w-32 h-24 sm:h-auto flex-shrink-0 ${
                  index === 0
                    ? "bg-gradient-to-br from-orange-400 to-red-500"
                    : "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"
                } flex items-center justify-center`}
              >
                {index === 0 && (
                  <span className="text-white text-sm font-medium px-2 py-1 bg-black/20 rounded">
                    Top Pick
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {recipe.name}
                    </h4>
                    {recipe.nameLocal && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {recipe.nameLocal}
                      </p>
                    )}

                    {/* Reasons */}
                    {reasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {reasons.map((reason, i) => (
                          <span
                            key={i}
                            className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {recipe.servings} servings
                      </span>
                      <DietBadge type={recipe.dietType} size="sm" />
                      <SpiceBadge level={recipe.spiceLevel} size="sm" />
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link href="/recipes">
          <Button variant="outline">
            Browse All Recipes
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SmartSuggestions;
