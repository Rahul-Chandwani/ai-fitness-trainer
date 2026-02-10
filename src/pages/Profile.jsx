import DashboardLayout from "../layouts/DashboardLayout";
import { useFitness } from "../context/FitnessContext";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, Target, Award, Dumbbell, Utensils, Activity as ActivityIcon, Zap, Trophy, TrendingUp, ChevronLeft } from "lucide-react";
import PageTransition from "../components/PageTransition";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Profile() {
    const { userProfile, calorieHistory, workoutRoutine, neuralXP } = useFitness();
    const { user } = useAuth();

    const totalMeals = calorieHistory?.length || 0;
    const joinedDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : "Recently";

    const level = Math.floor((neuralXP || 0) / 1000) + 1;
    const progress = ((neuralXP || 0) % 1000) / 10;

    return (
        <DashboardLayout>
            <PageTransition>
                <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 pb-20 relative px-4 md:px-6">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-[0.6rem] font-black text-muted hover:text-accent transition-colors group uppercase tracking-[0.3em] opacity-60">
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                        BACK TO DASHBOARD
                    </Link>

                    {/* Hero / Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden card-premium p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] group bg-card/40 border border-border shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 scale-100 md:scale-125 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none">
                            <User className="w-24 h-24 md:w-56 md:h-56 text-accent" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left w-full">
                            <div className="relative flex-shrink-0">
                                <div className="w-20 h-20 md:w-28 md:h-28 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 shadow-2xl shadow-accent/5 overflow-hidden">
                                    <User className="w-10 h-10 md:w-14 md:h-14 text-accent" />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 bg-text text-bg p-1.5 md:p-2.5 rounded-lg shadow-xl border border-border">
                                    <Trophy className="w-3.5 h-3.5" />
                                </div>
                            </div>

                            <div className="space-y-2 w-full min-w-0 flex-1">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 rounded-full border border-accent/20 mx-auto md:mx-0">
                                    <span className="w-1 h-1 bg-accent rounded-full animate-pulse"></span>
                                    <p className="text-[0.55rem] md:text-[0.6rem] font-black text-accent uppercase tracking-[0.3em]">ACTIVE USER</p>
                                </div>
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-text tracking-tighter italic leading-none truncate uppercase">
                                    {userProfile?.name || "FITNESS_USER"}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 md:gap-6 w-full">
                                    <div className="flex items-center gap-2 text-muted font-black text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.2em] min-w-0 max-w-full opacity-60">
                                        <Mail className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                                        <span className="truncate">{user?.email}</span>
                                    </div>
                                    <div className="h-3 w-[1px] bg-border hidden sm:block opacity-30"></div>
                                    <div className="flex items-center gap-2 text-muted font-black text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.2em] opacity-60">
                                        <Calendar className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                                        <span>JOINED {joinedDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:ml-auto w-full md:w-auto mt-4 md:mt-0 flex-shrink-0">
                                <Link
                                    to="/settings"
                                    className="px-6 py-3 md:px-8 md:py-3.5 bg-text text-bg rounded-[1rem] shadow-xl hover:bg-accent hover:text-bg transition-all text-[0.6rem] md:text-[0.65rem] block text-center font-black uppercase tracking-[0.2em] italic active:scale-95"
                                >
                                    SETTINGS
                                </Link>
                            </div>
                        </div>

                        {/* XP Progress Bar Overlay in Hero */}
                        <div className="mt-6 md:mt-12 pt-4 md:pt-10 border-t border-white/5 relative z-10 w-full">
                            <div className="flex justify-between items-end mb-2 md:mb-3">
                                <div>
                                    <p className="text-[0.55rem] md:text-[0.6rem] font-black text-muted uppercase tracking-[0.3em] mb-1.5 opacity-60">LEVEL_SYSTEM</p>
                                    <p className="text-xl md:text-3xl font-black text-text italic tracking-tighter leading-none uppercase">LEVEL_{level}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[0.55rem] md:text-[0.6rem] font-black text-muted uppercase tracking-[0.3em] mb-1.5 opacity-60">XP POINTS</p>
                                    <p className="text-xl md:text-3xl font-black text-accent italic tracking-tighter leading-none">{neuralXP || 0} <span className="text-[0.55rem] text-muted/40 not-italic tracking-[0.2em]">PTS</span></p>
                                </div>
                            </div>
                            <div className="h-2 md:h-3 bg-card/60 rounded-full w-full overflow-hidden border border-border p-0.5 shadow-inner relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-accent via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] relative z-10"
                                />
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                        {/* Strategy Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card/40 p-5 md:p-8 rounded-[1.2rem] md:rounded-[2rem] border border-border hover:border-accent/40 transition-all group shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6 md:mb-10">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all shadow-sm">
                                    <Target className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-[0.55rem] md:text-[0.6rem] font-black text-text uppercase italic tracking-[0.3em] opacity-80">CURRENT GOAL</h3>
                            </div>
                            <p className="text-2xl lg:text-3xl font-black text-text mb-3 uppercase italic tracking-tighter leading-none line-clamp-1">
                                {userProfile?.goal || "EVOLUTION"}
                            </p>
                            <p className="text-[0.55rem] md:text-[0.6rem] text-accent font-black uppercase tracking-[0.3em] opacity-60">PERSONAL GOAL</p>
                        </motion.div>

                        {/* Performance Stats */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="card-premium p-5 md:p-8 rounded-[1.2rem] md:rounded-[2rem] border border-border hover:border-accent/40 transition-all group shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6 md:mb-10">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all shadow-sm">
                                    <Zap className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-[0.55rem] md:text-[0.6rem] font-black text-text uppercase italic tracking-[0.3em] opacity-80">ACCOUNT TYPE</h3>
                            </div>
                            <p className="text-2xl lg:text-3xl font-black text-accent mb-3 uppercase italic tracking-tighter leading-none line-clamp-1">
                                {userProfile?.subscriptionTier || "ACTIVE"}
                            </p>
                            <p className="text-[0.55rem] md:text-[0.6rem] text-muted font-black uppercase tracking-[0.3em] opacity-60">SYNC LEVEL</p>
                        </motion.div>

                        {/* Activity Hub */}
                        <motion.div
                            whileHover={{ y: -8 }}
                            className="bg-card/40 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-border hover:border-accent/40 transition-all group shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6 md:mb-10">
                                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all shadow-sm">
                                    <ActivityIcon className="w-5 h-5 text-accent" />
                                </div>
                                <h3 className="text-[0.55rem] md:text-[0.6rem] font-black text-text uppercase italic tracking-[0.3em] opacity-80">YOUR ACTIVITY</h3>
                            </div>
                            <div className="flex items-center gap-5 md:gap-8">
                                <div>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-black text-text tabular-nums italic tracking-tighter leading-none">{totalMeals}</p>
                                    <p className="text-[0.5rem] md:text-[0.55rem] text-accent font-black uppercase tracking-[0.3em] mt-2 border-l-2 border-accent pl-2 opacity-80">MEALS</p>
                                </div>
                                <div className="h-10 md:h-12 w-[1.5px] bg-border opacity-30"></div>
                                <div>
                                    <p className="text-3xl md:text-4xl lg:text-5xl font-black text-text tabular-nums italic tracking-tighter leading-none">
                                        {workoutRoutine ? "1" : "0"}
                                    </p>
                                    <p className="text-[0.5rem] md:text-[0.55rem] text-accent font-black uppercase tracking-[0.3em] mt-2 border-l-2 border-accent pl-2 opacity-80">SESSIONS</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Detailed Biometrics Table / Stats */}
                    <div className="card-premium p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-border bg-card/40 space-y-6 md:space-y-10 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 md:p-10 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                            <TrendingUp className="w-40 h-40 md:w-56 md:h-56 text-accent" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 text-center md:text-left">
                            <div>
                                <h2 className="text-2xl md:text-4xl font-black text-text uppercase tracking-tighter italic leading-none">BODY STATS</h2>
                                <p className="text-[0.55rem] md:text-[0.6rem] text-accent font-black uppercase tracking-[0.4em] mt-2 opacity-80">BIOMETRICS</p>
                            </div>
                            <div className="px-5 py-2.5 bg-accent/10 rounded-xl border border-accent/20 shadow-xl shadow-accent/5 self-center md:self-auto">
                                <p className="text-[0.55rem] md:text-[0.6rem] font-black text-accent uppercase tracking-[0.5em]">SYNC_ACTIVE</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 relative z-10">
                            <BiometricItem
                                icon={<Utensils className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />}
                                label="Calorie Target"
                                value={`${userProfile?.targetCalories || 2000}`}
                                unit="KCAL"
                                color="emerald"
                            />
                            <BiometricItem
                                icon={<Dumbbell className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />}
                                label="Workout Plan"
                                value={workoutRoutine ? "ACTIVE" : "INACTIVE"}
                                unit=""
                                color="blue"
                            />
                            <BiometricItem
                                icon={<TrendingUp className="text-amber-500 w-5 h-5 md:w-6 md:h-6" />}
                                label="Tracking"
                                value="ON"
                                unit=""
                                color="amber"
                            />
                        </div>
                    </div>
                </div>
            </PageTransition>
        </DashboardLayout>
    );
}

function BiometricItem({ icon, label, value, unit, color }) {
    const colorMap = {
        emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        amber: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
        accent: 'bg-accent/10 border-accent/20 text-accent',
    };

    return (
        <div className="flex items-center gap-3 md:gap-6 p-4 md:p-6 bg-card/60 rounded-[1.2rem] md:rounded-[2rem] border border-border group hover:border-accent/40 transition-all hover:bg-card/80 shadow-xl overflow-hidden relative">
            <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[0.8rem] md:rounded-[1.2rem] flex items-center justify-center p-2.5 md:p-4 border transition-all group-hover:scale-110 group-hover:rotate-6 shadow-xl ${colorMap[color] || colorMap.accent}`}>
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[0.55rem] md:text-[0.6rem] text-accent font-black uppercase tracking-[0.25em] mb-1 opacity-80">{label}</p>
                <div className="flex items-baseline gap-1.5 md:gap-2">
                    <p className="text-lg md:text-2xl font-black text-text italic tracking-tighter uppercase truncate leading-none">{value}</p>
                    {unit && <span className="text-[0.55rem] md:text-[0.6rem] text-muted font-black uppercase tracking-[0.15em] opacity-40 italic">{unit}</span>}
                </div>
            </div>
        </div>
    );
}
