import { X, Info, Apple, Zap, AlertTriangle, Salad, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodDetailModal({ food, onClose }) {
    if (!food) return null;

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
                {/* Visual / Macro Panel */}
                <div className="md:w-[40%] p-8 md:p-12 bg-black/40 flex flex-col relative overflow-hidden group">
                    <div className="absolute inset-0 bg-accent/5 opacity-30 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 mb-10">
                        <p className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4">Nutritional Matrix</p>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{food.name}</h2>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest italic">{food.region} Cuisine • {food.category}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-10">
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Calories</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter">{food.calories}<span className="text-[10px] ml-1">KCAL</span></p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Protein</p>
                            <p className="text-2xl font-black text-accent italic tracking-tighter">{food.protein || food.protein_g}<span className="text-[10px] ml-1">G</span></p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Carbs</p>
                            <p className="text-2xl font-black text-blue-400 italic tracking-tighter">{food.carbs || food.carbohydrates_total_g || food.carbs_g}<span className="text-[10px] ml-1">G</span></p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center">
                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Fats</p>
                            <p className="text-2xl font-black text-orange-400 italic tracking-tighter">{food.fats || food.fats_g}<span className="text-[10px] ml-1">G</span></p>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-accent/10 rounded-2xl border border-accent/20 relative z-10">
                        <p className="text-[8px] font-black text-accent uppercase tracking-widest text-center mb-1">Suitability</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {(food.suitable_for || []).map(s => (
                                <span key={s} className="text-[7px] font-black text-white/50 uppercase tracking-tighter px-2 py-0.5 bg-white/5 rounded military-border">{s}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto scrollbar-none">
                    <div className="flex justify-end mb-6">
                        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-2xl transition-all border border-white/5">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-12">
                        {/* Health Benefits */}
                        <section>
                            <div className="flex items-center gap-3 mb-4">
                                <Heart className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Metabolic Benefits</h3>
                            </div>
                            <p className="text-sm font-bold text-white/70 leading-relaxed uppercase italic">
                                {food.benefits}
                            </p>
                        </section>

                        {/* Potential Drawbacks */}
                        <section className="p-8 bg-red-500/5 rounded-[3rem] border border-red-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
                                <AlertTriangle className="w-24 h-24 text-red-500" />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Dietary Considerations</h3>
                            </div>
                            <p className="text-sm font-bold text-red-500/70 leading-relaxed uppercase italic relative z-10">
                                {food.drawbacks}
                            </p>
                        </section>

                        {/* Macro Breakdown Visualizer */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <Zap className="w-4 h-4 text-accent" />
                                <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.3em]">Macro Analysis</h3>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { label: 'Protein', value: food.protein || food.protein_g, color: 'bg-accent', max: 50 },
                                    { label: 'Carbs', value: food.carbs || food.carbohydrates_total_g || food.carbs_g, color: 'bg-blue-400', max: 100 },
                                    { label: 'Fats', value: food.fats || food.fats_g, color: 'bg-orange-400', max: 50 }
                                ].map(m => (
                                    <div key={m.label} className="space-y-2">
                                        <div className="flex justify-between items-end px-1">
                                            <p className="text-[9px] font-black text-white uppercase tracking-widest">{m.label}</p>
                                            <p className="text-[9px] font-black text-muted uppercase">{m.value}g</p>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }}
                                                className={`h-full ${m.color}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
