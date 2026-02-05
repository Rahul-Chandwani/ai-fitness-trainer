import { X, Dumbbell, ListChecks, Timer, Flame, CheckCircle2, Play, ChevronLeft, ChevronRight, Activity, Zap, Cpu, Info } from "lucide-react";
import { useState } from "react";
import { useFitness } from "../context/FitnessContext";
import ExerciseVisual from "./ExerciseVisual";
import ExerciseDetailModal from "./ExerciseDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";
import EXERCISE_DATABASE from "../data/exercises.json";

export default function WorkoutProtocolModal({ workout, onClose }) {
    const { completeWorkout } = useFitness();
    const { addToast } = useToast();
    const [isLive, setIsLive] = useState(false);
    const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
    const [completing, setCompleting] = useState(false);
    const [detailExercise, setDetailExercise] = useState(null);

    if (!workout) return null;

    const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
    const currentExercise = exercises[currentExerciseIdx];

    const handleComplete = async () => {
        try {
            setCompleting(true);
            await completeWorkout(workout);
            addToast("WORKOUT COMPLETED", "success");
            onClose();
        } catch (err) {
            addToast("ERROR: Failed to save workout", "error");
        } finally {
            setCompleting(false);
        }
    };

    const nextExercise = () => {
        if (currentExerciseIdx < exercises.length - 1) {
            setCurrentExerciseIdx(prev => prev + 1);
        }
    };

    const prevExercise = () => {
        if (currentExerciseIdx > 0) {
            setCurrentExerciseIdx(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center md:p-12">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
                onClick={onClose}
            ></motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative bg-card/90 border-0 md:border border-white/10 w-full md:max-w-6xl rounded-none md:rounded-[4rem] overflow-hidden shadow-none md:shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-dvh md:h-[85vh]"
            >
                {/* Visual / Control Panel */}
                <div className="md:w-[55%] p-5 md:p-12 flex flex-col relative overflow-hidden h-1/2 md:h-full">
                    <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none -translate-x-12 -translate-y-12">
                        <Activity className="w-[500px] h-[500px] text-accent" />
                    </div>

                    {!isLive ? (
                        <div className="flex-grow flex flex-col justify-center relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-1.5 h-12 bg-accent rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]"></div>
                                <div>
                                    <p className="text-accent font-black uppercase tracking-[0.4em] text-[10px] leading-tight mb-1">Workout Plan</p>
                                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{workout.name}</h2>
                                </div>
                            </div>

                            <p className="text-muted text-sm font-bold uppercase tracking-tight mb-8 md:mb-12 max-w-md leading-relaxed opacity-60 line-clamp-3">
                                START YOUR PERSONALIZED WORKOUT. FOLLOW THE EXERCISES FOR MAXIMUM RESULTS.
                            </p>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12">
                                <div className="p-4 md:p-6 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-accent/20 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Timer className="w-4 h-4 text-accent" />
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Estimated Time</p>
                                    </div>
                                    <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{workout.duration}</p>
                                </div>
                                <div className="p-4 md:p-6 bg-white/5 rounded-[2.5rem] border border-white/5 group hover:border-accent/20 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Zap className="w-4 h-4 text-orange-500" />
                                        <p className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Total Exercises</p>
                                    </div>
                                    <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter">{exercises.length} EXERCISES</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col relative z-10">
                            <div className="flex justify-between items-center mb-6 md:mb-10">
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-2 px-1">Current Exercise</p>
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">{currentExerciseIdx + 1}<span className="text-xl text-muted mx-2">/</span>{exercises.length}</h3>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={prevExercise} disabled={currentExerciseIdx === 0} className="p-3 md:p-4 bg-white/5 rounded-2xl disabled:opacity-5 border border-white/10 hover:bg-white hover:text-black transition-all group/btn"><ChevronLeft className="w-6 h-6" /></button>
                                    <button onClick={nextExercise} disabled={currentExerciseIdx === exercises.length - 1} className="p-3 md:p-4 bg-white/5 rounded-2xl disabled:opacity-5 border border-white/10 hover:bg-white hover:text-black transition-all group/btn"><ChevronRight className="w-6 h-6" /></button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExerciseIdx}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    className="flex-grow flex flex-col min-h-0"
                                >
                                    <div className="flex-grow flex items-center justify-center p-8 bg-card-premium rounded-[3.5rem] border border-white/5 shadow-inner mb-6 md:mb-10 relative overflow-hidden group min-h-0">
                                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[80px]"></div>
                                        <ExerciseVisual exerciseName={currentExercise?.name} />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-4">
                                            <div className="w-2 h-0.5 bg-accent"></div>
                                            <div className="flex items-center gap-4">
                                                <h4 className="text-3xl md:text-5xl font-black text-accent uppercase italic tracking-tighter leading-none line-clamp-2">{currentExercise?.name}</h4>
                                                <button
                                                    onClick={() => {
                                                        const fullEx = EXERCISE_DATABASE.find(e => e.name === currentExercise.name);
                                                        setDetailExercise(fullEx || currentExercise);
                                                    }}
                                                    className="p-3 bg-white/5 hover:bg-white/20 rounded-2xl border border-white/10"
                                                >
                                                    <Info className="w-6 h-6 text-accent" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 md:gap-12 bg-white/5 p-4 md:p-8 rounded-[2.5rem] border border-white/10">
                                            <div>
                                                <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-2 leading-none">Sets</p>
                                                <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter leading-none">{currentExercise?.sets}</p>
                                            </div>
                                            <div className="w-[1px] h-10 bg-white/10"></div>
                                            <div>
                                                <p className="text-[9px] font-black text-muted uppercase tracking-[0.4em] mb-2 leading-none">{currentExercise?.duration !== "N/A" ? "Time" : "Reps"}</p>
                                                <p className="text-2xl md:text-3xl font-black text-white italic tracking-tighter leading-none">{currentExercise?.duration !== "N/A" ? currentExercise?.duration : currentExercise?.reps}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Vertical Registry / Sidebar */}
                <div className="md:w-[45%] p-5 md:p-12 bg-black/40 flex flex-col border-t md:border-t-0 md:border-l border-white/10 relative overflow-hidden h-1/2 md:h-full">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none translate-x-12 -translate-y-12">
                        <Cpu className="w-64 h-64 text-accent" />
                    </div>

                    <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
                        <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">{isLive ? "EXERCISE LIST" : "WORKOUT DETAILS"}</h3>
                        {!isLive && (
                            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all border border-white/5">
                                <X className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Scrollable List with visible scrollbar */}
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6 md:mb-10 relative z-10 mask-gradient-b">
                        {exercises.map((ex, idx) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={idx}
                                className={`p-6 rounded-[2rem] border transition-all relative overflow-hidden group ${isLive && idx === currentExerciseIdx
                                    ? 'bg-accent/10 border-accent/40 shadow-xl shadow-accent/5 ring-1 ring-accent/20 translate-x-3'
                                    : isLive && idx < currentExerciseIdx
                                        ? 'opacity-30 border-white/5 bg-emerald-500/5'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-10 h-10 flex flex-col items-center justify-center bg-black/40 rounded-xl border border-white/10">
                                        {isLive && idx < currentExerciseIdx ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        ) : (
                                            <span className="text-xs font-black text-white/50">{String(idx + 1).padStart(2, '0')}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-center">
                                            <p className={`font-black text-lg uppercase italic tracking-tighter ${isLive && idx === currentExerciseIdx ? 'text-white' : 'text-white/80'}`}>{ex.name}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const fullEx = EXERCISE_DATABASE.find(item => item.name === ex.name);
                                                    setDetailExercise(fullEx || ex);
                                                }}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl"
                                            >
                                                <Info className="w-3 h-3 text-muted" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[8px] font-black text-muted uppercase tracking-widest leading-none">
                                                {ex.duration !== "N/A" ? `Time: ${ex.duration}` : `Reps: ${ex.sets}x${ex.reps}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="pt-10 border-t border-white/10 flex flex-col gap-4 relative z-10">
                        {!isLive ? (
                            <button
                                onClick={() => setIsLive(true)}
                                className="w-full bg-accent text-black py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] hover:bg-white transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-accent/10 italic text-sm"
                            >
                                <Play className="w-6 h-6 fill-black group-hover:scale-110 transition-transform" />
                                START WORKOUT
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="w-full bg-white text-black py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-white/5 italic text-sm"
                            >
                                {completing ? (
                                    <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-6 h-6" />
                                )}
                                COMPLETE WORKOUT
                            </button>
                        )}
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 border border-white/10 hover:bg-white/5 py-4 rounded-3xl text-[9px] uppercase font-black tracking-[0.3em] text-muted transition-all"
                            >
                                {isLive ? "CANCEL" : "CLOSE"}
                            </button>
                        </div>
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
