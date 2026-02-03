import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
let model;

if (API_KEY) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
}

/**
 * Generate a comprehensive training plan based on user profile and goals
 */
export async function generateComprehensiveTrainingPlan(userProfile, preferences = {}) {
  if (!model) {
    throw new Error("AI model not initialized");
  }

  const {
    duration = 8, // weeks
    daysPerWeek = 5,
    goal = userProfile.goal || "general_fitness",
    experience = "intermediate",
    equipment = "full_gym",
    dietaryPreference = "balanced"
  } = preferences;

  const prompt = `
You are an expert fitness coach and nutritionist. Generate a comprehensive ${duration}-week training plan.

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age || 25}
- Current Weight: ${userProfile.weight || 70}kg
- Height: ${userProfile.height || 170}cm
- Goal: ${goal}
- Experience Level: ${experience}
- Available Equipment: ${equipment}
- Dietary Preference: ${dietaryPreference}
- Training Days per Week: ${daysPerWeek}

REQUIREMENTS:
1. Create a ${duration}-week progressive training plan. You MUST provide details for EVERY SINGLE DAY.
2. Each week should have ${daysPerWeek} workout days + rest days. Even rest days MUST have meal plans.
3. Include specific exercises with sets, reps, and rest periods for EVERY workout.
4. Progressive overload: gradually increase intensity/volume each week. 
5. Include a UNIQUE daily meal plan for EVERY DAY with precise macros (protein, carbs, fats). DO NOT skip any days.
6. Target calories based on goal: ${goal}.
7. Include hydration and sleep recommendations for every day.
8. Add weekly milestones and checkpoints.

Return ONLY valid JSON in this exact format:
{
  "planId": "plan_${Date.now()}",
  "duration": ${duration},
  "goal": "${goal}",
  "targetCalories": 2200,
  "targetMacros": {
    "protein": 165,
    "carbs": 220,
    "fats": 73
  },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Foundation Building",
      "milestone": "Complete all workouts with proper form",
      "days": [
        {
          "dayOfWeek": "Monday",
          "type": "workout",
          "workout": {
            "name": "Upper Body Strength",
            "duration": "60 min",
            "exercises": [
              {
                "name": "Bench Press",
                "sets": 4,
                "reps": "8-10",
                "rest": "90s",
                "notes": "Focus on controlled movement"
              }
            ]
          },
          "meals": [
            {
              "type": "breakfast",
              "name": "Protein Oatmeal Bowl",
              "foods": "Oats, protein powder, banana, almonds",
              "calories": 450,
              "protein": 30,
              "carbs": 55,
              "fats": 12
            },
            {
              "type": "lunch",
              "name": "Chicken & Rice Bowl",
              "foods": "Grilled chicken, brown rice, vegetables",
              "calories": 600,
              "protein": 50,
              "carbs": 65,
              "fats": 15
            },
            {
              "type": "dinner",
              "name": "Salmon & Sweet Potato",
              "foods": "Baked salmon, sweet potato, broccoli",
              "calories": 550,
              "protein": 45,
              "carbs": 50,
              "fats": 20
            },
            {
              "type": "snacks",
              "name": "Greek Yogurt & Berries",
              "foods": "Greek yogurt, mixed berries, honey",
              "calories": 250,
              "protein": 20,
              "carbs": 35,
              "fats": 5
            }
          ],
          "hydration": 3000,
          "sleepTarget": 8
        }
      ]
    }
  ]
}

Generate a complete ${duration}-week plan with all days filled out. Make it progressive and realistic.
Do not include markdown formatting.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const plan = JSON.parse(jsonText);

    // Add metadata
    plan.createdAt = new Date().toISOString();
    plan.userId = userProfile.uid;
    plan.currentWeek = 1;
    plan.startDate = new Date().toISOString().split('T')[0];

    return plan;
  } catch (error) {
    console.error("Training Plan Generation Error:", error);
    throw error;
  }
}

/**
 * Generate a single week schedule (for plan adjustments)
 */
export async function generateWeeklySchedule(weekNumber, userProfile, previousWeekData = null) {
  if (!model) {
    throw new Error("AI model not initialized");
  }

  const prompt = `
Generate Week ${weekNumber} training schedule for:
- Goal: ${userProfile.goal}
- Previous week performance: ${previousWeekData ? "Good progress" : "First week"}

Return a single week object with 7 days (5 workout days, 2 rest days).
Include workouts and meals for each day.
Format as JSON matching the week structure from the comprehensive plan.
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Weekly Schedule Generation Error:", error);
    throw error;
  }
}

/**
 * Analyze user progress and provide insights
 */
export async function analyzeProgress(progressData, trainingPlan) {
  if (!model) {
    throw new Error("AI model not initialized");
  }

  const {
    completedWorkouts = 0,
    totalWorkouts = 0,
    completedMeals = 0,
    totalMeals = 0,
    weightChange = 0,
    currentWeek = 1
  } = progressData;

  const workoutAdherence = totalWorkouts > 0 ? (completedWorkouts / totalWorkouts * 100).toFixed(1) : 0;
  const mealAdherence = totalMeals > 0 ? (completedMeals / totalMeals * 100).toFixed(1) : 0;

  const prompt = `
Analyze this fitness progress and provide insights:

PROGRESS DATA:
- Current Week: ${currentWeek} of ${trainingPlan.duration}
- Workout Adherence: ${workoutAdherence}%
- Meal Plan Adherence: ${mealAdherence}%
- Weight Change: ${weightChange}kg
- Goal: ${trainingPlan.goal}

Provide:
1. Overall performance assessment
2. Top 3 specific recommendations
3. Motivational message
4. Adjustment suggestions (if needed)

Return ONLY valid JSON:
{
  "overallScore": 85,
  "assessment": "Excellent progress! You're on track.",
  "recommendations": [
    "Increase protein intake by 10g to support muscle recovery",
    "Add 5 minutes of stretching post-workout",
    "Ensure 8 hours of sleep for optimal recovery"
  ],
  "motivation": "You've completed 85% of your workouts - keep pushing!",
  "adjustments": {
    "increaseIntensity": false,
    "modifyDiet": false,
    "addRestDay": false
  }
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Progress Analysis Error:", error);
    return {
      overallScore: 70,
      assessment: "Keep up the good work!",
      recommendations: [
        "Stay consistent with your workouts",
        "Track your meals daily",
        "Get adequate rest"
      ],
      motivation: "Every workout brings you closer to your goal!",
      adjustments: {
        increaseIntensity: false,
        modifyDiet: false,
        addRestDay: false
      }
    };
  }
}

/**
 * Generate daily motivation based on progress
 */
export async function generateDailyMotivation(userProfile, todayTasks) {
  if (!model) {
    return "You've got this! Make today count! 💪";
  }

  const prompt = `
Generate a short, motivational message (max 15 words) for a fitness enthusiast.
Goal: ${userProfile.goal}
Today's workout: ${todayTasks?.workout?.name || "Rest day"}

Be energetic and inspiring!
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim().replace(/['"]/g, '');
  } catch (error) {
    return "You've got this! Make today count! 💪";
  }
}
