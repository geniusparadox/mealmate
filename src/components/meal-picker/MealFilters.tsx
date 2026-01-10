"use client";

import { useState } from "react";
import { CuisineType, MealType, DietType, CUISINE_INFO } from "@/types/recipe";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, ChevronUp, Filter, X, Leaf, Drumstick, Egg } from "lucide-react";

interface MealFiltersProps {
  selectedMealType: MealType | "all";
  selectedDietType: DietType | "all";
  selectedCuisines: CuisineType[];
  maxCookTime: number | null;
  spiceLevelMax: number;
  onMealTypeChange: (type: MealType | "all") => void;
  onDietTypeChange: (type: DietType | "all") => void;
  onCuisinesChange: (cuisines: CuisineType[]) => void;
  onMaxCookTimeChange: (time: number | null) => void;
  onSpiceLevelChange: (level: number) => void;
  onReset: () => void;
}

const MEAL_TYPES: { id: MealType | "all"; label: string }[] = [
  { id: "all", label: "Any Meal" },
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
];

const DIET_TYPES: { id: DietType | "all"; label: string; icon: React.ReactNode; selectedClass: string; unselectedClass: string }[] = [
  {
    id: "all",
    label: "All",
    icon: null,
    selectedClass: "bg-gray-700 text-white dark:bg-gray-600",
    unselectedClass: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
  },
  {
    id: "veg",
    label: "Vegetarian",
    icon: <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-green-600 rounded-sm mr-1.5"><span className="w-2 h-2 bg-green-600 rounded-full"></span></span>,
    selectedClass: "bg-green-600 text-white border-green-600",
    unselectedClass: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50"
  },
  {
    id: "non-veg",
    label: "Non-Veg",
    icon: <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-red-600 rounded-sm mr-1.5"><span className="w-2 h-2 bg-red-600 rounded-full"></span></span>,
    selectedClass: "bg-red-600 text-white border-red-600",
    unselectedClass: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50"
  },
  {
    id: "egg",
    label: "Eggetarian",
    icon: <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-amber-500 rounded-sm mr-1.5"><span className="w-2 h-2 bg-amber-500 rounded-full"></span></span>,
    selectedClass: "bg-amber-500 text-white border-amber-500",
    unselectedClass: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
  },
];

const TIME_OPTIONS = [
  { value: null, label: "Any Time" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hour" },
];

const CUISINE_GROUPS = {
  "South Indian": ["karnataka", "tamil", "kerala", "andhra", "telangana"] as CuisineType[],
  "North Indian": ["punjabi", "rajasthani", "gujarati", "mughlai", "bengali"] as CuisineType[],
  "Indo-Fusion": ["indo-chinese"] as CuisineType[],
  "Asian": ["thai", "japanese", "korean", "vietnamese", "chinese"] as CuisineType[],
  "World": ["italian", "mexican", "mediterranean", "middle-eastern"] as CuisineType[],
};

export const MealFilters = ({
  selectedMealType,
  selectedDietType,
  selectedCuisines,
  maxCookTime,
  spiceLevelMax,
  onMealTypeChange,
  onDietTypeChange,
  onCuisinesChange,
  onMaxCookTimeChange,
  onSpiceLevelChange,
  onReset,
}: MealFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    selectedMealType !== "all" ||
    selectedDietType !== "all" ||
    selectedCuisines.length > 0 ||
    maxCookTime !== null ||
    spiceLevelMax < 5;

  const toggleCuisine = (cuisine: CuisineType) => {
    if (selectedCuisines.includes(cuisine)) {
      onCuisinesChange(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      onCuisinesChange([...selectedCuisines, cuisine]);
    }
  };

  const selectCuisineGroup = (cuisines: CuisineType[]) => {
    const allSelected = cuisines.every((c) => selectedCuisines.includes(c));
    if (allSelected) {
      onCuisinesChange(selectedCuisines.filter((c) => !cuisines.includes(c)));
    } else {
      const newCuisines = [...new Set([...selectedCuisines, ...cuisines])];
      onCuisinesChange(newCuisines);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Diet Type - Primary Filter (Prominent) */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 block">
          Diet Preference
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIET_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onDietTypeChange(type.id)}
              className={`flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border-2 ${
                selectedDietType === type.id
                  ? type.selectedClass
                  : type.unselectedClass
              }`}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meal Type */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Meal Type
        </label>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onMealTypeChange(type.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedMealType === type.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Cuisine Filter (Region of Origin) */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Region
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(CUISINE_GROUPS).map(([group, cuisines]) => {
            const allSelected = cuisines.every((c) => selectedCuisines.includes(c));
            const someSelected = cuisines.some((c) => selectedCuisines.includes(c));
            return (
              <button
                key={group}
                onClick={() => selectCuisineGroup(cuisines)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  allSelected
                    ? "bg-orange-500 text-white"
                    : someSelected
                    ? "bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {group}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600"
      >
        {showAdvanced ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide advanced filters
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show more filters
          </>
        )}
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* Cuisines */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Cuisines ({selectedCuisines.length} selected)
            </label>
            <div className="space-y-3">
              {Object.entries(CUISINE_GROUPS).map(([group, cuisines]) => (
                <div key={group}>
                  <button
                    onClick={() => selectCuisineGroup(cuisines)}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 hover:text-orange-600"
                  >
                    {group}
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {cuisines.map((cuisine) => (
                      <button
                        key={cuisine}
                        onClick={() => toggleCuisine(cuisine)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          selectedCuisines.includes(cuisine)
                            ? "bg-orange-500 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        {CUISINE_INFO[cuisine]?.name || cuisine}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Max Cook Time */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Max Cooking Time
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => onMaxCookTimeChange(option.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    maxCookTime === option.value
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Max Spice Level: {spiceLevelMax === 5 ? "Any" : "🌶️".repeat(spiceLevelMax)}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={spiceLevelMax}
              onChange={(e) => onSpiceLevelChange(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Mild</span>
              <span>Very Hot</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {selectedMealType !== "all" && (
            <Badge variant="primary" removable onRemove={() => onMealTypeChange("all")}>
              {selectedMealType}
            </Badge>
          )}
          {selectedDietType !== "all" && (
            <Badge
              variant={selectedDietType === "veg" ? "veg" : selectedDietType === "non-veg" ? "non-veg" : "egg"}
              removable
              onRemove={() => onDietTypeChange("all")}
            >
              {selectedDietType}
            </Badge>
          )}
          {selectedCuisines.map((cuisine) => (
            <Badge
              key={cuisine}
              variant="secondary"
              removable
              onRemove={() => toggleCuisine(cuisine)}
            >
              {CUISINE_INFO[cuisine]?.name || cuisine}
            </Badge>
          ))}
          {maxCookTime && (
            <Badge variant="primary" removable onRemove={() => onMaxCookTimeChange(null)}>
              ≤{maxCookTime} min
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default MealFilters;
