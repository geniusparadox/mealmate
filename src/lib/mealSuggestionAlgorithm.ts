import { Recipe, CuisineType, MealType, DietType } from "@/types/recipe";

interface SuggestionContext {
  mealType?: MealType;
  recentMealIds?: string[];
  preferredCuisines?: CuisineType[];
  dietType?: DietType;
  spiceLevelMax?: number;
  maxCookTime?: number;
  preferQuickMeals?: boolean;
}

interface ScoredRecipe {
  recipe: Recipe;
  score: number;
  reasons: string[];
}

/**
 * Calculate a score for a recipe based on user context
 * Higher score = better match
 */
function calculateRecipeScore(
  recipe: Recipe,
  context: SuggestionContext
): ScoredRecipe {
  let score = 100;
  const reasons: string[] = [];

  // 1. Meal type match (high priority)
  if (context.mealType && recipe.mealType.includes(context.mealType)) {
    score += 30;
    reasons.push(`Perfect for ${context.mealType}`);
  } else if (context.mealType && !recipe.mealType.includes(context.mealType)) {
    score -= 50; // Significant penalty for wrong meal type
  }

  // 2. Variety - haven't eaten recently (medium-high priority)
  if (context.recentMealIds && context.recentMealIds.length > 0) {
    if (!context.recentMealIds.includes(recipe.id)) {
      score += 25;
      reasons.push("Something different");
    } else {
      // Recent meals get penalized based on how recently they were eaten
      const recentIndex = context.recentMealIds.indexOf(recipe.id);
      if (recentIndex >= 0) {
        score -= 30 - recentIndex * 3; // More recent = bigger penalty
      }
    }
  }

  // 3. Cuisine preference match (medium priority)
  if (context.preferredCuisines && context.preferredCuisines.length > 0) {
    const cuisineIndex = context.preferredCuisines.indexOf(recipe.cuisine);
    if (cuisineIndex >= 0) {
      // Earlier in the list = higher priority
      score += 20 - cuisineIndex * 2;
      reasons.push(`Your favorite: ${recipe.cuisine}`);
    }
  }

  // 4. Spice level preference (important for user comfort)
  if (context.spiceLevelMax !== undefined) {
    if (recipe.spiceLevel <= context.spiceLevelMax) {
      score += 10;
      if (recipe.spiceLevel === context.spiceLevelMax) {
        reasons.push("Just the right spice level");
      }
    } else {
      score -= 40; // Significant penalty for too spicy
    }
  }

  // 5. Time constraint (practical consideration)
  if (context.maxCookTime !== undefined) {
    const totalTime = recipe.prepTime + recipe.cookTime;
    if (totalTime <= context.maxCookTime) {
      score += 15;
      if (totalTime <= context.maxCookTime * 0.5) {
        score += 10;
        reasons.push("Quick to make");
      }
    } else {
      // Proportional penalty for exceeding time
      const overageRatio = totalTime / context.maxCookTime;
      score -= Math.min(30, overageRatio * 15);
    }
  }

  // 6. Quick meal preference
  if (context.preferQuickMeals && recipe.isQuickMeal) {
    score += 15;
    reasons.push("Ready in under 30 min");
  }

  // 7. Bonus for meal prep friendly (slightly favored)
  if (recipe.isMealPrep) {
    score += 5;
  }

  // 8. Bonus for one-pot meals (convenience)
  if (recipe.isOnePot) {
    score += 5;
    reasons.push("Easy cleanup");
  }

  // Ensure score doesn't go below 0
  score = Math.max(0, score);

  return { recipe, score, reasons: reasons.slice(0, 3) };
}

/**
 * Filter recipes based on hard constraints
 */
function filterRecipes(
  recipes: Recipe[],
  context: SuggestionContext
): Recipe[] {
  return recipes.filter((recipe) => {
    // Diet type is a hard constraint
    if (context.dietType) {
      if (context.dietType === "veg" && recipe.dietType !== "veg") {
        return false;
      }
      if (context.dietType === "egg" && recipe.dietType !== "veg" && recipe.dietType !== "egg") {
        // Eggetarian: show veg and egg recipes only
        return false;
      }
      if (context.dietType === "non-veg" && recipe.dietType !== "non-veg") {
        // Non-veg: show only non-veg recipes (meat/fish)
        return false;
      }
    }

    return true;
  });
}

/**
 * Get smart meal suggestions
 * Returns top recipes sorted by score with reasons
 */
