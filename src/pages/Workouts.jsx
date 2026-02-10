import DashboardLayout from "../layouts/DashboardLayout";
import WorkoutCard from "../components/WorkoutCard";
import AddWorkoutModal from "../components/AddWorkoutModal";
import WorkoutProtocolModal from "../components/WorkoutProtocolModal";
import { useState } from "react";
import { generateWorkoutRoutine } from "../services/ai";
import { useFitness } from "../context/FitnessContext";
import { Plus, Sparkles, Activity, Dumbbell, Zap, ChevronLeft, Search, Filter, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Workouts() {
  const {
    manualWorkouts,
    aiWorkouts,
    updateManualWorkouts,
    updateAIWorkouts,
    userProfile,
    trainingPlan
  } = useFitness();
  const { addToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai"); // ai, manual

  const isPro = userProfile?.subscriptionTier && userProfile.subscriptionTier !== "free";
  const isAdvanced = userProfile?.subscriptionTier === "advanced";

  // AI Generation Preferences
  const [selectedMuscles, setSelectedMuscles] = useState(["Full Body"]);
  const [duration, setDuration] = useState("45");
  const [calorieTarget, setCalorieTarget] = useState("400");
  const [level, setLevel] = useState("intermediate");
  const [location, setLocation] = useState("gym");
  const [searchQuery, setSearchQuery] = useState("");

  const MUSCLE_OPTIONS = [
    "Chest", "Shoulders", "Legs", "Biceps", "Triceps", "Abs", "Back",
    "Full Body", "Push", "Pull", "Cardio", "Strength"
  ];

  const workouts = (() => {
    let list = [];
    if (activeTab === "ai") {
      // If AI Workouts (ad-hoc) exist, show only them.
      // Otherwise fallback to Training Plan workout.
      if (aiWorkouts.length > 0) {
        list = aiWorkouts;
      } else if (isAdvanced && trainingPlan?.weeks) {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const currentWeek = trainingPlan.weeks[trainingPlan.currentWeek - 1];
        const day = currentWeek?.days?.find(d => d.dayOfWeek === today);
        if (day?.workout) list.push(day.workout);
      }
    } else {
      list = manualWorkouts;
    }

    if (searchQuery) {
      return list.filter(w => w.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  })();

  const handleGenerateWorkout = async () => {
    if (!isPro) {
      addToast("PRO PLAN REQUIRED", "error");
      return;
    }

    try {
      setLoading(true);
      const newWorkout = await generateWorkoutRoutine({
        muscles: selectedMuscles,
        duration,
        calorieTarget,
        level,
        location,
        experienceLevel: userProfile?.experienceLevel || level
      });
      if (newWorkout) {
        updateAIWorkouts([newWorkout]); // REPLACE instead of append
        addToast("Workout plan updated", "success");
      } else {
        addToast("Failed to generate", "error");
      }
    } catch (err) {
      addToast("Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWorkout = (workoutId) => {
    if (activeTab === "manual") {
      updateManualWorkouts(manualWorkouts.filter(w => w.id !== workoutId));
      addToast("Workout removed", "success");
    } else {
      updateAIWorkouts(aiWorkouts.filter(w => w.id !== workoutId));
      addToast("Workout plan deleted", "success");
    }
  };

  const toggleMuscle = (muscle) => {
    if (muscle === "Full Body") {
      setSelectedMuscles(["Full Body"]);
      return;
    }
    const newMuscles = selectedMuscles.includes(muscle)
      ? selectedMuscles.filter(m => m !== muscle)
      : [...selectedMuscles.filter(m => m !== "Full Body"), muscle];
    setSelectedMuscles(newMuscles.length === 0 ? ["Full Body"] : newMuscles);
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-4 pb-20 px-2 sm:px-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[0.65rem] font-black text-muted hover:text-accent transition-colors group uppercase tracking-[0.2em] opacity-60">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full mb-0.5" />
              <div>
                <h1 className="text-xl md:text-2xl font-black text-text italic tracking-tighter uppercase leading-none">Workouts</h1>
                <p className="text-[0.6rem] text-accent font-bold uppercase tracking-[0.4em] mt-1.5 opacity-60">WORKOUT PLANNER</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-card/40 rounded-xl border border-border w-full md:w-auto self-stretch md:self-auto shadow-sm">
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-black uppercase tracking-tight text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-text text-bg shadow-md' : 'text-muted hover:text-text'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-black uppercase tracking-tight text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-text text-bg shadow-md' : 'text-muted hover:text-text'}`}
              >
                <Plus className="w-4 h-4" />
                Manual
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'ai' ? (
              <motion.div
                key="ai-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="card-premium p-6 md:p-8 rounded-2xl border border-border bg-card/40 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Muscle Target */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                          <Dumbbell className="w-4 h-4 text-accent" />
                          <h3 className="text-[0.65rem] font-black text-text uppercase tracking-[0.2em] opacity-80">FOCUS AREAS</h3>
                        </div>
                        <span className="text-[0.6rem] font-bold text-muted uppercase tracking-widest opacity-60">Selection</span>
                      </div>
                      <div className="flex flex-wrap gap-2 p-4 bg-card/60 rounded-2xl border border-border max-h-[160px] overflow-y-auto scrollbar-none shadow-inner">
                        {MUSCLE_OPTIONS.map(m => (
                          <button
                            key={m}
                            onClick={() => toggleMuscle(m)}
                            className={`px-4 py-1.5 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all border whitespace-nowrap active:scale-95 ${selectedMuscles.includes(m) ? 'bg-text text-bg border-text shadow-lg' : 'bg-card/40 text-muted border-border hover:border-accent/30'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="lg:col-span-12 xl:col-span-4 grid grid-cols-2 gap-2">
                      <div className="space-y-3">
                        <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60 flex items-center gap-2"><Clock className="w-3.5 h-3.5" />TIME</p>
                        <input
                          type="number"
                          value={duration || ""}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-card/60 border border-border rounded-xl py-3 px-4 text-text font-black text-xs outline-none focus:border-accent/40 shadow-sm placeholder:opacity-20"
                        />
                      </div>
                      <div className="space-y-3">
                        <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60 flex items-center gap-2"><Activity className="w-3.5 h-3.5" />ENERGY</p>
                        <input
                          type="number"
                          value={calorieTarget || ""}
                          onChange={(e) => setCalorieTarget(e.target.value)}
                          className="w-full bg-card/60 border border-border rounded-xl py-3 px-4 text-text font-black text-xs outline-none focus:border-accent/40 shadow-sm placeholder:opacity-20"
                        />
                      </div>
                      <div className="col-span-2 space-y-3">
                        <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60">BASE LOCATION</p>
                        <div className="grid grid-cols-2 gap-3">
                          {['gym', 'home'].map(loc => (
                            <button
                              key={loc}
                              onClick={() => setLocation(loc)}
                              className={`py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border transition-all active:scale-95 shadow-sm ${location === loc ? 'bg-text text-bg border-text' : 'bg-card/40 text-muted border-border hover:border-accent/30'}`}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 col-span-2">
                        <button
                          onClick={handleGenerateWorkout}
                          disabled={loading || !isPro}
                          className={`w-full py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 ${isPro ? 'bg-accent text-zinc-950 hover:bg-white shadow-lg shadow-accent/10' : 'bg-white/10 text-muted opacity-50 cursor-not-allowed'}`}
                        >
                          {loading ? (
                            <div className="w-3.5 h-3.5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          {loading ? 'CREATING...' : isPro ? 'Create Workout' : 'Pro Required'}
                        </button>
                        <Link
                          to="/training-plan"
                          className="w-full py-2 rounded-lg border border-dashed border-white/10 text-[7px] font-black text-muted hover:text-accent hover:border-accent/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                          <Calendar className="w-3 h-3" />
                          Full 4-Week Architecture
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Summary Callout */}
                {workouts.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-accent/5 border border-accent/10 rounded-2xl gap-4 shadow-lg shadow-accent/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent text-bg rounded-xl flex items-center justify-center shadow-lg shadow-accent/10">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-[0.65rem] font-black text-text uppercase tracking-widest opacity-80">ACTIVE PLAN</h4>
                        <p className="text-[0.6rem] text-accent font-black uppercase truncate max-w-[200px] tracking-widest mt-1 italic">{workouts[0].name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedWorkout(workouts[0])}
                      className="w-full sm:w-auto px-6 py-2.5 bg-text text-bg rounded-xl font-black uppercase text-[0.65rem] tracking-widest hover:bg-accent hover:text-bg transition-all active:scale-95 shadow-lg"
                    >
                      Workout Details
                    </button>
                  </div>
                )}

                {/* AI Protocols Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                  {workouts.map((w, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={`ai-wk-${w.id || i}`}
                    >
                      <WorkoutCard
                        workout={w}
                        onView={(workout) => setSelectedWorkout(workout)}
                        onRemove={activeTab === "manual" ? () => handleRemoveWorkout(w.id) : null}
                      />
                    </motion.div>
                  ))}
                  {workouts.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[2rem] bg-card/10">
                      <p className="text-xs font-black text-muted uppercase tracking-[0.5em] opacity-40 px-10">No Workouts for Today</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="manual-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Manual Utility Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH WORKOUTS..."
                      className="w-full bg-card/40 border border-border rounded-xl py-3.5 pl-12 pr-4 text-xs font-black text-text outline-none focus:border-accent/40 shadow-sm placeholder:opacity-20"
                    />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="p-3.5 bg-card/40 border border-border rounded-xl text-muted hover:text-text transition-all shadow-sm">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 sm:flex-none px-8 py-2.5 bg-accent text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all shadow-accent/10"
                    >
                      Add Log
                    </button>
                  </div>
                </div>

                {/* Protocols Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                  {workouts.map((w, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={w.id}
                    >
                      <WorkoutCard
                        workout={w}
                        onView={(workout) => setSelectedWorkout(workout)}
                        onRemove={activeTab === "manual" ? () => handleRemoveWorkout(w.id) : null}
                      />
                    </motion.div>
                  ))}
                  {workouts.length === 0 && (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[2rem] bg-card/10">
                      <p className="text-xs font-black text-muted uppercase tracking-[0.5em] opacity-40 px-10">Workout history empty</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {showAddModal && <AddWorkoutModal onClose={() => setShowAddModal(false)} />}
          {selectedWorkout && (
            <WorkoutProtocolModal
              workout={selectedWorkout}
              onClose={() => setSelectedWorkout(null)}
            />
          )}
        </div>
      </PageTransition>
    </DashboardLayout >
  );
}
