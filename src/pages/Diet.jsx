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
    let list = [];
    if (activeTab === "ai") {
      // If AI Meals (ad-hoc) exist, show only them. 
      // Otherwise fallback to Training Plan meals.
      if (aiMeals.length > 0) {
        list = aiMeals;
      } else if (isAdvanced && todayTasks?.meals) {
        list = todayTasks.meals;
      }
    } else {
      list = manualMeals;
    }

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
        updateAIMeals(newPlan); // REPLACE instead of append
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

  const handleRemoveMeal = (mealId) => {
    if (activeTab === "manual") {
      updateManualMeals(manualMeals.filter(m => m.id !== mealId));
      addToast("MEAL REMOVED FROM LOG", "success");
    } else {
      updateAIMeals(aiMeals.filter(m => m.id !== mealId));
      addToast("AI PROTOCOL DELETED", "success");
    }
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-4 pb-20 px-2 sm:px-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent transition-colors group uppercase tracking-widest">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full mb-0.5" />
              <div>
                <h1 className="text-lg md:text-2xl font-black text-white italic tracking-tighter uppercase">Nutrition</h1>
                <p className="text-[7px] text-muted font-bold uppercase tracking-[0.3em] uppercase">AI Sync & Engine</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-0.5 bg-white/5 rounded-xl border border-white/5 w-full md:w-auto self-stretch md:self-auto">
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 md:flex-none px-4 sm:px-6 py-1.5 rounded-lg font-black uppercase tracking-tighter text-[9px] transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                <Sparkles className="w-3 h-3" />
                AI
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 md:flex-none px-4 sm:px-6 py-1.5 rounded-lg font-black uppercase tracking-tighter text-[9px] transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-white text-black shadow-md' : 'text-muted hover:text-white'}`}
              >
                <Plus className="w-3 h-3" />
                Manual
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
                <div className="card-premium p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Preference</p>
                      <select
                        value={dietPreference}
                        onChange={(e) => setDietPreference(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-[9px] uppercase outline-none"
                      >
                        {PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest px-2">Focus / Aim</p>
                      <select
                        value={dietAim}
                        onChange={(e) => setDietAim(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-white font-black text-[9px] uppercase outline-none"
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
                        className="w-full py-2.5 rounded-lg bg-white text-zinc-950 font-black uppercase text-[9px] tracking-widest shadow-md hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {loading ? <div className="w-3 h-3 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        SYNC DIET
                      </button>
                      <Link
                        to="/training-plan"
                        className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-[7px] font-black text-muted hover:text-accent hover:border-accent/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                      >
                        <Target className="w-3 h-3" />
                        4-Week Diet Sync
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
                <div className="flex flex-col xl:flex-row items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[7px] font-black text-muted uppercase tracking-[0.4em] mb-0.5">Energy Matrix</p>
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <h3 className="text-xl font-black text-white italic tracking-tighter leading-none">{totalCalories}</h3>
                        <span className="text-[8px] font-black text-muted uppercase">Kcal Sync</span>
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
                      className="flex-1 sm:flex-none px-6 py-2 bg-blue-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      Add Meal
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
                <MealCard
                  meal={meal}
                  onViewDetails={setSelectedFood}
                  onRemove={activeTab === "manual" ? () => handleRemoveMeal(meal.id) : null}
                />
              </motion.div>
            ))}
            {meals.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
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
    <div className="flex flex-col items-center gap-0.5 min-w-[45px]">
      <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
        {icon}
      </div>
      <p className="text-[6px] font-black text-muted tracking-widest leading-none">{label}</p>
      <p className="text-[9px] font-black text-white italic tabular-nums">{value}</p>
    </div>
  );
}
