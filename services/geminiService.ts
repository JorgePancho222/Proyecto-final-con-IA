import { GoogleGenAI, Type } from "@google/genai";
import { NutritionAnalysis, Recipe, MealPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<NutritionAnalysis> => {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        {
          text: "Analiza esta comida. Identifica el plato principal, estima las calorías totales, y desglose de macronutrientes (proteína, carbohidratos, grasa). Da una puntuación de salud del 1 al 10 y un breve consejo.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING },
          calories: { type: Type.NUMBER, description: "Total estimated calories" },
          protein: { type: Type.NUMBER, description: "Protein in grams" },
          carbs: { type: Type.NUMBER, description: "Carbohydrates in grams" },
          fat: { type: Type.NUMBER, description: "Fat in grams" },
          healthScore: { type: Type.NUMBER, description: "Score from 1 to 10 based on nutritional value" },
          summary: { type: Type.STRING, description: "A short description of the meal" },
          advice: { type: Type.STRING, description: "Nutritional advice regarding this meal" },
        },
        required: ["foodName", "calories", "protein", "carbs", "fat", "healthScore", "summary", "advice"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as NutritionAnalysis;
};

export const generateRecipesFromIngredients = async (base64Image: string, mimeType: string): Promise<Recipe[]> => {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        {
          text: "Mira estos ingredientes en la foto (nevera o despensa). Sugiere 3 recetas creativas que se puedan hacer principalmente con estos ingredientes. Asume que el usuario tiene básicos como aceite, sal, pimienta.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Fácil", "Media", "Difícil"] },
            timeMinutes: { type: Type.NUMBER },
            calories: { type: Type.NUMBER },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "difficulty", "timeMinutes", "calories", "ingredients", "instructions"],
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as Recipe[];
};

export const generateMealPlan = async (userGoal: string, dietaryRestrictions: string): Promise<MealPlanResponse> => {
  const prompt = `
    Genera un plan de alimentación semanal (Lunes a Domingo) para una persona con el objetivo: "${userGoal}".
    Restricciones o preferencias dietéticas: "${dietaryRestrictions}".
    Devuelve la respuesta en JSON estructurado.
  `;

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weeklyGoal: { type: Type.STRING, description: "Summary of the goal focusing on nutrition" },
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                breakfast: { type: Type.STRING },
                lunch: { type: Type.STRING },
                dinner: { type: Type.STRING },
                snack: { type: Type.STRING },
              },
              required: ["day", "breakfast", "lunch", "dinner", "snack"],
            },
          },
        },
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as MealPlanResponse;
};