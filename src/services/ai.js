
/**
 * AI Service using Puter.js with Pollinations AI as a fallback.
 * Puter.js provides stable, keyless AI access.
 */

const PUTER_MODEL = 'openai'; // or 'gpt-4o', etc.

const DEFAULT_SYSTEM_PROMPT = `You are a professional AI Fitness Coach. Your goal is to provide highly accurate, science-based fitness, nutrition, and workout advice. 
You MUST strictly follow the user's dietary preferences (e.g., Vegan, Non-Veg) and fitness aims. 
For workouts, ensure exercises are appropriate for the specified location (Gym vs Home) and experience level. 
Keep your responses properly formatted as valid JSON when requested.`;

async function callPuterAI(prompt, stream = false, onChunk = null) {
    if (!window.puter) {
        throw new Error("Puter.js not loaded");
    }

    const fullPrompt = `${DEFAULT_SYSTEM_PROMPT}\n\nUser: ${prompt}`;

    if (stream) {
        const response = await window.puter.ai.chat(fullPrompt, { stream: true });
        let fullText = "";
        for await (const chunk of response) {
            fullText += chunk?.text || "";
            if (onChunk) onChunk(fullText);
        }
        return fullText;
    } else {
        const response = await window.puter.ai.chat(fullPrompt);
        return response.message.content;
    }
}

/**
 * Fallback to Pollinations AI if Puter fails
 */
async function callPollinationsAI(prompt, jsonMode = true) {
    const fullPrompt = `${DEFAULT_SYSTEM_PROMPT}\n\nUser: ${prompt}`;
    const url = `https://text.pollinations.ai/${encodeURIComponent(fullPrompt)}?model=openai${jsonMode ? '&json=true' : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Pollinations error: ${response.status}`);
    const text = await response.text();
    if (jsonMode) {
        return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
    }
    return text.trim();
}

export async function getAIResponseStream(prompt, onChunk) {
    try {
        if (window.puter) {
            return await callPuterAI(prompt, true, onChunk);
        }
        throw new Error("Puter unavailable");
    } catch (error) {
        console.warn("Puter AI failed, falling back to Pollinations:", error);
        // Basic fallback for streaming (not perfectly streaming but works)
        try {
            const response = await callPollinationsAI(prompt, false);
            onChunk(response);
            return response;
        } catch (fallError) {
            const msg = "AI services are currently unavailable. Please try again later.";
            onChunk(msg);
            return msg;
        }
    }
}

export async function generateDietPlan(preferences = {}) {
    const {
        dietPreference = "Balanced",
        dietAim = "High Protein",
        calories = "2000",
        experienceLevel = "intermediate"
    } = preferences;

    const foodSamples = {
        "Vegetarian": "Paneer, Greek Yogurt, Moong Dal, Dal Makhani, Palak Paneer, Oats, Brown Rice, Chapati, Milk, Almonds",
        "Vegan": "Tofu, Idli, Dosa, Poha, Chickpeas (Chole), Rajma, Quinoa, Soy Milk, Spinach, Broccoli, Walnuts",
        "Non-Vegetarian": "Chicken Breast, Boiled Egg, Salmon, Chicken Curry, Fish Curry, Mutton, Eggs, Paneer, Oats, Rice",
        "Eggitarian": "Boiled Egg, Egg Bhurji, Omelette, Greek Yogurt, Oats, Chapati, Lentils, Fruit Salad"
    };

    const preferredFoods = foodSamples[dietPreference] || foodSamples["Vegetarian"];

    const prompt = `Generate a comprehensive daily diet plan for a ${dietPreference} preference with a focus on ${dietAim}. Target: ~${calories} kcal. 
    Experience Level: ${experienceLevel}.
    
    REFERENCE INGREDIENTS (Use these or similar): ${preferredFoods}.

    Return ONLY a JSON array of 4-5 objects, each representing a meal (Breakfast, Lunch, Dinner, Snack, etc.).
    Each object MUST have:
    - "name": The meal title (e.g. "Early Morning Fuel", "Muscle Recovery Lunch")
    - "type": The category (Breakfast, Lunch, Dinner, or Snack)
    - "food": A detailed description of literal food items and portions (e.g. "200g Grilled Chicken with 100g Brown Rice")
    - "calories": Estimated total calories for this meal (number)
    - "protein": Protein in grams (number)
    - "carbs": Carbohydrates in grams (number)
    - "fats": Fats in grams (number)

    Ensure the total daily calories across all objects sum up to approximately ${calories}.
    Strictly adhere to the ${dietPreference} dietary restriction.`;

    try {
        if (window.puter) {
            const res = await callPuterAI(prompt);
            const meals = JSON.parse(res.replace(/```json/g, "").replace(/```/g, "").trim());
            return meals.map((m, i) => ({ ...m, id: `ai_meal_${Date.now()}_${i}`, isAI: true }));
        }
    } catch (e) {
        console.warn("Puter diet generation failed:", e);
    }
    const result = await callPollinationsAI(prompt).catch(() => null);
    if (result && Array.isArray(result)) {
        return result.map((m, i) => ({ ...m, id: `ai_meal_${Date.now()}_${i}`, isAI: true }));
    }
    return result;
}

export async function generateWorkoutRoutine(preferences = {}) {
    const {
        muscles = ["Full Body"],
        duration = "45",
        calorieTarget = "400",
        level = "intermediate",
        location = "gym",
        experienceLevel = "intermediate"
    } = preferences;

    const prompt = `Generate a highly effective workout routine targeting ${muscles.join(", ")}. 
    Duration: ${duration} minutes. Target Calories: ${calorieTarget} kcal. 
    Level: ${level}. Location: ${location}.
    Return ONLY JSON: 
    {
      "id": "ai_workout_${Date.now()}", 
      "name": "Targeted ${muscles.join("/")} Session", 
      "duration": "${duration} min", 
      "totalCalories": ${calorieTarget},
      "exercises": [
        {"name": "Exercise Name", "sets": 3, "reps": "12", "duration": "N/A"}
      ]
    }`;

    try {
        if (window.puter) {
            const res = await callPuterAI(prompt);
            return JSON.parse(res.replace(/```json/g, "").replace(/```/g, "").trim());
        }
    } catch (e) {
        console.warn("Puter workout generation failed:", e);
    }
    return await callPollinationsAI(prompt).catch(() => null);
}
