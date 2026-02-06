import { X, Search, Plus, Trash2, Calculator, Timer, Flame, ChevronRight, Activity, Save, Layers, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { useFitness } from "../context/FitnessContext";
import EXERCISE_DATABASE from "../data/exercises.json";
import ExerciseVisual from "./ExerciseVisual";
import ExerciseDetailModal from "./ExerciseDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";

// Get unique muscles for categories
const CATEGORIES = ["All", ...new Set(EXERCISE_DATABASE.flatMap(ex => ex.muscles))];

export default function AddWorkoutModal({ onClose }) {
  const { manualWorkouts, updateManualWorkouts } = useFitness();
  const { addToast } = useToast();
  const [protocolName, setProtocolName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailExercise, setDetailExercise] = useState(null);

  // Filtered exercise list
  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      const matchesCategory = selectedCategory === "All" || ex.muscles.includes(selectedCategory);
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalCalories = selectedExercises.reduce((acc, ex) => {
    if (ex.unit === 'reps') {
      const caloriesPerRep = (ex.calories_per_min || 5) / 10; // Assume 1 min intensity = 10 reps
      return acc + (ex.sets * ex.value * caloriesPerRep);
    }
    return acc + (ex.value * (ex.calories_per_min || 7));
  }, 0);

  const totalDuration = selectedExercises.reduce((acc, ex) => {
    if (ex.unit === 'reps') {
      return acc + (ex.sets * 1.5); // Estimate 1.5 min per set (set + rest)
    }
    return acc + parseInt(ex.value);
  }, 0);

  const addExercise = (exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) return;
    const unit = exercise.unit || 'min';
    setSelectedExercises([...selectedExercises, {
      ...exercise,
      unit,
      value: unit === 'min' ? 10 : 12, // duration or reps
      sets: unit === 'reps' ? 3 : 1
    }]);
  };

  const removeExercise = (id) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  const updateValue = (id, newVal) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.id === id ? { ...e, value: Math.max(1, parseInt(newVal) || 0) } : e
    ));
  };

  const updateSets = (id, newSets) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.id === id ? { ...e, sets: Math.max(1, parseInt(newSets) || 0) } : e
    ));
  };

  const handleSave = async () => {
    if (!protocolName || selectedExercises.length === 0) return;
    try {
      setLoading(true);
      const workoutData = {
        id: Date.now(),
        name: protocolName,
        duration: `${Math.round(totalDuration)} min`,
        totalCalories: Math.round(totalCalories),
        exercises: selectedExercises.map(ex => ({
          name: ex.name,
          sets: ex.unit === 'reps' ? ex.sets : 1,
          reps: ex.unit === 'reps' ? String(ex.value) : "1",
          duration: ex.unit === 'min' ? `${ex.value} min` : "N/A"
        }))
      };
      await updateManualWorkouts([workoutData, ...manualWorkouts]);
      addToast("WORKOUT PLAN SAVED", "success");
      onClose();
    } catch (err) {
      addToast("FAILED TO SAVE WORKOUT", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg/95 backdrop-blur-2xl flex items-center justify-center z-[200] p-6 lg:p-12 font-sans overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-white/5 w-full max-w-7xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col xl:flex-row h-[95vh] md:h-auto md:max-h-[90vh]"
      >
        {/* Left Panel: Exercise Browser */}
        <div className="w-full xl:w-[320px] border-b xl:border-b-0 xl:border-r border-white/5 p-4 md:p-6 flex flex-col bg-black/40 relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 left-0 p-10 opacity-5 -translate-x-12 -translate-y-12 pointer-events-none">
            <Layers className="w-64 h-64 text-accent" />
          </div>

          <div className="mb-4 relative z-10">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">Library</h2>
            <div className="flex items-center gap-2 text-accent text-[8px] font-black uppercase tracking-[0.3em]">
              <div className="w-2 h-0.5 bg-accent"></div>
              Build Your Manual Plan
            </div>
          </div>

          <div className="space-y-3 mb-4 relative z-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-accent transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-accent/40 text-[11px] font-black uppercase tracking-tight transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 text-muted border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-none space-y-2 relative z-10">
            {filteredExercises.map(ex => (
              <div key={ex.id} className="w-full flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-all group">
                <div className="text-left min-w-0">
                  <p className="font-black text-white text-[10px] uppercase italic tracking-tighter truncate">{ex.name}</p>
                  <p className="text-[6px] font-black text-muted uppercase tracking-[0.2em] mt-0.5">{ex.muscles.join(', ')}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setDetailExercise(ex)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10"
                  >
                    <Info className="w-3 h-3 text-muted" />
                  </button>
                  <button
                    onClick={() => addExercise(ex)}
                    disabled={selectedExercises.some(e => e.id === ex.id)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-accent hover:text-black transition-all disabled:opacity-20"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Configuration */}
        <div className="flex-1 p-4 md:p-6 flex flex-col relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -translate-y-12 translate-x-12">
            <Activity className="w-[500px] h-[500px] text-accent" />
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="space-y-1.5 flex-grow max-w-md w-full">
              <label className="text-[7px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1 h-2.5 bg-accent rounded-full"></div>
                Plan Identifier
              </label>
              <input
                value={protocolName}
                onChange={(e) => setProtocolName(e.target.value)}
                placeholder="NAME..."
                className="bg-transparent border-b border-white/10 focus:border-accent text-xl font-black text-white uppercase tracking-tighter outline-none w-full pb-1.5 transition-all italic"
              />
            </div>
            <button onClick={onClose} className="p-2 bg-white/5 text-muted hover:text-white rounded-lg border border-white/5">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 scrollbar-none space-y-4 mb-8 relative z-10">
            <AnimatePresence>
              {selectedExercises.map(ex => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card-premium border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 shadow-lg relative bg-black/20">
                    <ExerciseVisual exerciseName={ex.name} />
                  </div>
                  <div className="flex-grow w-full">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-black text-white text-sm uppercase italic tracking-tighter">{ex.name}</h4>
                      <button onClick={() => removeExercise(ex.id)} className="p-1 link-red rounded-lg transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {ex.unit === 'min' ? (
                        <>
                          <div className="flex-grow">
                            <input
                              type="range"
                              min="1"
                              max="60"
                              value={ex.value}
                              onChange={(e) => updateValue(ex.id, e.target.value)}
                              className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-accent cursor-pointer"
                            />
                          </div>
                          <div className="w-16 text-right">
                            <span className="text-sm font-black text-white italic">{ex.value}</span>
                            <span className="text-[7px] text-muted ml-1 uppercase font-black tracking-widest italic">min</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 w-full">
                          <div className="flex-1 space-y-2">
                            <p className="text-[7px] font-black text-muted uppercase tracking-widest px-1">Sets</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={ex.sets}
                                onChange={(e) => updateSets(ex.id, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-xs outline-none focus:border-accent/40"
                              />
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <p className="text-[7px] font-black text-muted uppercase tracking-widest px-1">Reps</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={ex.value}
                                onChange={(e) => updateValue(ex.id, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-xs outline-none focus:border-accent/40"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {selectedExercises.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-white/5 rounded-2xl py-12">
                <Calculator className="w-10 h-10 mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">Select Exercises</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 bg-transparent">
            <div className="flex gap-6">
              <div>
                <p className="text-[6px] font-black text-accent uppercase tracking-widest mb-0.5">Time</p>
                <p className="text-lg font-black text-white italic tracking-tighter leading-none">{totalDuration} min</p>
              </div>
              <div>
                <p className="text-[6px] font-black text-orange-500 uppercase tracking-widest mb-0.5">Burn</p>
                <p className="text-lg font-black text-white italic tracking-tighter leading-none">{totalCalories} kcal</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading || !protocolName || selectedExercises.length === 0}
              className="bg-white text-zinc-950 py-3 px-8 rounded-lg font-black uppercase tracking-widest hover:bg-accent transition-all text-[10px] disabled:opacity-20 flex items-center gap-2"
            >
              {loading ? <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save Protocol</>}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {detailExercise && (
          <ExerciseDetailModal
            exercise={detailExercise}
            onClose={() => setDetailExercise(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
