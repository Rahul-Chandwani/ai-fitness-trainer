import { generateDietPlan, generateWorkoutRoutine, getAIResponseStream } from './ai';
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

  // Sample 25 exercises to ensure variety (if we send too many, the AI context is static)
  // By sending a smaller random subset, we force the AI to choose from different options each time
  const sampleSize = Math.min(25, relevantExercises.length);
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
    `${ex.name} (${ex.id}): ${ex.tutorial} | Muscles: ${ex.muscles.join(', ')} | Level: ${ex.level} | Unit: ${ex.unit} | Cal/unit: ${ex.calories_per_min || 'N/A'}`
  ).join('\n');

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

  // Sample 50 food items
  const foodSampleSize = Math.min(50, relevantFoods.length);
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
    `${food.name}: ${food.calories}kcal | P:${food.protein}g C:${food.carbs}g F:${food.fats}g | Serving: ${food.serving}`
  ).join('\n');

  const prompt = `
You are an ELITE AI Fitness Coach. Generate a comprehensive ${duration}-week training and nutrition protocol.
User: ${userProfile.name}, Goal: ${goal}, Experience: ${experience}.

SYSTEM CONTEXT:
- Workout Intensity: ${workoutIntensity}
- Muscle Focus: ${muscleFocus.length > 0 ? muscleFocus.join(', ') : 'Full Body balance'}
- Frequency: ${daysPerWeek} training cycles per week
- Equipment: ${equipment}
- Target: ${dailyCalories} kcal /day
- Structure: ${mealsPerDay} meals /day
- Preference: ${dietaryPreference}

EXERCISE REGISTRY (Use ONLY these exact names and IDs):
${exerciseContext}

NUTRITION REGISTRY (Use ONLY these items):
${foodContext}

EXERCISE SELECTION RULES (STRICT):
1. COMPOUND FIRST: Every session MUST start with 2 major compound movements (Bench, Squat, Deadlift variations).
2. VARIETY MATRIX: Do NOT repeat the same exercise within a 3-day window.
3. LOAD BALANCE: Balance pushing, pulling, and leg movements throughout the week.
4. METADATA: Ensure every exercise has sets, reps (or duration), unit, tutorial, and form_tips.

NUTRITION RULES (STRICT):
1. CALORIC PRECISION: All meals MUST sum to EXACTLY ~${dailyCalories} kcal (+/- 50).
2. ROTATION: Rotate through the registry. Monday's breakfast must be different from Tuesday's.
3. MACRO BALANCE: Align with ${dietaryPreference} goals.

JSON ARCHITECTURE (STRICT):
Generate ONLY a valid JSON object. No prose.
{
  "planId": "plan_${Date.now()}",
  "duration": ${duration},
  "currentWeek": 1,
  "goal": "${goal}",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Protocol Initialization",
      "milestone": "Establishing neural pathways",
      "days": [
        {
          "dayOfWeek": "Monday",
          "type": "workout",
          "workout": { 
            "name": "Phase 1: Dynamic Strength", 
            "duration": "60m", 
            "exercises": [
              {
                "id": "ex_XXX",
                "name": "Exercise Name", 
                "sets": 4, 
                "reps": "10-12",
                "unit": "reps",
                "tutorial": "...",
                "form_tips": ["...", "..."]
              }
            ] 
          },
          "meals": [
            {"type": "Meal 1", "name": "...", "food": "...", "calories": 500, "protein": 30, "carbs": 50, "fats": 15}
          ],
          "hydration": 3500,
          "sleepTarget": 8
        }
      ]
    }
  ]
}

REQUIRED: Provide a complete ${duration}-week plan. Ensure ${daysPerWeek} training days and ${7 - daysPerWeek} rest days per cycle.`;

  try {
    let responseText;
    if (window.puter) {
      responseText = await window.puter.ai.chat(prompt);
      responseText = responseText.message.content;
    } else {
      // Fallback to fetch style if Puter not ready
      const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?json=true`);
      responseText = await res.text();
    }

    const plan = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());

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
  // Simplified for now, uses same logic as above
  const res = await getAIResponseStream(prompt, () => { });
  return JSON.parse(res.replace(/```json/g, "").replace(/```/g, "").trim());
}

export async function analyzeProgress(progressData, trainingPlan) {
  const prompt = `Analyze progress: ${JSON.stringify(progressData)}. Return JSON { "overallScore": 80, "assessment": "...", "recommendations": [], "motivation": "...", "adjustments": {} }`;
  const res = await getAIResponseStream(prompt, () => { });
  return JSON.parse(res.replace(/```json/g, "").replace(/```/g, "").trim());
}

export async function generateDailyMotivation(userProfile, todayTasks) {
  const prompt = `Short motivation (10 words) for ${userProfile.name} doing ${todayTasks?.workout?.name || 'Rest'}.`;
  return await getAIResponseStream(prompt, () => { });
}
