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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-card border-0 md:border border-white/10 w-full md:max-w-6xl rounded-none md:rounded-xl overflow-hidden shadow-none flex flex-col md:flex-row h-dvh md:h-[85vh]"
            >
                {/* Visual / Control Panel */}
                <div className="md:w-[55%] p-4 md:p-8 flex flex-col relative overflow-hidden h-1/2 md:h-full">
                    <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none -translate-x-12 -translate-y-12">
                        <Activity className="w-[500px] h-[500px] text-accent" />
                    </div>

                    {!isLive ? (
                        <div className="flex-grow flex flex-col justify-center relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1 h-8 bg-accent rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]"></div>
                                <div>
                                    <p className="text-accent font-black uppercase tracking-[0.3em] text-[8px] leading-tight mb-0.5">Protocol</p>
                                    <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{workout.name}</h2>
                                </div>
                            </div>

                            <p className="text-muted text-[11px] font-bold uppercase tracking-tight mb-6 md:mb-8 max-w-sm leading-relaxed opacity-60 line-clamp-2">
                                EXECUTE SYSTEMATIC PROTOCOLS. MAINTAIN PEAK INTENSITY.
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-accent/20 transition-all text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Timer className="w-3 h-3 text-accent" />
                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none">Estimate</p>
                                    </div>
                                    <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{workout.duration}</p>
                                </div>
                                <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-accent/20 transition-all text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap className="w-3 h-3 text-orange-400" />
                                        <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none">Count</p>
                                    </div>
                                    <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{exercises.length} EX</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col relative z-10">
                            <div className="flex justify-between items-center mb-6 md:mb-10">
                                <div className="flex flex-col">
                                    <p className="text-[8px] font-black text-accent uppercase tracking-[0.4em] mb-1 px-1">Active Step</p>
                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic leading-none">{currentExerciseIdx + 1}<span className="text-lg text-muted mx-1">/</span>{exercises.length}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={prevExercise} disabled={currentExerciseIdx === 0} className="p-2 md:p-3 bg-white/5 rounded-lg disabled:opacity-5 border border-white/10 hover:bg-white hover:text-black transition-all group/btn"><ChevronLeft className="w-5 h-5" /></button>
                                    <button onClick={nextExercise} disabled={currentExerciseIdx === exercises.length - 1} className="p-2 md:p-3 bg-white/5 rounded-lg disabled:opacity-5 border border-white/10 hover:bg-white hover:text-black transition-all group/btn"><ChevronRight className="w-5 h-5" /></button>
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
                                    <div className="flex-grow flex items-center justify-center p-6 bg-card-premium rounded-xl border border-white/5 shadow-inner mb-4 md:mb-6 relative overflow-hidden group min-h-0">
                                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[60px]"></div>
                                        <ExerciseVisual exerciseName={currentExercise?.name} />
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="space-y-2">
                                            <div className="w-1.5 h-0.5 bg-accent"></div>
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-xl md:text-3xl font-black text-accent uppercase italic tracking-tighter leading-none line-clamp-1">{currentExercise?.name}</h4>
                                                <button
                                                    onClick={() => {
                                                        const fullEx = EXERCISE_DATABASE.find(e => e.name === currentExercise.name);
                                                        setDetailExercise(fullEx || currentExercise);
                                                    }}
                                                    className="p-2 bg-white/5 hover:bg-white/20 rounded-lg border border-white/10"
                                                >
                                                    <Info className="w-4 h-4 text-accent" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 md:gap-8 bg-white/5 p-3 md:p-5 rounded-xl border border-white/10 shrink-0">
                                            <div>
                                                <p className="text-[7px] font-black text-muted uppercase tracking-widest mb-1 leading-none">Sets</p>
                                                <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter leading-none">{currentExercise?.sets}</p>
                                            </div>
                                            <div className="w-[1px] h-6 bg-white/10 mt-1"></div>
                                            <div>
                                                <p className="text-[7px] font-black text-muted uppercase tracking-widest mb-1 leading-none">{currentExercise?.duration !== "N/A" ? "Time" : "Reps"}</p>
                                                <p className="text-xl md:text-2xl font-black text-white italic tracking-tighter leading-none">{currentExercise?.duration !== "N/A" ? currentExercise?.duration : currentExercise?.reps}</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Vertical Registry / Sidebar */}
                <div className="md:w-[45%] p-4 md:p-8 bg-black/40 flex flex-col border-t md:border-t-0 md:border-l border-white/10 relative overflow-hidden h-1/2 md:h-full">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none translate-x-12 -translate-y-12">
                        <Cpu className="w-64 h-64 text-accent" />
                    </div>

                    <div className="flex justify-between items-center mb-4 md:mb-6 relative z-10">
                        <h3 className="text-[9px] font-black text-muted uppercase tracking-widest">{isLive ? "SYSTEM REGISTRY" : "PROTOCOL DETAILS"}</h3>
                        {!isLive && (
                            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white hover:text-zinc-950 rounded-lg transition-all border border-white/5">
                                <X className="w-5 h-5" />
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
                                className={`p-4 rounded-xl border transition-all relative overflow-hidden group ${isLive && idx === currentExerciseIdx
                                    ? 'bg-accent/10 border-accent/40 shadow-xl shadow-accent/5 ring-1 ring-accent/20 translate-x-2'
                                    : isLive && idx < currentExerciseIdx
                                        ? 'opacity-30 border-white/5 bg-emerald-500/5'
                                        : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-8 h-8 flex flex-col items-center justify-center bg-black/40 rounded-lg border border-white/10 shrink-0">
                                        {isLive && idx < currentExerciseIdx ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <span className="text-[10px] font-black text-white/50">{String(idx + 1).padStart(2, '0')}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-center gap-2">
                                            <p className={`font-black text-sm uppercase italic tracking-tighter truncate ${isLive && idx === currentExerciseIdx ? 'text-white' : 'text-white/80'}`}>{ex.name}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const fullEx = EXERCISE_DATABASE.find(item => item.name === ex.name);
                                                    setDetailExercise(fullEx || ex);
                                                }}
                                                className="p-1 bg-white/5 hover:bg-white/10 rounded-lg shrink-0"
                                            >
                                                <Info className="w-3 h-3 text-muted" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[7px] font-black text-muted uppercase tracking-widest leading-none">
                                                {ex.duration !== "N/A" ? `Time: ${ex.duration}` : `Vol: ${ex.sets}x${ex.reps}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/10 flex flex-col gap-3 relative z-10">
                        {!isLive ? (
                            <button
                                onClick={() => setIsLive(true)}
                                className="w-full bg-accent text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 group shadow-xl shadow-accent/10 italic text-[11px]"
                            >
                                <Play className="w-4 h-4 fill-zinc-950 group-hover:scale-110 transition-transform" />
                                INITIATE PROTOCOL
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={completing}
                                className="w-full bg-white text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3 group shadow-xl shadow-white/5 italic text-[11px]"
                            >
                                {completing ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-5 h-5" />
                                )}
                                FINALIZE MISSION
                            </button>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="flex-1 border border-white/10 hover:bg-white/5 py-3 rounded-xl text-[8px] uppercase font-black tracking-widest text-muted transition-all"
                            >
                                {isLive ? "ABORT" : "CLOSE"}
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
