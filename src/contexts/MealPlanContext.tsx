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
  WeeklyPlan,
  DayPlan,
  MealSlot,
  ShoppingItem,
  createEmptyWeekPlan,
  getWeekStart,
  formatDate,
  DAYS_OF_WEEK,
} from "@/types/mealPlan";
import { Recipe, MealType, NutritionInfo } from "@/types/recipe";
import { getRecipeById } from "@/data/recipes";
import { sumNutrition, scaleNutrition, EMPTY_NUTRITION } from "@/types/nutrition";

interface MealPlanContextType {
  // State
  currentWeekPlan: WeeklyPlan;
  allPlans: Record<string, WeeklyPlan>;
  isLoaded: boolean;

  // Navigation
  goToWeek: (date: Date) => void;
  goToNextWeek: () => void;
  goToPreviousWeek: () => void;
  goToCurrentWeek: () => void;

  // Actions
  addMealToSlot: (
    date: string,
    mealType: MealType,
    recipe: Recipe,
    servings?: number
  ) => void;
  removeMealFromSlot: (date: string, mealType: MealType) => void;
  updateServings: (date: string, mealType: MealType, servings: number) => void;
  toggleLock: (date: string, mealType: MealType) => void;
  clearDay: (date: string) => void;
  clearWeek: () => void;
  copyDayToDay: (sourceDate: string, targetDate: string) => void;
  copyPreviousWeek: () => void;

  // Computed
  getDayNutrition: (date: string) => NutritionInfo;
  getWeekNutrition: () => NutritionInfo;
  generateShoppingList: () => ShoppingItem[];
}

const MealPlanContext = createContext<MealPlanContextType | null>(null);

const PLANS_KEY = "mealmate_meal_plans";

