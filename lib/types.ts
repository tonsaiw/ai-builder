export type FoodItem = {
  name: string;
  servingDescription: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type NutritionAnalysis = {
  items: FoodItem[];
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
  notes: string;
};

export type MealEntry = NutritionAnalysis & {
  id: string;
  timestamp: string; // ISO datetime
  dateKey: string; // YYYY-MM-DD, local
  thumbnail: string; // small base64 data URL
  mealName: string;
};

export type UserSettings = {
  dailyCalorieGoal: number;
  proteinGoalG: number;
  carbsGoalG: number;
  fatGoalG: number;
};

export const DEFAULT_SETTINGS: UserSettings = {
  dailyCalorieGoal: 2000,
  proteinGoalG: 120,
  carbsGoalG: 225,
  fatGoalG: 65,
};
