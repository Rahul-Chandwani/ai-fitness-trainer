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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="relative w-full max-w-2xl bg-card border border-white/10 rounded-xl p-4 md:p-8 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all"
                    >
                        <X className="w-4 h-4 text-muted" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3 border border-accent/20">
                            <Sparkles className="w-6 h-6 text-accent" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight mb-1">
                            Generate Protocol
                        </h2>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                            AI-Powered Optimization Engine
                        </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-1.5 mb-6">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all ${s === step ? "w-8 bg-accent" : s < step ? "w-4 bg-accent/50" : "w-4 bg-white/10"
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Target className="w-3 h-3 inline mr-1.5" />
                                        Primary Directive
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: "weight_loss", label: "Loss" },
                                            { value: "muscle_gain", label: "Gain" },
                                            { value: "endurance", label: "Endurance" },
                                            { value: "general_fitness", label: "General" }
                                        ].map((goal) => (
                                            <button
                                                key={goal.value}
                                                onClick={() => setFormData({ ...formData, goal: goal.value })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.goal === goal.value
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Calendar className="w-3 h-3 inline mr-1.5" />
                                        Temporal Window
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[4, 8, 12].map((weeks) => (
                                            <button
                                                key={weeks}
                                                onClick={() => setFormData({ ...formData, duration: weeks })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.duration === weeks
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Dumbbell className="w-3 h-3 inline mr-1.5" />
                                        Weekly Iterations
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[3, 4, 5, 6].map((days) => (
                                            <button
                                                key={days}
                                                onClick={() => setFormData({ ...formData, daysPerWeek: days })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.daysPerWeek === days
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        Operator Status
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: "beginner", label: "Novice" },
                                            { value: "intermediate", label: "Pro" },
                                            { value: "advanced", label: "Elite" }
                                        ].map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() => setFormData({ ...formData, experience: level.value })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.experience === level.value
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        Hardware Setup
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: "full_gym", label: "HQ Gym" },
                                            { value: "home_basic", label: "Home" },
                                            { value: "bodyweight", label: "Kinetic" },
                                            { value: "dumbbells", label: "Minimal" }
                                        ].map((eq) => (
                                            <button
                                                key={eq.value}
                                                onClick={() => setFormData({ ...formData, equipment: eq.value })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.equipment === eq.value
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Utensils className="w-3 h-3 inline mr-1.5" />
                                        Fuel Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { value: "balanced", label: "Balanced" },
                                            { value: "high_protein", label: "Protein" },
                                            { value: "low_carb", label: "Slim" },
                                            { value: "vegetarian", label: "Plant" },
                                            { value: "vegan", label: "Vegan" },
                                            { value: "keto", label: "Keto" },
                                            { value: "non_vegetarian", label: "Mixed" },
                                            { value: "eggetarian", label: "Egg" }
                                        ].map((diet) => (
                                            <button
                                                key={diet.value}
                                                onClick={() => setFormData({ ...formData, dietaryPreference: diet.value })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.dietaryPreference === diet.value
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Activity className="w-3 h-3 inline mr-1.5" />
                                        Stress Threshold
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: "low", label: "Low" },
                                            { value: "moderate", label: "Mid" },
                                            { value: "high", label: "Max" }
                                        ].map((intensity) => (
                                            <button
                                                key={intensity.value}
                                                onClick={() => setFormData({ ...formData, workoutIntensity: intensity.value })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.workoutIntensity === intensity.value
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Dumbbell className="w-3 h-3 inline mr-1.5" />
                                        Vector Focus
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
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
                                                    className={`p-2.5 rounded-xl border font-black uppercase tracking-widest text-[9px] transition-all ${isSelected
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
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Flame className="w-3 h-3 inline mr-1.5" />
                                        Caloric Load
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.dailyCalories}
                                        onChange={(e) => setFormData({ ...formData, dailyCalories: parseInt(e.target.value) || 2000 })}
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[11px] focus:border-accent/40 focus:outline-none transition-all"
                                        placeholder="2000"
                                        min="1200"
                                        max="5000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-white uppercase tracking-widest mb-2">
                                        <Utensils className="w-3 h-3 inline mr-1.5" />
                                        Frequency
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[3, 4, 5].map((meals) => (
                                            <button
                                                key={meals}
                                                onClick={() => setFormData({ ...formData, mealsPerDay: meals })}
                                                className={`p-3 rounded-xl border font-black uppercase tracking-widest text-[10px] transition-all ${formData.mealsPerDay === meals
                                                    ? "bg-accent/20 border-accent/40 text-accent"
                                                    : "bg-white/5 border-white/10 text-muted hover:border-accent/20"
                                                    }`}
                                            >
                                                {meals} Units
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
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 shrink-0">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-lg transition-all"
                            >
                                Previous
                            </button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-zinc-950 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center gap-1.5"
                            >
                                Continue
                                <Zap className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <button
                                onClick={handleGenerate}
                                className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-zinc-950 font-black uppercase tracking-widest text-[9px] rounded-lg transition-all flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Initiate Engine
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
