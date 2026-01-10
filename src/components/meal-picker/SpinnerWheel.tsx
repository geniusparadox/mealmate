"use client";

import { useState, useEffect, useRef } from "react";
import { Recipe } from "@/types/recipe";
import { ChefHat, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SpinnerWheelProps {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
}

// Generate colors for wheel segments
const SEGMENT_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Coral
  "#AA96DA", // Purple
  "#FCBAD3", // Pink
  "#A8D8EA", // Light Blue
  "#FF9F43", // Orange
  "#6C5CE7", // Indigo
  "#00B894", // Green
  "#FD79A8", // Rose
];

export const SpinnerWheel = ({ recipes, onSelect }: SpinnerWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Limit to 12 recipes for the wheel
  const wheelRecipes = recipes.slice(0, 12);
  const segmentAngle = 360 / wheelRecipes.length;

  const spin = () => {
    if (isSpinning || wheelRecipes.length === 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setSelectedRecipe(null);

    // Random rotation: 5-8 full spins + random segment
    const spins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = spins * 360 + randomAngle;

    setRotation((prev) => prev + totalRotation);

    // Calculate which recipe will be selected
    setTimeout(() => {
      const finalAngle = (rotation + totalRotation) % 360;
      // The pointer is at the top (0 degrees), so we need to find which segment is there
      const selectedIndex = Math.floor(
        ((360 - finalAngle + segmentAngle / 2) % 360) / segmentAngle
      ) % wheelRecipes.length;

      const selected = wheelRecipes[selectedIndex];
      setSelectedRecipe(selected);
      setShowResult(true);
      setIsSpinning(false);
    }, 4000);
  };

  const handleConfirm = () => {
    if (selectedRecipe) {
      onSelect(selectedRecipe);
    }
  };

  const handleSpinAgain = () => {
    setShowResult(false);
    setSelectedRecipe(null);
    spin();
  };

  if (wheelRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ChefHat className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No recipes match your filters. Try adjusting them!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel Container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-orange-500 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full shadow-2xl overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
              : "none",
          }}
        >
          {wheelRecipes.map((recipe, index) => {
            const startAngle = index * segmentAngle;
            const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

            return (
              <div
                key={recipe.id}
                className="absolute w-full h-full origin-center"
                style={{
                  transform: `rotate(${startAngle}deg)`,
                }}
              >
                <div
                  className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                  style={{
                    background: color,
                    transform: `rotate(${segmentAngle}deg) skewY(${90 - segmentAngle}deg)`,
                  }}
                />
              </div>
            );
          })}
          {/* Center circle */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10">
            <ChefHat className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Glow effect when spinning */}
        {isSpinning && (
          <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-r from-orange-500/20 to-yellow-500/20 blur-xl" />
        )}
      </div>

      {/* Spin Button */}
      {!showResult && (
        <Button
          onClick={spin}
          disabled={isSpinning}
          size="lg"
          className="min-w-[200px]"
        >
          {isSpinning ? (
            <>
              <RotateCcw className="w-5 h-5 animate-spin" />
              Spinning...
            </>
          ) : (
            <>
              <ChefHat className="w-5 h-5" />
              Spin the Wheel!
            </>
          )}
        </Button>
      )}

      {/* Result */}
      {showResult && selectedRecipe && (
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-4 rounded-2xl shadow-lg mb-4">
            <p className="text-sm opacity-90 mb-1">You should make...</p>
            <h3 className="text-2xl font-bold">{selectedRecipe.name}</h3>
            {selectedRecipe.nameLocal && (
              <p className="text-sm opacity-90 mt-1">{selectedRecipe.nameLocal}</p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleSpinAgain}>
              <RotateCcw className="w-4 h-4" />
              Spin Again
            </Button>
            <Button onClick={handleConfirm}>
              <Check className="w-4 h-4" />
              Let&apos;s Cook!
            </Button>
          </div>
        </div>
      )}

      {/* Recipe count indicator */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {wheelRecipes.length} recipes in the wheel
        {recipes.length > 12 && ` (${recipes.length} total match your filters)`}
      </p>
    </div>
  );
};

export default SpinnerWheel;
