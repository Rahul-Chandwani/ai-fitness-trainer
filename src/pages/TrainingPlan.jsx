import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PageTransition from "../components/PageTransition";
import WeeklyCalendar from "../components/WeeklyCalendar";
import DailyTaskCard from "../components/DailyTaskCard";
import WorkoutProtocolModal from "../components/WorkoutProtocolModal";
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
import { motion } from "framer-motion";
import { analyzeProgress } from "../services/trainingPlanGenerator";
import { getProgressSummary, calculateWeeklyCompletion } from "../services/progressAnalyzer";

export default function TrainingPlan() {
    const { trainingPlan, userProfile, updateDailyTask, workoutHistory, calorieHistory, weightHistory } = useFitness();
    const { addToast } = useToast();
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
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
                    <div className="max-w-7xl mx-auto">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-32 h-32 bg-accent/10 rounded-[3rem] flex items-center justify-center mx-auto border border-accent/20 shadow-2xl shadow-accent/5">
                                    <Lock className="w-12 h-12 text-accent animate-pulse" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                                        Advanced Feature
                                    </h2>
                                    <p className="text-muted font-bold text-sm leading-relaxed uppercase tracking-tight">
                                        AI-powered automatic training plans are exclusive to{" "}
                                        <span className="text-accent underline decoration-2 underline-offset-4">Advanced members</span>.
                                        Upgrade to unlock personalized workout and diet plans!
                                    </p>
                                </div>
                                <Link
                                    to="/plans"
                                    className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black font-black uppercase tracking-tighter rounded-[2rem] hover:bg-accent transition-all shadow-2xl shadow-white/5 active:scale-95"
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
                    <div className="max-w-7xl mx-auto">
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="max-w-md text-center space-y-8">
                                <div className="w-32 h-32 bg-accent/10 rounded-[3rem] flex items-center justify-center mx-auto border border-accent/20">
                                    <Sparkles className="w-12 h-12 text-accent" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight mb-4">
                                        No Training Plan
                                    </h2>
                                    <p className="text-muted font-bold text-sm leading-relaxed uppercase tracking-tight">
                                        Generate your personalized AI training plan to get started!
                                    </p>
                                </div>
                                <Link
                                    to="/workouts"
                                    className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black font-black uppercase tracking-tighter rounded-[2rem] hover:bg-accent transition-all shadow-2xl"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Generate Plan
                                </Link>
                            </div>
                        </div>
                    </div>
                </PageTransition>
            </DashboardLayout>
        );
    }

    const currentWeek = trainingPlan.weeks[trainingPlan.currentWeek - 1];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayData = currentWeek?.days?.find(d => d.dayOfWeek === today);
    const weeklyCompletion = calculateWeeklyCompletion(currentWeek);

    // Prepare chart data
    const weightChartData = weightHistory?.slice(-8).map((w, i) => ({
        date: `Week ${i + 1}`,
        value: w.weight
    })) || [];

    return (
        <DashboardLayout>
            <PageTransition>
                <div className="max-w-7xl mx-auto space-y-8 pb-20">
                    {/* Header */}
                    <div>
                        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mb-6">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>

                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-1.5 h-12 md:h-16 bg-accent rounded-full flex-shrink-0" />
                                <div className="min-w-0">
                                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white truncate">AI Training Plan</h1>
                                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 truncate">
                                        Week {trainingPlan.currentWeek} of {trainingPlan.duration} • {trainingPlan.goal}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full xl:w-auto">
                                <div className="p-3 md:p-4 bg-white/5 rounded-2xl border border-white/5 flex-grow xl:flex-grow-0">
                                    <p className="text-[8px] text-muted font-black uppercase tracking-widest mb-1">Weekly Progress</p>
                                    <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter">{weeklyCompletion}%</p>
                                </div>
                                <button
                                    onClick={loadAIInsights}
                                    className="p-3 md:p-4 bg-accent/10 hover:bg-accent/20 rounded-2xl border border-accent/20 transition-all flex-shrink-0"
                                >
                                    <RefreshCw className="w-5 h-5 text-accent" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1.5 md:p-2 bg-white/5 rounded-3xl border border-white/5 overflow-x-auto min-w-0">
                        <TabButton
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                            icon={<Target className="w-4 h-4" />}
                            label="Overview"
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
                            label="Progress"
                        />
                    </div>

                    {/* Content */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Today's Tasks */}
                            <div className="lg:col-span-2">
                                {todayData ? (
                                    <DailyTaskCard
                                        day={todayData}
                                        onTaskComplete={handleTaskComplete}
                                        onViewWorkout={(workout) => setSelectedWorkout(workout)}
                                        isToday={true}
                                    />
                                ) : (
                                    <div className="card-premium p-12 rounded-[2.5rem] border border-white/5 text-center">
                                        <p className="text-muted font-bold uppercase tracking-tight">No tasks for today</p>
                                    </div>
                                )}
                            </div>

                            {/* AI Insights */}
                            <div>
                                <AIInsightsWidget insights={aiInsights} loading={loadingInsights} />
                            </div>
                        </div>
                    )}

                    {activeTab === "schedule" && (
                        <div className="space-y-8">
                            {/* Weekly Calendar */}
                            <WeeklyCalendar
                                weekData={currentWeek}
                                onDayClick={setSelectedDay}
                                currentDay={today}
                            />

                            {/* Selected Day Details */}
                            {selectedDay && (
                                <DailyTaskCard
                                    day={selectedDay}
                                    onTaskComplete={handleTaskComplete}
                                    onViewWorkout={(workout) => setSelectedWorkout(workout)}
                                    isToday={selectedDay.dayOfWeek === today}
                                />
                            )}
                        </div>
                    )}

                    {activeTab === "progress" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Weight Progress */}
                            <div className="card-premium p-8 rounded-[2.5rem] border border-white/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
                                        <TrendingUp className="w-5 h-5 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Weight Trend</h3>
                                </div>
                                <ProgressChart data={weightChartData} type="weight" title="Weight (kg)" />
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                                <StatCard
                                    icon={<Flame className="w-6 h-6 text-orange-400" />}
                                    label="Target Calories"
                                    value={`${trainingPlan.targetCalories} kcal`}
                                    color="orange"
                                />
                                <StatCard
                                    icon={<Target className="w-6 h-6 text-accent" />}
                                    label="Protein Goal"
                                    value={`${trainingPlan.targetMacros?.protein || 0}g`}
                                    color="accent"
                                />
                                <StatCard
                                    icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                                    label="Weekly Completion"
                                    value={`${weeklyCompletion}%`}
                                    color="emerald"
                                />
                            </div>
                        </div>
                    )}

                </div>
            </PageTransition>

            {
                selectedWorkout && (
                    <WorkoutProtocolModal
                        workout={selectedWorkout}
                        onClose={() => setSelectedWorkout(null)}
                    />
                )
            }
        </DashboardLayout >
    );
}

function TabButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-tight text-sm transition-all ${active
                ? "bg-white text-black shadow-lg"
                : "text-muted hover:text-white hover:bg-white/5"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function StatCard({ icon, label, value, color = "accent" }) {
    return (
        <div className={`card-premium p-6 rounded-[2rem] border border-white/5 flex items-center gap-4`}>
            <div className={`w-12 h-12 bg-${color}-500/10 rounded-2xl flex items-center justify-center border border-${color}-500/20`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-muted font-black uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">{value}</p>
            </div>
        </div>
    );
}
