"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { getRecipeById, allRecipes } from "@/data/recipes";
import { CUISINE_INFO } from "@/types/recipe";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge, DietBadge, SpiceBadge } from "@/components/ui/Badge";
import { CircularProgress } from "@/components/ui/ProgressBar";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Lightbulb,
  ShoppingBag,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RecipeDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const recipe = getRecipeById(id);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Recipe Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The recipe you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/recipes">
          <Button>Browse All Recipes</Button>
        </Link>
      </div>
    );
  }

  const cuisineInfo = CUISINE_INFO[recipe.cuisine];
  const totalTime = recipe.prepTime + recipe.cookTime;

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const progress = (completedSteps.length / recipe.steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Header */}
      <div
        className="relative rounded-2xl p-6 sm:p-8 mb-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${cuisineInfo?.color || "#f97316"}, ${cuisineInfo?.color || "#f97316"}cc)`,
        }}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <DietBadge type={recipe.dietType} />
              <Badge variant="default" size="sm">
                {cuisineInfo?.name}
              </Badge>
              {recipe.isQuickMeal && (
                <Badge variant="success" size="sm">
                  Quick Meal
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{recipe.name}</h1>
            {recipe.nameLocal && (
              <p className="text-xl opacity-90">{recipe.nameLocal}</p>
            )}
            <p className="mt-3 opacity-90 max-w-xl">{recipe.description}</p>
          </div>
          <div className="flex-shrink-0">
            <ChefHat className="w-20 h-20 opacity-30" />
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <div>
              <div className="font-semibold">{totalTime} min</div>
              <div className="text-sm opacity-80">
                Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <div>
              <div className="font-semibold">{recipe.servings} servings</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <div>
              <div className="font-semibold">{recipe.difficulty}</div>
              <div className="text-sm opacity-80">
                {"🌶️".repeat(recipe.spiceLevel)} spice
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredients */}
          <Card>
            <CardHeader
              title="Ingredients"
              subtitle={`${recipe.ingredients.length} items`}
              action={
                <ShoppingBag className="w-5 h-5 text-gray-400" />
              }
            />
            <CardBody>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        ingredient.category === "vegetable"
                          ? "bg-green-500"
                          : ingredient.category === "protein"
                          ? "bg-red-500"
                          : ingredient.category === "spice"
                          ? "bg-yellow-500"
                          : ingredient.category === "dairy"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {ingredient.name}
                    </span>
                    {ingredient.isOptional && (
                      <span className="text-xs text-gray-400">(optional)</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader
              title="Instructions"
              subtitle={`${recipe.steps.length} steps`}
              action={
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {completedSteps.length}/{recipe.steps.length} done
                  </span>
                </div>
              }
            />
            <CardBody>
              <div className="space-y-4">
                {recipe.steps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className={`flex gap-4 p-3 rounded-lg transition-colors cursor-pointer ${
                      completedSteps.includes(step.stepNumber)
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => toggleStep(step.stepNumber)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSteps.includes(step.stepNumber)
                          ? "bg-green-500 text-white"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                      }`}
                    >
                      {completedSteps.includes(step.stepNumber) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.stepNumber
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-gray-900 dark:text-white ${
                          completedSteps.includes(step.stepNumber)
                            ? "line-through opacity-60"
                            : ""
                        }`}
                      >
                        {step.instruction}
                      </p>
                      {step.duration && (
                        <p className="text-sm text-gray-500 mt-1">
                          ~{step.duration} minutes
                        </p>
                      )}
                      {step.tip && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          {step.tip}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <Card>
              <CardHeader title="Pro Tips" />
              <CardBody>
                <ul className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 dark:text-gray-300"
                    >
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <CardBody className="text-center">
              <CircularProgress
                value={progress}
                size={100}
                strokeWidth={10}
                variant={progress === 100 ? "success" : "default"}
                label="Complete"
              />
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {progress === 100
                  ? "All steps completed!"
                  : "Click steps to mark as done"}
              </p>
            </CardBody>
          </Card>

          {/* Nutrition */}
          <Card>
            <CardHeader title="Nutrition" subtitle="Per serving" />
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: "Calories", value: recipe.nutrition.calories, unit: "kcal", color: "orange" },
                  { label: "Protein", value: recipe.nutrition.protein, unit: "g", color: "red" },
                  { label: "Carbs", value: recipe.nutrition.carbohydrates, unit: "g", color: "blue" },
                  { label: "Fat", value: recipe.nutrition.fat, unit: "g", color: "yellow" },
                  { label: "Fiber", value: recipe.nutrition.fiber, unit: "g", color: "green" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {item.value}
                      {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Serve with */}
          {recipe.serveWith && recipe.serveWith.length > 0 && (
            <Card>
              <CardHeader title="Serve With" />
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {recipe.serveWith.map((item, index) => (
                    <Badge key={index} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader title="Tags" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
