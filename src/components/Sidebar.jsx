import { LayoutDashboard, Dumbbell, Utensils, Bot, CreditCard, Settings, User, Zap, Trophy, Home } from "lucide-react";
import { useFitness } from "../context/FitnessContext";
import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Sidebar() {
  const { userProfile, neuralXP } = useFitness();

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-3 px-6 py-2 rounded-xl transition-all duration-300 font-bold uppercase tracking-tight text-sm
     ${isActive
      ? "text-black bg-accent shadow-lg shadow-accent/20"
      : "text-muted hover:text-white hover:bg-white/5"
    }`;

  return (
    <aside className="w-72 flex-shrink-0 p-4 hidden lg:block h-screen sticky top-0">
      <div className="bg-card/40 backdrop-blur-2xl border border-white/5 h-full rounded-[2.5rem] flex flex-col p-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-[100px]"></div>

        {/* Logo */}
        <div className="mb-4">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-white uppercase block">
            SmartFit <span className="text-accent">AI</span>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-1 w-8 bg-accent rounded-full"></div>
            <p className="text-[8px] font-bold text-muted uppercase tracking-widest uppercase">Dashboard v2.0</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-grow overflow-y-auto scrollbar-none">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>

          <NavLink to="/workouts" className={linkClass}>
            <Dumbbell className="w-5 h-5" />
            <span>Workouts</span>
          </NavLink>

          <NavLink to="/diet" className={linkClass}>
            <Utensils className="w-5 h-5" />
            <span>Diet</span>
          </NavLink>

          <NavLink to="/ai-coach" className={linkClass}>
            <Bot className="w-5 h-5" />
            <span>AI Trainer</span>
          </NavLink>

          <NavLink to="/training-plan" className={linkClass}>
            <Zap className="w-5 h-5" />
            <span>Training Plan</span>
            {userProfile?.subscriptionTier === "advanced" && (
              <span className="ml-auto px-2 py-0.5 bg-accent/20 text-accent text-[8px] font-black uppercase tracking-wider rounded-full border border-accent/30">
                Advanced
              </span>
            )}
          </NavLink>

          <NavLink to="/settings" className={linkClass}>
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>

          <NavLink to="/plans" className={linkClass}>
            <CreditCard className="w-5 h-5" />
            <span>Plans</span>
          </NavLink>

          <Link to="/" className="relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-bold uppercase tracking-tighter italic text-sm text-muted hover:text-white hover:bg-white/5 mt-2 border-t border-white/5 pt-4">
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </nav>

        {/* Gamification Stats */}
        <div className="mt-2 mb-2 p-3 bg-white/5 rounded-2xl border border-white/5 relative group cursor-pointer hover:border-accent/20 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-4 h-4 text-accent shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
            <span className="text-[10px] font-black text-muted uppercase tracking-widest">AI Sync</span>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-black text-white italic tracking-tighter">{neuralXP || 0}<span className="text-[10px] text-muted ml-1">XP</span></p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(neuralXP % 1000) / 10}%` }}
                className="h-full bg-accent"
              />
            </div>
          </div>
          <p className="text-[8px] font-black text-muted uppercase mt-3 tracking-widest">Level {(Math.floor(neuralXP / 1000) || 0) + 1} Unlocked</p>
        </div>

        {/* Bottom */}
        <div className="pt-3 space-y-2 border-t border-white/5">
          <ThemeSwitcher />

          <div className="px-6 py-2 bg-accent/5 rounded-2xl text-center border border-accent/10">
            <p className="text-[8px] uppercase tracking-widest text-[#a1a1aa] font-black mb-1">
              Access Tier
            </p>
            <p className="text-xs font-black text-accent uppercase tracking-tighter">
              {userProfile?.subscriptionTier || "Generic"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
