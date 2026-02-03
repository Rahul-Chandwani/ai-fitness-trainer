import DashboardLayout from "../layouts/DashboardLayout";
import WorkoutCard from "../components/WorkoutCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import WorkoutProtocolModal from "../components/WorkoutProtocolModal";
import PlanGenerationModal from "../components/PlanGenerationModal";
import { useState } from "react";
import { generateWorkoutRoutine } from "../services/ai";
// Fixed import issue - using correct function name
import { generateComprehensiveTrainingPlan } from "../services/trainingPlanGenerator";
import { useFitness } from "../context/FitnessContext";
import { Plus, Sparkles, Clock, Layers, Activity, Dumbbell, Zap, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";

import DailyTaskCard from "../components/DailyTaskCard";

export default function Workouts() {
  const { workoutRoutine, updateWorkoutRoutine, userProfile, updateTrainingPlan, getTodayTasks, updateDailyTask, trainingPlan } = useFitness();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const isPro = userProfile?.subscriptionTier && userProfile.subscriptionTier !== "free";
  const isAdvanced = userProfile?.subscriptionTier === "advanced";
  const trainingPlanId = trainingPlan?.planId;

  // Preferences
  const [type, setType] = useState("Full Body");
  const [duration, setDuration] = useState("45 mins");

  // Logic: For Advanced users, the workout list should ONLY show unique workouts from the training plan.
  // For others, show the general library.
  const allLibraryWorkouts = Array.isArray(workoutRoutine)
    ? workoutRoutine
    : (workoutRoutine ? [workoutRoutine] : []);

  const workouts = (() => {
    if (isAdvanced && trainingPlan?.weeks) {
      const planWorkouts = [];
      const seenNames = new Set();

      trainingPlan.weeks.forEach(week => {
        week.days.forEach(day => {
          if (day.workout && !seenNames.has(day.workout.name)) {
            planWorkouts.push(day.workout);
            seenNames.add(day.workout.name);
          }
        });
      });
      return planWorkouts;
    }
    return allLibraryWorkouts;
  })();

  const handleGenerateWorkout = async () => {
    if (!isPro) {
      addToast("PRO PLAN REQUIRED", "error");
      return;
    }

    try {
      setLoading(true);
      const newWorkout = await generateWorkoutRoutine({ type, duration });
      if (newWorkout) {
        updateWorkoutRoutine(newWorkout);
        addToast("Workout plan saved", "success");
      } else {
        addToast("Failed to create workout", "error");
      }
    } catch (err) {
      addToast("Failed to save workout", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTrainingPlan = async (preferences) => {
    if (!isAdvanced) {
      addToast("ADVANCED PLAN REQUIRED", "error");
      return;
    }

    try {
      setGeneratingPlan(true);
      addToast("Generating your personalized training plan...", "info");

      const plan = await generateComprehensiveTrainingPlan(userProfile, preferences);

      if (plan) {
        await updateTrainingPlan(plan);
        addToast("Training plan generated successfully!", "success");
        navigate("/training-plan");
      } else {
        addToast("Failed to generate training plan", "error");
      }
    } catch (err) {
      console.error("Plan generation error:", err);
      addToast("Failed to generate training plan", "error");
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-8 pb-20 relative overflow-x-hidden">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          {/* Header Interface */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 xl:gap-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-1.5 h-12 md:h-16 bg-accent rounded-full flex-shrink-0"></div>
              <div className="min-w-0">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight truncate">Workout Center</h1>
                <p className="text-[8px] md:text-[10px] text-muted font-bold uppercase tracking-widest mt-1 truncate">Design and track your training sessions</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 p-3 bg-white/5 backdrop-blur-3xl rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl relative group w-full xl:w-auto">
              {!isPro && (
                <div className="absolute -top-3 -right-3 bg-amber-500 text-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-500/20 z-10 animate-pulse">
                  Upgrade Required
                </div>
              )}

              <div className="flex items-center gap-3 px-4 md:px-6 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all flex-grow xl:flex-grow-0 min-w-[140px]">
                <Layers className="w-4 h-4 text-accent flex-shrink-0" />
                <select
                  disabled={!isPro}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-transparent text-[10px] font-black text-white outline-none uppercase tracking-widest cursor-pointer disabled:opacity-30 w-full"
                >
                  <option value="Full Body">Full Body Workout</option>
                  <option value="Upper Body">Upper Body</option>
                  <option value="Lower Body">Lower Body</option>
                  <option value="HIIT">High Intensity (HIIT)</option>
                  <option value="Yoga">Yoga / Recovery</option>
                </select>
              </div>

              <div className="flex items-center gap-3 px-4 md:px-6 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all flex-grow xl:flex-grow-0 min-w-[140px]">
                <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                <select
                  disabled={!isPro}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-transparent text-[10px] font-black text-white outline-none uppercase tracking-widest cursor-pointer disabled:opacity-30 w-full"
                >
                  <option value="15 mins">15 MINS</option>
                  <option value="30 mins">30 MINS</option>
                  <option value="45 mins">45 MINS</option>
                  <option value="60 mins">60 MINS</option>
                </select>
              </div>

              <button
                onClick={handleGenerateWorkout}
                disabled={loading}
                className={`${isPro ? 'bg-white text-black hover:bg-accent' : 'bg-white/10 text-muted cursor-not-allowed'} px-6 md:px-8 py-3 md:py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-3 flex-grow xl:flex-grow-0 w-full md:w-auto`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isPro ? (isAdvanced ? "Plan Active" : "Generate") : "Upgrade"}
              </button>

              {isAdvanced && (
                <button
                  onClick={() => setShowPlanModal(true)}
                  disabled={generatingPlan}
                  className="bg-accent text-black hover:bg-accent/90 px-6 md:px-8 py-3 md:py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-3 flex-grow xl:flex-grow-0 w-full md:w-auto"
                >
                  {generatingPlan ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  Training Plan
                </button>
              )}
            </div>
          </div>

          {/* Today's Training Session (New Section) */}
          {getTodayTasks()?.workout && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-accent rounded-full"></div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Today's Session</h2>
              </div>
              <DailyTaskCard
                day={getTodayTasks()}
                onTaskComplete={updateDailyTask}
                onViewWorkout={(workout) => setSelectedWorkout(workout)}
                isToday={true}
              />
            </div>
          )}

          {/* Quick Stats Banner / Action */}
          <div className="card-premium p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/5 flex flex-col xl:flex-row justify-between items-center gap-8 md:gap-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 -scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
              <Activity className="w-48 h-48 md:w-64 md:h-64 text-accent" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left w-full">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-accent/10 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/5 flex-shrink-0">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mb-2 px-1">Active Plan</p>
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3">
                  <h2 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none truncate max-w-full">
                    {workouts.length > 0 ? workouts[0].name.split(' ')[0] : 'NO PLAN'}
                  </h2>
                  {workouts.length > 0 && <span className="text-xs md:text-xl font-black text-accent uppercase italic tracking-tighter">V1</span>}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative z-10 w-full xl:w-auto flex-shrink-0">
              <div className="flex gap-4 items-center">
                <div className="h-20 w-[1px] bg-white/10 hidden xl:block"></div>
                <div className="flex flex-col justify-center items-center xl:items-start text-center xl:text-left">
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1">Status</p>
                  <p className={`text-xl font-black italic tracking-tighter ${workouts.length > 0 ? 'text-accent' : 'text-red-500/50'}`}>
                    {workouts.length > 0 ? "ACTIVE" : "INACTIVE"}
                  </p>
                </div>
              </div>

              {!isAdvanced && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary px-8 md:px-12 py-4 md:py-5 text-black font-black uppercase tracking-tighter rounded-3xl flex items-center justify-center gap-3 shadow-2xl shadow-accent/20 group hover:scale-105 active:scale-95 transition-all text-xs w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  Add Manually
                </button>
              )}
            </div>
          </div>

          {/* Protocols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workouts.map((w, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={w.id}
              >
                <WorkoutCard
                  workout={w}
                  onView={(workout) => setSelectedWorkout(workout)}
                />
              </motion.div>
            ))}
            {workouts.length === 0 && !loading && (
              <div className="col-span-full py-40 text-center glass border-2 border-dashed border-white/5 rounded-[4rem]">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 opacity-20 border border-white/10">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4 opacity-40">No Workouts Yet</h3>
                <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] max-w-sm mx-auto opacity-40">Generate an AI workout or add one manually to start tracking your progress.</p>
              </div>
            )}
          </div>

          {showModal && <AddWorkoutModal onClose={() => setShowModal(false)} />}

          {selectedWorkout && (
            <WorkoutProtocolModal
              workout={selectedWorkout}
              onClose={() => setSelectedWorkout(null)}
            />
          )}
          {showPlanModal && (
            <PlanGenerationModal
              isOpen={showPlanModal}
              onClose={() => setShowPlanModal(false)}
              onGenerate={handleGenerateTrainingPlan}
              userProfile={userProfile}
            />
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
