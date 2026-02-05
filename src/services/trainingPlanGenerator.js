import { generateDietPlan, generateWorkoutRoutine, getAIResponseStream } from './ai';

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
    dietaryPreference = "balanced"
  } = preferences;

  const prompt = `
You are an expert fitness coach and nutritionist. Generate a comprehensive ${duration}-week training and nutrition plan.
User: ${userProfile.name}, Goal: ${goal}, Experience: ${experience}.
Dietary Preference: ${dietaryPreference}.

CRITICAL: Return a COMPLETE plan for the full ${duration} weeks. Each week must have 7 days.
For EACH day, provide:
1. A workout (if training day) or recovery protocol.
2. A COMPLETE daily diet chart including Breakfast, Lunch, Dinner, and 1-2 Snacks.
3. Each meal MUST have detailed food item suggestions (e.g. "200g Grilled Chicken with 100g Brown Rice").

Return ONLY valid JSON in this format:
{
  "planId": "plan_${Date.now()}",
  "duration": ${duration},
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Consistency",
      "milestone": "Initiate protocol",
      "days": [
        {
          "dayOfWeek": "Monday",
          "type": "workout",
          "workout": { "name": "Push Prototype", "duration": "60m", "exercises": [{"name": "Bench Press", "sets": 3, "reps": "10"}] },
          "meals": [
            {"type": "Breakfast", "name": "Fuel", "food": "Description", "calories": 400, "protein": 30, "carbs": 40, "fats": 10},
            {"type": "Lunch", "name": "Recovery", "food": "Description", "calories": 600, "protein": 40, "carbs": 60, "fats": 15},
            {"type": "Dinner", "name": "Night Fuel", "food": "Description", "calories": 500, "protein": 35, "carbs": 30, "fats": 12},
            {"type": "Snack", "name": "Metabolic Spark", "food": "Description", "calories": 200, "protein": 15, "carbs": 10, "fats": 5}
          ],
          "hydration": 3500,
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
