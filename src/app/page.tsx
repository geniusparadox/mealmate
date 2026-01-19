"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Recipe, CuisineType, MealType, DietType, CUISINE_INFO } from "@/types/recipe";
import { allRecipes } from "@/data/recipes";
import Link from "next/link";
import { SpinnerWheel, MealFilters, SmartSuggestions, IngredientSelector } from "@/components/meal-picker";
import { SimpleTabs } from "@/components/ui/Tabs";
import { Card, CardBody } from "@/components/ui/Card";
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
  Flame,
  Leaf,
  Globe,
  Timer,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const {
    availableIngredients,
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
    return filterByAvailableIngredients(baseFilteredRecipes, availableIngredients, 0.05);
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

  // Welcome message
  const greeting = {
    text: "Hello! What should we eat today?",
    subtext: "Discover delicious recipes from around the world"
  };

  // Get cuisine counts
  const cuisineCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allRecipes.forEach((recipe) => {
      counts[recipe.cuisine] = (counts[recipe.cuisine] || 0) + 1;
    });
    return counts;
  }, []);

  // Group cuisines by region
  const cuisineGroups = [
    {
      name: "South Indian",
      icon: <Flame className="w-4 h-4" />,
      gradient: "bg-gradient-terracotta",
      cuisines: ["karnataka", "tamil", "kerala", "andhra", "telangana"] as CuisineType[],
    },
    {
      name: "North Indian",
      icon: <Leaf className="w-4 h-4" />,
      gradient: "bg-gradient-sage",
      cuisines: ["punjabi", "rajasthani", "gujarati", "maharashtrian", "mughlai", "bengali", "kashmiri", "lucknowi"] as CuisineType[],
    },
    {
      name: "Asian",
      icon: <Globe className="w-4 h-4" />,
      gradient: "bg-gradient-amber",
      cuisines: ["indo-chinese", "thai", "japanese", "korean", "vietnamese", "chinese", "indonesian", "malaysian"] as CuisineType[],
    },
    {
      name: "European",
      icon: <UtensilsCrossed className="w-4 h-4" />,
      gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
      cuisines: ["german", "italian", "spanish", "hungarian", "mediterranean", "continental"] as CuisineType[],
    },
    {
      name: "Americas & Middle East",
      icon: <Timer className="w-4 h-4" />,
      gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
      cuisines: ["mexican", "american", "middle-eastern"] as CuisineType[],
    },
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-terracotta flex items-center justify-center animate-pulse-soft">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <p className="text-[var(--foreground-muted)]">Loading your kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero pattern-food">
        <div className="max-w-5xl mx-auto px-4 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="text-center animate-fade-in">
            {/* Greeting */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Discover {allRecipes.length}+ recipes</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--foreground)] mb-3 tracking-tight">
              {greeting.text}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-8">
              {greeting.subtext}
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--background)] shadow-premium">
                <UtensilsCrossed className="w-4 h-4 text-[var(--accent-primary)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">{allRecipes.length} recipes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--background)] shadow-premium">
                <ChefHat className="w-4 h-4 text-[var(--accent-secondary)]" />
                <span className="text-sm font-medium text-[var(--foreground)]">{filteredRecipes.length} matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-[var(--accent-primary)]/5 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-[var(--accent-tertiary)]/5 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-10">
        {/* Cuisine Groups */}
        <div className="space-y-4 mb-6">
          {cuisineGroups.map((group, groupIndex) => {
            const groupTotal = group.cuisines.reduce((sum, c) => sum + (cuisineCounts[c] || 0), 0);
            if (groupTotal === 0) return null;

            return (
              <Card key={group.name} className="animate-slide-up overflow-hidden" style={{ animationDelay: `${groupIndex * 50}ms` }}>
                <div className={`${group.gradient} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2 text-white">
                    {group.icon}
                    <span className="font-semibold">{group.name}</span>
                  </div>
                  <span className="text-white/80 text-sm">{groupTotal} recipes</span>
                </div>
                <CardBody className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {group.cuisines
                      .filter((cuisine) => cuisineCounts[cuisine] > 0)
                      .map((cuisine) => {
                        const info = CUISINE_INFO[cuisine];
                        return (
                          <Link
                            key={cuisine}
                            href={`/recipes?cuisine=${cuisine}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: `${info?.color || "#C4704B"}15`,
                              color: info?.color || "#C4704B",
                              border: `1px solid ${info?.color || "#C4704B"}30`,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: info?.color || "#C4704B" }}
                            />
                            {info?.name || cuisine}
                            <span className="opacity-60">({cuisineCounts[cuisine]})</span>
                          </Link>
                        );
                      })}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
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

        {/* What's in your kitchen section */}
        <Card className="mb-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardBody className="p-0">
            {/* Header - always visible */}
            <button
              onClick={() => setShowIngredientSelector(!showIngredientSelector)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--background-secondary)] transition-all duration-300 rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-secondary)]/15 flex items-center justify-center">
                  <Refrigerator className="w-5 h-5 text-[var(--accent-secondary)]" />
                </div>
                <div className="text-left">
                  <span className="font-semibold text-[var(--foreground)] block">
                    What&apos;s in your kitchen?
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    Find recipes with ingredients you have
                  </span>
                </div>
                {availableIngredients.length > 0 && (
                  <Badge variant="sage" size="sm" glow>
                    {availableIngredients.length} items
                  </Badge>
                )}
              </div>
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                transition-all duration-300
                ${showIngredientSelector ? "bg-[var(--accent-primary)]/10 rotate-180" : "bg-[var(--color-light-gray)]/50"}
              `}>
                <ChevronDown className="w-5 h-5 text-[var(--foreground-muted)]" />
              </div>
            </button>

            {/* Selected ingredients preview (when collapsed) */}
            {!showIngredientSelector && availableIngredients.length > 0 && (
              <div className="px-5 pb-4 flex flex-wrap gap-2 animate-fade-in">
                {availableIngredients.slice(0, 6).map((ingredient) => (
                  <Badge key={ingredient} variant="sage" size="sm">
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
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-out
                ${showIngredientSelector ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <div className="px-5 pb-5 border-t border-[var(--color-light-gray)]/50">
                <div className="pt-5">
                  <IngredientSelector compact showContinue={false} />
                </div>

                {/* Filter toggle */}
                {availableIngredients.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-[var(--color-light-gray)]/50">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={filterByIngredients}
                            onChange={(e) => setFilterByIngredients(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`
                            w-12 h-7 rounded-full transition-all duration-300
                            ${filterByIngredients ? "bg-[var(--accent-secondary)]" : "bg-[var(--color-light-gray)]"}
                          `}>
                            <div className={`
                              w-5 h-5 rounded-full bg-white shadow-sm
                              absolute top-1 transition-all duration-300
                              ${filterByIngredients ? "left-6" : "left-1"}
                            `} />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent-secondary)] transition-colors">
                          Only show recipes I can make
                        </span>
                      </label>
                      <button
                        onClick={clearAvailableIngredients}
                        className="text-sm font-medium text-[var(--foreground-muted)] hover:text-red-500 transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    {filterByIngredients && !ingredientFilterHasMatches && (
                      <p className="mt-3 text-sm text-amber-600 bg-amber-500/10 px-3 py-2 rounded-lg">
                        No exact matches found. Showing all recipes instead.
                      </p>
                    )}
                    {filterByIngredients && ingredientFilterHasMatches && availableIngredients.length > 0 && (
                      <p className="mt-3 text-sm text-[var(--accent-secondary)] bg-[var(--accent-secondary)]/10 px-3 py-2 rounded-lg">
                        Found {ingredientFilteredRecipes.length} recipes you can make!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Decision Mode Tabs */}
        <Card className="animate-slide-up" style={{ animationDelay: "400ms" }}>
          <CardBody className="p-0">
            <SimpleTabs
              defaultTab="spinner"
              tabs={[
                {
                  id: "spinner",
                  label: "Spin the Wheel",
                  icon: <Shuffle className="w-4 h-4" />,
                  content: (
                    <div className="py-8 px-5">
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
                    <div className="py-6 px-5">
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

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
