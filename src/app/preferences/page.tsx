"use client";

import { useState } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useNutrition } from "@/contexts/NutritionContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  DietType,
  CuisineType,
  CUISINE_INFO,
  SpiceLevel,
} from "@/types/recipe";
import { NUTRITION_PRESETS } from "@/types/nutrition";
import { COMMON_ALLERGIES, COMMON_DISLIKES } from "@/types/user";
import {
  Leaf,
  Drumstick,
  Egg,
  Flame,
  Clock,
  Target,
  X,
  Plus,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Save,
  Check,
} from "lucide-react";

const DIET_OPTIONS: { value: DietType; label: string; icon: typeof Leaf }[] = [
  { value: "veg", label: "Vegetarian", icon: Leaf },
  { value: "egg", label: "Eggetarian", icon: Egg },
  { value: "non-veg", label: "Non-Vegetarian", icon: Drumstick },
];

const CUISINE_GROUPS = {
  "South Indian": ["karnataka", "tamil", "kerala", "andhra", "telangana"],
  "North Indian": ["punjabi", "rajasthani", "gujarati", "maharashtrian", "mughlai", "bengali", "kashmiri", "lucknowi"],
  "Indo-Fusion": ["indo-chinese", "indo-french", "indo-spanish", "indo-italian"],
  "Asian": ["thai", "japanese", "korean", "vietnamese", "chinese", "indonesian", "malaysian"],
  "World": ["italian", "mexican", "mediterranean", "american", "middle-eastern", "continental"],
} as const;

