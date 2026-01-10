import { Recipe } from "@/types/recipe";
import karnatakaData from "./karnataka.json";
import southIndianData from "./south-indian.json";
import northIndianData from "./north-indian.json";
import indoChineseData from "./indo-chinese.json";
import asianData from "./asian.json";
import worldData from "./world-cuisines.json";

// Type the imported data
interface RecipeData {
  recipes: Recipe[];
}

// Cast imports to proper type
const karnataka = karnatakaData as RecipeData;
const southIndian = southIndianData as RecipeData;
const northIndian = northIndianData as RecipeData;
const indoChinese = indoChineseData as RecipeData;
const asian = asianData as RecipeData;
const world = worldData as RecipeData;

// Combine all recipes
export const allRecipes: Recipe[] = [
  ...karnataka.recipes,
  ...southIndian.recipes,
  ...northIndian.recipes,
  ...indoChinese.recipes,
  ...asian.recipes,
  ...world.recipes,
];

// Get recipes by cuisine
export function getRecipesByCuisine(cuisine: string): Recipe[] {
  return allRecipes.filter((recipe) => recipe.cuisine === cuisine);
}

// Get recipes by meal type
export function getRecipesByMealType(mealType: string): Recipe[] {
  return allRecipes.filter((recipe) => recipe.mealType.includes(mealType as Recipe["mealType"][number]));
}

// Get recipes by diet type
export function getRecipesByDietType(dietType: string): Recipe[] {
  return allRecipes.filter((recipe) => recipe.dietType === dietType);
}

// Get recipe by ID
export function getRecipeById(id: string): Recipe | undefined {
  return allRecipes.find((recipe) => recipe.id === id);
}

// Search recipes
export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return allRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      recipe.cuisine.toLowerCase().includes(lowerQuery)
  );
}

// Get quick meals (< 30 mins)
export function getQuickMeals(): Recipe[] {
  return allRecipes.filter((recipe) => recipe.isQuickMeal);
}

// Get recipes suitable for meal prep
export function getMealPrepRecipes(): Recipe[] {
  return allRecipes.filter((recipe) => recipe.isMealPrep);
}

// Export cuisine-specific recipes
export const karnatakaRecipes = karnataka.recipes;
export const southIndianRecipes = southIndian.recipes;
export const northIndianRecipes = northIndian.recipes;
export const indoChineseRecipes = indoChinese.recipes;
export const asianRecipes = asian.recipes;
export const worldRecipes = world.recipes;

// Recipe statistics
export const recipeStats = {
  total: allRecipes.length,
  veg: allRecipes.filter((r) => r.dietType === "veg").length,
  nonVeg: allRecipes.filter((r) => r.dietType === "non-veg").length,
  egg: allRecipes.filter((r) => r.dietType === "egg").length,
  quickMeals: allRecipes.filter((r) => r.isQuickMeal).length,
  cuisines: [...new Set(allRecipes.map((r) => r.cuisine))].length,
};
