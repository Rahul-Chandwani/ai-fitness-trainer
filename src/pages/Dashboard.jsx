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
  const { calorieHistory, workoutHistory, neuralXP, streak, userProfile, trainingPlan, getTodayTasks, updateDailyTask, weightHistory } = useFitness();
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
        <div className="max-w-7xl mx-auto space-y-3 pb-16 relative">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/5 rounded-full blur-[80px] md:blur-[140px] -z-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          {/* Header with Your Stats */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group w-fit">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-8 bg-accent rounded-full"></div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-text uppercase italic leading-none">Dashboard</h1>
                  <p className="text-[0.6rem] text-accent font-black uppercase tracking-[0.4em] mt-1.5 opacity-80">OVERVIEW</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 p-2 bg-white/5 backdrop-blur-2xl rounded-xl border border-white/5 relative group">
                <div className="flex items-center gap-3 px-3 border-r border-white/10 relative z-10">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div className="text-left">
                    <p className="text-[0.6rem] font-black text-muted uppercase tracking-[0.2em] opacity-60">XP Points</p>
                    <p className="text-lg font-black text-text tabular-nums leading-none">{neuralXP || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-3 relative z-10">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-[0.6rem] font-black text-muted uppercase tracking-[0.2em] opacity-60">Active Streak</p>
                    <p className="text-lg font-black text-text tabular-nums leading-none">{streak || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced User Section - Training Plan Widgets */}
          {isAdvanced && trainingPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Daily Calories */}
            <motion.div
              whileHover={{ y: -2 }}
              className="md:col-span-2 card-premium p-5 md:p-6 rounded-2xl border border-border relative overflow-hidden group shadow-xl bg-card/40"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5 -translate-y-6 translate-x-6 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                <Activity className="w-48 h-48 text-accent" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-6">
                  <Cpu className="w-4 h-4 text-accent" />
                  <p className="text-muted text-[0.6rem] font-black uppercase tracking-[0.4em] opacity-60">Daily Stats</p>
                </div>

                <div className="flex flex-col sm:flex-row items-end gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                      <p className="text-[0.6rem] font-black text-emerald-400 uppercase tracking-widest opacity-80">Intake</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl md:text-4xl font-black text-text italic tracking-tighter leading-none">{todayStats.intake}</h2>
                      <span className="text-[0.6rem] font-black text-muted uppercase tracking-widest opacity-60 tabular-nums">KCAL</span>
                    </div>
                  </div>

                  <div className="h-12 w-[1px] bg-white/10 hidden sm:block mb-1"></div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                      <p className="text-[0.6rem] font-black text-orange-400 uppercase tracking-widest opacity-80">Burned</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl md:text-4xl font-black text-text italic tracking-tighter leading-none">{todayStats.burned || 0}</h2>
                      <span className="text-[0.6rem] font-black text-muted uppercase tracking-widest opacity-60 tabular-nums">KCAL</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Consistency Widget */}
            <div className="card-premium p-5 md:p-6 rounded-2xl border border-border bg-card/40 hover:border-accent/30 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted text-[0.6rem] font-black uppercase tracking-[0.3em] opacity-60">Consistency</p>
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <ShieldAlert className="w-4 h-4 text-emerald-500" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative w-20 h-20">
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
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-text italic tracking-tighter leading-none">{consistencyScore}%</span>
                    <span className="text-[0.6rem] font-black text-muted uppercase mt-1 opacity-60 tracking-widest">SCORE</span>
                  </div>
                </div>
                <p className="text-[0.6rem] text-muted text-center font-black uppercase tracking-[0.15em] leading-relaxed px-2 opacity-60">
                  Consistency <span className="text-accent underline decoration-accent/30 underline-offset-4">Score</span> 7d
                </p>
              </div>
            </div>

          </div>

          {/* Navigation Hub */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/workouts" className="card-premium p-4 rounded-2xl border border-border bg-card/40 hover:border-accent/30 transition-all flex items-center gap-4 group relative overflow-hidden">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:rotate-6 transition-all relative z-10 shrink-0">
                <Dumbbell className="w-6 h-6 text-accent" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-text uppercase italic tracking-tighter group-hover:text-accent transition-colors leading-none">Workouts</h3>
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.3em] mt-2 opacity-60">TRAINING</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/diet" className="card-premium p-4 rounded-2xl border border-border bg-card/40 hover:border-blue-400/30 transition-all flex items-center gap-4 group relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:rotate-6 transition-all relative z-10 shrink-0">
                <Utensils className="w-6 h-6 text-blue-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-text uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-none">Diet</h3>
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.3em] mt-2 opacity-60">NUTRITION</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link to="/ai-coach" className="card-premium p-4 rounded-2xl border border-border bg-card/40 hover:border-purple-400/30 transition-all flex items-center gap-4 group relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl"></div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:rotate-6 transition-all relative z-10 shrink-0">
                <Bot className="w-6 h-6 text-purple-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-base font-black text-text uppercase italic tracking-tighter group-hover:text-purple-400 transition-colors leading-none">AI Trainer</h3>
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.3em] mt-2 opacity-60">AI ASSISTANT</p>
              </div>
              <ChevronRight className="ml-auto w-5 h-5 text-muted group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          {/* Nutrition Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card-premium p-6 rounded-2xl border border-border bg-card/40 relative overflow-hidden group">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text italic">Macros</h3>
                  <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.3em] mt-1.5 opacity-60">NUTRITION</p>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
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

          {/* Progress Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card-premium p-5 md:p-6 rounded-2xl border border-border bg-card/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Target className="w-16 h-16 text-accent" />
              </div>
              <div className="mb-6 relative z-10">
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text italic">Body Weight</h3>
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.4em] mt-1.5 opacity-80">YOUR PROGRESS</p>
              </div>
              <div className="relative z-10">
                <WeightChart />
              </div>
            </div>

            <div className="card-premium p-5 md:p-6 rounded-2xl border border-border bg-card/40 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Flame className="w-16 h-16 text-accent" />
              </div>
              <div className="mb-6 relative z-10">
                <h3 className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-text italic">Energy Flux</h3>
                <p className="text-[0.6rem] text-muted font-black uppercase tracking-[0.4em] mt-1.5 opacity-80">DAILY BALANCE</p>
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
