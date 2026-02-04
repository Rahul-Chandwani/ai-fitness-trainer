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
You are an expert fitness coach. Generate a ${duration}-week training plan.
User: ${userProfile.name}, Goal: ${goal}, Experience: ${experience}.

Return ONLY valid JSON:
{
  "planId": "plan_${Date.now()}",
  "duration": ${duration},
  "goal": "${goal}",
  "targetCalories": 2200,
  "targetMacros": { "protein": 150, "carbs": 250, "fats": 70 },
  "weeks": [
    {
      "weekNumber": 1,
      "focus": "Consistency",
      "milestone": "Complete week 1",
      "days": [
        {
          "dayOfWeek": "Monday",
          "type": "workout",
          "workout": { "name": "Push Day", "duration": "60m", "exercises": [{"name": "Bench Press", "sets": 3, "reps": "10"}] },
          "meals": [{"type": "breakfast", "name": "Oats", "foods": "Oats, Milk", "calories": 400, "protein": 15, "carbs": 60, "fats": 8}],
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
