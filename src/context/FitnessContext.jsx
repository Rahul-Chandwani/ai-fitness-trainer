import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

const FitnessContext = createContext();

export function useFitness() {
    return useContext(FitnessContext);
}

export function FitnessProvider({ children }) {
    const { user } = useAuth();

    // State
    const [userProfile, setUserProfile] = useState(null);
    const [manualMeals, setManualMeals] = useState([]);
    const [aiMeals, setAIMeals] = useState([]);
    const [manualWorkouts, setManualWorkouts] = useState([]);
    const [aiWorkouts, setAIWorkouts] = useState([]);
    const [weightHistory, setWeightHistory] = useState([]);
    const [calorieHistory, setCalorieHistory] = useState([]);
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [neuralXP, setNeuralXP] = useState(0);
    const [streak, setStreak] = useState(0);
    const [hydration, setHydration] = useState(0);
    const [trainingPlan, setTrainingPlan] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    // Initial Defaults (if new user)
    const defaultProfile = {
        name: "New User",
        goal: "Get Fit",
        targetCalories: 2000,
        subscriptionTier: "free",
        neuralXP: 0,
        streak: 0,
        hydration: 0
    };


    useEffect(() => {
        if (!user) {
            setUserProfile(null);
            setManualMeals([]);
            setAIMeals([]);
            setManualWorkouts([]);
            setAIWorkouts([]);
            setWeightHistory([]);
            setCalorieHistory([]);
            setLoadingData(false);
            return;
        }

        setLoadingData(true);
        const userRef = doc(db, "users", user.uid);

        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserProfile(data.profile || defaultProfile);

                // DATA MIGRATION & HYDRATION
                // 1. Meals
                if (data.manualMeals || data.aiMeals) {
                    setManualMeals(data.manualMeals || []);
                    setAIMeals(data.aiMeals || []);
                } else if (data.dietPlan) {
                    // Legacy migration
                    const manual = data.dietPlan.filter(m => !m.isAI && !m.id?.toString().startsWith('ai_'));
                    const ai = data.dietPlan.filter(m => m.isAI || m.id?.toString().startsWith('ai_'));
                    setManualMeals(manual);
                    setAIMeals(ai);
                    // Persist to prevent loop
                    updateDoc(userRef, { manualMeals: manual, aiMeals: ai });
                }

                // 2. Workouts
                if (data.manualWorkouts || data.aiWorkouts) {
                    setManualWorkouts(data.manualWorkouts || []);
                    setAIWorkouts(data.aiWorkouts || []);
                } else if (data.workoutRoutine) {
                    // Legacy migration
                    const routine = Array.isArray(data.workoutRoutine) ? data.workoutRoutine : [data.workoutRoutine];
                    const manual = routine.filter(w => !w.isAI && !w.id?.toString().startsWith('ai_'));
                    const ai = routine.filter(w => w.isAI || w.id?.toString().startsWith('ai_'));
                    setManualWorkouts(manual);
                    setAIWorkouts(ai);
                    // Persist to prevent loop
                    updateDoc(userRef, { manualWorkouts: manual, aiWorkouts: ai });
                }

                setWeightHistory(data.weightHistory || []);
                setCalorieHistory(data.calorieHistory || []);
                setWorkoutHistory(data.workoutHistory || []);
                setNeuralXP(data.profile?.neuralXP || 0);
                setStreak(data.profile?.streak || 0);
                setHydration(data.profile?.hydration || 0);
                setTrainingPlan(data.trainingPlan || null);
            } else {
                setDoc(userRef, {
                    profile: { ...defaultProfile, name: user.email?.split("@")[0] || "User" },
                    dietPlan: [],
                    workoutRoutine: null,
                    weightHistory: [],
                    calorieHistory: [],
                    workoutHistory: [],
                    createdAt: new Date().toISOString()
                }, { merge: true });
            }

            setLoadingData(false);
        }, (error) => {
            console.error("Error fetching user data:", error);
            setLoadingData(false);
        });

        return () => unsubscribe();
    }, [user]);

    // Actions
    const updateUserProfile = async (newProfile) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { profile: { ...userProfile, ...newProfile } }, { merge: true });
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    const updateManualMeals = async (newMeals) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { manualMeals: newMeals }, { merge: true });
        } catch (err) {
            console.error("Error updating manual meals:", err);
        }
    };

    const updateAIMeals = async (newMeals) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { aiMeals: newMeals }, { merge: true });
        } catch (err) {
            console.error("Error updating AI meals:", err);
        }
    };

    const updateManualWorkouts = async (newWorkouts) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { manualWorkouts: newWorkouts }, { merge: true });
        } catch (err) {
            console.error("Error updating manual workouts:", err);
        }
    };

    const updateAIWorkouts = async (newWorkouts) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { aiWorkouts: newWorkouts }, { merge: true });
        } catch (err) {
            console.error("Error updating AI workouts:", err);
        }
    };

    const addMealEntry = async (meal) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            const today = new Date().toLocaleDateString();

            const history = [...calorieHistory];
            const todayIndex = history.findIndex(h => h.date === today);

            const protein = parseFloat(meal.protein || 0);
            const carbs = parseFloat(meal.carbs || 0);
            const fats = parseFloat(meal.fats || 0);
            const cals = parseFloat(meal.calories || 0);

            if (todayIndex > -1) {
                history[todayIndex].intake += cals;
                history[todayIndex].protein = (history[todayIndex].protein || 0) + protein;
                history[todayIndex].carbs = (history[todayIndex].carbs || 0) + carbs;
                history[todayIndex].fats = (history[todayIndex].fats || 0) + fats;
            } else {
                history.push({
                    date: today,
                    intake: cals,
                    burned: 0,
                    protein,
                    carbs,
                    fats
                });
            }

            await updateDoc(userRef, { calorieHistory: history });
        } catch (err) {
            console.error("Error logging meal:", err);
        }
    };


    const addWeightEntry = async (weight) => {
        if (!user) return;
        try {
            const newEntry = { date: new Date().toLocaleDateString(), weight: parseFloat(weight) };
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { weightHistory: arrayUnion(newEntry) });
        } catch (err) {
            console.error("Error adding weight:", err);
        }
    };

    const completeWorkout = async (workout) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            const today = new Date().toLocaleDateString();

            // Calculate calorie burn from workout data or default
            const burnedCalories = workout.totalCalories || 400;
            const xpReward = 50;

            const completionEntry = {
                date: today,
                timestamp: new Date().toISOString(),
                workoutId: workout.id,
                name: workout.name,
                duration: workout.duration,
                calories: burnedCalories,
                xpAwarded: xpReward
            };

            const history = [...calorieHistory];
            const todayIndex = history.findIndex(h => h.date === today);

            if (todayIndex > -1) {
                history[todayIndex].burned = (history[todayIndex].burned || 0) + burnedCalories;
            } else {
                history.push({ date: today, intake: 0, burned: burnedCalories });
            }

            // Gamification Update
            const newXP = (userProfile?.neuralXP || 0) + xpReward;
            const newStreak = (userProfile?.streak || 0) + 1;

            await updateDoc(userRef, {
                workoutHistory: arrayUnion(completionEntry),
                calorieHistory: history,
                "profile.neuralXP": newXP,
                "profile.streak": newStreak
            });
        } catch (err) {
            console.error("Error completing workout:", err);
        }

        // SYNC: If this workout matches today's planned workout, mark it as complete
        if (trainingPlan && trainingPlan.weeks) {
            const currentWeek = trainingPlan.weeks[trainingPlan.currentWeek - 1];
            const day = currentWeek?.days?.find(d => d.workout?.id === workout.id);

            if (day && !day.workoutCompleted) {
                // Mark workout as done
                await updateDailyTask(trainingPlan.currentWeek, day.dayOfWeek, 'workout');

                // Also mark all exercises as done? 
                // Yes, if they finished the protocol, they finished the exercises.
                if (day.workout?.exercises) {
                    day.workout.exercises.forEach((ex, idx) => {
                        if (!ex.completed) {
                            updateDailyTask(trainingPlan.currentWeek, day.dayOfWeek, 'exercise', idx);
                        }
                    });
                }
            }
        }
    };

    const updateHydration = async (amount) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            const newHydration = Math.max(0, (userProfile?.hydration || 0) + amount);
            await updateDoc(userRef, { "profile.hydration": newHydration });
        } catch (err) {
            console.error("Error updating hydration:", err);
        }
    };



    const resetData = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            const resetProfile = {
                ...defaultProfile,
                name: userProfile?.name || user.email?.split("@")[0] || "User",
            };

            await setDoc(userRef, {
                profile: resetProfile,
                dietPlan: [],
                workoutRoutine: null,
                weightHistory: [],
                calorieHistory: [],
                workoutHistory: [],
                trainingPlan: null
            }, { merge: true });

            // Local state updates (onSnapshot will handle most, but clearing these explicitly for instant UI feedback)
            setUserProfile(resetProfile);
            setDietPlan([]);
            setWorkoutRoutine(null);
            setWeightHistory([]);
            setCalorieHistory([]);
            setWorkoutHistory([]);
            setTrainingPlan(null);
            setNeuralXP(0);
            setStreak(0);
            setHydration(0);

        } catch (err) {
            console.error("Error resetting data:", err);
            throw err;
        }
    };

    // Training Plan Functions
    const updateTrainingPlan = async (newPlan) => {
        if (!user) return;
        try {
            setTrainingPlan(newPlan); // Optimistic Update

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { trainingPlan: newPlan }, { merge: true });

        } catch (err) {
            console.error("Error updating training plan:", err);
            // Revert on error (optional, but good practice would be to re-fetch)
        }
    };

    const updateDailyTask = async (weekNumber, dayOfWeek, taskType, taskIndex) => {
        if (!user || !trainingPlan) return;
        try {
            // DEEP CLONE to avoid state mutation and reference issues
            const updatedPlan = JSON.parse(JSON.stringify(trainingPlan));
            const week = updatedPlan.weeks[weekNumber - 1];

            if (!week || !week.days) return;

            const day = week.days.find(d => d.dayOfWeek === dayOfWeek);

            if (!day) return;

            if (taskType === 'workout') {
                day.workoutCompleted = !day.workoutCompleted;
                // If unchecking workout, uncheck all exercises? Or leave them? 
                // Let's leave them for now to avoid accidental data loss.
            } else if (taskType === 'exercise' && taskIndex !== undefined) {
                if (day.workout && day.workout.exercises && day.workout.exercises[taskIndex]) {
                    // Toggle exercise
                    day.workout.exercises[taskIndex].completed = !day.workout.exercises[taskIndex].completed;

                    // Auto-update Workout Completion Status
                    const allCompleted = day.workout.exercises.every(ex => ex.completed);
                    day.workoutCompleted = allCompleted;
                }
            } else if (taskType === 'meal' && taskIndex !== undefined) {
                if (day.meals && day.meals[taskIndex]) {
                    day.meals[taskIndex].completed = !day.meals[taskIndex].completed;
                }
            } else if (taskType === 'hydration') {
                day.hydrationCompleted = !day.hydrationCompleted;
            } else if (taskType === 'sleep') {
                day.sleepCompleted = !day.sleepCompleted;
            }

            // Update local state immediately to prevent flicker
            setTrainingPlan(updatedPlan);

            // Persist to DB
            await updateTrainingPlan(updatedPlan);

            // Award XP for task completion (optimistic)
            if ((taskType === 'workout' && day.workoutCompleted) ||
                (taskType === 'hydration' && day.hydrationCompleted) ||
                (taskType === 'sleep' && day.sleepCompleted)) {

                const newXP = (userProfile?.neuralXP || 0) + 10;
                // Don't await profile update to keep UI snappy
                updateUserProfile({ neuralXP: newXP });
            }
        } catch (err) {
            console.error("Error updating daily task:", err);
            // Revert state if needed by triggering a re-fetch or rolling back
            // For now, onSnapshot will eventually correct it if DB fails
        }
    };

    const getTodayTasks = () => {
        if (!trainingPlan) return null;
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const currentWeek = trainingPlan.weeks[trainingPlan.currentWeek - 1];
        return currentWeek?.days?.find(d => d.dayOfWeek === today) || null;
    };

    const value = {
        userProfile,
        manualMeals,
        aiMeals,
        manualWorkouts,
        aiWorkouts,
        weightHistory,
        calorieHistory,
        workoutHistory,
        neuralXP,
        streak,
        hydration,
        trainingPlan,
        loadingData,
        updateUserProfile,
        updateManualMeals,
        updateAIMeals,
        updateManualWorkouts,
        updateAIWorkouts,
        addMealEntry,
        addWeightEntry,
        completeWorkout,
        updateHydration,
        updateTrainingPlan,
        updateDailyTask,
        getTodayTasks,
        resetData
    };


    return (
        <FitnessContext.Provider value={value}>
            {children}
        </FitnessContext.Provider>
    );
}

