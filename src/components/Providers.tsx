"use client";

import { ReactNode } from "react";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { NutritionProvider } from "@/contexts/NutritionContext";
import { MealPlanProvider } from "@/contexts/MealPlanContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserPreferencesProvider>
      <NutritionProvider>
        <MealPlanProvider>{children}</MealPlanProvider>
      </NutritionProvider>
    </UserPreferencesProvider>
  );
}
