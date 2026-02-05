import DashboardLayout from "../layouts/DashboardLayout";
import MealCard from "../components/MealCard";
import AddFoodModal from "../components/AddFoodModal";
import FoodDetailModal from "../components/FoodDetailModal";
import { useState } from "react";
import { generateDietPlan } from "../services/ai";
import { useFitness } from "../context/FitnessContext";
import { Plus, Sparkles, Utensils, Target, Beef, Waves, Cookie, Activity, ChevronLeft, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Diet() {
  const {
    manualMeals,
    aiMeals,
    updateManualMeals,
    updateAIMeals,
    getTodayTasks,
    userProfile
  } = useFitness();
  const { addToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai"); // ai, manual
  const [selectedFood, setSelectedFood] = useState(null);

  // AI Generation Preferences
  const [dietPreference, setDietPreference] = useState("Balanced");
  const [dietAim, setDietAim] = useState("High Protein");
  const [targetCalories, setTargetCalories] = useState("2000");
  const [searchQuery, setSearchQuery] = useState("");

  const PREFERENCE_OPTIONS = ["Balanced", "Vegetarian", "Vegan", "Non-Vegetarian", "Eggitarian", "Keto", "High Protein", "Low Carb"];
  const AIM_OPTIONS = ["High Protein", "Bulking", "High Fiber", "Weight Loss", "Clean Eating", "Muscle Gain", "Endurance"];

  const isAdvanced = userProfile?.subscriptionTier === "advanced";
  const todayTasks = getTodayTasks();

  const meals = (() => {
    let list = activeTab === "ai"
      ? [...(isAdvanced && todayTasks?.meals ? todayTasks.meals : []), ...aiMeals]
      : manualMeals;

    if (searchQuery) {
      return list.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  })();

  const totalCalories = meals.reduce((sum, m) => sum + (m.calories || 0), 0);

  const handleGenerateValues = async () => {
    try {
      setLoading(true);
      const newPlan = await generateDietPlan({
        dietPreference,
        dietAim,
        calories: targetCalories,
        experienceLevel: userProfile?.experienceLevel || "intermediate"
      });
      if (newPlan) {
        updateAIMeals([...newPlan, ...aiMeals]);
        addToast("Nutritional profile optimized", "success");
      } else {
        addToast("Synthesis failed", "error");
      }
    } catch (err) {
      addToast("Uplink unstable", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-2 sm:px-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent transition-colors group uppercase tracking-widest">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-blue-500 rounded-full mb-1" />
              <div>
                <h1 className="text-xl md:text-3xl font-black text-white italic tracking-tighter uppercase">Nutrition Hub</h1>
                <p className="text-[8px] text-muted font-bold uppercase tracking-[0.3em]">AI Synthesis & Calorie Engine</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 w-full md:w-auto self-stretch md:self-auto">
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 md:flex-none px-4 sm:px-8 py-2.5 rounded-xl font-black uppercase tracking-tighter text-[10px] transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white text-black shadow-lg' : 'text-muted hover:text-white'}`}
              >
                <Sparkles className="w-3 h-3" />
                AI Protocols
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 md:flex-none px-4 sm:px-8 py-2.5 rounded-xl font-black uppercase tracking-tighter text-[10px] transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-white text-black shadow-lg' : 'text-muted hover:text-white'}`}
              >
                <Plus className="w-3 h-3" />
                Manual Logs & Library
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'ai' ? (
              <motion.div
                key="ai-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* AI Generation Interface */}
                <div className="card-premium p-4 sm:p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Preference</p>
                      <select
                        value={dietPreference}
                        onChange={(e) => setDietPreference(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white font-black text-[10px] uppercase outline-none focus:border-accent/40 cursor-pointer"
                      >
                        {PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Focus / Aim</p>
                      <select
                        value={dietAim}
                        onChange={(e) => setDietAim(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white font-black text-[10px] uppercase outline-none focus:border-accent/40 cursor-pointer"
                      >
                        {AIM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Target Kcal</p>
                      <input
                        type="number"
                        value={targetCalories || ""}
                        onChange={(e) => setTargetCalories(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-white font-black text-[10px] outline-none focus:border-accent/40"
                      />
                    </div>
                    <div className="flex flex-col gap-2 justify-end">
                      <button
                        onClick={handleGenerateValues}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-2 "
                      >
                        {loading ? <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Optimize Nutrition
                      </button>
                      <Link
                        to="/training-plan"
                        className="w-full py-2 rounded-xl border border-dashed border-white/10 text-[8px] font-black text-muted hover:text-accent hover:border-accent/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <Target className="w-3 h-3" />
                        Create 4-Week Diet Architecture
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="FILTER AI PROTOCOLS..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white outline-none focus:border-accent/40"
                    />
                  </div>
                </div>

                {/* Active Summary Callout */}
                <div className="flex flex-col xl:flex-row items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-[1.5rem] gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-muted uppercase tracking-[0.4em] mb-1">Total Calorie Matrix</p>
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <h3 className="text-2xl font-black text-white italic tracking-tighter leading-none">{totalCalories}</h3>
                        <span className="text-[9px] font-black text-muted uppercase">Kcal Generated</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MacroMini icon={<Beef className="text-emerald-400 w-3 h-3" />} label="PRO" value={`${Math.round(meals.reduce((s, m) => s + (m.protein || m.protein_g || 0), 0))}g`} />
                    <MacroMini icon={<Waves className="text-blue-400 w-3 h-3" />} label="CHO" value={`${Math.round(meals.reduce((s, m) => s + (m.carbs || m.carbs_g || m.carbohydrates_total_g || 0), 0))}g`} />
                    <MacroMini icon={<Cookie className="text-amber-500 w-3 h-3" />} label="FAT" value={`${Math.round(meals.reduce((s, m) => s + (m.fats || m.fats_g || 0), 0))}g`} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="manual-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* Manual Utility Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH NUTRITION DATABASE..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white outline-none focus:border-accent/40"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-muted hover:text-white transition-all"><Filter className="w-4 h-4" /></button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Add Manually
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Meals Display - Common for both tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
            {meals.map((meal, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={i}
              >
                <MealCard meal={meal} onViewDetails={setSelectedFood} />
              </motion.div>
            ))}
            {meals.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">
                  {activeTab === 'ai' ? 'No AI Protocols Active' : 'No Manual Meals Documented'}
                </p>
              </div>
            )}
          </div>

          {showAddModal && <AddFoodModal onClose={() => setShowAddModal(false)} />}
          <AnimatePresence>
            {selectedFood && (
              <FoodDetailModal
                food={selectedFood}
                onClose={() => setSelectedFood(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </DashboardLayout >
  );
}

function MacroMini({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[50px]">
      <div className="w-8 h-8 md:w-9 md:h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <p className="text-[7px] font-black text-muted tracking-widest leading-none">{label}</p>
      <p className="text-[10px] font-black text-white italic tabular-nums">{value}</p>
    </div>
  );
}
