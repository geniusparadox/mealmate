"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserPreferences,
  MealHistoryEntry,
  DEFAULT_PREFERENCES,
  CuisinePreference,
} from "@/types/user";
import { CuisineType, DietType, SpiceLevel } from "@/types/recipe";
import { NutritionGoals } from "@/types/nutrition";

interface UserPreferencesContextType {
  preferences: UserPreferences;
  mealHistory: MealHistoryEntry[];
  availableIngredients: string[];
  isLoaded: boolean;

  // Preference setters
  setDietaryPreference: (pref: DietType) => void;
  setCuisinePreferences: (cuisines: CuisinePreference[]) => void;
  toggleCuisine: (cuisine: CuisineType, enabled: boolean) => void;
  setCuisinePriority: (cuisine: CuisineType, priority: number) => void;
  setAllergies: (allergies: string[]) => void;
  addAllergy: (allergy: string) => void;
  removeAllergy: (allergy: string) => void;
  setDislikedIngredients: (ingredients: string[]) => void;
  setSpiceTolerance: (level: SpiceLevel) => void;
  setMaxCookingTime: (time: number | undefined) => void;
  setPreferQuickMeals: (prefer: boolean) => void;
  setNutritionGoals: (goals: NutritionGoals) => void;

  // Available ingredients
  setAvailableIngredients: (ingredients: string[]) => void;
  addAvailableIngredient: (ingredient: string) => void;
  removeAvailableIngredient: (ingredient: string) => void;
  clearAvailableIngredients: () => void;

  // Meal history
  addMealToHistory: (entry: Omit<MealHistoryEntry, "id" | "timestamp">) => void;
  removeMealFromHistory: (id: string) => void;
  clearMealHistory: () => void;
  getRecentMealIds: (days?: number) => string[];

  // Reset
  resetPreferences: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

const STORAGE_KEY = "mealmate_preferences";
const HISTORY_KEY = "mealmate_meal_history";
const INGREDIENTS_KEY = "mealmate_available_ingredients";

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [mealHistory, setMealHistory] = useState<MealHistoryEntry[]>([]);
  const [availableIngredients, setAvailableIngredientsState] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem(STORAGE_KEY);
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      const storedIngredients = localStorage.getItem(INGREDIENTS_KEY);

      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }
      if (storedHistory) {
        setMealHistory(JSON.parse(storedHistory));
      }
      if (storedIngredients) {
        setAvailableIngredientsState(JSON.parse(storedIngredients));
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  // Save meal history to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(mealHistory));
    }
  }, [mealHistory, isLoaded]);

  // Save available ingredients to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(availableIngredients));
    }
  }, [availableIngredients, isLoaded]);

  // Preference setters
  const setDietaryPreference = (pref: DietType) => {
    setPreferences((prev) => ({ ...prev, dietaryPreference: pref }));
  };

  const setCuisinePreferences = (cuisines: CuisinePreference[]) => {
    setPreferences((prev) => ({ ...prev, cuisinePreferences: cuisines }));
  };

  const toggleCuisine = (cuisine: CuisineType, enabled: boolean) => {
    setPreferences((prev) => {
      const existing = prev.cuisinePreferences.find((c) => c.cuisine === cuisine);
      if (existing) {
        return {
          ...prev,
          cuisinePreferences: prev.cuisinePreferences.map((c) =>
            c.cuisine === cuisine ? { ...c, enabled } : c
          ),
        };
      } else {
        return {
          ...prev,
          cuisinePreferences: [
            ...prev.cuisinePreferences,
            { cuisine, priority: 3, enabled },
          ],
        };
      }
    });
  };

  const setCuisinePriority = (cuisine: CuisineType, priority: number) => {
    setPreferences((prev) => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.map((c) =>
        c.cuisine === cuisine ? { ...c, priority } : c
      ),
    }));
  };

  const setAllergies = (allergies: string[]) => {
    setPreferences((prev) => ({ ...prev, allergies }));
  };

  const addAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: [...new Set([...prev.allergies, allergy])],
    }));
  };

  const removeAllergy = (allergy: string) => {
    setPreferences((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const setDislikedIngredients = (ingredients: string[]) => {
    setPreferences((prev) => ({ ...prev, dislikedIngredients: ingredients }));
  };

  const setSpiceTolerance = (level: SpiceLevel) => {
    setPreferences((prev) => ({ ...prev, spiceToleranceMax: level }));
  };

  const setMaxCookingTime = (time: number | undefined) => {
    setPreferences((prev) => ({ ...prev, maxCookingTime: time }));
  };

  const setPreferQuickMeals = (prefer: boolean) => {
    setPreferences((prev) => ({ ...prev, preferQuickMeals: prefer }));
  };

  const setNutritionGoals = (goals: NutritionGoals) => {
    setPreferences((prev) => ({ ...prev, nutritionGoals: goals }));
  };

  // Meal history
  const addMealToHistory = (entry: Omit<MealHistoryEntry, "id" | "timestamp">) => {
    const newEntry: MealHistoryEntry = {
      ...entry,
      id: `meal-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMealHistory((prev) => [newEntry, ...prev].slice(0, 100)); // Keep last 100
  };

  const removeMealFromHistory = (id: string) => {
    setMealHistory((prev) => prev.filter((m) => m.id !== id));
  };

  const clearMealHistory = () => {
    setMealHistory([]);
  };

  const getRecentMealIds = (days: number = 7): string[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return mealHistory
      .filter((m) => new Date(m.timestamp) > cutoff)
      .map((m) => m.recipeId);
  };

  // Available ingredients
  const setAvailableIngredients = (ingredients: string[]) => {
    setAvailableIngredientsState(ingredients);
  };

  const addAvailableIngredient = (ingredient: string) => {
    const normalized = ingredient.trim().toLowerCase();
    if (normalized && !availableIngredients.some(i => i.toLowerCase() === normalized)) {
      setAvailableIngredientsState((prev) => [...prev, ingredient.trim()]);
    }
  };

  const removeAvailableIngredient = (ingredient: string) => {
    setAvailableIngredientsState((prev) => prev.filter((i) => i !== ingredient));
  };

  const clearAvailableIngredients = () => {
    setAvailableIngredientsState([]);
  };

  // Reset
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    setMealHistory([]);
    setAvailableIngredientsState([]);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        mealHistory,
        availableIngredients,
        isLoaded,
        setDietaryPreference,
        setCuisinePreferences,
        toggleCuisine,
        setCuisinePriority,
        setAllergies,
        addAllergy,
        removeAllergy,
        setDislikedIngredients,
        setSpiceTolerance,
        setMaxCookingTime,
        setPreferQuickMeals,
        setNutritionGoals,
        setAvailableIngredients,
        addAvailableIngredient,
        removeAvailableIngredient,
        clearAvailableIngredients,
        addMealToHistory,
        removeMealFromHistory,
        clearMealHistory,
        getRecentMealIds,
        resetPreferences,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error("useUserPreferences must be used within UserPreferencesProvider");
  }
  return context;
}
