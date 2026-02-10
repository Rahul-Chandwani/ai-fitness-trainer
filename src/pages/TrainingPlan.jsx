import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import WeeklyCalendar from "../components/WeeklyCalendar";
import DailyTaskCard from "../components/DailyTaskCard";
import WorkoutProtocolModal from "../components/WorkoutProtocolModal";
import PlanGenerationModal from "../components/PlanGenerationModal";
import ProgressChart from "../components/ProgressChart";
import AIInsightsWidget from "../components/AIInsightsWidget";
import { useFitness } from "../context/FitnessContext";
import { useToast } from "../components/Toast";
import {
    ChevronLeft,
    Sparkles,
    Calendar,
    TrendingUp,
    Target,
    RefreshCw,
    Lock,
    Flame,
    Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeProgress, generateComprehensiveTrainingPlan } from "../services/trainingPlanGenerator";
import { getProgressSummary, calculateWeeklyCompletion } from "../services/progressAnalyzer";

export default function TrainingPlan() {
    const { trainingPlan, userProfile, updateDailyTask, updateTrainingPlan, workoutHistory, calorieHistory, weightHistory } = useFitness();
    const { addToast } = useToast();
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenModal, setShowGenModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [aiInsights, setAiInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [activeTab, setActiveTab] = useState("overview"); // overview, schedule, progress

    const isAdvanced = userProfile?.subscriptionTier === "advanced";

    useEffect(() => {
        if (isAdvanced && trainingPlan) {
            loadAIInsights();
        }
    }, [isAdvanced, trainingPlan]);

    const loadAIInsights = async () => {
        if (!trainingPlan) return;

        setLoadingInsights(true);
        try {
            const progressData = getProgressSummary(
                { workoutHistory, calorieHistory, weightHistory, userProfile },
                trainingPlan
            );

            const insights = await analyzeProgress(
                {
                    completedWorkouts: workoutHistory?.length || 0,
                    totalWorkouts: trainingPlan.currentWeek * 5,
                    completedMeals: calorieHistory?.length || 0,
                    totalMeals: trainingPlan.currentWeek * 28,
                    weightChange: progressData.weightTrend,
                    currentWeek: trainingPlan.currentWeek
                },
                trainingPlan
            );

            setAiInsights(progressData.insights);
        } catch (error) {
            console.error("Failed to load AI insights:", error);
        } finally {
            setLoadingInsights(false);
        }
    };

    const handleGeneratePlan = async (preferences) => {
        try {
            setIsGenerating(true);
            const plan = await generateComprehensiveTrainingPlan(userProfile, preferences);
            if (plan) {
                await updateTrainingPlan(plan);
                addToast("PREMIUM PLAN SAVED", "success");
                setShowGenModal(false);
            }
        } catch (err) {
            addToast("FAILED TO GENERATE", "error");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleResetPlan = async () => {
        try {
            await updateTrainingPlan(null);
            addToast("TRAINING PLAN DELETED", "success");
            setShowResetConfirm(false);
        } catch (error) {
            addToast("RESET FAILED", "error");
        }
    };

    const handleTaskComplete = async (dayOfWeek, taskType, taskIndex) => {
        try {
            await updateDailyTask(trainingPlan.currentWeek, dayOfWeek, taskType, taskIndex);
            addToast("Task completed!", "success");
        } catch (error) {
            addToast("Failed to update task", "error");
        }
    };

    if (!isAdvanced) {
        return (
            <DashboardLayout>
                <PageTransition>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-[0.65rem] font-black text-muted hover:text-accent transition-colors group mb-8 uppercase tracking-[0.2em] opacity-60">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto border border-accent/20 shadow-2xl shadow-accent/5">
                                    <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-black text-text uppercase tracking-tighter mb-4 italic leading-none">
                                        PRO ACCESS
                                    </h2>
                                    <p className="text-muted font-black text-[0.65rem] sm:text-xs leading-relaxed uppercase tracking-[0.3em] opacity-60">
                                        AI-powered automatic training plans are exclusive to{" "}
                                        <span className="text-accent underline decoration-accent/30 underline-offset-4">Advanced members</span>.
                                    </p>
                                </div>
                                <Link
                                    to="/plans"
                                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-text text-bg font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-all shadow-xl active:scale-95 text-[0.65rem] italic"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Upgrade Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </DashboardLayout>
        );
    }

    if (!trainingPlan) {
        return (
            <DashboardLayout hideHeader={showGenModal}>
                <PageTransition>
                    <div className="max-w-7xl mx-auto px-4">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto border border-accent/20 shadow-2xl shadow-accent/5">
                                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-3xl sm:text-5xl font-black text-text uppercase italic tracking-tighter mb-4 leading-none">
                                        NO PROTOCOL FOUND
                                    </h2>
                                    <p className="text-muted font-black text-[0.65rem] sm:text-xs leading-relaxed uppercase tracking-[0.3em] opacity-60">
                                        Initialize your personalized AI protocol to synchronize your nutrition and training schedule.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowGenModal(true)}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-text text-bg font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-all shadow-xl active:scale-95 text-[0.65rem] italic"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-4 h-4" />
                                    )}
                                    {isGenerating ? "Processing..." : "Sync AI Plan"}
                                </button>
                            </div>
                        </div>
                    </div>
                </PageTransition>

                <PlanGenerationModal
                    isOpen={showGenModal}
                    onClose={() => setShowGenModal(false)}
                    onGenerate={handleGeneratePlan}
                    userProfile={userProfile}
                />
            </DashboardLayout>
        );
    }

    const currentWeekData = trainingPlan.weeks[trainingPlan.currentWeek - 1];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayData = currentWeekData?.days?.find(d => d.dayOfWeek === today);
    const weeklyCompletion = calculateWeeklyCompletion(currentWeekData);

    const weightChartData = weightHistory?.slice(-8).map((w, i) => ({
        date: `W${i + 1}`,
        value: w.weight
    })) || [];

    return (
        <DashboardLayout hideHeader={showGenModal}>
            <PageTransition>
                <div className="max-w-7xl mx-auto space-y-4 pb-32 px-4">
                    {/* Header */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-1.5 h-10 md:h-12 bg-accent rounded-full flex-shrink-0" />
                            <div className="min-w-0">
                                <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-text truncate uppercase italic leading-none">Training Plan</h1>
                                <p className="text-[0.6rem] text-accent font-black uppercase tracking-[0.4em] mt-2 truncate opacity-80">
                                    WEEK {trainingPlan.currentWeek} • {trainingPlan.duration} TOTAL • {(trainingPlan.goal || 'ALPHA').replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            <div className="px-5 py-2.5 bg-card/60 rounded-xl border border-border flex-grow xl:flex-grow-0 min-w-[140px] shadow-inner">
                                <p className="font-mono text-[0.55rem] text-muted font-black uppercase tracking-[0.3em] mb-1 opacity-50">COMPLETION</p>
                                <p className="text-xl font-black text-text italic tracking-tighter leading-none">{weeklyCompletion}% DONE</p>
                            </div>
                            <button
                                onClick={loadAIInsights}
                                disabled={loadingInsights}
                                className="p-3 bg-accent/10 hover:bg-accent/20 rounded-xl border border-accent/20 transition-all flex-shrink-0"
                            >
                                <RefreshCw className={`w-4 h-4 text-accent ${loadingInsights ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={() => setShowResetConfirm(true)}
                                className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 transition-all flex-shrink-0 group"
                            >
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1.5 p-1.5 bg-card/40 rounded-2xl border border-border overflow-x-auto min-w-0 scrollbar-none shadow-lg">
                        <TabButton
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                            icon={<Target className="w-4 h-4" />}
                            label="Today"
                        />
                        <TabButton
                            active={activeTab === "schedule"}
                            onClick={() => setActiveTab("schedule")}
                            icon={<Calendar className="w-4 h-4" />}
                            label="Cycle"
                        />
                        <TabButton
                            active={activeTab === "progress"}
                            onClick={() => setActiveTab("progress")}
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Metrics"
                        />
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-1 h-5 bg-accent rounded-full"></div>
                                            <h2 className="text-sm font-black text-text uppercase italic tracking-[0.2em]">TODAY'S PLAN</h2>
                                        </div>
                                        {todayData ? (
                                            <DailyTaskCard
                                                day={todayData}
                                                onTaskComplete={handleTaskComplete}
                                                onViewWorkout={(workout) => setSelectedWorkout(workout)}
                                                isToday={true}
                                            />
                                        ) : (
                                            <div className="card-premium p-10 rounded-xl border border-border text-center bg-card/40">
                                                <p className="text-sm font-black text-muted uppercase tracking-[0.2em] opacity-50">Active Rest Day</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="w-1 h-5 bg-accent rounded-full"></div>
                                            <h2 className="text-sm font-black text-text uppercase italic tracking-[0.2em]">AI COACH</h2>
                                        </div>
                                        <AIInsightsWidget insights={aiInsights} loading={loadingInsights} />

                                        <div className="grid grid-cols-2 gap-3">
                                            <StatCard
                                                icon={<Flame className="w-4 h-4 text-orange-400" />}
                                                label="Target"
                                                value={`${trainingPlan.targetCalories || 0}`}
                                                unit="KCAL"
                                                color="orange"
                                            />
                                            <StatCard
                                                icon={<Target className="w-4 h-4 text-accent" />}
                                                label="Protein"
                                                value={`${trainingPlan.targetMacros?.protein || 0}g`}
                                                color="accent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "schedule" && (
                            <motion.div
                                key="schedule"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <WeeklyCalendar
                                    weekData={currentWeekData}
                                    onDayClick={setSelectedDay}
                                    currentDay={today}
                                />
                                {selectedDay && (
                                    <DailyTaskCard
                                        day={selectedDay}
                                        onTaskComplete={handleTaskComplete}
                                        onViewWorkout={(workout) => setSelectedWorkout(workout)}
                                        isToday={selectedDay.dayOfWeek === today}
                                    />
                                )}
                            </motion.div>
                        )}

                        {activeTab === "progress" && (
                            <motion.div
                                key="progress"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="card-premium p-6 md:p-10 rounded-[2.5rem] border border-border bg-card/60 shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                        <TrendingUp className="w-32 h-32 text-accent" />
                                    </div>
                                    <div className="flex items-center gap-4 mb-8 relative z-10">
                                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 shadow-sm">
                                            <TrendingUp className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="text-sm font-black text-text uppercase italic tracking-[0.2em]">WEIGHT HISTORY</h3>
                                    </div>
                                    <div className="h-[200px]">
                                        <ProgressChart data={weightChartData} type="weight" title="Weight (kg)" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <StatCard
                                        icon={<Flame className="w-6 h-6 text-orange-400" />}
                                        label="Daily Intake"
                                        value={`${trainingPlan.targetCalories || 0} kcal`}
                                        color="orange"
                                    />
                                    <StatCard
                                        icon={<Target className="w-6 h-6 text-accent" />}
                                        label="Protein Focus"
                                        value={`${trainingPlan.targetMacros?.protein || 0}g`}
                                        color="accent"
                                    />
                                    <StatCard
                                        icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                                        label="System Health"
                                        value={`${weeklyCompletion}%`}
                                        color="emerald"
                                    />
                                    <button
                                        onClick={() => setShowGenModal(true)}
                                        className="w-full mt-4 p-8 rounded-[2rem] border border-dashed border-accent/20 hover:border-accent/40 text-muted hover:text-accent transition-all uppercase font-black tracking-[0.4em] text-[0.6rem] flex flex-col items-center gap-4 bg-accent/5 hover:bg-accent/10 group shadow-sm active:scale-95"
                                    >
                                        <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        Update Plan
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PageTransition>

            <PlanGenerationModal
                isOpen={showGenModal}
                onClose={() => setShowGenModal(false)}
                onGenerate={handleGeneratePlan}
                userProfile={userProfile}
            />

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
                {showResetConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowResetConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-dark border border-red-500/20 rounded-xl p-6 max-w-sm w-full space-y-4"
                        >
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto border border-red-500/20">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>

                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-black text-text uppercase italic tracking-tighter leading-none">
                                    DELETE PLAN?
                                </h3>
                                <p className="text-xs text-muted font-black uppercase tracking-[0.2em] leading-relaxed opacity-60">
                                    This action will permanently remove your current {trainingPlan.duration}-week training plan. All history will be preserved.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowResetConfirm(false)}
                                    className="flex-1 px-8 py-5 bg-card/60 hover:bg-card/80 text-muted font-black uppercase text-[0.65rem] tracking-widest rounded-2xl border border-border transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPlan}
                                    className="flex-1 px-8 py-5 bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[0.65rem] tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-500/20"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <WorkoutProtocolModal
                isOpen={!!selectedWorkout}
                onClose={() => setSelectedWorkout(null)}
                workout={selectedWorkout}
            />
        </DashboardLayout>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black uppercase tracking-tight text-xs transition-all whitespace-nowrap ${active
                ? "bg-text text-bg shadow-md"
                : "text-muted hover:text-text hover:bg-white/10"
                }`}
        >
            {icon}
            <span className="tracking-widest">{label}</span>
        </button>
    );
}

function StatCard({ icon, label, value, unit, color = "accent" }) {
    const colorMap = {
        accent: "bg-accent/10 border-accent/20",
        orange: "bg-orange-500/10 border-orange-500/20",
        emerald: "bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <div className="card-premium p-4 rounded-2xl border border-border flex items-center gap-4 bg-card/40 group hover:border-accent/30 transition-all">
            <div className={`w-10 h-10 ${colorMap[color] || colorMap.accent} rounded-xl flex items-center justify-center border shrink-0`}>
                <div className="scale-100">{icon}</div>
            </div>
            <div className="min-w-0">
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.2em] truncate mb-1 opacity-60">{label}</p>
                <div className="flex items-baseline gap-1.5">
                    <p className="text-2xl font-black text-text italic tracking-tighter truncate leading-none">{value}</p>
                    {unit && <span className="text-[0.65rem] font-black text-muted uppercase italic opacity-70">{unit}</span>}
                </div>
            </div>
        </div>
    );
}
