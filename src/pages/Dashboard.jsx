import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import WeightChart from "../components/charts/WeightChart";
import CaloriesChart from "../components/charts/CaloriesChart";
import MacrosChart from "../components/charts/MacrosChart";
import HydrationWidget from "../components/HydrationWidget";
import TodayTasksWidget from "../components/TodayTasksWidget";
import AIInsightsWidget from "../components/AIInsightsWidget";
import { useFitness } from "../context/FitnessContext";
import { Activity, Flame, TrendingUp, Zap, Trophy, Droplets, Target, Cpu, ShieldAlert, Dumbbell, Utensils, Bot, ChevronLeft, ChevronRight, Home } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getProgressSummary } from "../services/progressAnalyzer";

export default function Dashboard() {
  const { calorieHistory, workoutRoutine, workoutHistory, neuralXP, streak, userProfile, trainingPlan, getTodayTasks, updateDailyTask, weightHistory } = useFitness();
  const [aiInsights, setAiInsights] = useState(null);

  const isAdvanced = userProfile?.subscriptionTier === "advanced";
  const todayTasks = getTodayTasks();

  useEffect(() => {
    if (isAdvanced && trainingPlan) {
      const progressData = getProgressSummary(
        { workoutHistory, calorieHistory, weightHistory, userProfile },
        trainingPlan
      );
      setAiInsights(progressData.insights);
    }
  }, [isAdvanced, trainingPlan, workoutHistory, calorieHistory, weightHistory]);

  // Get latest day's data
  const todayStats = calorieHistory?.length > 0
    ? calorieHistory[calorieHistory.length - 1]
    : { intake: 0, burned: 0 };

  // Calculate Consistency Score
  const last7Days = workoutHistory?.filter(h => {
    const sessionDate = new Date(h.timestamp);
    const now = new Date();
    return (now - sessionDate) / (1000 * 60 * 60 * 24) <= 7;
  }) || [];

  const consistencyScore = Math.min(Math.round((last7Days.length / 4) * 100), 100);

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-12 pb-20 relative">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 rounded-full blur-[80px] md:blur-[140px] -z-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Header with Gamification Meta */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group w-fit">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-16 bg-accent rounded-full"></div>
                <div>
                  <h1 className="text-5xl font-extrabold tracking-tight text-white">Dashboard</h1>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">AI Health & Progress Insights</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/5 shadow-2xl relative group">
                <div className="absolute inset-0 bg-accent/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 px-6 border-r border-white/10 relative z-10">
                  <Trophy className="w-6 h-6 text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]" />
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-muted uppercase tracking-widest">XP Progress</p>
                    <p className="text-xl font-bold text-white tabular-nums">{neuralXP || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 px-6 relative z-10">
                  <Zap className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <div className="text-left">
                    <p className="text-[8px] font-bold text-muted uppercase tracking-widest">Active Streak</p>
                    <p className="text-xl font-bold text-white tabular-nums">{streak || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced User Section - Training Plan Widgets */}
          {isAdvanced && trainingPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <TodayTasksWidget
                  todayTasks={todayTasks}
                  onQuickComplete={async (taskType) => {
                    if (todayTasks) {
                      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                      await updateDailyTask(trainingPlan.currentWeek, today, taskType);
                    }
                  }}
                />
              </div>
              <div>
                <AIInsightsWidget insights={aiInsights} loading={false} />
              </div>
            </div>
          )}

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary Metabolic Controller */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 card-premium p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group shadow-2xl shadow-accent/5"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-6 translate-x-6 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Activity className="w-48 h-48 text-accent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Cpu className="w-4 h-4 text-accent" />
                  <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em]">Nutrition Hub</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-12">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <p className="text-[9px] font-black text-emerald-400/80 uppercase tracking-widest">Intake</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-7xl font-black text-white italic tracking-tighter leading-none">{todayStats.intake}</h2>
                      <span className="text-xs font-black text-muted uppercase tracking-tighter">KCAL IN</span>
                    </div>
                  </div>

                  <div className="h-20 w-[1px] bg-white/10 hidden sm:block mb-1"></div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <p className="text-[9px] font-black text-orange-400/80 uppercase tracking-widest">Burned</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-7xl font-black text-white italic tracking-tighter leading-none">{todayStats.burned || 0}</h2>
                      <span className="text-xs font-black text-muted uppercase tracking-tighter">KCAL OUT</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reliability Widget */}
            <div className="card-premium p-10 rounded-[3.5rem] border border-white/5 hover:border-accent/30 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted text-[10px] font-black uppercase tracking-[0.3em]">Consistency</p>
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#fff" strokeWidth="2.5" strokeOpacity="0.05" />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: consistencyScore / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_5px_rgba(var(--accent-rgb),0.5)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{consistencyScore}%</span>
                    <span className="text-[8px] font-black text-muted uppercase mt-1">Status</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted text-center font-bold uppercase tracking-tight leading-relaxed px-2">
                  Workout consistency remains <span className="text-accent">High</span> across the last 7 days.
                </p>
              </div>
            </div>

          </div>

          {/* Strategic Hubs Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/workouts" className="card-premium p-10 rounded-[3.5rem] border border-white/5 hover:border-accent/30 transition-all flex items-center gap-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-transform relative z-10">
                <Dumbbell className="w-8 h-8 text-accent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-accent transition-colors">Workouts</h3>
                <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">Workout Plans</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/diet" className="card-premium p-10 rounded-[3.5rem] border border-white/5 hover:border-blue-400/30 transition-all flex items-center gap-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform relative z-10">
                <Utensils className="w-8 h-8 text-blue-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors">Diet</h3>
                <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">Diet Center</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/ai-coach" className="card-premium p-10 rounded-[3.5rem] border border-white/5 hover:border-purple-400/30 transition-all flex items-center gap-8 group relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform relative z-10">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-purple-400 transition-colors">AI Coach</h3>
                <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">AI Sync</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Secondary Data Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="card-premium p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-10 relative z-10">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Macro Split</h3>
                  <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">Daily nutrient distribution</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                </div>
              </div>
              <div className="relative z-10">
                <MacrosChart />
              </div>
            </div>

            <div className="lg:col-span-2">
              <HydrationWidget />
            </div>
          </div>

          {/* Longitudinal Trajectory Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card-premium p-10 rounded-[3.5rem] border border-white/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32 text-accent" />
              </div>
              <div className="mb-10 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Weight Progress</h3>
                <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">Long-term weight tracking</p>
              </div>
              <div className="relative z-10">
                <WeightChart />
              </div>
            </div>

            <div className="card-premium p-10 rounded-[3.5rem] border border-white/5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Flame className="w-32 h-32 text-accent" />
              </div>
              <div className="mb-10 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white italic">Calorie Trends</h3>
                <p className="text-[8px] text-muted font-black uppercase tracking-[0.3em] mt-1">Daily calorie burn tracking</p>
              </div>
              <div className="relative z-10">
                <CaloriesChart />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
