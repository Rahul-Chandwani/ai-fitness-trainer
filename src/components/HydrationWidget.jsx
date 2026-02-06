import { Droplets, Plus, Minus, Waves } from "lucide-react";
import { useFitness } from "../context/FitnessContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HydrationWidget() {
    const { hydration, updateHydration } = useFitness();

    const goal = 8;
    const percentage = Math.min(100, (hydration / goal) * 100);

    return (
        <div className="card-premium border border-white/5 rounded-xl p-3.5 relative overflow-hidden group h-full flex flex-col justify-between">
            {/* Background Liquid Surface */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: `${100 - percentage}%` }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="absolute inset-x-0 bottom-0 bg-blue-500/10 -z-10 pointer-events-none"
                style={{ height: '100%' }}
            >
                <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-blue-400/20 to-transparent"></div>
            </motion.div>

            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Waves className="w-20 h-20 text-blue-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black text-white uppercase italic tracking-tighter">Hydration</h3>
                            <p className="text-[7px] text-muted font-black uppercase tracking-widest mt-0.5">Matrix</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-none">Status</p>
                        <p className={`text-xs font-black uppercase tracking-widest mt-1 ${percentage >= 100 ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {percentage >= 100 ? 'Saturated' : 'Synchronizing'}
                        </p>
                    </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-3">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none">{hydration}</h2>
                    <div className="flex flex-col">
                        <span className="text-base font-black text-muted uppercase tracking-widest leading-none">/ {goal}</span>
                        <span className="text-[6px] font-black text-muted uppercase tracking-[0.2em] mt-0.5">Units</span>
                    </div>
                </div>

                {/* Technical Progress View */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-1">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-sm border transition-all duration-500 ${i < hydration ? 'bg-blue-500 border-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.5)]' : 'bg-white/5 border-white/10'}`}
                                ></div>
                            ))}
                        </div>
                        <span className="text-[8px] font-black text-white italic tabular-nums">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-1.5 relative z-10">
                <button
                    onClick={() => updateHydration(1)}
                    className="flex-grow bg-white text-zinc-950 py-2.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-400 transition-all font-black uppercase tracking-widest text-[8px] shadow-sm active:scale-95 group"
                >
                    <Plus className="w-3 h-3" />
                    Input Dose
                </button>
                <button
                    onClick={() => updateHydration(-1)}
                    className="px-3 bg-white/5 text-white py-2.5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 active:scale-90"
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
