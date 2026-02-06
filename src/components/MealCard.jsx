import { Plus, Utensils, Check, Beef, Waves, Cookie, Activity, Info } from "lucide-react";
import { useFitness } from "../context/FitnessContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "./Toast";
import FOOD_DATABASE from "../data/foodItems.json";

export default function MealCard({ meal, onViewDetails, onRemove }) {
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
      whileHover={{ y: -2 }}
      className="card-premium p-3 rounded-xl border border-white/5 relative overflow-hidden group h-full flex flex-col"
    >
      {/* Removal Button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 flex items-center justify-center transition-all active:scale-95 group/remove"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      )}
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none">
        <Activity className="w-24 h-24 text-accent" />
      </div>

      <div className="relative z-10 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5 group-hover:bg-accent/10 transition-colors shrink-0">
              <Utensils className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight line-clamp-1">{meal.name}</h3>
              <p className="text-[8px] text-muted font-black uppercase tracking-widest mt-0.5">{meal.type || "Fuel"}</p>
            </div>
          </div>
          <button
            onClick={() => {
              const fullFood = FOOD_DATABASE.find(f => f.name === meal.name);
              onViewDetails(fullFood || meal);
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5"
          >
            <Info className="w-4 h-4 text-muted" />
          </button>
        </div>

        <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 mb-3 flex justify-between items-center group-hover:border-accent/10 transition-colors">
          <p className="text-[8px] font-black text-muted uppercase tracking-widest">Energy</p>
          <div className="text-right">
            <span className="text-lg font-black text-white italic tracking-tighter tabular-nums block opacity-90 leading-none">
              {meal.calories}
            </span>
            <span className="text-[7px] font-black text-accent uppercase mt-0.5 block opacity-80">KCAL</span>
          </div>
        </div>

        {/* Macros Display */}
        {(meal.protein || meal.protein_g || meal.carbs || meal.carbs_g || meal.fats || meal.fats_g) && (
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <MacroStat icon={<Beef className="w-2.5 h-2.5 text-emerald-400" />} label="PRO" val={meal.protein || meal.protein_g} />
            <MacroStat icon={<Waves className="w-2.5 h-2.5 text-blue-400" />} label="CHO" val={meal.carbs || meal.carbs_g} />
            <MacroStat icon={<Cookie className="w-2.5 h-2.5 text-amber-500" />} label="FAT" val={meal.fats || meal.fats_g} />
          </div>
        )}
      </div>

      <button
        onClick={handleLog}
        disabled={logged}
        className={`relative z-10 w-full py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md group/btn
          ${logged ? 'bg-accent text-zinc-950 shadow-cyan-500/20' : 'bg-white/5 hover:bg-white text-white hover:text-black border border-white/5'}`}
      >
        {logged ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Confirmed
          </>
        ) : (
          <>
            <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform" />
            Acknowledge
          </>
        )}
      </button>
    </motion.div>
  );
}

function MacroStat({ icon, label, val }) {
  return (
    <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col items-center gap-1.5 group-hover:border-accent/5 transition-colors">
      <div className="p-1.5 bg-white/5 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-[7px] font-black text-muted uppercase tracking-[0.15em] text-center mb-0.5">{label}</p>
        <p className="text-[10px] font-black text-white tabular-nums text-center italic tracking-tighter opacity-90">{val || 0}G</p>
      </div>
    </div>
  );
}
