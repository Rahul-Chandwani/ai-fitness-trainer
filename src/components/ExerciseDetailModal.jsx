import { X, Info, Dumbbell, Play, Target, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ExerciseVisual from "./ExerciseVisual";

export default function ExerciseDetailModal({ exercise, onClose }) {
    if (!exercise) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg/95 backdrop-blur-2xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative bg-card border border-white/10 w-full max-w-4xl rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
                {/* Visual Panel */}
                <div className="md:w-1/2 p-8 md:p-12 bg-black/40 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 opacity-30 blur-[100px] pointer-events-none" />

                    <div className="w-full aspect-square rounded-[3rem] border border-white/5 bg-white/5 flex items-center justify-center relative overflow-hidden mb-8">
                        <ExerciseVisual exerciseName={exercise.name} />
                    </div>

                    <div className="flex gap-4 w-full">
                        <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Calories/Min</p>
                            <p className="text-xl font-black text-accent">{exercise.calories_per_min || 7}</p>
                        </div>
                        <div className="flex-1 p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Level</p>
                            <p className="text-xl font-black text-white uppercase">{exercise.level}</p>
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-none">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-2 leading-none">
                                <Target className="w-3 h-3" />
                                Specialized Protocol
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{exercise.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all border border-white/5">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Tutorial */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Play className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Tutorial & Form</h3>
                            </div>
                            <p className="text-sm font-bold text-white/70 leading-relaxed uppercase italic">
                                {exercise.tutorial}
                            </p>
                        </section>

                        {/* Muscle effectiveness */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Dumbbell className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Activated Fibers</h3>
                            </div>
                            <p className="text-xs font-bold text-accent uppercase tracking-wide leading-relaxed">
                                {exercise.effective_parts}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {(exercise.muscles || []).map(m => (
                                    <span key={m} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[8px] font-black uppercase text-muted tracking-widest">
                                        {m}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Form Tips */}
                        <section className="p-6 bg-accent/5 rounded-3xl border border-accent/20">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Pro Performance Tips</h3>
                            </div>
                            <ul className="space-y-3">
                                {(exercise.form_tips || []).map((tip, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                        <div className="w-1 h-1 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-tight">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
