import { Recipe, MealType } from "./recipe";
import { NutritionInfo } from "./recipe";

// Single meal slot in a plan
export interface MealSlot {
  id: string;
  mealType: MealType;
  recipeId?: string;
  recipe?: Recipe;
  servings: number;
  notes?: string;
  isLocked?: boolean; // Prevent auto-replacement
}

// Single day meal plan
export interface DayPlan {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Monday, Tuesday, etc.
  meals: {
    breakfast?: MealSlot;
    lunch?: MealSlot;
    dinner?: MealSlot;
    snack?: MealSlot[];
  };
  totalNutrition?: NutritionInfo;
}

// Weekly meal plan
export interface WeeklyPlan {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  days: DayPlan[];
  createdAt: string;
  updatedAt: string;
}

// Shopping list item
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  recipes: string[]; // Recipe names that need this
  checked: boolean;
}

// Shopping list grouped by category
export interface ShoppingList {
  id: string;
  weekPlanId: string;
  items: ShoppingItem[];
  createdAt: string;
}

// Meal suggestion from the algorithm
export interface MealSuggestion {
  recipe: Recipe;
  score: number;
  reasons: string[];
  matchedFilters: string[];
}

// Suggestion context for the algorithm
export interface SuggestionContext {
  mealType: MealType;
  date: string;
  recentMealIds: string[]; // Last 7-14 days
  todayNutrition: NutritionInfo;
  nutritionGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  maxCookTime?: number;
  preferredCuisines: string[];
  spiceLevelMax: number;
  dietType: "veg" | "non-veg" | "egg";
}

// Days of week constant
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// Helper to get day of week from date
export function getDayOfWeek(dateStr: string): DayOfWeek {
  const date = new Date(dateStr);
  const days: DayOfWeek[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  // Adjust for Monday start
  const day = days[date.getDay()];
  return day === "Sunday" ? "Sunday" : days[date.getDay()];
}

// Helper to get week start (Monday) from any date
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Helper to format date as YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Generate empty week plan
export function createEmptyWeekPlan(weekStart: Date): WeeklyPlan {
  const days: DayPlan[] = [];
  const start = getWeekStart(weekStart);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    days.push({
      date: formatDate(currentDate),
      dayOfWeek: DAYS_OF_WEEK[i],
      meals: {
        breakfast: undefined,
        lunch: undefined,
        dinner: undefined,
        snack: [],
      },
    });
  }

  const weekEnd = new Date(start);
  weekEnd.setDate(start.getDate() + 6);

  return {
    id: `week-${formatDate(start)}`,
    weekStart: formatDate(start),
    weekEnd: formatDate(weekEnd),
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
