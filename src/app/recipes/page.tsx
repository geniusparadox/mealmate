"use client";

import { useState, useMemo } from "react";
import { allRecipes } from "@/data/recipes";
import { RecipeCard } from "@/components/recipes";
import { MealFilters } from "@/components/meal-picker";
import { CuisineType, MealType, DietType, CUISINE_INFO } from "@/types/recipe";
import { filterRecipesWithCriteria } from "@/lib/mealSuggestionAlgorithm";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<MealType | "all">("all");
  const [selectedDietType, setSelectedDietType] = useState<DietType | "all">("all");
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>([]);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [spiceLevelMax, setSpiceLevelMax] = useState<number>(5);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return filterRecipesWithCriteria(allRecipes, {
      mealType: selectedMealType,
      dietType: selectedDietType,
      cuisines: selectedCuisines,
      maxCookTime,
      spiceLevelMax,
      searchQuery,
    });
  }, [selectedMealType, selectedDietType, selectedCuisines, maxCookTime, spiceLevelMax, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedMealType("all");
    setSelectedDietType("all");
    setSelectedCuisines([]);
    setMaxCookTime(null);
    setSpiceLevelMax(5);
  };

  // Group recipes by cuisine for the sidebar
  const cuisineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRecipes.forEach((recipe) => {
      counts[recipe.cuisine] = (counts[recipe.cuisine] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Recipe Collection
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore {allRecipes.length} recipes from around the world
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* View toggle and filter button */}
        <div className="flex gap-2">
          <Button
            variant={showFilters ? "primary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>

          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 ${
                viewMode === "grid"
                  ? "bg-orange-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 ${
                viewMode === "list"
                  ? "bg-orange-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <MealFilters
            selectedMealType={selectedMealType}
            selectedDietType={selectedDietType}
            selectedCuisines={selectedCuisines}
            maxCookTime={maxCookTime}
            spiceLevelMax={spiceLevelMax}
            onMealTypeChange={setSelectedMealType}
            onDietTypeChange={setSelectedDietType}
            onCuisinesChange={setSelectedCuisines}
            onMaxCookTimeChange={setMaxCookTime}
            onSpiceLevelChange={setSpiceLevelMax}
            onReset={resetFilters}
          />
        </div>
      )}

      {/* Quick cuisine filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(cuisineCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([cuisine, count]) => (
            <button
              key={cuisine}
              onClick={() => {
                if (selectedCuisines.includes(cuisine as CuisineType)) {
                  setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
                } else {
                  setSelectedCuisines([...selectedCuisines, cuisine as CuisineType]);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCuisines.includes(cuisine as CuisineType)
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {CUISINE_INFO[cuisine as CuisineType]?.name || cuisine} ({count})
            </button>
          ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing {filteredRecipes.length} of {allRecipes.length} recipes
      </p>

      {/* Recipe Grid/List */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No recipes match your filters.
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Clear Filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
