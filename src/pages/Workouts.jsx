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
        addToast("Workout plan synchronized", "success");
      } else {
        addToast("Transmission failed", "error");
      }
    } catch (err) {
      addToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWorkout = (workoutId) => {
    if (activeTab === "manual") {
      updateManualWorkouts(manualWorkouts.filter(w => w.id !== workoutId));
      addToast("ROUTINE PURGED FROM REPOSITORY", "success");
    } else {
      updateAIWorkouts(aiWorkouts.filter(w => w.id !== workoutId));
      addToast("AI PROTOCOL DELETED", "success");
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
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent transition-colors group uppercase tracking-widest">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-accent rounded-full mb-0.5" />
              <div>
                <h1 className="text-lg md:text-2xl font-black text-white italic tracking-tighter uppercase">Workouts</h1>
                <p className="text-[7px] text-muted font-bold uppercase tracking-[0.3em]">AI Synthesis & Manual</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-0.5 bg-white/5 rounded-xl border border-white/5 w-full md:w-auto self-stretch md:self-auto">
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 md:flex-none px-4 sm:px-6 py-1.5 rounded-lg font-black uppercase tracking-tighter text-[9px] transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                <Sparkles className="w-3 h-3" />
                AI
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 md:flex-none px-4 sm:px-6 py-1.5 rounded-lg font-black uppercase tracking-tighter text-[9px] transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                <Plus className="w-3 h-3" />
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
                <div className="card-premium p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Muscle Target */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-accent" />
                          <h3 className="text-[9px] font-black text-white uppercase tracking-widest">Focus</h3>
                        </div>
                        <span className="text-[7px] font-bold text-muted uppercase">Selection</span>
                      </div>
                      <div className="flex flex-wrap gap-1 p-2.5 bg-black/20 rounded-xl border border-white/5 max-h-[120px] overflow-y-auto scrollbar-none">
                        {MUSCLE_OPTIONS.map(m => (
                          <button
                            key={m}
                            onClick={() => toggleMuscle(m)}
                            className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap active:scale-95 ${selectedMuscles.includes(m) ? 'bg-accent text-zinc-950 border-accent' : 'bg-white/5 text-muted border-white/10 hover:border-white/20'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Parameters */}
                    <div className="lg:col-span-12 xl:col-span-4 grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2 flex items-center gap-2"><Clock className="w-3 h-3" />Time</p>
                        <input
                          type="number"
                          value={duration || ""}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-[10px] outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2 flex items-center gap-2"><Activity className="w-3 h-3" />Energy</p>
                        <input
                          type="number"
                          value={calorieTarget || ""}
                          onChange={(e) => setCalorieTarget(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-[10px] outline-none"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Base Location</p>
                        <div className="grid grid-cols-2 gap-2">
                          {['gym', 'home'].map(loc => (
                            <button
                              key={loc}
                              onClick={() => setLocation(loc)}
                              className={`py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest border transition-all active:scale-95 ${location === loc ? 'bg-white text-zinc-950 border-white' : 'bg-white/5 text-muted border-white/10'}`}
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
                          {loading ? 'SYNCING...' : isPro ? 'Generate Protocol' : 'Pro Required'}
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
                  <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-xl gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent text-zinc-950 rounded-lg flex items-center justify-center shadow-lg shadow-accent/10">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Active Alpha</h4>
                        <p className="text-[8px] text-accent font-bold uppercase truncate max-w-[150px]">{workouts[0].name}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedWorkout(workouts[0])}
                      className="w-full sm:w-auto px-4 py-1.5 bg-white text-zinc-950 rounded-lg font-black uppercase text-[8px] tracking-widest hover:bg-accent transition-all active:scale-95"
                    >
                      Protocol
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
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">No AI Protocols for Today</p>
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
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH REPOSITORY..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white outline-none focus:border-accent/40"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="p-2 bg-white/5 border border-white/5 rounded-lg text-muted hover:text-white transition-all"><Filter className="w-3.5 h-3.5" /></button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 sm:flex-none px-6 py-2 bg-accent text-zinc-950 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all"
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
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                      <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Repository Empty</p>
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
