export enum AppMode {
  SCANNER = 'SCANNER',
  CHEF = 'CHEF',
  PLANNER = 'PLANNER'
}

export interface MacroData {
  name: string;
  value: number;
  unit: string;
  color: string;
}

export interface NutritionAnalysis {
  foodName: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  healthScore: number; // 1-10
  summary: string;
  advice: string;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Recipe {
  title: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  timeMinutes: number;
  calories: number;
  ingredients: string[];
  instructions: string[];
}

export interface DayPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface MealPlanResponse {
  weeklyGoal: string;
  plan: DayPlan[];
}