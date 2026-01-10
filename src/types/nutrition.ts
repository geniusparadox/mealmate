import { NutritionInfo } from "./recipe";

// Daily Nutrition Goals
export interface NutritionGoals {
  dailyCalories: number;
  dailyProtein: number; // grams
  dailyCarbs: number; // grams
  dailyFat: number; // grams
  dailyFiber?: number; // grams
  dailySodium?: number; // mg
  dailySugar?: number; // grams
}

// Consumed meal entry
export interface MealEntry {
  id: string;
  recipeId: string;
  recipeName: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  nutrition: NutritionInfo;
  timestamp: string; // ISO date string
}

// Daily nutrition log
export interface DailyNutritionLog {
  date: string; // YYYY-MM-DD format
  meals: MealEntry[];
  totals: NutritionInfo;
  goals: NutritionGoals;
}

// Weekly nutrition summary
export interface WeeklyNutritionSummary {
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  dailyLogs: DailyNutritionLog[];
  averages: NutritionInfo;
  goals: NutritionGoals;
}

// Nutrition progress for display
export interface NutritionProgress {
  consumed: number;
  goal: number;
  percentage: number;
  remaining: number;
  status: "under" | "on-track" | "over";
}

// Comprehensive daily progress
export interface DailyProgress {
  date: string;
  calories: NutritionProgress;
  protein: NutritionProgress;
  carbs: NutritionProgress;
  fat: NutritionProgress;
  fiber?: NutritionProgress;
}

// Preset nutrition goals
export interface NutritionPreset {
  id: string;
  name: string;
  description: string;
  goals: NutritionGoals;
}

// Common nutrition presets
export const NUTRITION_PRESETS: NutritionPreset[] = [
  {
    id: "balanced",
    name: "Balanced Diet",
    description: "Standard balanced nutrition for maintaining weight",
    goals: {
      dailyCalories: 2000,
      dailyProtein: 50,
      dailyCarbs: 250,
      dailyFat: 65,
      dailyFiber: 25,
      dailySodium: 2300,
    },
  },
  {
    id: "weight-loss",
    name: "Weight Loss",
    description: "Calorie deficit for gradual weight loss",
    goals: {
      dailyCalories: 1500,
      dailyProtein: 75,
      dailyCarbs: 150,
      dailyFat: 50,
      dailyFiber: 30,
      dailySodium: 2000,
    },
  },
  {
    id: "muscle-gain",
    name: "Muscle Building",
    description: "High protein for muscle growth",
    goals: {
      dailyCalories: 2500,
      dailyProtein: 150,
      dailyCarbs: 300,
      dailyFat: 70,
      dailyFiber: 30,
      dailySodium: 2500,
    },
  },
  {
    id: "low-carb",
    name: "Low Carb",
    description: "Reduced carbohydrates for metabolic health",
    goals: {
      dailyCalories: 1800,
      dailyProtein: 100,
      dailyCarbs: 100,
      dailyFat: 100,
      dailyFiber: 25,
      dailySodium: 2300,
    },
  },
  {
    id: "high-protein",
    name: "High Protein",
    description: "Maximum protein intake for athletes",
    goals: {
      dailyCalories: 2200,
      dailyProtein: 165,
      dailyCarbs: 200,
      dailyFat: 70,
      dailyFiber: 30,
      dailySodium: 2500,
    },
  },
  {
    id: "vegetarian-balanced",
    name: "Vegetarian Balanced",
    description: "Balanced nutrition with plant-based protein focus",
    goals: {
      dailyCalories: 2000,
      dailyProtein: 60,
      dailyCarbs: 275,
      dailyFat: 60,
      dailyFiber: 35,
      dailySodium: 2300,
    },
  },
];

// Helper function to calculate empty nutrition info
export const EMPTY_NUTRITION: NutritionInfo = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
};

// Helper to sum nutrition values
export function sumNutrition(items: NutritionInfo[]): NutritionInfo {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbohydrates: acc.carbohydrates + item.carbohydrates,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
      sugar: acc.sugar + item.sugar,
      sodium: acc.sodium + item.sodium,
      cholesterol: (acc.cholesterol || 0) + (item.cholesterol || 0),
    }),
    { ...EMPTY_NUTRITION }
  );
}

// Helper to scale nutrition by servings
export function scaleNutrition(
  nutrition: NutritionInfo,
  servings: number
): NutritionInfo {
  return {
    calories: Math.round(nutrition.calories * servings),
    protein: Math.round(nutrition.protein * servings * 10) / 10,
    carbohydrates: Math.round(nutrition.carbohydrates * servings * 10) / 10,
    fat: Math.round(nutrition.fat * servings * 10) / 10,
    fiber: Math.round(nutrition.fiber * servings * 10) / 10,
    sugar: Math.round(nutrition.sugar * servings * 10) / 10,
    sodium: Math.round(nutrition.sodium * servings),
    cholesterol: nutrition.cholesterol
      ? Math.round(nutrition.cholesterol * servings)
      : undefined,
  };
}
