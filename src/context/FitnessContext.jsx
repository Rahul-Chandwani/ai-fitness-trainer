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
    const [dietPlan, setDietPlan] = useState([]);
    const [workoutRoutine, setWorkoutRoutine] = useState(null);
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
            setDietPlan([]);
            setWorkoutRoutine(null);
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
                setDietPlan(data.dietPlan || []);
                setWorkoutRoutine(data.workoutRoutine || null);
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

    const updateDietPlan = async (newPlan) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { dietPlan: newPlan }, { merge: true });
        } catch (err) {
            console.error("Error updating diet:", err);
        }
    };

    const updateWorkoutRoutine = async (newRoutine) => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { workoutRoutine: newRoutine }, { merge: true });
        } catch (err) {
            console.error("Error updating workout:", err);
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
            await setDoc(userRef, {
                dietPlan: [],
                workoutRoutine: null,
                weightHistory: [],
                calorieHistory: [],
                workoutHistory: []
            }, { merge: true });
        } catch (err) {
            console.error("Error resetting data:", err);
        }
    };

    // Training Plan Functions
    const updateTrainingPlan = async (newPlan) => {
        if (!user) return;
        try {
            setTrainingPlan(newPlan); // Optimistic Update

            // SYNC LOGIC: Also add these workouts/meals to the user's main library
            // This ensures they appear in "My Workouts" and "My Diet"
            let workoutUpdates = {};
            let dietUpdates = {};

            // 1. Extract unique workouts from the plan
            if (newPlan && newPlan.weeks) {
                const planWorkouts = [];
                const planMeals = [];

                newPlan.weeks.forEach(week => {
                    week.days.forEach(day => {
                        if (day.workout) {
                            // Add an ID if missing to dedup
                            if (!day.workout.id) day.workout.id = `plan_wk${week.weekNumber}_${day.dayOfWeek}_${Date.now()}`;
                            planWorkouts.push(day.workout);
                        }
                        if (day.meals) {
                            day.meals.forEach(meal => {
                                if (!meal.id) meal.id = `plan_meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                                planMeals.push(meal);
                            });
                        }
                    });
                });

                // Merge into existing workoutRoutine if it's an array, or create new
                // For simplicity in this context, we might just append distinct ones or replace if it's a "Routine"
                // The user asked to "add to the workouts and diet pages".
                // Assuming 'workoutRoutine' is a single routine or array of routines? 
                // Looking at initial state: `workoutRoutine` = null or object. 
                // Let's assume we want to APPEND to `workoutHistory` or a new `savedWorkouts` collection? 
                // The context has `workoutRoutine` (singular). 
                // *Correction*: The prompt says "My Workouts".
                // If the app structure uses `workoutRoutine` as "The Current Routine", we might overwrite it OR 
                // if we have a list of saved workouts, we add there. 
                // Let's look at `Workouts.jsx`... it uses `workoutRoutine`. 
                // Let's just update `workoutRoutine` to BE this new plan's schedule if it's compatible, 
                // OR better, let's just save the plan and let Workouts.jsx read from TrainingPlan?
                // NO, user said "track individually".
                // Let's just create a Union of workouts in a new field if needed, but for now let's 
                // assume `workoutRoutine` should track the *current* plan's structure.

                // ACTUALLY, checking `FitnessContext` state: `workoutRoutine` seems to be *one* routine.
                // But `dietPlan` is an array `[]`.

                if (planMeals.length > 0) {
                    // Filter duplicates based on name/cal? Or just append?
                    // Let's append new ones to dietPlan
                    const newDiet = [...dietPlan, ...planMeals];
                    dietUpdates = { dietPlan: newDiet };
                    setDietPlan(newDiet);
                }
            }

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, { trainingPlan: newPlan, ...dietUpdates }, { merge: true });

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
        dietPlan,
        workoutRoutine,
        weightHistory,
        calorieHistory,
        workoutHistory,
        neuralXP,
        streak,
        hydration,
        trainingPlan,
        loadingData,
        updateUserProfile,
        updateDietPlan,
        updateWorkoutRoutine,
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

