// Cuisine Types
export type CuisineType =
  // South Indian
  | "karnataka"
  | "tamil"
  | "kerala"
  | "andhra"
  | "telangana"
  // North Indian
  | "punjabi"
  | "rajasthani"
  | "gujarati"
  | "maharashtrian"
  | "mughlai"
  | "bengali"
  | "kashmiri"
  | "lucknowi"
  // Indo-Fusion
  | "indo-chinese"
  | "indo-french"
  | "indo-spanish"
  | "indo-italian"
  // Asian
  | "thai"
  | "japanese"
  | "korean"
  | "vietnamese"
  | "chinese"
  | "indonesian"
  | "malaysian"
  // World Cuisines
  | "italian"
  | "mexican"
  | "mediterranean"
  | "american"
  | "middle-eastern"
  | "continental";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DietType = "veg" | "non-veg" | "egg";

export type DifficultyLevel = "easy" | "medium" | "hard";

export type SpiceLevel = 1 | 2 | 3 | 4 | 5;

export type IngredientCategory =
  | "vegetable"
  | "fruit"
  | "protein"
  | "grain"
  | "dairy"
  | "spice"
  | "oil"
  | "legume"
  | "nut"
  | "condiment"
  | "other";

// Ingredient Interface
export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
  category: IngredientCategory;
  isOptional?: boolean;
  notes?: string;
}

// Cooking Step Interface
export interface CookingStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
  tip?: string;
}

// Nutrition Information
export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sugar: number; // grams
  sodium: number; // mg
  cholesterol?: number; // mg
  saturatedFat?: number; // grams
  transFat?: number; // grams
  vitamins?: {
    vitaminA?: number; // % daily value
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminK?: number;
    vitaminB1?: number;
    vitaminB2?: number;
    vitaminB6?: number;
    vitaminB12?: number;
    folate?: number;
    niacin?: number;
  };
  minerals?: {
    iron?: number; // % daily value
    calcium?: number;
    potassium?: number;
    zinc?: number;
    magnesium?: number;
    phosphorus?: number;
    selenium?: number;
    copper?: number;
    manganese?: number;
  };
}

// Main Recipe Interface
export interface Recipe {
  id: string;
  name: string;
  nameLocal?: string; // Native language name (Kannada, Tamil, etc.)
  description: string;
  cuisine: CuisineType;
  subCuisine?: string; // e.g., "Udupi", "Mangalorean", "Chettinad"
  region?: string; // Geographic region
  mealType: MealType[];
  dietType: DietType;

  // Time & Difficulty
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime?: number; // auto-calculated or custom
  difficulty: DifficultyLevel;
  servings: number;

  // Ingredients
  ingredients: Ingredient[];

  // Instructions
  steps: CookingStep[];
  tips?: string[];

  // Nutrition (per serving)
  nutrition: NutritionInfo;

  // Metadata
  tags: string[];
  spiceLevel: SpiceLevel;
  isQuickMeal: boolean; // < 30 mins
  isMealPrep: boolean; // Good for batch cooking
  isOnePot: boolean; // Single vessel cooking
  isKidFriendly?: boolean;
  isPartyDish?: boolean;

  // Media
  imageUrl?: string;
  videoUrl?: string;

  // Accompaniments
  serveWith?: string[];
  pairsWith?: string[]; // Recipe IDs that go well together

