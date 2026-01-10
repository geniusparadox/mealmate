import { CuisineType, DietType, MealType, SpiceLevel } from "./recipe";
import { NutritionGoals } from "./nutrition";

// User dietary preferences
export interface UserPreferences {
  // Diet
  dietaryPreference: DietType;

  // Cuisine preferences with priority
  cuisinePreferences: CuisinePreference[];

  // Restrictions
  allergies: string[];
  dislikedIngredients: string[];

  // Taste preferences
  spiceToleranceMax: SpiceLevel;

  // Time constraints
  maxCookingTime?: number; // minutes
  preferQuickMeals: boolean;

  // Nutrition
  nutritionGoals: NutritionGoals;

  // Meal preferences
  mealPreferences: {
    breakfast: MealPreference;
    lunch: MealPreference;
    dinner: MealPreference;
    snack: MealPreference;
  };
}

// Cuisine preference with priority ranking
export interface CuisinePreference {
  cuisine: CuisineType;
  priority: number; // 1-5, higher = more preferred
  enabled: boolean;
}

// Meal-specific preferences
export interface MealPreference {
  enabled: boolean;
  preferredCuisines?: CuisineType[];
  maxCookTime?: number;
  preferLight?: boolean;
}

// Meal history entry for tracking what was eaten
export interface MealHistoryEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  mealType: MealType;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
  rating?: number; // 1-5 stars
  notes?: string;
  servings: number;
}

// User profile (for future expansion)
export interface UserProfile {
  id: string;
  name?: string;
  preferences: UserPreferences;
  mealHistory: MealHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// Common allergies for quick selection
export const COMMON_ALLERGIES = [
  "Peanuts",
  "Tree Nuts",
  "Milk/Dairy",
  "Eggs",
  "Wheat/Gluten",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
  "Mustard",
] as const;

// Common disliked ingredients
export const COMMON_DISLIKES = [
  "Onion",
  "Garlic",
  "Cilantro/Coriander",
  "Tomato",
  "Coconut",
  "Mushrooms",
  "Bell Peppers",
  "Eggplant/Brinjal",
  "Okra/Ladyfinger",
  "Bitter Gourd",
] as const;

// Default user preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  dietaryPreference: "non-veg",
  cuisinePreferences: [
    { cuisine: "karnataka", priority: 5, enabled: true },
    { cuisine: "tamil", priority: 4, enabled: true },
    { cuisine: "kerala", priority: 4, enabled: true },
    { cuisine: "andhra", priority: 3, enabled: true },
    { cuisine: "punjabi", priority: 3, enabled: true },
    { cuisine: "indo-chinese", priority: 4, enabled: true },
  ],
  allergies: [],
  dislikedIngredients: [],
  spiceToleranceMax: 4,
  maxCookingTime: 60,
  preferQuickMeals: false,
  nutritionGoals: {
    dailyCalories: 2000,
    dailyProtein: 60,
    dailyCarbs: 250,
    dailyFat: 65,
    dailyFiber: 25,
  },
  mealPreferences: {
    breakfast: { enabled: true, maxCookTime: 30, preferLight: true },
    lunch: { enabled: true, maxCookTime: 45 },
    dinner: { enabled: true, maxCookTime: 60 },
    snack: { enabled: true, maxCookTime: 15, preferLight: true },
  },
};