export function getSmartSuggestions(
  recipes: Recipe[],
  context: SuggestionContext,
  limit: number = 5
): ScoredRecipe[] {
  // First filter by hard constraints
  const filteredRecipes = filterRecipes(recipes, context);

  // Score all remaining recipes
  const scoredRecipes = filteredRecipes.map((recipe) =>
    calculateRecipeScore(recipe, context)
  );

  // Sort by score (highest first) and return top N
  return scoredRecipes
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get a random recipe from filtered list
 * Weighted by score for better randomness
 */
export function getWeightedRandomRecipe(
  recipes: Recipe[],
  context: SuggestionContext
): Recipe | null {
  const filteredRecipes = filterRecipes(recipes, context);

  if (filteredRecipes.length === 0) return null;

  const scoredRecipes = filteredRecipes.map((recipe) =>
    calculateRecipeScore(recipe, context)
  );

  // Calculate total score for weighted selection
  const totalScore = scoredRecipes.reduce((sum, sr) => sum + sr.score, 0);

  // Random weighted selection
  let random = Math.random() * totalScore;
  for (const sr of scoredRecipes) {
    random -= sr.score;
    if (random <= 0) {
      return sr.recipe;
    }
  }

  // Fallback to last recipe
  return scoredRecipes[scoredRecipes.length - 1].recipe;
}

/**
 * Filter recipes with multiple criteria
 */
export function filterRecipesWithCriteria(
  recipes: Recipe[],
  criteria: {
    mealType?: MealType | "all";
    dietType?: DietType | "all";
    cuisines?: CuisineType[];
    maxCookTime?: number | null;
    spiceLevelMax?: number;
    searchQuery?: string;
  }
): Recipe[] {
  return recipes.filter((recipe) => {
    // Meal type filter
    if (
      criteria.mealType &&
      criteria.mealType !== "all" &&
      !recipe.mealType.includes(criteria.mealType)
    ) {
      return false;
    }

    // Diet type filter
    if (criteria.dietType && criteria.dietType !== "all") {
      if (criteria.dietType === "veg" && recipe.dietType !== "veg") {
        return false;
      }
      if (criteria.dietType === "egg" && recipe.dietType !== "veg" && recipe.dietType !== "egg") {
        // Eggetarian: show veg and egg recipes only
        return false;
      }
      if (criteria.dietType === "non-veg" && recipe.dietType !== "non-veg") {
        // Non-veg: show only non-veg recipes (meat/fish)
        return false;
      }
    }

    // Cuisine filter
    if (criteria.cuisines && criteria.cuisines.length > 0) {
      if (!criteria.cuisines.includes(recipe.cuisine)) {
        return false;
      }
    }

    // Time filter
    if (criteria.maxCookTime) {
      const totalTime = recipe.prepTime + recipe.cookTime;
      if (totalTime > criteria.maxCookTime) {
        return false;
      }
    }

    // Spice level filter
    if (criteria.spiceLevelMax && recipe.spiceLevel > criteria.spiceLevelMax) {
      return false;
    }

    // Search query
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      const matchesName = recipe.name.toLowerCase().includes(query);
      const matchesDescription = recipe.description.toLowerCase().includes(query);
      const matchesTags = recipe.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      const matchesCuisine = recipe.cuisine.toLowerCase().includes(query);

      if (!matchesName && !matchesDescription && !matchesTags && !matchesCuisine) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Filter recipes based on available ingredients
 * Returns recipes where at least one ingredient matches (or threshold percentage)
 */
export function filterByAvailableIngredients(
  recipes: Recipe[],
  availableIngredients: string[],
  threshold: number = 0.05 // At least 1 ingredient must match (5% = 1 in 20)
): Recipe[] {
  if (availableIngredients.length === 0) {
    return recipes;
  }

  // Normalize available ingredients for matching
  const normalizedAvailable = availableIngredients.map((i) =>
    i.toLowerCase().trim()
  );

  // Get all variations for each available ingredient upfront
  const allVariations = normalizedAvailable.flatMap((ing) =>
    getIngredientVariations(ing)
  );

  const matchedRecipes = recipes
    .map((recipe) => {
      // Check ALL ingredients (not just required) for better matching
      const allIngredients = recipe.ingredients;

      if (allIngredients.length === 0) {
        return { recipe, matchCount: 0, totalIngredients: 0 };
      }

      // Count how many ingredients match
      let matchCount = 0;
      for (const ingredient of allIngredients) {
        const ingredientName = ingredient.name.toLowerCase().trim();

        // Check if any available ingredient or variation matches
        const hasMatch = normalizedAvailable.some((available) => {
          // Exact match
          if (ingredientName === available) return true;

          // Partial match (ingredient contains available or vice versa)
          if (ingredientName.includes(available) || available.includes(ingredientName)) {
            return true;
          }

          return false;
        }) || allVariations.some((variation) => {
          // Check variations
          return ingredientName.includes(variation) || variation.includes(ingredientName);
        });

        if (hasMatch) {
          matchCount++;
        }
      }

      return { recipe, matchCount, totalIngredients: allIngredients.length };
    })
    .filter(({ matchCount }) => matchCount > 0) // At least 1 match
    .sort((a, b) => {
      // Sort by match count (more matches first)
      return b.matchCount - a.matchCount;
    })
    .map(({ recipe }) => recipe);

  return matchedRecipes;
}

/**
 * Get common variations of an ingredient name
 */
function getIngredientVariations(ingredient: string): string[] {
  const variations: string[] = [ingredient];
  const lower = ingredient.toLowerCase();

  // Common mappings
  const mappings: Record<string, string[]> = {
    chicken: ["chicken breast", "chicken thigh", "chicken wings", "poultry", "chicken pieces"],
    potato: ["potatoes", "aloo", "potato"],
    tomato: ["tomatoes", "tamatar", "tomato"],
    onion: ["onions", "pyaaz", "onion"],
    garlic: ["lahsun", "garlic cloves"],
    ginger: ["adrak"],
    paneer: ["cottage cheese", "indian cheese"],
    curd: ["yogurt", "dahi", "yoghurt", "curd"],
    rice: ["basmati", "chawal", "basmati rice"],
    spinach: ["palak", "spinach leaves"],
    beans: ["green beans", "french beans", "string beans", "rajma", "kidney beans", "mixed vegetables"],
    carrot: ["carrots", "gajar"],
    peas: ["green peas", "matar", "frozen peas"],
    capsicum: ["bell pepper", "shimla mirch", "green pepper", "red pepper"],
    cabbage: ["patta gobhi"],
    cauliflower: ["gobi", "phool gobhi"],
    corn: ["sweet corn", "makai", "baby corn"],
    mushroom: ["mushrooms", "button mushroom"],
    "methi (fenugreek)": ["methi", "fenugreek", "methi leaves"],
    "bottle gourd (lauki)": ["lauki", "bottle gourd", "dudhi"],
    "brinjal (eggplant)": ["brinjal", "eggplant", "baingan", "aubergine"],
    "okra (ladies finger)": ["okra", "ladies finger", "bhindi"],
    "bitter gourd": ["karela"],
    egg: ["eggs", "egg"],
    fish: ["pomfret", "salmon", "tuna", "mackerel", "rohu", "fish fillet"],
    prawns: ["shrimp", "jhinga", "prawn"],
    mutton: ["lamb", "goat meat", "goat"],
    dal: ["toor dal", "chana dal", "moong dal", "urad dal", "masoor dal", "lentils", "daal"],
    flour: ["wheat flour", "atta", "maida", "all-purpose flour"],
    noodles: ["hakka noodles", "chow mein", "instant noodles"],
    tofu: ["bean curd", "soy paneer"],
    soy: ["soy sauce", "soya"],
  };

  // Add mapped variations
  for (const [key, values] of Object.entries(mappings)) {
    if (lower.includes(key) || values.some((v) => lower.includes(v))) {
      variations.push(key, ...values);
    }
  }

  return [...new Set(variations)];
}

/**
 * Calculate ingredient match score for a recipe
 * Returns detailed matching information
 */
export function getIngredientMatchScore(
  recipe: Recipe,
  availableIngredients: string[]
): {
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
} {
  if (availableIngredients.length === 0) {
    return {
      matchPercentage: 0,
      matchedIngredients: [],
      missingIngredients: recipe.ingredients
        .filter((i) => !i.isOptional)
        .map((i) => i.name),
    };
  }

  const normalizedAvailable = availableIngredients.map((i) =>
    i.toLowerCase().trim()
  );

  const requiredIngredients = recipe.ingredients.filter((i) => !i.isOptional);
  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  for (const ingredient of requiredIngredients) {
    const ingredientName = ingredient.name.toLowerCase().trim();

    const hasMatch = normalizedAvailable.some((available) => {
      if (ingredientName === available) return true;
      if (
        ingredientName.includes(available) ||
        available.includes(ingredientName)
      )
        return true;
      const variations = getIngredientVariations(available);
      return variations.some(
        (v) => ingredientName.includes(v) || v.includes(ingredientName)
      );
    });

    if (hasMatch) {
      matchedIngredients.push(ingredient.name);
    } else {
      missingIngredients.push(ingredient.name);
    }
  }

  const matchPercentage =
    requiredIngredients.length > 0
      ? matchedIngredients.length / requiredIngredients.length
      : 0;

  return { matchPercentage, matchedIngredients, missingIngredients };
}
