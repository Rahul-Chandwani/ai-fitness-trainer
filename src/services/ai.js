
import { GoogleGenerativeAI } from "@google/generative-ai";
import EXERCISE_DATABASE from '../data/exercises.json';



const DEFAULT_SYSTEM_PROMPT = `You are a professional AI Fitness Coach. Your goal is to provide highly accurate, science-based fitness, nutrition, and workout advice. 
You MUST strictly follow the user's dietary preferences (e.g., Vegan, Non-Veg) and fitness aims. 
For workouts, ensure exercises are appropriate for the specified location (Gym vs Home) and experience level. 
Keep your responses properly formatted as valid JSON when requested.`;

/**
 * AI PROVIDER MANAGEMENT
 */
/**
 * AI PROVIDER MANAGEMENT
 */
export const AI_PROVIDERS = {
    GEMINI: 'gemini'
};

export const getAIPreference = () => {
    const key = localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || "";
    return { provider: AI_PROVIDERS.GEMINI, geminiKey: key };
};

export const setAIPreference = (provider, key = null) => {
    // Provider is always Gemini now, but keeping signature for compatibility if needed
    if (key !== null) localStorage.setItem('GEMINI_API_KEY', key);
};

/**
 * GOOGLE GEMINI SERVICE
 */
async function callGeminiAI(prompt, jsonMode = true) {
    const { geminiKey } = getAIPreference();
    if (!geminiKey) throw new Error("Gemini API Key missing");

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Updated to latest stable/fast model
        generationConfig: jsonMode ? { responseMimeType: "application/json" } : {}
    });

    const fullPrompt = `${DEFAULT_SYSTEM_PROMPT}\n\nUser: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    if (jsonMode) {
        try {
            return JSON.parse(text);
        } catch (e) {
            // Fallback for malformed JSON
            const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (match) return JSON.parse(match[0]);
            throw e;
        }
    }
    return text;
}

/**
 * UNIFIED AI DISPATCHER
 */
export async function getAIResponseStream(prompt, onChunk) {
    try {
        const res = await callGeminiAI(prompt, false);
        if (res) {
            onChunk(res);
            return res;
        }
    } catch (err) {
        console.error("Gemini AI Stream Error:", err);
        const fallbackMsg = `AI service error: ${err.message || 'Service unavailable'}. Please verify your API key in Settings.`;
        onChunk(fallbackMsg);
        return fallbackMsg;
    }
}

/**
 * UNIFIED AI DISPATCHER - Static (Non-Streaming)
 */
export async function callUnifiedAI(prompt, jsonMode = true) {
    try {
        return await callGeminiAI(prompt, jsonMode);
    } catch (err) {
        console.error("Gemini AI Static Error:", err);
        throw err;
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

    const prompt = `Daily diet for ${dietPreference} aimed at ${dietAim}. Target: ${calories} kcal.
    Items: ${preferredFoods}. 
    Return JSON array: [{ name, type, food, calories, protein, carbs, fats }]. 
    Sum to ${calories} kcal.`;

    try {
        const meals = await callUnifiedAI(prompt, true);
        if (meals && Array.isArray(meals)) {
            return meals.map((m, i) => ({ ...m, id: `ai_meal_${Date.now()}_${i}`, isAI: true }));
        }
    } catch (e) {
        console.warn("AI failed for diet, using deterministic generator.");
    }

    // Deterministic High-Quality Fallback
    const fallbackMeals = [
        { name: "Breakfast Fuel", type: "Breakfast", calories: 500, protein: 30, carbs: 60, fats: 15, food: dietPreference === "Vegan" ? "Oatmeal with Almond Milk, Chia Seeds, and Berries" : "Scrambled Eggs (3) with Whole Wheat Toast and Spinach" },
        { name: "Lunch Powerhouse", type: "Lunch", calories: 700, protein: 45, carbs: 80, fats: 20, food: dietPreference === "Vegan" ? "Quinoa Salad with Chickpeas, Avocado, and Tahini" : "Grilled Chicken Breast (200g) with Brown Rice and Broccoli" },
        { name: "Dinner Recovery", type: "Dinner", calories: 600, protein: 40, carbs: 50, fats: 25, food: dietPreference === "Vegan" ? "Lentil Soup with Roasted Sweet Potato and Kale" : "Baked Salmon with Lemon, Asparagus, and New Potatoes" },
        { name: "Focus Snack", type: "Snack", calories: 200, protein: 10, carbs: 20, fats: 10, food: dietPreference === "Vegan" ? "Mixed Nuts and an Apple" : "Greek Yogurt with Honey and Walnuts" }
    ];

    return fallbackMeals.map((m, i) => ({ ...m, id: `fallback_meal_${Date.now()}_${i}`, isAI: true }));
}


export async function generateWorkoutRoutine(preferences = {}) {
    const {
        muscles = ["Full Body"],
        duration = "45",
        calorieTarget = "400",
        level = "intermediate",
        location = "gym"
    } = preferences;

    const relevantExercises = EXERCISE_DATABASE.filter(ex => {
        const matchesMuscle = muscles.some(m =>
            ex.muscles.some(em => em.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(em.toLowerCase()))
        );
        const matchesLocation = ex.location === location || ex.location === 'home';
        return matchesMuscle && matchesLocation;
    });

    const sampleSize = Math.min(8, relevantExercises.length);
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
        `${ex.name}(${ex.id}): ${ex.unit}, ${ex.calories_per_min || 0}cpm`
    ).join('|');

    const prompt = `Routine for ${muscles.join("/")}, ${duration}m, ${calorieTarget}kcal, ${level}. 
    DB: ${exerciseContext}.
    Return JSON: { id, name, duration, totalCalories, exercises: [{id, name, sets, reps, duration, unit, calories, tutorial, form_tips, level}] }.`;

    try {
        const routine = await callUnifiedAI(prompt, true);
        if (routine && routine.exercises) return routine;
    } catch (e) {
        console.warn("AI workout generation failed, using database selection.");
    }

    // High-Quality Database Fallback
    const workoutId = `fallback_workout_${Date.now()}`;
    return {
        id: workoutId,
        name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${muscles[0]} Power Session`,
        duration: `${duration} min`,
        totalCalories: calorieTarget,
        exercises: sampledExercises.slice(0, 6).map((ex, i) => ({
            id: ex.id,
            name: ex.name,
            sets: level === 'beginner' ? 2 : 3,
            reps: ex.unit === 'min' ? "5" : "12",
            duration: ex.unit === 'min' ? "5 min" : "N/A",
            unit: ex.unit,
            calories: Math.floor(calorieTarget / 6),
            tutorial: ex.tutorial,
            form_tips: ["Focus on breath", "Control the tempo", "Maintain posture"],
            level: ex.level
        }))
    };
}