export default function PreferencesPage() {
  const { preferences, isLoaded, ...actions } = useUserPreferences();
  const { goals, setGoals, setGoalsFromPreset } = useNutrition();

  const [newAllergy, setNewAllergy] = useState("");
  const [newDislike, setNewDislike] = useState("");
  const [saved, setSaved] = useState(false);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading preferences...</div>
      </div>
    );
  }

  const getCuisinePriority = (cuisine: CuisineType) => {
    const pref = preferences.cuisinePreferences.find((c) => c.cuisine === cuisine);
    return pref?.priority || 3;
  };

  const isCuisineEnabled = (cuisine: CuisineType) => {
    const pref = preferences.cuisinePreferences.find((c) => c.cuisine === cuisine);
    return pref?.enabled ?? false;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Preferences
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your meal recommendations and nutrition goals
        </p>
      </div>

      {/* Saved notification */}
      {saved && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4" />
          Preferences saved!
        </div>
      )}

      <div className="space-y-6">
        {/* Dietary Preference */}
        <Card>
          <CardHeader
            title="Dietary Preference"
            subtitle="Choose your primary diet type"
          />
          <CardBody>
            <div className="grid grid-cols-3 gap-3">
              {DIET_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = preferences.dietaryPreference === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      actions.setDietaryPreference(option.value);
                      showSaved();
                    }}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-orange-300"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        isSelected
                          ? "text-orange-500"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isSelected
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Spice Tolerance */}
        <Card>
          <CardHeader
            title="Spice Tolerance"
            subtitle="Set your maximum spice level"
            action={<Flame className="w-5 h-5 text-red-500" />}
          />
          <CardBody>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Mild</span>
              <div className="flex-1 flex gap-2">
                {([1, 2, 3, 4, 5] as SpiceLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      actions.setSpiceTolerance(level);
                      showSaved();
                    }}
                    className={`flex-1 py-3 rounded-lg transition-all ${
                      preferences.spiceToleranceMax >= level
                        ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {"🌶️".repeat(level)}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">Hot</span>
            </div>
            <p className="text-center mt-3 text-gray-600 dark:text-gray-400">
              You&apos;ll see recipes up to level {preferences.spiceToleranceMax} spice
            </p>
          </CardBody>
        </Card>

        {/* Cooking Time */}
        <Card>
          <CardHeader
            title="Cooking Time"
            subtitle="Set your maximum cooking time preference"
            action={<Clock className="w-5 h-5 text-blue-500" />}
          />
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="15"
                  max="120"
                  step="15"
                  value={preferences.maxCookingTime || 60}
                  onChange={(e) => {
                    actions.setMaxCookingTime(Number(e.target.value));
                    showSaved();
                  }}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="w-20 text-right font-semibold text-gray-900 dark:text-white">
                  {preferences.maxCookingTime || 60} min
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="quickMeals"
                  checked={preferences.preferQuickMeals}
                  onChange={(e) => {
                    actions.setPreferQuickMeals(e.target.checked);
                    showSaved();
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <label htmlFor="quickMeals" className="text-gray-700 dark:text-gray-300">
                  Prefer quick meals (&lt;30 minutes)
                </label>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Cuisine Preferences */}
        <Card>
          <CardHeader
            title="Cuisine Preferences"
            subtitle="Select and prioritize your favorite cuisines"
          />
          <CardBody>
            <div className="space-y-6">
              {Object.entries(CUISINE_GROUPS).map(([group, cuisines]) => (
                <div key={group}>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {group}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cuisines.map((cuisine) => {
                      const info = CUISINE_INFO[cuisine as CuisineType];
                      const enabled = isCuisineEnabled(cuisine as CuisineType);
                      const priority = getCuisinePriority(cuisine as CuisineType);

                      return (
                        <div
                          key={cuisine}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            enabled
                              ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                actions.toggleCuisine(cuisine as CuisineType, !enabled);
                                showSaved();
                              }}
                              className="flex items-center gap-2 flex-1"
                            >
                              <div
                                className={`w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                                  enabled
                                    ? "bg-orange-500 border-orange-500"
                                    : "border-gray-300"
                                }`}
                              >
                                {enabled && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span
                                className={`font-medium ${
                                  enabled
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500"
                                }`}
                              >
                                {info.name}
                              </span>
                            </button>
                            {enabled && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    if (priority > 1) {
                                      actions.setCuisinePriority(cuisine as CuisineType, priority - 1);
                                      showSaved();
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  disabled={priority <= 1}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <span className="w-4 text-center text-sm font-medium text-orange-600">
                                  {priority}
                                </span>
                                <button
                                  onClick={() => {
                                    if (priority < 5) {
                                      actions.setCuisinePriority(cuisine as CuisineType, priority + 1);
                                      showSaved();
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  disabled={priority >= 5}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Allergies */}
        <Card>
          <CardHeader
            title="Allergies"
            subtitle="Add ingredients you're allergic to"
          />
          <CardBody>
            <div className="space-y-4">
              {/* Common allergies quick select */}
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map((allergy) => {
                  const isSelected = preferences.allergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      onClick={() => {
                        if (isSelected) {
                          actions.removeAllergy(allergy);
                        } else {
                          actions.addAllergy(allergy);
                        }
                        showSaved();
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300"
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}
                      {allergy}
                    </button>
                  );
                })}
              </div>

              {/* Custom allergy input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add custom allergy..."
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newAllergy.trim()) {
                      actions.addAllergy(newAllergy.trim());
                      setNewAllergy("");
                      showSaved();
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newAllergy.trim()) {
                      actions.addAllergy(newAllergy.trim());
                      setNewAllergy("");
                      showSaved();
                    }
                  }}
                  disabled={!newAllergy.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Selected allergies */}
              {preferences.allergies.length > 0 && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 mb-2">Your allergies:</p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="danger"
                        className="flex items-center gap-1"
                      >
                        {allergy}
                        <button
                          onClick={() => {
                            actions.removeAllergy(allergy);
                            showSaved();
                          }}
                          className="ml-1 hover:text-red-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Disliked Ingredients */}
        <Card>
          <CardHeader
            title="Disliked Ingredients"
            subtitle="Ingredients you'd prefer to avoid"
          />
          <CardBody>
            <div className="space-y-4">
              {/* Common dislikes quick select */}
              <div className="flex flex-wrap gap-2">
                {COMMON_DISLIKES.map((ingredient) => {
                  const isSelected = preferences.dislikedIngredients.includes(ingredient);
                  return (
                    <button
                      key={ingredient}
                      onClick={() => {
                        if (isSelected) {
                          actions.setDislikedIngredients(
                            preferences.dislikedIngredients.filter((i) => i !== ingredient)
                          );
                        } else {
                          actions.setDislikedIngredients([
                            ...preferences.dislikedIngredients,
                            ingredient,
                          ]);
                        }
                        showSaved();
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-2 border-yellow-300"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-transparent hover:border-gray-300"
                      }`}
                    >
                      {isSelected && <span className="mr-1">✓</span>}
                      {ingredient}
                    </button>
                  );
                })}
              </div>

              {/* Custom dislike input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDislike}
                  onChange={(e) => setNewDislike(e.target.value)}
                  placeholder="Add ingredient you dislike..."
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newDislike.trim()) {
                      actions.setDislikedIngredients([
                        ...preferences.dislikedIngredients,
                        newDislike.trim(),
                      ]);
                      setNewDislike("");
                      showSaved();
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newDislike.trim()) {
                      actions.setDislikedIngredients([
                        ...preferences.dislikedIngredients,
                        newDislike.trim(),
                      ]);
                      setNewDislike("");
                      showSaved();
                    }
                  }}
                  disabled={!newDislike.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Nutrition Goals */}
        <Card>
          <CardHeader
            title="Nutrition Goals"
            subtitle="Set your daily nutrition targets"
            action={<Target className="w-5 h-5 text-green-500" />}
          />
          <CardBody>
            <div className="space-y-6">
              {/* Preset selection */}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Quick presets:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {NUTRITION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setGoalsFromPreset(preset.id);
                        showSaved();
                      }}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all text-left"
                    >
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {preset.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {preset.goals.dailyCalories} cal
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom goals */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Or customize your goals:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { key: "dailyCalories", label: "Calories", unit: "kcal", color: "orange" },
                    { key: "dailyProtein", label: "Protein", unit: "g", color: "red" },
                    { key: "dailyCarbs", label: "Carbs", unit: "g", color: "blue" },
                    { key: "dailyFat", label: "Fat", unit: "g", color: "yellow" },
                    { key: "dailyFiber", label: "Fiber", unit: "g", color: "green" },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {item.label}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={goals[item.key as keyof typeof goals] || ""}
                          onChange={(e) => {
                            setGoals({
                              ...goals,
                              [item.key]: Number(e.target.value),
                            });
                          }}
                          onBlur={showSaved}
                          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Reset */}
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Reset Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Clear all preferences and start fresh
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all preferences?")) {
                    actions.resetPreferences();
                    showSaved();
                  }
                }}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