export function MealPlanProvider({ children }: { children: ReactNode }) {
  const [allPlans, setAllPlans] = useState<Record<string, WeeklyPlan>>({});
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    getWeekStart(new Date())
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PLANS_KEY);
      if (stored) {
        setAllPlans(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading meal plans:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PLANS_KEY, JSON.stringify(allPlans));
    }
  }, [allPlans, isLoaded]);

  // Current week plan
  const currentWeekPlan = useMemo(() => {
    const weekKey = formatDate(currentWeekStart);
    const planId = `week-${weekKey}`;

    if (allPlans[planId]) {
      return allPlans[planId];
    }

    return createEmptyWeekPlan(currentWeekStart);
  }, [allPlans, currentWeekStart]);

  // Navigation
  const goToWeek = (date: Date) => {
    setCurrentWeekStart(getWeekStart(date));
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToPreviousWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  // Helper to update plan
  const updatePlan = (updater: (plan: WeeklyPlan) => WeeklyPlan) => {
    setAllPlans((prev) => {
      const updated = updater(currentWeekPlan);
      return {
        ...prev,
        [updated.id]: {
          ...updated,
          updatedAt: new Date().toISOString(),
        },
      };
    });
  };

  // Actions
  const addMealToSlot = (
    date: string,
    mealType: MealType,
    recipe: Recipe,
    servings: number = recipe.servings
  ) => {
    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== date) return day;

        const slot: MealSlot = {
          id: `${date}-${mealType}-${Date.now()}`,
          mealType,
          recipeId: recipe.id,
          recipe,
          servings,
        };

        if (mealType === "snack") {
          return {
            ...day,
            meals: {
              ...day.meals,
              snack: [...(day.meals.snack || []), slot],
            },
          };
        }

        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: slot,
          },
        };
      }),
    }));
  };

  const removeMealFromSlot = (date: string, mealType: MealType) => {
    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== date) return day;

        if (mealType === "snack") {
          return {
            ...day,
            meals: {
              ...day.meals,
              snack: [],
            },
          };
        }

        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: undefined,
          },
        };
      }),
    }));
  };

  const updateServings = (date: string, mealType: MealType, servings: number) => {
    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== date) return day;

        const slot = day.meals[mealType];
        if (!slot || mealType === "snack") return day;

        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: { ...slot, servings },
          },
        };
      }),
    }));
  };

  const toggleLock = (date: string, mealType: MealType) => {
    if (mealType === "snack") return; // Snacks don't support locking

    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== date) return day;

        const slot = day.meals[mealType] as MealSlot | undefined;
        if (!slot) return day;

        return {
          ...day,
          meals: {
            ...day.meals,
            [mealType]: { ...slot, isLocked: !slot.isLocked },
          },
        };
      }),
    }));
  };

  const clearDay = (date: string) => {
    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== date) return day;
        return {
          ...day,
          meals: {
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: [],
          },
        };
      }),
    }));
  };

  const clearWeek = () => {
    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => ({
        ...day,
        meals: {
          breakfast: undefined,
          lunch: undefined,
          dinner: undefined,
          snack: [],
        },
      })),
    }));
  };

  const copyDayToDay = (sourceDate: string, targetDate: string) => {
    const sourceDay = currentWeekPlan.days.find((d) => d.date === sourceDate);
    if (!sourceDay) return;

    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day) => {
        if (day.date !== targetDate) return day;
        return {
          ...day,
          meals: { ...sourceDay.meals },
        };
      }),
    }));
  };

  const copyPreviousWeek = () => {
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevPlanId = `week-${formatDate(prevWeekStart)}`;
    const prevPlan = allPlans[prevPlanId];

    if (!prevPlan) return;

    updatePlan((plan) => ({
      ...plan,
      days: plan.days.map((day, index) => {
        const prevDay = prevPlan.days[index];
        if (!prevDay) return day;
        return {
          ...day,
          meals: { ...prevDay.meals },
        };
      }),
    }));
  };

  // Computed
  const getDayNutrition = (date: string): NutritionInfo => {
    const day = currentWeekPlan.days.find((d) => d.date === date);
    if (!day) return EMPTY_NUTRITION;

    const nutritionValues: NutritionInfo[] = [];

    for (const mealType of ["breakfast", "lunch", "dinner"] as const) {
      const slot = day.meals[mealType];
      if (slot?.recipe) {
        nutritionValues.push(scaleNutrition(slot.recipe.nutrition, slot.servings / slot.recipe.servings));
      }
    }

    if (day.meals.snack) {
      for (const slot of day.meals.snack) {
        if (slot?.recipe) {
          nutritionValues.push(scaleNutrition(slot.recipe.nutrition, slot.servings / slot.recipe.servings));
        }
      }
    }

    if (nutritionValues.length === 0) return EMPTY_NUTRITION;
    return sumNutrition(nutritionValues);
  };

  const getWeekNutrition = (): NutritionInfo => {
    const dayNutritions = currentWeekPlan.days.map((day) =>
      getDayNutrition(day.date)
    );
    if (dayNutritions.every((n) => n.calories === 0)) return EMPTY_NUTRITION;
    return sumNutrition(dayNutritions);
  };

  const generateShoppingList = (): ShoppingItem[] => {
    const itemsMap: Record<string, ShoppingItem> = {};

    for (const day of currentWeekPlan.days) {
      const slots: (MealSlot | undefined)[] = [
        day.meals.breakfast,
        day.meals.lunch,
        day.meals.dinner,
        ...(day.meals.snack || []),
      ];

      for (const slot of slots) {
        if (!slot?.recipe) continue;

        const multiplier = slot.servings / slot.recipe.servings;

        for (const ingredient of slot.recipe.ingredients) {
          const key = `${ingredient.name.toLowerCase()}-${ingredient.unit}`;

          if (itemsMap[key]) {
            // Add quantity
            const existingQty = parseFloat(itemsMap[key].quantity) || 0;
            const addQty = (parseFloat(ingredient.quantity) || 0) * multiplier;
            itemsMap[key].quantity = String(Math.round((existingQty + addQty) * 10) / 10);
            if (!itemsMap[key].recipes.includes(slot.recipe.name)) {
              itemsMap[key].recipes.push(slot.recipe.name);
            }
          } else {
            itemsMap[key] = {
              id: key,
              name: ingredient.name,
              quantity: String(Math.round((parseFloat(ingredient.quantity) || 0) * multiplier * 10) / 10),
              unit: ingredient.unit,
              category: ingredient.category,
              recipes: [slot.recipe.name],
              checked: false,
            };
          }
        }
      }
    }

    return Object.values(itemsMap).sort((a, b) => a.category.localeCompare(b.category));
  };

  return (
    <MealPlanContext.Provider
      value={{
        currentWeekPlan,
        allPlans,
        isLoaded,
        goToWeek,
        goToNextWeek,
        goToPreviousWeek,
        goToCurrentWeek,
        addMealToSlot,
        removeMealFromSlot,
        updateServings,
        toggleLock,
        clearDay,
        clearWeek,
        copyDayToDay,
        copyPreviousWeek,
        getDayNutrition,
        getWeekNutrition,
        generateShoppingList,
      }}
    >
      {children}
    </MealPlanContext.Provider>
  );
}

export function useMealPlan() {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error("useMealPlan must be used within MealPlanProvider");
  }
  return context;
}
