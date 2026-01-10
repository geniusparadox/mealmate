"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Recipe, CuisineType, MealType, DietType } from "@/types/recipe";
import { allRecipes } from "@/data/recipes";
import { SpinnerWheel, MealFilters, SmartSuggestions, IngredientSelector } from "@/components/meal-picker";
import { SimpleTabs } from "@/components/ui/Tabs";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  filterRecipesWithCriteria,
  getSmartSuggestions,
  filterByAvailableIngredients,
} from "@/lib/mealSuggestionAlgorithm";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import {
  Shuffle,
  Sparkles,
  ChefHat,
  UtensilsCrossed,
  Refrigerator,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    availableIngredients,
    addAvailableIngredient,
    removeAvailableIngredient,
    clearAvailableIngredients,
    isLoaded,
  } = useUserPreferences();

  // Filter state
  const [selectedMealType, setSelectedMealType] = useState<MealType | "all">("all");
  const [selectedDietType, setSelectedDietType] = useState<DietType | "all">("all");
  const [selectedCuisines, setSelectedCuisines] = useState<CuisineType[]>([]);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [spiceLevelMax, setSpiceLevelMax] = useState<number>(5);

  // Ingredient section state
  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [filterByIngredients, setFilterByIngredients] = useState(true);
  const [ingredientInput, setIngredientInput] = useState("");

  // Filter recipes based on criteria
  const baseFilteredRecipes = useMemo(() => {
    return filterRecipesWithCriteria(allRecipes, {
      mealType: selectedMealType,
      dietType: selectedDietType,
      cuisines: selectedCuisines,
      maxCookTime,
      spiceLevelMax,
    });
  }, [selectedMealType, selectedDietType, selectedCuisines, maxCookTime, spiceLevelMax]);

  // Apply ingredient filter separately
  const ingredientFilteredRecipes = useMemo(() => {
    if (!filterByIngredients || availableIngredients.length === 0) {
      return baseFilteredRecipes;
    }
    return filterByAvailableIngredients(baseFilteredRecipes, availableIngredients, 0.3);
  }, [baseFilteredRecipes, filterByIngredients, availableIngredients]);

  // Use ingredient filtered if it has results, otherwise fall back to base
  const filteredRecipes = ingredientFilteredRecipes.length > 0
    ? ingredientFilteredRecipes
    : baseFilteredRecipes;

  // Check if ingredient filter found matches
  const ingredientFilterHasMatches = ingredientFilteredRecipes.length > 0 || availableIngredients.length === 0;

  // Get smart suggestions
  const smartSuggestions = useMemo(() => {
    return getSmartSuggestions(
      filteredRecipes,
      {
        mealType: selectedMealType !== "all" ? selectedMealType : undefined,
        dietType: selectedDietType !== "all" ? selectedDietType : undefined,
        preferredCuisines:
          selectedCuisines.length > 0
            ? selectedCuisines
            : ["karnataka", "tamil", "punjabi"],
        spiceLevelMax: spiceLevelMax < 5 ? spiceLevelMax : undefined,
        maxCookTime: maxCookTime || undefined,
      },
      5
    );
  }, [
    filteredRecipes,
    selectedMealType,
    selectedDietType,
    selectedCuisines,
    maxCookTime,
    spiceLevelMax,
  ]);

  const handleSelectRecipe = (recipe: Recipe) => {
    router.push(`/recipes/${recipe.id}`);
  };

  const resetFilters = () => {
    setSelectedMealType("all");
    setSelectedDietType("all");
    setSelectedCuisines([]);
    setMaxCookTime(null);
    setSpiceLevelMax(5);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim()) {
      addAvailableIngredient(ingredientInput.trim());
      setIngredientInput("");
    }
  };

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning!", meal: "breakfast" };
    if (hour < 17) return { text: "Good afternoon!", meal: "lunch" };
    if (hour < 21) return { text: "Good evening!", meal: "dinner" };
    return { text: "Late night snack?", meal: "snack" };
  };

  const greeting = getGreeting();

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {greeting.text}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          What would you like to cook today?
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UtensilsCrossed className="w-4 h-4 text-orange-500" />
            <span>{allRecipes.length} recipes</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <span>{filteredRecipes.length} match filters</span>
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* What's in your kitchen section */}
      <Card className="mb-6">
        <CardBody className="p-0">
          {/* Header - always visible */}
          <button
            onClick={() => setShowIngredientSelector(!showIngredientSelector)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Refrigerator className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">
                What&apos;s in your kitchen?
              </span>
              {availableIngredients.length > 0 && (
                <Badge variant="success" size="sm">
                  {availableIngredients.length} items
                </Badge>
              )}
            </div>
            {showIngredientSelector ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Selected ingredients preview (when collapsed) */}
          {!showIngredientSelector && availableIngredients.length > 0 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
              {availableIngredients.slice(0, 6).map((ingredient) => (
                <Badge key={ingredient} variant="secondary" size="sm">
                  {ingredient}
                </Badge>
              ))}
              {availableIngredients.length > 6 && (
                <Badge variant="default" size="sm">
                  +{availableIngredients.length - 6} more
                </Badge>
              )}
            </div>
          )}

          {/* Expanded ingredient selector */}
          {showIngredientSelector && (
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
              <div className="pt-4">
                <IngredientSelector compact showContinue={false} />
              </div>

              {/* Filter toggle */}
              {availableIngredients.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterByIngredients}
                        onChange={(e) => setFilterByIngredients(e.target.checked)}
                        className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Only show recipes I can make
                      </span>
                    </label>
                    <button
                      onClick={clearAvailableIngredients}
                      className="text-sm text-gray-500 hover:text-red-500"
                    >
                      Clear all
                    </button>
                  </div>
                  {filterByIngredients && !ingredientFilterHasMatches && (
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      No exact matches found. Showing all recipes instead.
                    </p>
                  )}
                  {filterByIngredients && ingredientFilterHasMatches && availableIngredients.length > 0 && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Found {ingredientFilteredRecipes.length} recipes you can make!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Decision Mode Tabs */}
      <Card>
        <CardBody>
          <SimpleTabs
            defaultTab="spinner"
            tabs={[
              {
                id: "spinner",
                label: "Spin the Wheel",
                icon: <Shuffle className="w-4 h-4" />,
                content: (
                  <div className="py-6">
                    <SpinnerWheel
                      recipes={filteredRecipes}
                      onSelect={handleSelectRecipe}
                    />
                  </div>
                ),
              },
              {
                id: "smart",
                label: "Smart Picks",
                icon: <Sparkles className="w-4 h-4" />,
                content: (
                  <div className="py-4">
                    <SmartSuggestions
                      suggestions={smartSuggestions}
                      onSelect={handleSelectRecipe}
                    />
                  </div>
                ),
              },
            ]}
            variant="pills"
          />
        </CardBody>
      </Card>

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Karnataka",
            count: allRecipes.filter((r) => r.cuisine === "karnataka").length,
            color:
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
          },
          {
            label: "South Indian",
            count: allRecipes.filter((r) =>
              ["tamil", "kerala", "andhra", "telangana"].includes(r.cuisine)
            ).length,
            color:
              "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
          },
          {
            label: "North Indian",
            count: allRecipes.filter((r) =>
              ["punjabi", "rajasthani", "mughlai", "gujarati"].includes(
                r.cuisine
              )
            ).length,
            color:
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
          },
          {
            label: "Indo-Chinese",
            count: allRecipes.filter((r) => r.cuisine === "indo-chinese").length,
            color:
              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} rounded-lg p-3 text-center`}
          >
            <div className="text-2xl font-bold">{stat.count}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
