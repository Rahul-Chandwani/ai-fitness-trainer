import { X, Search, Plus, Trash2, Calculator, Apple, Beef, Waves, Cookie, Activity, Save, Info, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useFitness } from "../context/FitnessContext";
import FOOD_DATABASE from "../data/foodItems.json";
import FoodDetailModal from "./FoodDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./Toast";

const CATEGORIES = ["All", ...new Set(FOOD_DATABASE.map(item => item.category))];

export default function AddFoodModal({ onClose }) {
  const { addMealEntry, manualMeals, updateManualMeals } = useFitness();
  const { addToast } = useToast();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailFood, setDetailFood] = useState(null);

  const filteredFood = useMemo(() => {
    return FOOD_DATABASE.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totals = useMemo(() => {
    return selectedItems.reduce((acc, item) => ({
      calories: acc.calories + (item.calories * item.servings),
      protein: acc.protein + ((item.protein || item.protein_g || 0) * item.servings),
      carbs: acc.carbs + ((item.carbs || item.carbs_g || 0) * item.servings),
      fats: acc.fats + ((item.fats || item.fats_g || 0) * item.servings)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [selectedItems]);

  const addItem = (item) => {
    if (selectedItems.find(i => i.id === item.id)) return;
    setSelectedItems([...selectedItems, { ...item, servings: 1 }]);
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const updateServings = (id, val) => {
    setSelectedItems(selectedItems.map(i =>
      i.id === id ? { ...i, servings: Math.max(0.5, parseFloat(val) || 0) } : i
    ));
  };

  const handleSave = async () => {
    if (!mealName || selectedItems.length === 0) return;
    try {
      setLoading(true);
      const mealData = {
        name: mealName,
        type: mealType,
        calories: Math.round(totals.calories),
        protein: Math.round(totals.protein),
        carbs: Math.round(totals.carbs),
        fats: Math.round(totals.fats),
        items: selectedItems.map(i => ({ name: i.name, servings: i.servings }))
      };
      await addMealEntry(mealData);
      await updateManualMeals([mealData, ...manualMeals]);
      addToast("MEAL LOGGED SUCCESSFULLY", "success");
      onClose();
    } catch (err) {
      addToast("FAILED TO LOG MEAL", "error");
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
        {/* Left Panel: Food Browser */}
        <div className="w-full xl:w-[320px] border-b xl:border-b-0 xl:border-r border-white/5 p-4 md:p-6 flex flex-col bg-black/40 relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 left-0 p-10 opacity-5 -translate-x-12 -translate-y-12 pointer-events-none">
            <Apple className="w-64 h-64 text-accent" />
          </div>

          <div className="mb-4 relative z-10">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">Library</h2>
            <div className="flex items-center gap-2 text-accent text-[8px] font-black uppercase tracking-[0.3em]">
              <div className="w-2 h-0.5 bg-accent"></div>
              Log Custom Nutrition
            </div>
          </div>

          <div className="space-y-3 mb-4 relative z-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted group-focus-within:text-accent transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food..."
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
            {filteredFood.map(item => (
              <div key={item.id} className="w-full flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-accent/30 transition-all group">
                <div className="text-left min-w-0">
                  <p className="font-black text-white text-[10px] uppercase italic tracking-tighter truncate">{item.name}</p>
                  <p className="text-[6px] font-black text-muted uppercase tracking-[0.2em] mt-0.5">{item.calories} KCAL • {item.protein || item.protein_g}P</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setDetailFood(item)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10"
                  >
                    <Info className="w-3 h-3 text-muted" />
                  </button>
                  <button
                    onClick={() => addItem(item)}
                    disabled={selectedItems.some(i => i.id === item.id)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 hover:bg-accent hover:text-black transition-all disabled:opacity-20"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Composition */}
        <div className="flex-1 p-4 md:p-6 flex flex-col relative overflow-hidden h-1/2 xl:h-full">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -translate-y-12 translate-x-12">
            <Activity className="w-[500px] h-[500px] text-accent" />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10 w-full">
            <div className="space-y-1.5 flex-grow max-w-md w-full">
              <label className="text-[7px] font-black text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                <div className="w-1 h-2.5 bg-accent rounded-full"></div>
                Meal Identifier
              </label>
              <input
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="NAME..."
                className="bg-transparent border-b border-white/10 focus:border-accent text-xl font-black text-white uppercase tracking-tighter outline-none w-full pb-1.5 transition-all italic"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="bg-card border border-white/10 rounded-lg py-2 px-4 text-[9px] font-black text-text uppercase outline-none focus:border-accent/40 cursor-pointer"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
              <button onClick={onClose} className="p-2 bg-white/5 text-muted hover:text-white rounded-lg border border-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 scrollbar-none space-y-4 mb-8 relative z-10">
            <AnimatePresence>
              {selectedItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card-premium border border-white/5 rounded-xl p-3 flex items-center gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-black text-white text-sm uppercase italic tracking-tighter">{item.name}</h4>
                        <p className="text-[7px] text-muted font-black uppercase tracking-widest">Base: {item.calories} kcal</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 bg-white/5 hover:bg-red-500/10 text-muted hover:text-red-500 rounded-lg transition-all h-fit">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <input
                          type="range"
                          min="0.5"
                          max="5"
                          step="0.5"
                          value={item.servings}
                          onChange={(e) => updateServings(item.id, e.target.value)}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none accent-accent cursor-pointer"
                        />
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-sm font-black text-white italic">{item.servings}x</span>
                        <span className="text-[6px] text-muted ml-1 uppercase font-black tracking-widest">SRV</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {selectedItems.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 border-2 border-dashed border-white/5 rounded-2xl py-12">
                <Calculator className="w-10 h-10 mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">Compose Nutrients</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 grid grid-cols-4 gap-4 relative z-10 bg-transparent mb-4">
            <StatMini label="Cal" value={Math.round(totals.calories)} unit="kcal" color="text-white" />
            <StatMini label="Prot" value={Math.round(totals.protein)} unit="g" color="text-accent" />
            <StatMini label="Carb" value={Math.round(totals.carbs)} unit="g" color="text-blue-400" />
            <StatMini label="Fat" value={Math.round(totals.fats)} unit="g" color="text-orange-400" />
          </div>

          <button
            onClick={handleSave}
            disabled={loading || !mealName || selectedItems.length === 0}
            className="w-full bg-white text-zinc-950 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-accent transition-all text-[10px] disabled:opacity-20 flex items-center justify-center gap-2 relative z-10 italic"
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> LOG MEAL DATA</>}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {detailFood && (
          <FoodDetailModal
            food={detailFood}
            onClose={() => setDetailFood(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatMini({ label, value, unit, color }) {
  return (
    <div>
      <p className="text-[6px] font-black text-muted uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-lg font-black italic tracking-tighter ${color}`}>{value}<span className="text-[7px] ml-0.5 opacity-50">{unit}</span></p>
    </div>
  );
}
