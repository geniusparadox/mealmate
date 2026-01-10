"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import {
  NutritionGoals,
  MealEntry,
  DailyNutritionLog,
  NutritionProgress,
  DailyProgress,
  EMPTY_NUTRITION,
  sumNutrition,
  scaleNutrition,
  NUTRITION_PRESETS,
} from "@/types/nutrition";
import { NutritionInfo, Recipe } from "@/types/recipe";

interface NutritionContextType {
  // State
  goals: NutritionGoals;
  todaysMeals: MealEntry[];
  weeklyLogs: DailyNutritionLog[];
  isLoaded: boolean;

  // Computed
  todaysTotals: NutritionInfo;
  todaysProgress: DailyProgress;

  // Actions
  setGoals: (goals: NutritionGoals) => void;
  setGoalsFromPreset: (presetId: string) => void;
  logMeal: (recipe: Recipe, mealType: MealEntry["mealType"], servings: number) => void;
  removeMeal: (mealId: string) => void;
  clearTodaysMeals: () => void;
  getLogsForDate: (date: string) => DailyNutritionLog | null;
  getWeekSummary: () => { averages: NutritionInfo; daysLogged: number };
}

const NutritionContext = createContext<NutritionContextType | null>(null);

const GOALS_KEY = "mealmate_nutrition_goals";
const LOGS_KEY = "mealmate_nutrition_logs";

// Helper to get today's date as YYYY-MM-DD
const getToday = () => new Date().toISOString().split("T")[0];

// Helper to get date N days ago
const getDateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [goals, setGoalsState] = useState<NutritionGoals>(
    NUTRITION_PRESETS[0].goals
  );
  const [allLogs, setAllLogs] = useState<Record<string, DailyNutritionLog>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedGoals = localStorage.getItem(GOALS_KEY);
      const storedLogs = localStorage.getItem(LOGS_KEY);

      if (storedGoals) {
        setGoalsState(JSON.parse(storedGoals));
      }
      if (storedLogs) {
        setAllLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Error loading nutrition data:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    }
  }, [goals, isLoaded]);

  // Save logs to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOGS_KEY, JSON.stringify(allLogs));
    }
  }, [allLogs, isLoaded]);

  // Today's meals
  const today = getToday();
  const todaysMeals = useMemo(() => {
    return allLogs[today]?.meals || [];
  }, [allLogs, today]);

  // Today's totals
  const todaysTotals = useMemo(() => {
    if (todaysMeals.length === 0) return EMPTY_NUTRITION;
    return sumNutrition(todaysMeals.map((m) => m.nutrition));
  }, [todaysMeals]);

  // Today's progress
  const todaysProgress: DailyProgress = useMemo(() => {
    const calcProgress = (consumed: number, goal: number): NutritionProgress => {
      const percentage = goal > 0 ? (consumed / goal) * 100 : 0;
      return {
        consumed,
        goal,
        percentage,
        remaining: Math.max(0, goal - consumed),
        status: percentage < 80 ? "under" : percentage <= 110 ? "on-track" : "over",
      };
    };

    return {
      date: today,
      calories: calcProgress(todaysTotals.calories, goals.dailyCalories),
      protein: calcProgress(todaysTotals.protein, goals.dailyProtein),
      carbs: calcProgress(todaysTotals.carbohydrates, goals.dailyCarbs),
      fat: calcProgress(todaysTotals.fat, goals.dailyFat),
      fiber: goals.dailyFiber
        ? calcProgress(todaysTotals.fiber, goals.dailyFiber)
        : undefined,
    };
  }, [todaysTotals, goals, today]);

  // Weekly logs (last 7 days)
  const weeklyLogs = useMemo(() => {
    const logs: DailyNutritionLog[] = [];
    for (let i = 0; i < 7; i++) {
      const date = getDateDaysAgo(i);
      if (allLogs[date]) {
        logs.push(allLogs[date]);
      }
    }
    return logs;
  }, [allLogs]);

  // Actions
  const setGoals = (newGoals: NutritionGoals) => {
    setGoalsState(newGoals);
  };

  const setGoalsFromPreset = (presetId: string) => {
    const preset = NUTRITION_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setGoalsState(preset.goals);
    }
  };

  const logMeal = (
    recipe: Recipe,
    mealType: MealEntry["mealType"],
    servings: number
  ) => {
    const scaledNutrition = scaleNutrition(recipe.nutrition, servings);
    const entry: MealEntry = {
      id: `meal-${Date.now()}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      mealType,
      servings,
      nutrition: scaledNutrition,
      timestamp: new Date().toISOString(),
    };

    setAllLogs((prev) => {
      const existingLog = prev[today];
      const meals = existingLog ? [...existingLog.meals, entry] : [entry];
      const totals = sumNutrition(meals.map((m) => m.nutrition));

      return {
        ...prev,
        [today]: {
          date: today,
          meals,
          totals,
          goals,
        },
      };
    });
  };

  const removeMeal = (mealId: string) => {
    setAllLogs((prev) => {
      const existingLog = prev[today];
      if (!existingLog) return prev;

      const meals = existingLog.meals.filter((m) => m.id !== mealId);
      const totals = meals.length > 0 ? sumNutrition(meals.map((m) => m.nutrition)) : EMPTY_NUTRITION;

      return {
        ...prev,
        [today]: {
          ...existingLog,
          meals,
          totals,
        },
      };
    });
  };

  const clearTodaysMeals = () => {
    setAllLogs((prev) => {
      const { [today]: _, ...rest } = prev;
      return rest;
    });
  };

  const getLogsForDate = (date: string): DailyNutritionLog | null => {
    return allLogs[date] || null;
  };

  const getWeekSummary = () => {
    if (weeklyLogs.length === 0) {
      return { averages: EMPTY_NUTRITION, daysLogged: 0 };
    }

    const totals = sumNutrition(weeklyLogs.map((log) => log.totals));
    const daysLogged = weeklyLogs.length;

    const averages: NutritionInfo = {
      calories: Math.round(totals.calories / daysLogged),
      protein: Math.round(totals.protein / daysLogged),
      carbohydrates: Math.round(totals.carbohydrates / daysLogged),
      fat: Math.round(totals.fat / daysLogged),
      fiber: Math.round(totals.fiber / daysLogged),
      sugar: Math.round(totals.sugar / daysLogged),
      sodium: Math.round(totals.sodium / daysLogged),
    };

    return { averages, daysLogged };
  };

  return (
    <NutritionContext.Provider
      value={{
        goals,
        todaysMeals,
        weeklyLogs,
        isLoaded,
        todaysTotals,
        todaysProgress,
        setGoals,
        setGoalsFromPreset,
        logMeal,
        removeMeal,
        clearTodaysMeals,
        getLogsForDate,
        getWeekSummary,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (!context) {
    throw new Error("useNutrition must be used within NutritionProvider");
  }
  return context;
}