  // Source
  source?: string;
  author?: string;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Cuisine Display Info
export interface CuisineInfo {
  id: CuisineType;
  name: string;
  nameLocal?: string;
  description: string;
  region: string;
  color: string; // For UI theming
  icon?: string;
}

// Recipe Filter Options
export interface RecipeFilters {
  cuisines: CuisineType[];
  mealTypes: MealType[];
  dietTypes: DietType[];
  difficulty: DifficultyLevel[];
  spiceLevelMax: SpiceLevel;
  maxCookTime?: number;
  isQuickMeal?: boolean;
  searchQuery?: string;
  tags?: string[];
}

// Cuisine metadata for display
export const CUISINE_INFO: Record<CuisineType, CuisineInfo> = {
  // South Indian
  karnataka: {
    id: "karnataka",
    name: "Karnataka",
    nameLocal: "ಕರ್ನಾಟಕ",
    description: "Diverse cuisine ranging from coastal Mangalorean to North Karnataka",
    region: "South India",
    color: "#E53E3E",
  },
  tamil: {
    id: "tamil",
    name: "Tamil Nadu",
    nameLocal: "தமிழ்நாடு",
    description: "Rich, aromatic cuisine with Chettinad specialties",
    region: "South India",
    color: "#DD6B20",
  },
  kerala: {
    id: "kerala",
    name: "Kerala",
    nameLocal: "കേരളം",
    description: "Coconut-rich cuisine with unique spice blends",
    region: "South India",
    color: "#38A169",
  },
  andhra: {
    id: "andhra",
    name: "Andhra Pradesh",
    nameLocal: "ఆంధ్ర ప్రదేశ్",
    description: "Spicy and tangy cuisine known for its bold flavors",
    region: "South India",
    color: "#D69E2E",
  },
  telangana: {
    id: "telangana",
    name: "Telangana",
    nameLocal: "తెలంగాణ",
    description: "Rustic cuisine with distinctive Hyderabadi influences",
    region: "South India",
    color: "#805AD5",
  },
  // North Indian
  punjabi: {
    id: "punjabi",
    name: "Punjabi",
    nameLocal: "ਪੰਜਾਬੀ",
    description: "Rich, hearty cuisine with butter and cream",
    region: "North India",
    color: "#F56565",
  },
  rajasthani: {
    id: "rajasthani",
    name: "Rajasthani",
    nameLocal: "राजस्थानी",
    description: "Desert cuisine with preserved and dried ingredients",
    region: "North India",
    color: "#ED8936",
  },
  gujarati: {
    id: "gujarati",
    name: "Gujarati",
    nameLocal: "ગુજરાતી",
    description: "Sweet and savory cuisine with unique thali culture",
    region: "West India",
    color: "#48BB78",
  },
  maharashtrian: {
    id: "maharashtrian",
    name: "Maharashtrian",
    nameLocal: "महाराष्ट्रीय",
    description: "Balanced cuisine ranging from mild to spicy",
    region: "West India",
    color: "#4299E1",
  },
  mughlai: {
    id: "mughlai",
    name: "Mughlai",
    nameLocal: "मुग़लई",
    description: "Royal cuisine with rich gravies and biryanis",
    region: "North India",
    color: "#9F7AEA",
  },
  bengali: {
    id: "bengali",
    name: "Bengali",
    nameLocal: "বাঙালি",
    description: "Fish-centric cuisine with subtle sweet notes",
    region: "East India",
    color: "#38B2AC",
  },
  kashmiri: {
    id: "kashmiri",
    name: "Kashmiri",
    nameLocal: "कश्मीरी",
    description: "Aromatic cuisine with saffron and dried fruits",
    region: "North India",
    color: "#FC8181",
  },
  lucknowi: {
    id: "lucknowi",
    name: "Lucknowi",
    nameLocal: "लखनवी",
    description: "Refined Awadhi cuisine with dum cooking",
    region: "North India",
    color: "#F6AD55",
  },
  // Indo-Fusion
  "indo-chinese": {
    id: "indo-chinese",
    name: "Indo-Chinese",
    description: "Indian adaptation of Chinese flavors",
    region: "Fusion",
    color: "#E53E3E",
  },
  "indo-french": {
    id: "indo-french",
    name: "Indo-French",
    description: "French techniques with Indian spices",
    region: "Fusion",
    color: "#3182CE",
  },
  "indo-spanish": {
    id: "indo-spanish",
    name: "Indo-Spanish",
    description: "Spanish cuisine with Indian twist",
    region: "Fusion",
    color: "#D69E2E",
  },
  "indo-italian": {
    id: "indo-italian",
    name: "Indo-Italian",
    description: "Italian favorites with Indian flavors",
    region: "Fusion",
    color: "#38A169",
  },
  // Asian
  thai: {
    id: "thai",
    name: "Thai",
    nameLocal: "ไทย",
    description: "Balance of sweet, sour, salty, and spicy",
    region: "Southeast Asia",
    color: "#805AD5",
  },
  japanese: {
    id: "japanese",
    name: "Japanese",
    nameLocal: "日本語",
    description: "Clean flavors with umami emphasis",
    region: "East Asia",
    color: "#E53E3E",
  },
  korean: {
    id: "korean",
    name: "Korean",
    nameLocal: "한국어",
    description: "Fermented foods and bold flavors",
    region: "East Asia",
    color: "#DD6B20",
  },
  vietnamese: {
    id: "vietnamese",
    name: "Vietnamese",
    nameLocal: "Tiếng Việt",
    description: "Fresh, light cuisine with herbs",
    region: "Southeast Asia",
    color: "#38A169",
  },
  chinese: {
    id: "chinese",
    name: "Chinese",
    nameLocal: "中文",
    description: "Diverse regional cuisines of China",
    region: "East Asia",
    color: "#E53E3E",
  },
  indonesian: {
    id: "indonesian",
    name: "Indonesian",
    description: "Rich, aromatic cuisine with complex spice pastes",
    region: "Southeast Asia",
    color: "#D69E2E",
  },
  malaysian: {
    id: "malaysian",
    name: "Malaysian",
    description: "Multicultural fusion cuisine",
    region: "Southeast Asia",
    color: "#3182CE",
  },
  // World Cuisines
  italian: {
    id: "italian",
    name: "Italian",
    nameLocal: "Italiano",
    description: "Pasta, pizza, and Mediterranean flavors",
    region: "Europe",
    color: "#38A169",
  },
  mexican: {
    id: "mexican",
    name: "Mexican",
    nameLocal: "Mexicano",
    description: "Bold, spicy cuisine with corn and beans",
    region: "Americas",
    color: "#E53E3E",
  },
  mediterranean: {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Healthy cuisine with olive oil and fresh produce",
    region: "Mediterranean",
    color: "#4299E1",
  },
  american: {
    id: "american",
    name: "American",
    description: "Diverse comfort food traditions",
    region: "Americas",
    color: "#3182CE",
  },
  "middle-eastern": {
    id: "middle-eastern",
    name: "Middle Eastern",
    description: "Mezze, grills, and aromatic spices",
    region: "Middle East",
    color: "#D69E2E",
  },
  continental: {
    id: "continental",
    name: "Continental",
    description: "European-style cooking adaptations",
    region: "Europe",
    color: "#718096",
  },
};
