import { Plus, Utensils, Check, Beef, Waves, Cookie, Activity, Info } from "lucide-react";
import { useFitness } from "../context/FitnessContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "./Toast";
import FOOD_DATABASE from "../data/foodItems.json";

export default function MealCard({ meal, onViewDetails }) {
  const { addMealEntry } = useFitness();
  const { addToast } = useToast();
  const [logged, setLogged] = useState(false);

  const handleLog = async () => {
    try {
      await addMealEntry(meal);
      setLogged(true);
      addToast("METABOLIC LOG AUTHORIZED", "success");
      setTimeout(() => setLogged(false), 2000);
    } catch (err) {
      addToast("LOGGING FAILED", "error");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-premium p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
        <Activity className="w-24 h-24 text-accent" />
      </div>

      <div className="relative z-10 flex-grow">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-accent/10 transition-colors">
              <Utensils className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight">{meal.name}</h3>
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mt-1">{meal.type || "Protocol"}</p>
              {meal.food && (
                <p className="text-[9px] text-accent/80 font-bold uppercase italic tracking-tight mt-2 line-clamp-2 leading-tight">
                  {meal.food}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              const fullFood = FOOD_DATABASE.find(f => f.name === meal.name);
              onViewDetails(fullFood || meal);
            }}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5"
          >
            <Info className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 mb-8 flex justify-between items-center group-hover:border-accent/10 transition-colors">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">Caloric Load</p>
          <div className="text-right">
            <span className="text-3xl font-black text-white italic tracking-tighter tabular-nums block">
              {meal.calories}
            </span>
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">KCAL</span>
          </div>
        </div>

        {/* Macros Display */}
        {(meal.protein || meal.protein_g || meal.carbs || meal.carbs_g || meal.fats || meal.fats_g) && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            <MacroStat icon={<Beef className="w-3 h-3 text-emerald-400" />} label="PRO" val={meal.protein || meal.protein_g} />
            <MacroStat icon={<Waves className="w-3 h-3 text-blue-400" />} label="CHO" val={meal.carbs || meal.carbs_g} />
            <MacroStat icon={<Cookie className="w-3 h-3 text-amber-500" />} label="FAT" val={meal.fats || meal.fats_g} />
          </div>
        )}
      </div>

      <button
        onClick={handleLog}
        disabled={logged}
        className={`relative z-10 w-full py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl group/btn
          ${logged ? 'bg-accent text-black shadow-accent/20' : 'bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 shadow-white/5'}`}
      >
        {logged ? (
          <>
            <Check className="w-4 h-4" />
            Uplink OK
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 group-hover/btn:rotate-90 transition-transform" />
            Authorize Log
          </>
        )}
      </button>
    </motion.div>
  );
}

function MacroStat({ icon, label, val }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center gap-2 group-hover:border-accent/5 transition-colors">
      <div className="p-2 bg-white/5 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-black text-muted uppercase tracking-widest text-center mb-0.5">{label}</p>
        <p className="text-sm font-black text-white tabular-nums text-center italic tracking-tighter">{val || 0}G</p>
      </div>
    </div>
  );
}
