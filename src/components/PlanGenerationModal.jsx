import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Dumbbell, Target, Calendar, Utensils, Zap, Activity, Flame } from "lucide-react";

export default function PlanGenerationModal({ isOpen, onClose, onGenerate, userProfile }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        duration: 8,
        daysPerWeek: 5,
        goal: userProfile?.goal || "general_fitness",
        experience: "intermediate",
        equipment: "full_gym",
        dietaryPreference: "balanced",
        workoutIntensity: "moderate",
        muscleFocus: [],
        dailyCalories: 2000,
        mealsPerDay: 4
    });

    const handleGenerate = () => {
        onGenerate(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl bg-card/95 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all"
                    >
                        <X className="w-5 h-5 text-muted" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-accent/20">
                            <Sparkles className="w-8 h-8 text-accent" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-2">
                            Generate Training Plan
                        </h2>
                        <p className="text-sm text-muted font-bold uppercase tracking-tight">
                            Customize your AI-powered fitness journey
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all ${s === step ? "w-12 bg-accent" : s < step ? "w-8 bg-accent/50" : "w-8 bg-white/10"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Content Container */}
                    <div className="overflow-y-auto flex-1 pr-2 -mr-2">
                        {/* Step 1: Goal & Duration */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Target className="w-4 h-4 inline mr-2" />
                                        Fitness Goal
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: "weight_loss", label: "Weight Loss" },
                                            { value: "muscle_gain", label: "Muscle Gain" },
                                            { value: "endurance", label: "Endurance" },
                                            { value: "general_fitness", label: "General Fitness" }
                                        ].map((goal) => (
                                            <button
                                                key={goal.value}
                                                onClick={() => setFormData({ ...formData, goal: goal.value })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.goal === goal.value
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {goal.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Plan Duration
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[4, 8, 12].map((weeks) => (
                                            <button
                                                key={weeks}
                                                onClick={() => setFormData({ ...formData, duration: weeks })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.duration === weeks
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {weeks} Weeks
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Training Frequency */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Dumbbell className="w-4 h-4 inline mr-2" />
                                        Training Days per Week
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {[3, 4, 5, 6].map((days) => (
                                            <button
                                                key={days}
                                                onClick={() => setFormData({ ...formData, daysPerWeek: days })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.daysPerWeek === days
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {days} Days
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        Experience Level
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "beginner", label: "Beginner" },
                                            { value: "intermediate", label: "Intermediate" },
                                            { value: "advanced", label: "Advanced" }
                                        ].map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() => setFormData({ ...formData, experience: level.value })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.experience === level.value
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        Available Equipment
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: "full_gym", label: "Full Gym" },
                                            { value: "home_basic", label: "Home (Basic)" },
                                            { value: "bodyweight", label: "Bodyweight Only" },
                                            { value: "dumbbells", label: "Dumbbells Only" }
                                        ].map((eq) => (
                                            <button
                                                key={eq.value}
                                                onClick={() => setFormData({ ...formData, equipment: eq.value })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.equipment === eq.value
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {eq.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Nutrition */}
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Utensils className="w-4 h-4 inline mr-2" />
                                        Dietary Preference
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: "balanced", label: "Balanced" },
                                            { value: "high_protein", label: "High Protein" },
                                            { value: "low_carb", label: "Low Carb" },
                                            { value: "vegetarian", label: "Vegetarian" },
                                            { value: "vegan", label: "Vegan" },
                                            { value: "keto", label: "Keto" },
                                            { value: "non_vegetarian", label: "Non-Veg" },
                                            { value: "eggetarian", label: "Eggitarian" }
                                        ].map((diet) => (
                                            <button
                                                key={diet.value}
                                                onClick={() => setFormData({ ...formData, dietaryPreference: diet.value })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.dietaryPreference === diet.value
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {diet.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Plan Summary</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Goal:</span> {formData.goal.replace("_", " ")}
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Duration:</span> {formData.duration} weeks
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Training:</span> {formData.daysPerWeek} days/week
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Level:</span> {formData.experience}
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Diet:</span> {formData.dietaryPreference.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Advanced Preferences */}
                        {step === 4 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Activity className="w-4 h-4 inline mr-2" />
                                        Workout Intensity
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: "low", label: "Low" },
                                            { value: "moderate", label: "Moderate" },
                                            { value: "high", label: "High" }
                                        ].map((intensity) => (
                                            <button
                                                key={intensity.value}
                                                onClick={() => setFormData({ ...formData, workoutIntensity: intensity.value })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.workoutIntensity === intensity.value
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {intensity.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Dumbbell className="w-4 h-4 inline mr-2" />
                                        Muscle Focus (Select Multiple)
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            "Chest", "Back", "Shoulders", "Arms",
                                            "Legs", "Core", "Glutes", "Full Body"
                                        ].map((muscle) => {
                                            const isSelected = formData.muscleFocus.includes(muscle);
                                            return (
                                                <button
                                                    key={muscle}
                                                    onClick={() => {
                                                        const newFocus = isSelected
                                                            ? formData.muscleFocus.filter(m => m !== muscle)
                                                            : [...formData.muscleFocus, muscle];
                                                        setFormData({ ...formData, muscleFocus: newFocus });
                                                    }}
                                                    className={`p-3 rounded-2xl border font-bold uppercase tracking-tight text-xs transition-all ${isSelected
                                                        ? "bg-accent/20 border-accent/40 text-accent"
                                                        : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                        }`}
                                                >
                                                    {muscle}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Flame className="w-4 h-4 inline mr-2" />
                                        Daily Calorie Target
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.dailyCalories}
                                        onChange={(e) => setFormData({ ...formData, dailyCalories: parseInt(e.target.value) || 2000 })}
                                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-accent/40 focus:outline-none transition-all"
                                        placeholder="2000"
                                        min="1200"
                                        max="5000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-white uppercase tracking-tight mb-3">
                                        <Utensils className="w-4 h-4 inline mr-2" />
                                        Meals Per Day
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[3, 4, 5].map((meals) => (
                                            <button
                                                key={meals}
                                                onClick={() => setFormData({ ...formData, mealsPerDay: meals })}
                                                className={`p-4 rounded-2xl border font-bold uppercase tracking-tight text-sm transition-all ${formData.mealsPerDay === meals
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {meals} Meals
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs font-black text-muted uppercase tracking-widest mb-3">Plan Summary</p>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Goal:</span> {formData.goal.replace("_", " ")}
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Duration:</span> {formData.duration} weeks
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Training:</span> {formData.daysPerWeek} days/week @ {formData.workoutIntensity} intensity
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Muscle Focus:</span> {formData.muscleFocus.length > 0 ? formData.muscleFocus.join(", ") : "All"}
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Nutrition:</span> {formData.dailyCalories} kcal, {formData.mealsPerDay} meals/day
                                        </p>
                                        <p className="text-white font-bold">
                                            <span className="text-muted">Diet:</span> {formData.dietaryPreference.replace("_", " ")}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10 shrink-0">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-tight text-sm rounded-2xl transition-all"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-8 py-3 bg-accent hover:bg-accent/90 text-black font-black uppercase tracking-tight text-sm rounded-2xl transition-all flex items-center gap-2"
                            >
                                Next
                                <Zap className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-3 bg-accent hover:bg-accent/90 text-black font-black uppercase tracking-tight text-sm rounded-2xl transition-all flex items-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Generate Plan
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
