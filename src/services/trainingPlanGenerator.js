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
You are an expert fitness coach and nutritionist. Generate a comprehensive ${duration}-week training and nutrition plan.
User: ${userProfile.name}, Goal: ${goal}, Experience: ${experience}.

USER PREFERENCES:
- Workout Intensity: ${workoutIntensity}
- Muscle Focus: ${muscleFocus.length > 0 ? muscleFocus.join(', ') : 'Full Body'}
- Training Days: ${daysPerWeek} days/week
- Equipment: ${equipment}
- Daily Calorie Target: ${dailyCalories} kcal
- Meals Per Day: ${mealsPerDay}
- Dietary Preference: ${dietaryPreference}

EXERCISE DATABASE (Use ONLY these exercises with their exact IDs):
${exerciseContext}

FOOD DATABASE (Use ONLY these foods with accurate macros):
${foodContext}

EXERCISE SELECTION PRIORITIES:
1. PRIORITIZE compound movements and strength exercises (e.g., Push-ups, Pull-ups, Squats, Lunges, Planks)
2. AVOID using only cardio exercises (Walking, Jogging, Jumping Jacks) for strength training days
3. Use a mix of:
   - 60% compound/multi-joint exercises (work multiple muscle groups)
   - 30% isolation exercises (target specific muscles)
   - 10% cardio/conditioning exercises (for warm-up or finishers)
4. For each workout, select 4-6 different exercises that complement each other
5. Rotate exercises across days - if Monday uses Push-ups, Tuesday should use different upper body exercises

CRITICAL INSTRUCTIONS:
1. WEEKLY SCHEDULE: Each week MUST have EXACTLY ${daysPerWeek} workout days and ${7 - daysPerWeek} rest days.
   - For ${daysPerWeek} days/week: Distribute workouts evenly (e.g., Mon/Tue/Thu/Fri/Sat for 5 days, Mon/Tue/Wed/Thu/Fri/Sat for 6 days)
   - Rest days should have type: "rest" with NO workout object
   - Training days should have type: "workout" with a complete workout object

2. EXERCISE VARIETY: 
   - Use DIFFERENT exercises each day - DO NOT repeat the same exercise on consecutive days
   - Rotate through the exercise database to maximize variety
   - For muscle focus areas, use 3-4 different exercises per session
   - Example: If Monday has Bench Press, Tuesday should have different chest exercises like Dumbbell Flyes or Cable Crossovers

3. MEAL VARIETY:
   - Create DIFFERENT meal combinations for each day of the week
   - Rotate through the food database - avoid repeating the same meals on consecutive days
   - Each day should have unique breakfast, lunch, dinner, and snack combinations
   - Example: If Monday breakfast is "Oats with Banana", Tuesday should be "Scrambled Eggs with Toast"

4. INTENSITY LEVELS:
   - Low: 2-3 sets, 12-15 reps, longer rest periods
   - Moderate: 3-4 sets, 8-12 reps, moderate rest
   - High: 4-5 sets, 6-10 reps, shorter rest periods

5. MEAL STRUCTURE: Provide exactly ${mealsPerDay} meals per day totaling ~${dailyCalories} kcal
   - Use foods from the database with accurate portions and macros
   - Distribute calories appropriately across meals

6. DIETARY RESTRICTIONS: Strictly adhere to ${dietaryPreference} preferences

Return ONLY valid JSON in this format:
{
  "planId": "plan_${Date.now()}",
  "duration": ${duration},
  "currentWeek": 1,
  "goal": "${goal}",
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "milestone": "Establish routine",
      "days": [
        {
          "dayOfWeek": "Monday",
          "type": "workout",
          "workout": { 
            "name": "Upper Body Push", 
            "duration": "60m", 
            "exercises": [
              {
                "id": "ex_001",
                "name": "Bench Press", 
                "sets": 4, 
                "reps": "8-10",
                "unit": "reps",
                "tutorial": "Lie on bench, lower bar to chest, press up",
                "form_tips": ["Keep feet planted", "Arch lower back slightly"]
              }
            ] 
          },
          "meals": [
            {"type": "Breakfast", "name": "Power Start", "food": "3 Scrambled Eggs, 2 Whole Wheat Toast, 1 Banana", "calories": 450, "protein": 28, "carbs": 52, "fats": 14},
            {"type": "Lunch", "name": "Muscle Builder", "food": "200g Grilled Chicken, 150g Brown Rice, 100g Broccoli", "calories": 580, "protein": 48, "carbs": 62, "fats": 12},
            {"type": "Dinner", "name": "Recovery Meal", "food": "150g Salmon, 200g Sweet Potato, Mixed Salad", "calories": 520, "protein": 42, "carbs": 48, "fats": 16},
            {"type": "Snack", "name": "Energy Boost", "food": "Greek Yogurt 200g, 30g Almonds", "calories": 280, "protein": 18, "carbs": 16, "fats": 14}
          ],
          "hydration": 3500,
          "sleepTarget": 8
        },
        {
          "dayOfWeek": "Tuesday",
          "type": "workout",
          "workout": { 
            "name": "Lower Body Focus", 
            "duration": "60m", 
            "exercises": [
              {
                "id": "ex_025",
                "name": "Squats", 
                "sets": 4, 
                "reps": "10-12",
                "unit": "reps",
                "tutorial": "Stand with feet shoulder-width, squat down, drive up",
                "form_tips": ["Keep chest up", "Knees track over toes"]
              }
            ] 
          },
          "meals": [
            {"type": "Breakfast", "name": "Morning Fuel", "food": "Oatmeal 80g, Protein Shake, Berries 100g", "calories": 420, "protein": 32, "carbs": 58, "fats": 8},
            {"type": "Lunch", "name": "Lean Protein", "food": "180g Turkey Breast, Quinoa 120g, Green Beans 150g", "calories": 560, "protein": 46, "carbs": 56, "fats": 10},
            {"type": "Dinner", "name": "Night Recovery", "food": "200g Lean Beef, 150g Pasta, Spinach Salad", "calories": 540, "protein": 44, "carbs": 50, "fats": 14},
            {"type": "Snack", "name": "Pre-Bed", "food": "Cottage Cheese 150g, Apple", "calories": 250, "protein": 22, "carbs": 28, "fats": 4}
          ],
          "hydration": 3500,
          "sleepTarget": 8
        },
        {
          "dayOfWeek": "Wednesday",
          "type": "rest",
          "meals": [
            {"type": "Breakfast", "name": "Rest Day Fuel", "food": "Pancakes 2pc, Maple Syrup, Berries", "calories": 380, "protein": 12, "carbs": 68, "fats": 8},
            {"type": "Lunch", "name": "Light Meal", "food": "Chicken Salad 250g, Olive Oil Dressing", "calories": 420, "protein": 35, "carbs": 18, "fats": 24},
            {"type": "Dinner", "name": "Balanced Plate", "food": "Grilled Fish 180g, Vegetables 200g, Rice 100g", "calories": 480, "protein": 38, "carbs": 42, "fats": 14},
            {"type": "Snack", "name": "Afternoon Treat", "food": "Protein Bar, Orange", "calories": 260, "protein": 20, "carbs": 32, "fats": 6}
          ],
          "hydration": 3000,
          "sleepTarget": 8
        }
      ]
    }
  ]
}
`;

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
