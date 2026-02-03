import { X, Apple, Waves, Beef, Cookie, Activity, ChevronRight, Save } from "lucide-react";
import { useState } from "react";
import { useFitness } from "../context/FitnessContext";
import { motion } from "framer-motion";
import { useToast } from "./Toast";

export default function AddFoodModal({ onClose }) {
  const { addMealEntry, dietPlan } = useFitness();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    type: "Breakfast"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const libraryMeals = (dietPlan || []).filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectFromLibrary = (meal) => {
    setFormData({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      type: meal.type || "Breakfast"
    });
    setSearchTerm(""); // Clear search after selection
  };

  const handleSave = async () => {
    if (!formData.name || !formData.calories) return;
    try {
      setLoading(true);
      await addMealEntry(formData);
      addToast("MEAL SAVED", "success");
      onClose();
    } catch (err) {
      addToast("ERROR: Failed to save meal", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg/90 backdrop-blur-xl flex items-center justify-center z-[200] p-6 lg:p-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card/90 border border-white/5 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-none"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Activity className="w-64 h-64 text-accent" />
        </div>

        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-12 bg-accent rounded-full"></div>
            <div>
              <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Add Meal</h2>
              <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mt-1">Log your daily nutrition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 text-muted hover:text-white transition-all rounded-2xl border border-white/5 hover:border-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-10 relative z-10">
          {/* Library Search (The "Hidden" Library) */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-muted tracking-[0.3em] px-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-accent rounded-full"></div>
              Search library
            </label>
            <div className="relative group">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 outline-none transition-all text-white font-black uppercase tracking-tight text-sm"
                placeholder="SEARCH PREVIOUS MEALS..."
              />
              {searchTerm && libraryMeals.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-3xl p-4 shadow-2xl z-50 max-h-64 overflow-y-auto scrollbar-none">
                  {libraryMeals.map((meal, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectFromLibrary(meal)}
                      className="w-full p-4 hover:bg-white/5 rounded-2xl flex items-center justify-between transition-all group/item"
                    >
                      <div className="text-left">
                        <p className="text-sm font-black text-white uppercase tracking-tight">{meal.name}</p>
                        <p className="text-xs text-muted font-bold uppercase">{meal.calories} KCAL</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted group-hover/item:text-accent group-hover/item:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">OR AUTO-COMPLETE BELOW</span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          {/* Main Input */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase font-black text-muted tracking-[0.3em] px-2 flex items-center gap-2">
              <div className="w-1 h-3 bg-accent rounded-full"></div>
              Meal Name
            </label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-6 p-y-7 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 outline-none transition-all text-white font-black uppercase tracking-tight text-lg"
              placeholder="E.G. CHICKEN SALAD"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black text-muted tracking-[0.3em] px-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-accent rounded-full"></div>
                Calories
              </label>
              <div className="relative">
                <input
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 outline-none transition-all text-white font-black tabular-nums text-xl"
                  placeholder="000"
                  type="number"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted uppercase tracking-widest">KCAL</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase font-black text-muted tracking-[0.3em] px-2 flex items-center gap-2">
                <div className="w-1 h-3 bg-accent rounded-full"></div>
                Meal Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 outline-none transition-all text-white font-black uppercase tracking-widest text-sm appearance-none cursor-pointer"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            <p className="text-[10px] uppercase font-black text-muted tracking-[0.4em] px-2">Macros (Grams)</p>
            <div className="grid grid-cols-3 gap-6">
              <MacroInput
                icon={<Beef className="w-4 h-4" />}
                label="PROTEIN"
                color="emerald"
                val={formData.protein}
                onChange={(v) => setFormData({ ...formData, protein: v })}
              />
              <MacroInput
                icon={<Waves className="w-4 h-4" />}
                label="CARBS"
                color="blue"
                val={formData.carbs}
                onChange={(v) => setFormData({ ...formData, carbs: v })}
              />
              <MacroInput
                icon={<Cookie className="w-4 h-4" />}
                label="FATS"
                color="amber"
                val={formData.fats}
                onChange={(v) => setFormData({ ...formData, fats: v })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-12 relative z-10">
          <button
            onClick={handleSave}
            disabled={loading || !formData.name || !formData.calories}
            className="w-full py-6 bg-white text-black font-black uppercase tracking-tighter rounded-3xl disabled:opacity-20 hover:bg-accent transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 text-sm italic"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                SAVE MEAL
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MacroInput({ icon, label, color, val, onChange }) {
  const colorClasses = {
    emerald: "text-emerald-400 group-focus-within:border-emerald-400/40",
    blue: "text-blue-400 group-focus-within:border-blue-400/40",
    amber: "text-amber-500 group-focus-within:border-amber-400/40"
  };

  return (
    <div className={`bg-white/5 p-5 rounded-[2rem] border border-white/5 group transition-all ${colorClasses[color]} flex flex-col gap-3 items-center`}>
      <div className="p-2.5 bg-white/5 rounded-xl">
        {icon}
      </div>
      <p className="text-[8px] font-black uppercase tracking-widest text-muted">{label}</p>
      <div className="relative">
        <input
          type="number"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-white font-black outline-none w-10 text-center text-lg italic tabular-nums"
          placeholder="0"
        />
        <span className="text-[10px] text-muted ml-0.5">G</span>
      </div>
    </div>
  );
}
