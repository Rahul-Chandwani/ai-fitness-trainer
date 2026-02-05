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
    return acc + (ex.value * (ex.calories_per_min || 7));
  }, 0);

  const totalDuration = selectedExercises.reduce((acc, ex) => {
    return acc + parseInt(ex.value);
  }, 0);

  const addExercise = (exercise) => {
    if (selectedExercises.find(e => e.id === exercise.id)) return;
    setSelectedExercises([...selectedExercises, { ...exercise, value: 10, unit: 'min' }]);
  };

  const removeExercise = (id) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== id));
  };

  const updateValue = (id, newVal) => {
    setSelectedExercises(selectedExercises.map(e =>
      e.id === id ? { ...e, value: Math.max(1, parseInt(newVal) || 0) } : e
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
          sets: 1,
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
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card/90 border border-white/5 w-full max-w-7xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col xl:flex-row h-full max-h-[90vh]"
      >
        {/* Left Panel: Exercise Browser */}
        <div className="w-full xl:w-[450px] border-b xl:border-b-0 xl:border-r border-white/5 p-6 md:p-10 flex flex-col bg-black/40 relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 left-0 p-10 opacity-5 -translate-x-12 -translate-y-12 pointer-events-none">
            <Layers className="w-64 h-64 text-accent" />
          </div>

          <div className="mb-8 relative z-10">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2 leading-none">Exercise Library</h2>
            <div className="flex items-center gap-2 text-accent text-[8px] font-black uppercase tracking-[0.3em]">
              <div className="w-2 h-0.5 bg-accent"></div>
              Build Your Manual Plan
            </div>
          </div>

          <div className="space-y-4 mb-6 relative z-10">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-accent transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exercises..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-accent/40 text-sm font-black uppercase tracking-tight transition-all"
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

          <div className="flex-grow overflow-y-auto scrollbar-none space-y-3 relative z-10">
            {filteredExercises.map(ex => (
              <div key={ex.id} className="w-full flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group">
                <div className="text-left">
                  <p className="font-black text-white text-xs uppercase italic tracking-tighter">{ex.name}</p>
                  <p className="text-[7px] font-black text-muted uppercase tracking-[0.2em] mt-1">{ex.muscles.join(', ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailExercise(ex)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10"
                  >
                    <Info className="w-4 h-4 text-muted" />
                  </button>
                  <button
                    onClick={() => addExercise(ex)}
                    disabled={selectedExercises.some(e => e.id === ex.id)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-accent hover:text-black transition-all disabled:opacity-20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Configuration */}
        <div className="flex-1 p-6 md:p-10 flex flex-col relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -translate-y-12 translate-x-12">
            <Activity className="w-[500px] h-[500px] text-accent" />
          </div>

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="space-y-2 flex-grow max-w-md">
              <label className="text-[8px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1 h-2 bg-accent rounded-full"></div>
                Workout Name
              </label>
              <input
                value={protocolName}
                onChange={(e) => setProtocolName(e.target.value)}
                placeholder="ENTER NAME"
                className="bg-transparent border-b border-white/10 focus:border-accent text-3xl font-black text-white uppercase tracking-tighter outline-none w-full pb-2 transition-all italic"
              />
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 text-muted hover:text-white rounded-2xl border border-white/5">
              <X className="w-6 h-6" />
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
                  className="card-premium border border-white/5 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-8"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5 shadow-xl relative bg-black/20">
                    <ExerciseVisual exerciseName={ex.name} />
                  </div>
                  <div className="flex-grow w-full">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-black text-white text-lg uppercase italic tracking-tighter">{ex.name}</h4>
                      <button onClick={() => removeExercise(ex.id)} className="p-2 bg-white/5 hover:bg-red-500/20 text-muted hover:text-red-500 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-6">
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
                      <div className="w-20 text-right">
                        <span className="text-xl font-black text-white">{ex.value}</span>
                        <span className="text-[8px] text-muted ml-1 uppercase font-black tracking-widest">Min</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {selectedExercises.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-white/5 rounded-[3rem] py-20">
                <Calculator className="w-16 h-16 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select exercises on the left</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 bg-transparent">
            <div className="flex gap-8">
              <div>
                <p className="text-[7px] font-black text-accent uppercase tracking-[0.3em] mb-1">Time</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">{totalDuration} min</p>
              </div>
              <div>
                <p className="text-[7px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Burn</p>
                <p className="text-2xl font-black text-white italic tracking-tighter">{totalCalories} kcal</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={loading || !protocolName || selectedExercises.length === 0}
              className="bg-white text-black py-4 px-10 rounded-3xl font-black uppercase tracking-widest hover:bg-accent transition-all text-xs disabled:opacity-20 flex items-center gap-3"
            >
              {loading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Plan</>}
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
