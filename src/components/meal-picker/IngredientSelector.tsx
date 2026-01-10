"use client";

import { useState } from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Carrot,
  Beef,
  Fish,
  Egg,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Refrigerator,
} from "lucide-react";

// Common vegetables grouped by category
const COMMON_VEGETABLES = {
  "Leafy Greens": [
    "Spinach",
    "Methi (Fenugreek)",
    "Palak",
    "Cabbage",
    "Lettuce",
    "Coriander",
    "Curry Leaves",
  ],
  "Root Vegetables": [
    "Potato",
    "Onion",
    "Carrot",
    "Beetroot",
    "Radish",
    "Ginger",
    "Garlic",
  ],
  "Gourds & Squash": [
    "Bottle Gourd (Lauki)",
    "Ridge Gourd",
    "Bitter Gourd",
    "Pumpkin",
    "Cucumber",
    "Zucchini",
  ],
  "Beans & Pods": [
    "Green Beans",
    "French Beans",
    "Cluster Beans",
    "Peas",
    "Broad Beans",
    "Drumstick",
  ],
  "Other Vegetables": [
    "Tomato",
    "Brinjal (Eggplant)",
    "Capsicum",
    "Cauliflower",
    "Broccoli",
    "Okra (Ladies Finger)",
    "Mushroom",
    "Corn",
    "Bell Pepper",
  ],
};

const COMMON_PROTEINS = {
  "Poultry": ["Chicken", "Chicken Breast", "Chicken Thigh", "Chicken Wings"],
  "Meat": ["Mutton", "Lamb", "Goat Meat", "Beef", "Pork"],
  "Seafood": [
    "Fish",
    "Prawns",
    "Shrimp",
    "Pomfret",
    "Salmon",
    "Tuna",
    "Mackerel",
    "Sardine",
    "Crab",
    "Squid",
  ],
  "Eggs & Dairy": ["Eggs", "Paneer", "Cottage Cheese", "Tofu", "Curd/Yogurt", "Milk"],
  "Legumes & Lentils": [
    "Toor Dal",
    "Chana Dal",
    "Moong Dal",
    "Urad Dal",
    "Masoor Dal",
    "Rajma (Kidney Beans)",
    "Chole (Chickpeas)",
    "Black Eyed Peas",
  ],
};

const PANTRY_STAPLES = [
  "Rice",
  "Wheat Flour (Atta)",
  "Rava (Semolina)",
  "Besan (Gram Flour)",
  "Poha",
  "Oats",
  "Bread",
  "Pasta",
  "Noodles",
  "Coconut",
  "Coconut Milk",
  "Tamarind",
  "Jaggery",
];

interface IngredientSelectorProps {
  onContinue?: () => void;
  showContinue?: boolean;
  compact?: boolean;
}

export function IngredientSelector({
  onContinue,
  showContinue = true,
  compact = false,
}: IngredientSelectorProps) {
  const {
    availableIngredients,
    addAvailableIngredient,
    removeAvailableIngredient,
    clearAvailableIngredients,
  } = useUserPreferences();

  const [newIngredient, setNewIngredient] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["Leafy Greens", "Poultry"]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isSelected = (ingredient: string) =>
    availableIngredients.some(
      (i) => i.toLowerCase() === ingredient.toLowerCase()
    );

  const handleAddCustom = () => {
    if (newIngredient.trim()) {
      addAvailableIngredient(newIngredient);
      setNewIngredient("");
    }
  };

  const renderIngredientButtons = (items: string[], icon?: React.ReactNode) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const selected = isSelected(item);
        return (
          <button
            key={item}
            onClick={() =>
              selected
                ? removeAvailableIngredient(
                    availableIngredients.find(
                      (i) => i.toLowerCase() === item.toLowerCase()
                    ) || item
                  )
                : addAvailableIngredient(item)
            }
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selected
                ? "bg-green-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {selected && <span>✓</span>}
            {item}
          </button>
        );
      })}
    </div>
  );

  const renderCollapsibleSection = (
    title: string,
    items: string[],
    icon: React.ReactNode
  ) => {
    const isExpanded = expandedSections.includes(title);
    const selectedCount = items.filter((item) => isSelected(item)).length;

    return (
      <div key={title} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <button
          onClick={() => toggleSection(title)}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium text-gray-900 dark:text-white">
              {title}
            </span>
            {selectedCount > 0 && (
              <Badge variant="success" size="sm">
                {selectedCount}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {isExpanded && (
          <div className="pb-3">{renderIngredientButtons(items)}</div>
        )}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Selected ingredients */}
        {availableIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableIngredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="success"
                className="flex items-center gap-1"
              >
                {ingredient}
                <button
                  onClick={() => removeAvailableIngredient(ingredient)}
                  className="ml-1 hover:text-red-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={clearAvailableIngredients}
              className="text-xs text-gray-500 hover:text-red-500"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Quick add */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add ingredient..."
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
          />
          <Button size="sm" onClick={handleAddCustom} disabled={!newIngredient.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <div className="flex items-center gap-2">
            <Refrigerator className="w-5 h-5 text-green-500" />
            What&apos;s in your kitchen?
          </div>
        }
        subtitle="Select ingredients you have available"
        action={
          availableIngredients.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAvailableIngredients}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )
        }
      />
      <CardBody>
        <div className="space-y-4">
          {/* Selected ingredients summary */}
          {availableIngredients.length > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                Selected ({availableIngredients.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {availableIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="success"
                    className="flex items-center gap-1"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeAvailableIngredient(ingredient)}
                      className="ml-1 hover:text-red-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Custom ingredient input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Type to add a custom ingredient..."
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            />
            <Button onClick={handleAddCustom} disabled={!newIngredient.trim()}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Vegetables section */}
          <div className="pt-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
              <Carrot className="w-5 h-5 text-orange-500" />
              Vegetables
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4">
              {Object.entries(COMMON_VEGETABLES).map(([category, items]) =>
                renderCollapsibleSection(
                  category,
                  items,
                  <span className="w-4 h-4 rounded-full bg-green-200 dark:bg-green-800" />
                )
              )}
            </div>
          </div>

          {/* Proteins section */}
          <div className="pt-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
              <Beef className="w-5 h-5 text-red-500" />
              Proteins
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-4">
              {Object.entries(COMMON_PROTEINS).map(([category, items]) =>
                renderCollapsibleSection(
                  category,
                  items,
                  category === "Seafood" ? (
                    <Fish className="w-4 h-4 text-blue-500" />
                  ) : category === "Eggs & Dairy" ? (
                    <Egg className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-red-200 dark:bg-red-800" />
                  )
                )
              )}
            </div>
          </div>

          {/* Pantry staples */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Pantry Staples
            </h3>
            {renderIngredientButtons(PANTRY_STAPLES)}
          </div>

          {/* Continue button */}
          {showContinue && onContinue && (
            <div className="pt-4 flex justify-center">
              <Button size="lg" onClick={onContinue}>
                Find Recipes
                {availableIngredients.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-sm">
                    {availableIngredients.length} items
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default IngredientSelector;
