"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { allRecipes } from "@/data/recipes";
import { RecipeCard } from "@/components/recipes";
import { MealFilters } from "@/components/meal-picker";
import { CuisineType, MealType, DietType, CUISINE_INFO } from "@/types/recipe";
import { filterRecipesWithCriteria } from "@/lib/mealSuggestionAlgorithm";
import { Search, Grid, List, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";

function RecipesContent() {
  const searchParams = useSearchParams();
  const cuisineFromUrl = searchParams.get("cuisine") as CuisineType | null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<MealType | "all">("all");
  const [selectedDietType, setSelectedDietType] = useState<DietType | "all">("all");
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>(
    cuisineFromUrl ? [cuisineFromUrl] : []
  );
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [spiceLevelMax, setSpiceLevelMax] = useState<number>(5);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  // Handle URL parameter changes
  useEffect(() => {
    if (cuisineFromUrl && !selectedCuisines.includes(cuisineFromUrl)) {
      setSelectedCuisines([cuisineFromUrl]);
    }
  }, [cuisineFromUrl]);

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

  // Get all cuisines sorted by count
  const allCuisinesSorted = useMemo(() => {
    return Object.entries(cuisineCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cuisine]) => cuisine as CuisineType);
  }, [cuisineCounts]);

  // Group cuisines by region for display
  const cuisineGroups = [
    {
      name: "South Indian",
      cuisines: ["karnataka", "tamil", "kerala", "andhra", "telangana"] as CuisineType[],
    },
    {
      name: "North Indian",
      cuisines: ["punjabi", "rajasthani", "gujarati", "maharashtrian", "mughlai", "bengali", "kashmiri", "lucknowi"] as CuisineType[],
    },
    {
      name: "Asian",
      cuisines: ["indo-chinese", "thai", "japanese", "korean", "vietnamese", "chinese", "indonesian", "malaysian"] as CuisineType[],
    },
    {
      name: "European",
      cuisines: ["german", "italian", "spanish", "hungarian", "mediterranean", "continental"] as CuisineType[],
    },
    {
      name: "Americas & Middle East",
      cuisines: ["mexican", "american", "middle-eastern"] as CuisineType[],
    },
    {
      name: "Fusion",
      cuisines: ["indo-french", "indo-spanish", "indo-italian"] as CuisineType[],
    },
  ];

  const toggleCuisine = (cuisine: CuisineType) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
          Recipe Collection
        </h1>
        <p className="text-[var(--foreground-muted)]">
          Explore {allRecipes.length} recipes from around the world
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--background)] border border-[var(--color-light-gray)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--foreground)]"
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

          <div className="flex border border-[var(--color-light-gray)] rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--background)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--accent-primary)] text-white"
                  : "bg-[var(--background)] text-[var(--foreground-muted)] hover:bg-[var(--background-secondary)]"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardBody>
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
          </CardBody>
        </Card>
      )}

      {/* Cuisine filters - All cuisines grouped by region */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--foreground)]">Browse by Cuisine</h3>
            {selectedCuisines.length > 0 && (
              <button
                onClick={() => setSelectedCuisines([])}
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                Clear all ({selectedCuisines.length})
              </button>
            )}
          </div>

          {/* Cuisine groups */}
          <div className="space-y-4">
            {cuisineGroups.map((group) => {
              const availableCuisines = group.cuisines.filter(c => cuisineCounts[c] > 0);
              if (availableCuisines.length === 0) return null;

              return (
                <div key={group.name}>
                  <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                    {group.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableCuisines.map((cuisine) => {
                      const info = CUISINE_INFO[cuisine];
                      const isSelected = selectedCuisines.includes(cuisine);
                      return (
                        <button
                          key={cuisine}
                          onClick={() => toggleCuisine(cuisine)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                            transition-all duration-200 hover:scale-105
                            ${isSelected
                              ? "text-white shadow-premium"
                              : "hover:opacity-80"
                            }
                          `}
                          style={{
                            backgroundColor: isSelected
                              ? info?.color || "#C4704B"
                              : `${info?.color || "#C4704B"}15`,
                            color: isSelected
                              ? "white"
                              : info?.color || "#C4704B",
                            border: `1px solid ${info?.color || "#C4704B"}${isSelected ? "" : "30"}`,
                          }}
                        >
                          {!isSelected && (
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: info?.color || "#C4704B" }}
                            />
                          )}
                          {info?.name || cuisine}
                          <span className={isSelected ? "opacity-80" : "opacity-60"}>
                            ({cuisineCounts[cuisine]})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Results count */}
      <p className="text-sm text-[var(--foreground-muted)] mb-4">
        Showing {filteredRecipes.length} of {allRecipes.length} recipes
        {selectedCuisines.length > 0 && (
          <span className="ml-1">
            in {selectedCuisines.map(c => CUISINE_INFO[c]?.name || c).join(", ")}
          </span>
        )}
      </p>

      {/* Recipe Grid/List */}
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--foreground-muted)] mb-4">
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

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-10 bg-[var(--background-secondary)] rounded-xl w-64 mb-4"></div>
          <div className="h-6 bg-[var(--background-secondary)] rounded-xl w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-[var(--background-secondary)] rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}
