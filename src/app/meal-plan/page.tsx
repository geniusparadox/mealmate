"use client";

import { useState } from "react";
import { useMealPlan } from "@/contexts/MealPlanContext";
import { useNutrition } from "@/contexts/NutritionContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { allRecipes, getRecipeById } from "@/data/recipes";
import { Recipe, CUISINE_INFO, MealType } from "@/types/recipe";
import { MealSlot, ShoppingItem } from "@/types/mealPlan";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  X,
  Trash2,
  Lock,
  Unlock,
  Copy,
  ShoppingCart,
  Flame,
  Clock,
  ChefHat,
  Search,
  Check,
  Download,
} from "lucide-react";
import Link from "next/link";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

const MEAL_TYPE_COLORS = {
  breakfast: "bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20",
  lunch: "bg-orange-100 border-orange-300 dark:bg-orange-900/20",
  dinner: "bg-purple-100 border-purple-300 dark:bg-purple-900/20",
  snack: "bg-green-100 border-green-300 dark:bg-green-900/20",
};

const MEAL_TYPE_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default function MealPlanPage() {
  const {
    currentWeekPlan,
    isLoaded,
    goToNextWeek,
    goToPreviousWeek,
    goToCurrentWeek,
    addMealToSlot,
    removeMealFromSlot,
    toggleLock,
    clearDay,
    clearWeek,
    copyPreviousWeek,
    getDayNutrition,
    getWeekNutrition,
    generateShoppingList,
  } = useMealPlan();
  const { goals } = useNutrition();

  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    mealType: MealType;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  if (!isLoaded) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading meal plan...</div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const weekNutrition = getWeekNutrition();

  const openRecipePicker = (date: string, mealType: MealType) => {
    setSelectedSlot({ date, mealType });
    setSearchQuery("");
    setShowRecipePicker(true);
  };

  const selectRecipe = (recipe: Recipe) => {
    if (selectedSlot) {
      addMealToSlot(selectedSlot.date, selectedSlot.mealType, recipe);
      setShowRecipePicker(false);
      setSelectedSlot(null);
    }
  };

  const filteredRecipes = allRecipes.filter((recipe) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      recipe.name.toLowerCase().includes(query) ||
      recipe.cuisine.toLowerCase().includes(query) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const handleGenerateShoppingList = () => {
    setShoppingList(generateShoppingList());
    setShowShoppingList(true);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const exportShoppingList = () => {
    const text = shoppingList
      .map(
        (item) =>
          `${item.checked ? "[x]" : "[ ]"} ${item.quantity} ${item.unit} ${item.name} (for: ${item.recipes.join(", ")})`
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shopping-list-${currentWeekPlan.weekStart}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Weekly Meal Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan your meals for the week ahead
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={copyPreviousWeek}>
            <Copy className="w-4 h-4 mr-1" />
            Copy Last Week
          </Button>
          <Button variant="outline" onClick={handleGenerateShoppingList}>
            <ShoppingCart className="w-4 h-4 mr-1" />
            Shopping List
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(currentWeekPlan.weekStart).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date(currentWeekPlan.weekEnd).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={goToCurrentWeek}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Go to current week
              </button>
            </div>

            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </CardBody>
      </Card>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-6">
        {currentWeekPlan.days.map((day) => {
          const isToday = day.date === today;
          const dayNutrition = getDayNutrition(day.date);
          const caloriePercent = Math.round(
            (dayNutrition.calories / goals.dailyCalories) * 100
          );

          return (
            <Card
              key={day.date}
              className={`${isToday ? "ring-2 ring-orange-500" : ""}`}
            >
              <CardHeader
                title={
                  <div className="flex items-center justify-between">
                    <span className={isToday ? "text-orange-600" : ""}>
                      {day.dayOfWeek.slice(0, 3)}
                    </span>
                    {isToday && (
                      <Badge variant="warning" size="sm">
                        Today
                      </Badge>
                    )}
                  </div>
                }
                subtitle={new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              />
              <CardBody className="p-2 space-y-2">
                {/* Meal slots */}
                {(["breakfast", "lunch", "dinner"] as const).map((mealType) => {
                  const slot = day.meals[mealType];

                  return (
                    <div
                      key={mealType}
                      className={`p-2 rounded-lg border-2 border-dashed ${
                        slot
                          ? MEAL_TYPE_COLORS[mealType]
                          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {MEAL_TYPE_LABELS[mealType]}
                        </span>
                        {slot && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleLock(day.date, mealType)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {slot.isLocked ? (
                                <Lock className="w-3 h-3" />
                              ) : (
                                <Unlock className="w-3 h-3" />
                              )}
                            </button>
                            <button
                              onClick={() => removeMealFromSlot(day.date, mealType)}
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {slot?.recipe ? (
                        <Link
                          href={`/recipes/${slot.recipe.id}`}
                          className="block hover:opacity-80"
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {slot.recipe.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {slot.recipe.nutrition.calories} kcal
                          </p>
                        </Link>
                      ) : (
                        <button
                          onClick={() => openRecipePicker(day.date, mealType)}
                          className="w-full py-2 flex items-center justify-center gap-1 text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs">Add</span>
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* Day nutrition summary */}
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Daily</span>
                    <span
                      className={`font-medium ${
                        caloriePercent > 110
                          ? "text-red-500"
                          : caloriePercent >= 80
                          ? "text-green-500"
                          : "text-gray-600"
                      }`}
                    >
                      {dayNutrition.calories} kcal
                    </span>
                  </div>
                </div>

                {/* Clear day button */}
                {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                  <button
                    onClick={() => clearDay(day.date)}
                    className="w-full text-xs text-gray-400 hover:text-red-500 py-1"
                  >
                    Clear day
                  </button>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Week Summary */}
      <Card>
        <CardHeader
          title="Week Summary"
          action={
            <Button variant="ghost" size="sm" onClick={clearWeek}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Week
            </Button>
          }
        />
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total Calories", value: weekNutrition.calories, unit: "kcal" },
              { label: "Avg/Day", value: Math.round(weekNutrition.calories / 7), unit: "kcal" },
              { label: "Total Protein", value: weekNutrition.protein, unit: "g" },
              { label: "Total Carbs", value: weekNutrition.carbohydrates, unit: "g" },
              { label: "Total Fat", value: weekNutrition.fat, unit: "g" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
              >
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                  <span className="text-sm font-normal text-gray-400 ml-1">
                    {stat.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recipe Picker Modal */}
      <Modal
        isOpen={showRecipePicker}
        onClose={() => {
          setShowRecipePicker(false);
          setSelectedSlot(null);
        }}
        title={`Add ${selectedSlot?.mealType ? MEAL_TYPE_LABELS[selectedSlot.mealType] : "Meal"}`}
        size="lg"
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Recipe grid */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredRecipes.slice(0, 20).map((recipe) => {
              const cuisineInfo = CUISINE_INFO[recipe.cuisine];

              return (
                <button
                  key={recipe.id}
                  onClick={() => selectRecipe(recipe)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left flex items-center gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: cuisineInfo?.color + "20" }}
                  >
                    <ChefHat
                      className="w-5 h-5"
                      style={{ color: cuisineInfo?.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {recipe.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{cuisineInfo?.name}</span>
                      <span>-</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                      <span>-</span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.nutrition.calories} kcal
                      </span>
                    </div>
                  </div>
                  <Plus className="w-5 h-5 text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      </Modal>

      {/* Shopping List Modal */}
      <Modal
        isOpen={showShoppingList}
        onClose={() => setShowShoppingList(false)}
        title="Shopping List"
        size="lg"
      >
        <div className="space-y-4">
          {shoppingList.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No meals planned for this week. Add some meals to generate a shopping list.
            </p>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={exportShoppingList}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-1">
                {shoppingList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleShoppingItem(item.id)}
                    className={`w-full p-2 rounded-lg text-left flex items-center gap-3 transition-colors ${
                      item.checked
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.checked
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          item.checked
                            ? "text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.quantity} {item.unit} {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        For: {item.recipes.join(", ")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 text-center">
                  {shoppingList.filter((i) => i.checked).length} of{" "}
                  {shoppingList.length} items checked
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
