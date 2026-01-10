"use client";

import { useState } from "react";
import { useNutrition } from "@/contexts/NutritionContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CircularProgress, ProgressBar } from "@/components/ui/ProgressBar";
import { NUTRITION_PRESETS } from "@/types/nutrition";
import {
  Target,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Apple,
  Calendar,
  TrendingUp,
  Trash2,
  ChevronRight,
  Utensils,
  Clock,
  Settings,
} from "lucide-react";
import Link from "next/link";

const MEAL_TYPE_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MEAL_TYPE_COLORS = {
  breakfast: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  lunch: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  dinner: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  snack: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export default function NutritionPage() {
  const {
    goals,
    todaysMeals,
    todaysTotals,
    todaysProgress,
    weeklyLogs,
    isLoaded,
    removeMeal,
    clearTodaysMeals,
    getWeekSummary,
  } = useNutrition();

  const [showGoalSettings, setShowGoalSettings] = useState(false);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading nutrition data...</div>
      </div>
    );
  }

  const weekSummary = getWeekSummary();

  const getStatusColor = (status: "under" | "on-track" | "over") => {
    switch (status) {
      case "under":
        return "text-blue-500";
      case "on-track":
        return "text-green-500";
      case "over":
        return "text-red-500";
    }
  };

  const getStatusBg = (status: "under" | "on-track" | "over") => {
    switch (status) {
      case "under":
        return "bg-blue-500";
      case "on-track":
        return "bg-green-500";
      case "over":
        return "bg-red-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Nutrition Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your daily nutrition and progress towards your goals
          </p>
        </div>
        <Link href="/preferences">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Goals
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Progress */}
          <Card>
            <CardHeader
              title="Today's Progress"
              subtitle={new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
              action={
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      todaysProgress.calories.status === "on-track"
                        ? "success"
                        : todaysProgress.calories.status === "over"
                        ? "danger"
                        : "secondary"
                    }
                  >
                    {Math.round(todaysProgress.calories.percentage)}% of goal
                  </Badge>
                </div>
              }
            />
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {/* Calories - larger display */}
                <div className="col-span-2 sm:col-span-1 flex justify-center">
                  <CircularProgress
                    value={Math.min(todaysProgress.calories.percentage, 100)}
                    size={140}
                    strokeWidth={12}
                    variant={
                      todaysProgress.calories.status === "on-track"
                        ? "success"
                        : todaysProgress.calories.status === "over"
                        ? "danger"
                        : "default"
                    }
                    label={
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {todaysTotals.calories}
                        </div>
                        <div className="text-xs text-gray-500">
                          / {goals.dailyCalories} kcal
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* Other macros */}
                <div className="col-span-2 space-y-4">
                  {[
                    {
                      label: "Protein",
                      icon: Beef,
                      progress: todaysProgress.protein,
                      color: "red",
                    },
                    {
                      label: "Carbs",
                      icon: Wheat,
                      progress: todaysProgress.carbs,
                      color: "blue",
                    },
                    {
                      label: "Fat",
                      icon: Droplets,
                      progress: todaysProgress.fat,
                      color: "yellow",
                    },
                    {
                      label: "Fiber",
                      icon: Apple,
                      progress: todaysProgress.fiber,
                      color: "green",
                    },
                  ].map((item) => {
                    if (!item.progress) return null;
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.progress.consumed}g / {item.progress.goal}g
                          </span>
                        </div>
                        <ProgressBar
                          value={Math.min(item.progress.percentage, 100)}
                          variant={
                            item.progress.status === "on-track"
                              ? "success"
                              : item.progress.status === "over"
                              ? "danger"
                              : "default"
                          }
                          size="sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Today's Meals */}
          <Card>
            <CardHeader
              title="Today's Meals"
              subtitle={`${todaysMeals.length} meals logged`}
              action={
                todaysMeals.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Clear all meals logged today?")) {
                        clearTodaysMeals();
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )
              }
            />
            <CardBody>
              {todaysMeals.length === 0 ? (
                <div className="text-center py-8">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No meals logged today</p>
                  <Link href="/recipes">
                    <Button>Browse Recipes</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            MEAL_TYPE_COLORS[meal.mealType]
                          }`}
                        >
                          {MEAL_TYPE_LABELS[meal.mealType]}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {meal.recipeName}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{meal.servings} serving{meal.servings > 1 ? "s" : ""}</span>
                            <span>{meal.nutrition.calories} kcal</span>
                            <span>{meal.nutrition.protein}g protein</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeMeal(meal.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader
              title="Weekly Overview"
              subtitle={`${weekSummary.daysLogged} days logged this week`}
              action={<TrendingUp className="w-5 h-5 text-gray-400" />}
            />
            <CardBody>
              {weekSummary.daysLogged === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No data logged this week</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { label: "Avg Calories", value: weekSummary.averages.calories, unit: "kcal", goal: goals.dailyCalories },
                      { label: "Avg Protein", value: weekSummary.averages.protein, unit: "g", goal: goals.dailyProtein },
                      { label: "Avg Carbs", value: weekSummary.averages.carbohydrates, unit: "g", goal: goals.dailyCarbs },
                      { label: "Avg Fat", value: weekSummary.averages.fat, unit: "g", goal: goals.dailyFat },
                      { label: "Avg Fiber", value: weekSummary.averages.fiber, unit: "g", goal: goals.dailyFiber || 25 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                      >
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-400">
                          {Math.round((item.value / item.goal) * 100)}% of goal
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Daily breakdown */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Daily Log
                    </p>
                    <div className="space-y-2">
                      {weeklyLogs.slice(0, 7).map((log) => {
                        const dateObj = new Date(log.date);
                        const isToday = log.date === new Date().toISOString().split("T")[0];
                        const caloriePercent = Math.round(
                          (log.totals.calories / goals.dailyCalories) * 100
                        );

                        return (
                          <div
                            key={log.date}
                            className={`flex items-center justify-between p-2 rounded ${
                              isToday ? "bg-orange-50 dark:bg-orange-900/20" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-20 text-sm text-gray-600 dark:text-gray-400">
                                {isToday
                                  ? "Today"
                                  : dateObj.toLocaleDateString("en-US", {
                                      weekday: "short",
                                    })}
                              </span>
                              <div className="w-32">
                                <ProgressBar
                                  value={Math.min(caloriePercent, 100)}
                                  size="sm"
                                  variant={
                                    caloriePercent >= 80 && caloriePercent <= 110
                                      ? "success"
                                      : caloriePercent > 110
                                      ? "danger"
                                      : "default"
                                  }
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {log.totals.calories}
                              </span>
                              <span className="text-gray-400 text-sm"> kcal</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Goals */}
          <Card>
            <CardHeader
              title="Daily Goals"
              action={
                <Link href="/preferences">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              }
            />
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: "Calories", value: goals.dailyCalories, unit: "kcal", icon: Flame, color: "text-orange-500" },
                  { label: "Protein", value: goals.dailyProtein, unit: "g", icon: Beef, color: "text-red-500" },
                  { label: "Carbs", value: goals.dailyCarbs, unit: "g", icon: Wheat, color: "text-blue-500" },
                  { label: "Fat", value: goals.dailyFat, unit: "g", icon: Droplets, color: "text-yellow-500" },
                  { label: "Fiber", value: goals.dailyFiber || 25, unit: "g", icon: Apple, color: "text-green-500" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.label}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.value} {item.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader title="Remaining Today" />
            <CardBody>
              <div className="space-y-3">
                {[
                  {
                    label: "Calories",
                    remaining: todaysProgress.calories.remaining,
                    status: todaysProgress.calories.status,
                    unit: "kcal",
                  },
                  {
                    label: "Protein",
                    remaining: todaysProgress.protein.remaining,
                    status: todaysProgress.protein.status,
                    unit: "g",
                  },
                  {
                    label: "Carbs",
                    remaining: todaysProgress.carbs.remaining,
                    status: todaysProgress.carbs.status,
                    unit: "g",
                  },
                  {
                    label: "Fat",
                    remaining: todaysProgress.fat.remaining,
                    status: todaysProgress.fat.status,
                    unit: "g",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                    <span
                      className={`font-semibold ${getStatusColor(item.status)}`}
                    >
                      {item.status === "over" ? "+" : ""}
                      {item.remaining} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader title="Nutrition Tips" />
            <CardBody>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                {todaysProgress.protein.status === "under" && todaysProgress.protein.percentage < 50 && (
                  <p className="flex items-start gap-2">
                    <Beef className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    You&apos;re low on protein today. Try adding some dal, paneer, eggs, or chicken.
                  </p>
                )}
                {todaysProgress.fiber?.status === "under" && (
                  <p className="flex items-start gap-2">
                    <Apple className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Add some vegetables or whole grains to boost your fiber intake.
                  </p>
                )}
                {todaysProgress.calories.status === "over" && (
                  <p className="flex items-start gap-2">
                    <Flame className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    You&apos;ve exceeded your calorie goal. Consider lighter options for your next meal.
                  </p>
                )}
                {todaysProgress.calories.status === "on-track" && todaysProgress.protein.status === "on-track" && (
                  <p className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Great job! You&apos;re on track with your nutrition goals today.
                  </p>
                )}
                {todaysMeals.length === 0 && (
                  <p className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    Start logging your meals by selecting a recipe and choosing &quot;Log Meal&quot;.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
