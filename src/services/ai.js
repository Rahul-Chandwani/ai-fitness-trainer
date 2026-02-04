
/**
 * AI Service using Puter.js with Pollinations AI as a fallback.
 * Puter.js provides stable, keyless AI access.
 */

const PUTER_MODEL = 'openai'; // or 'gpt-4o', etc.

async function callPuterAI(prompt, stream = false, onChunk = null) {
    if (!window.puter) {
        throw new Error("Puter.js not loaded");
    }

    if (stream) {
        const response = await window.puter.ai.chat(prompt, { stream: true });
        let fullText = "";
        for await (const chunk of response) {
            fullText += chunk?.text || "";
            if (onChunk) onChunk(fullText);
        }
        return fullText;
    } else {
        const response = await window.puter.ai.chat(prompt);
        return response.message.content;
    }
}

/**
 * Fallback to Pollinations AI if Puter fails
 */
async function callPollinationsAI(prompt, jsonMode = true) {
    const url = `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai${jsonMode ? '&json=true' : ''}`;
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
    const { dietType = "balanced", calories = "2000" } = preferences;
    const prompt = `Generate a daily diet plan for ${dietType} diet, ~${calories} kcal. Return ONLY JSON array: [{"name": "Breakfast", "food": "...", "calories": 350}, ...]`;

    try {
        if (window.puter) {
            const res = await callPuterAI(prompt);
            return JSON.parse(res.replace(/```json/g, "").replace(/```/g, "").trim());
        }
    } catch (e) {
        console.warn("Puter diet generation failed:", e);
    }
    return await callPollinationsAI(prompt).catch(() => null);
}

export async function generateWorkoutRoutine(preferences = {}) {
    const { type = "Full Body", duration = "45 mins" } = preferences;
    const prompt = `Generate a workout routine for ${type}, ${duration}. Return ONLY JSON: {"id": 1, "name": "...", "duration": "...", "exercises": [{"name": "...", "sets": 3, "reps": "10"}]}`;

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
