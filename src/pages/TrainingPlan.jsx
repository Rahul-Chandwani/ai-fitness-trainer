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
    Flame
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
                addToast("PREMIUM TRAINING PLAN SYNCHRONIZED", "success");
                setShowGenModal(false);
            }
        } catch (err) {
            addToast("UPLINK FAILED: AI OVERLOAD", "error");
        } finally {
            setIsGenerating(false);
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
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-accent/10 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center mx-auto border border-accent/20 shadow-2xl shadow-accent/5">
                                    <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                                        Advanced Feature
                                    </h2>
                                    <p className="text-muted font-bold text-xs sm:text-sm leading-relaxed uppercase tracking-tight">
                                        AI-powered automatic training plans are exclusive to{" "}
                                        <span className="text-accent underline decoration-2 underline-offset-4">Advanced members</span>.
                                        Upgrade to unlock personalized workout and diet plans!
                                    </p>
                                </div>
                                <Link
                                    to="/plans"
                                    className="inline-flex items-center gap-3 px-8 sm:px-12 py-5 sm:py-6 bg-white text-black font-black uppercase tracking-tighter rounded-full sm:rounded-[2rem] hover:bg-accent transition-all shadow-2xl shadow-white/5 active:scale-95 text-xs sm:text-sm"
                                >
                                    <Sparkles className="w-5 h-5" />
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
            <DashboardLayout>
                <PageTransition>
                    <div className="max-w-7xl mx-auto px-4">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-accent/10 rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center mx-auto border border-accent/20 shadow-2xl shadow-accent/5">
                                    <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase italic tracking-tight mb-4 leading-tight">
                                        No Training Plan Attached
                                    </h2>
                                    <p className="text-muted font-bold text-xs sm:text-sm leading-relaxed uppercase tracking-tight">
                                        Initialize your personalized AI protocol to synchronize your nutrition and training schedule.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowGenModal(true)}
                                    className="inline-flex items-center gap-3 px-8 sm:px-12 py-5 sm:py-6 bg-white text-black font-black uppercase tracking-tighter rounded-full sm:rounded-[2rem] hover:bg-accent transition-all shadow-2xl active:scale-95 text-xs sm:text-sm"
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Sparkles className="w-5 h-5" />
                                    )}
                                    {isGenerating ? "Processing Plan..." : "Generate AI Plan"}
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
        <DashboardLayout>
            <PageTransition>
                <div className="max-w-7xl mx-auto space-y-8 pb-32 px-4">
                    {/* Header */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-1.5 h-12 md:h-16 bg-accent rounded-full flex-shrink-0" />
                            <div className="min-w-0">
                                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white truncate uppercase italic">AI Training Protocol</h1>
                                <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 truncate">
                                    Week {trainingPlan.currentWeek} of {trainingPlan.duration} • {trainingPlan.goal.replace('_', ' ')}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <div className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5 flex-grow xl:flex-grow-0 min-w-[140px]">
                                <p className="text-[8px] text-muted font-black uppercase tracking-widest mb-1">Weekly Metric</p>
                                <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter">{weeklyCompletion}% DONE</p>
                            </div>
                            <button
                                onClick={loadAIInsights}
                                disabled={loadingInsights}
                                className="p-4 bg-accent/10 hover:bg-accent/20 rounded-2xl border border-accent/20 transition-all flex-shrink-0"
                            >
                                <RefreshCw className={`w-5 h-5 text-accent ${loadingInsights ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1.5 md:p-2 bg-white/5 rounded-3xl border border-white/5 overflow-x-auto min-w-0 scrollbar-none">
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
                            label="Schedule"
                        />
                        <TabButton
                            active={activeTab === "progress"}
                            onClick={() => setActiveTab("progress")}
                            icon={<TrendingUp className="w-4 h-4" />}
                            label="Insights"
                        />
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-6 bg-accent rounded-full"></div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Current Protocol</h2>
                                        </div>
                                        {todayData ? (
                                            <DailyTaskCard
                                                day={todayData}
                                                onTaskComplete={handleTaskComplete}
                                                onViewWorkout={(workout) => setSelectedWorkout(workout)}
                                                isToday={true}
                                            />
                                        ) : (
                                            <div className="card-premium p-12 rounded-[2.5rem] border border-white/5 text-center bg-white/5">
                                                <p className="text-muted font-bold uppercase tracking-tight">Active Rest Day</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-6 bg-accent rounded-full"></div>
                                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">AI Intelligence</h2>
                                        </div>
                                        <AIInsightsWidget insights={aiInsights} loading={loadingInsights} />

                                        <div className="grid grid-cols-1 gap-4">
                                            <StatCard
                                                icon={<Flame className="w-6 h-6 text-orange-400" />}
                                                label="Target Calories"
                                                value={`${trainingPlan.targetCalories || 0} kcal`}
                                                color="orange"
                                            />
                                            <StatCard
                                                icon={<Target className="w-6 h-6 text-accent" />}
                                                label="Protein Goal"
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
                                <div className="card-premium p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-white/5">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                                            <TrendingUp className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tight">Vitals Track</h3>
                                    </div>
                                    <div className="h-[250px] sm:h-[300px]">
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
                                        className="w-full mt-4 p-8 rounded-[2rem] border border-dashed border-white/10 hover:border-accent/40 text-muted hover:text-accent transition-all uppercase font-black tracking-widest text-[10px] flex flex-col items-center gap-3 bg-white/2"
                                    >
                                        <Sparkles className="w-6 h-6" />
                                        Refactor Training Plan
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </PageTransition>

            {selectedWorkout && (
                <WorkoutProtocolModal
                    workout={selectedWorkout}
                    onClose={() => setSelectedWorkout(null)}
                />
            )}

            <PlanGenerationModal
                isOpen={showGenModal}
                onClose={() => setShowGenModal(false)}
                onGenerate={handleGeneratePlan}
                userProfile={userProfile}
            />
        </DashboardLayout>
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black uppercase tracking-tight text-[10px] sm:text-xs transition-all whitespace-nowrap min-w-[100px] ${active
                ? "bg-white text-black shadow-xl"
                : "text-muted hover:text-white hover:bg-white/5"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function StatCard({ icon, label, value, color = "accent" }) {
    const colorMap = {
        accent: "bg-accent/10 border-accent/20",
        orange: "bg-orange-500/10 border-orange-500/20",
        emerald: "bg-emerald-500/10 border-emerald-500/20",
    };

    return (
        <div className="card-premium p-5 sm:p-6 rounded-[2rem] border border-white/5 flex items-center gap-4 bg-white/5 group hover:bg-white/10 transition-all">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorMap[color] || colorMap.accent} rounded-2xl flex items-center justify-center border shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] sm:text-[9px] text-muted font-black uppercase tracking-widest truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-black text-white italic tracking-tighter truncate">{value}</p>
            </div>
        </div>
    );
}
