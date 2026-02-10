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
        addToast("Diet plan updated", "success");
      } else {
        addToast("Failed to generate", "error");
      }
    } catch (err) {
      addToast("Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMeal = (mealId) => {
    if (activeTab === "manual") {
      updateManualMeals(manualMeals.filter(m => m.id !== mealId));
      addToast("MEAL REMOVED", "success");
    } else {
      updateAIMeals(aiMeals.filter(m => m.id !== mealId));
      addToast("Meal plan deleted", "success");
    }
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto space-y-4 pb-20 px-2 sm:px-4">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[0.65rem] font-black text-muted hover:text-accent transition-colors group uppercase tracking-[0.2em] opacity-60">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Hub
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-blue-500 rounded-full mb-0.5" />
              <div>
                <h1 className="text-xl md:text-2xl font-black text-text italic tracking-tighter uppercase leading-none">Nutrition</h1>
                <p className="text-[0.6rem] text-muted font-bold uppercase tracking-[0.4em] mt-1.5 opacity-60">DIET PLANNER</p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-card/40 rounded-xl border border-border w-full md:w-auto self-stretch md:self-auto shadow-sm">
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-black uppercase tracking-tight text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-text text-bg shadow-md' : 'text-muted hover:text-text'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-black uppercase tracking-tight text-xs transition-all flex items-center justify-center gap-2 ${activeTab === 'manual' ? 'bg-text text-bg shadow-md' : 'text-muted hover:text-text'}`}
              >
                <Plus className="w-4 h-4" />
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
                <div className="card-premium p-6 md:p-8 rounded-2xl border border-border bg-card/40 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60">Preference</p>
                      <select
                        value={dietPreference}
                        onChange={(e) => setDietPreference(e.target.value)}
                        className="w-full bg-card/60 border border-border rounded-xl py-3 px-4 text-text font-black text-xs uppercase outline-none focus:border-accent/40 shadow-sm"
                      >
                        {PREFERENCE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60">Focus / Aim</p>
                      <select
                        value={dietAim}
                        onChange={(e) => setDietAim(e.target.value)}
                        className="w-full bg-card/60 border border-border rounded-xl py-3 px-4 text-text font-black text-xs uppercase outline-none focus:border-accent/40 shadow-sm"
                      >
                        {AIM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.2em] px-1 opacity-60">Target Kcal</p>
                      <input
                        type="number"
                        value={targetCalories || ""}
                        onChange={(e) => setTargetCalories(e.target.value)}
                        className="w-full bg-card/60 border border-border rounded-xl py-3 px-4 text-text font-black text-xs outline-none focus:border-accent/40 shadow-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-3 justify-end">
                      <button
                        onClick={handleGenerateValues}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-text text-bg font-black uppercase text-xs tracking-widest shadow-xl hover:bg-accent transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {loading ? <div className="w-4 h-4 border-2 border-bg/20 border-t-bg rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        SYNC DIET
                      </button>
                      <Link
                        to="/training-plan"
                        className="w-full py-2 rounded-xl border border-dashed border-border text-[0.6rem] font-black text-muted hover:text-accent hover:border-accent/40 transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] opacity-60"
                      >
                        <Target className="w-3.5 h-3.5" />
                        4-Week Diet Sync
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH MEAL PLANS..."
                      className="w-full bg-card/40 border border-border rounded-xl py-3.5 pl-12 pr-4 text-xs font-black text-text outline-none focus:border-accent/40 shadow-sm placeholder:opacity-20"
                    />
                  </div>
                </div>

                {/* Active Summary Callout */}
                <div className="flex flex-col xl:flex-row items-center justify-between p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl gap-8">
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.4em] mb-1.5 opacity-60">DAILY SUMMARY</p>
                      <div className="flex items-baseline gap-2.5 justify-center sm:justify-start">
                        <h3 className="text-2xl font-black text-text italic tracking-tighter leading-none">{totalCalories}</h3>
                        <span className="text-[0.65rem] font-black text-muted uppercase tracking-widest opacity-60">CALORIES</span>
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
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-40" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH NUTRITION DATABASE..."
                      className="w-full bg-card/40 border border-border rounded-xl py-3.5 pl-12 pr-4 text-xs font-black text-text outline-none focus:border-accent/40 shadow-sm placeholder:opacity-20"
                    />
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="p-3.5 bg-card/40 border border-border rounded-xl text-muted hover:text-text transition-all shadow-sm">
                      <Filter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex-1 sm:flex-none px-8 py-2.5 bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all shadow-blue-500/10"
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
              <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-[2rem] bg-card/10">
                <p className="text-xs font-black text-muted uppercase tracking-[0.5em] opacity-40 px-10">
                  {activeTab === 'ai' ? 'No Meal Plans Found' : 'No Manual Meals Found'}
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
    <div className="flex flex-col items-center gap-1.5 min-w-[60px]">
      <div className="w-9 h-9 bg-card/60 rounded-xl flex items-center justify-center border border-border shadow-sm">
        {icon}
      </div>
      <p className="text-[0.6rem] font-black text-muted tracking-widest leading-none opacity-60">{label}</p>
      <p className="text-xs font-black text-text italic tabular-nums">{value}</p>
    </div>
  );
}
