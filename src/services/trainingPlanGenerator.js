import { generateDietPlan, generateWorkoutRoutine, getAIResponseStream, callUnifiedAI } from './ai';

import EXERCISE_JSON_DB from '../data/exercises.json';
import { EXERCISE_DATABASE as EXERCISE_JS_DB } from '../data/exercises.js';
import FOOD_DATABASE from '../data/foodItems.json';

/**
 * Generate a comprehensive training plan using Puter AI
 */
export async function generateComprehensiveTrainingPlan(userProfile, preferences = {}) {
  const {
    duration = 8,
    daysPerWeek = 5,
    goal = userProfile.goal || "general_fitness",
    experience = "intermediate",
    equipment = "full_gym",
    dietaryPreference = "balanced",
    workoutIntensity = "moderate",
    muscleFocus = [],
    dailyCalories = 2000,
    mealsPerDay = 4
  } = preferences;

  // Normalize JS DB to match JSON DB structure
  const normalizedJSDB = EXERCISE_JS_DB.map(ex => ({
    id: ex.id,
    name: ex.name,
    muscles: [ex.category.toLowerCase()], // Map category to muscles array
    level: "intermediate", // Default level
    location: "gym", // Default location
    tutorial: "Perform with proper form.", // Default tutorial
    unit: ex.unit,
    calories_per_min: ex.calPerUnit,
    form_tips: ["Maintain neutral spine", "Control the movement"]
  }));

  // Merge databases
  const EXERCISE_DATABASE = [...EXERCISE_JSON_DB, ...normalizedJSDB];

  // Sample exercises based on muscle focus and equipment
  let relevantExercises = EXERCISE_DATABASE;

  // Filter out pure cardio/warmup exercises, but keep strength exercises
  const excludedExercises = [
    'power walk', 'treadmill walk', 'incline walk', 'outdoor jog', 'treadmill jog',
    'outdoor run', 'treadmill run', 'jumping jacks', 'high knees', 'butt kicks',
    'arm circles', 'leg swings'
  ];

  relevantExercises = relevantExercises.filter(ex =>
    !excludedExercises.some(excluded => ex.name.toLowerCase().includes(excluded))
  );

  // Apply muscle focus filter if specified
  if (muscleFocus.length > 0) {
    relevantExercises = relevantExercises.filter(ex =>
      muscleFocus.some(muscle =>
        ex.muscles.some(em => em.toLowerCase().includes(muscle.toLowerCase()) || muscle.toLowerCase().includes(em.toLowerCase()))
      )
    );
  }

  // Filter by equipment/location
  const locationMap = {
    "full_gym": "gym",
    "home_basic": "home",
    "bodyweight": "home",
    "dumbbells": "home"
  };
  const targetLocation = locationMap[equipment] || "gym";
  relevantExercises = relevantExercises.filter(ex => ex.location === targetLocation || ex.location === 'home');

  // Sample 8-10 exercises to ensure stable URL lengths
  const sampleSize = Math.min(10, relevantExercises.length);
  const sampledExercises = [];
  const usedIndices = new Set();

  while (sampledExercises.length < sampleSize && usedIndices.size < relevantExercises.length) {
    const randomIndex = Math.floor(Math.random() * relevantExercises.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      sampledExercises.push(relevantExercises[randomIndex]);
    }
  }

  const exerciseContext = sampledExercises.map(ex =>
    `${ex.name} (${ex.id}): ${ex.unit}, ${ex.calories_per_min || 'N/A'}cal/min`
  ).join('|');

  // Sample food items based on dietary preference
  const dietMap = {
    "balanced": ["all"],
    "vegetarian": ["Vegetarian", "Vegan"],
    "vegan": ["Vegan"],
    "non_vegetarian": ["Non-Vegetarian", "Vegetarian"],
    "eggetarian": ["Eggitarian", "Vegetarian"],
    "high_protein": ["all"],
    "low_carb": ["all"],
    "keto": ["all"]
  };

  const allowedCategories = dietMap[dietaryPreference] || ["all"];
  let relevantFoods = FOOD_DATABASE;

  if (!allowedCategories.includes("all")) {
    relevantFoods = FOOD_DATABASE.filter(food =>
      allowedCategories.some(cat => food.category?.toLowerCase().includes(cat.toLowerCase()))
    );
  }

  // Sample 12 food items
  const foodSampleSize = Math.min(12, relevantFoods.length);
  const sampledFoods = [];
  const usedFoodIndices = new Set();

  while (sampledFoods.length < foodSampleSize && usedFoodIndices.size < relevantFoods.length) {
    const randomIndex = Math.floor(Math.random() * relevantFoods.length);
    if (!usedFoodIndices.has(randomIndex)) {
      usedFoodIndices.add(randomIndex);
      sampledFoods.push(relevantFoods[randomIndex]);
    }
  }

  const foodContext = sampledFoods.map(food =>
    `${food.name}: ${food.protein}P, ${food.carbs}C, ${food.calories}cal`
  ).join('|');

  const prompt = `ELITE Coach: 4-week plan for ${userProfile.name}, Goal: ${goal}.
  Context: ${workoutIntensity}, ${daysPerWeek} training days/wk, ${dailyCalories}kcal/day, ${dietaryPreference}.
  DB_EX: ${exerciseContext}.
  DB_FOOD: ${foodContext}.
  Rules: 1. Use DB IDs. 2. 2 Compound moves/session. 3. Target ${dailyCalories}kcal.
  Return JSON: { "planId": "plan_${Date.now()}", "duration": ${duration}, "weeks": [{ "weekNumber": 1, "days": [{ "dayOfWeek": "Monday", "type": "workout/rest", "workout": { "name": "...", "exercises": [{ "id": "ex_XXX", "name": "...", "sets": 3, "reps": "12", "unit": "reps", "tutorial": "...", "form_tips": ["..."] }] }, "meals": [{ "type": "Meal 1", "name": "...", "calories": 500, "protein": 30 }] }] }] }`;

  try {
    const plan = await callUnifiedAI(prompt, true);

    if (!plan) {
      throw new Error("AI failed to generate a training plan.");
    }


    // Add metadata
    plan.createdAt = new Date().toISOString();
    plan.userId = userProfile.uid;
    plan.goal = goal; // Explicitly save goal for UI
    plan.currentWeek = 1;
    plan.startDate = new Date().toISOString().split('T')[0];

    return plan;
  } catch (error) {
    console.error("Training plan generation failed:", error);
    throw error;
  }
}

export async function generateWeeklySchedule(weekNumber, userProfile) {
  const prompt = `Generate Week ${weekNumber} for ${userProfile.goal}. Return JSON week object.`;
  return await callUnifiedAI(prompt, true);
}


export async function analyzeProgress(progressData, trainingPlan) {
  const prompt = `Analyze progress: ${JSON.stringify(progressData)}. Return JSON { "overallScore": 80, "assessment": "...", "recommendations": [], "motivation": "...", "adjustments": {} }`;
  return await callUnifiedAI(prompt, true);
}


export async function generateDailyMotivation(userProfile, todayTasks) {
  const prompt = `Short motivation (10 words) for ${userProfile.name} doing ${todayTasks?.workout?.name || 'Rest'}.`;
  return await callUnifiedAI(prompt, false);
}

