import { motion } from "framer-motion";
import { Dumbbell, Utensils, Droplets, ChevronRight, Circle, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function TodayTasksWidget({ todayTasks, onQuickComplete }) {
    if (!todayTasks) {
        return (
            <div className="card-premium p-8 rounded-[2.5rem] border border-white/5">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-4">
                    Today's Tasks
                </h3>
                <p className="text-sm text-muted font-bold uppercase tracking-tight">
                    No training plan active. Generate one to get started!
                </p>
            </div>
        );
    }

    const { dayOfWeek, workout, meals = [], hydration, workoutCompleted, hydrationCompleted } = todayTasks;
    const isRestDay = todayTasks.type === "rest";

    // Calculate completion
    const totalTasks = isRestDay ? 1 : (1 + meals.length + 1);
    const completedTasks = [
        workoutCompleted,
        ...meals.map(m => m.completed),
        hydrationCompleted
    ].filter(Boolean).length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="card-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Dumbbell className="w-32 h-32 text-accent" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                            Today's Tasks
                        </h3>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1">
                            {dayOfWeek}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-white italic tracking-tighter">{completionPercentage}%</p>
                        <p className="text-[8px] text-muted font-black uppercase tracking-widest">Complete</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        className="h-full bg-gradient-to-r from-accent to-emerald-400"
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Quick tasks */}
                <div className="space-y-3 mb-6">
                    {/* Workout */}
                    {!isRestDay && workout && (
                        <QuickTask
                            icon={<Dumbbell className="w-4 h-4" />}
                            title={workout.name}
                            subtitle={`${workout.exercises?.length || 0} exercises`}
                            completed={workoutCompleted}
                            onToggle={() => onQuickComplete('workout')}
                            color="accent"
                        />
                    )}

                    {/* Meals summary */}
                    {meals.length > 0 && (
                        <QuickTask
                            icon={<Utensils className="w-4 h-4" />}
                            title="Meal Plan"
                            subtitle={`${meals.filter(m => m.completed).length}/${meals.length} meals logged`}
                            info={meals.slice(0, 2).map(m => m.name).join(", ") + (meals.length > 2 ? "..." : "")}
                            completed={meals.every(m => m.completed)}
                            onToggle={() => onQuickComplete('meals')}
                            color="blue-400"
                        />
                    )}

                    {/* Hydration */}
                    <QuickTask
                        icon={<Droplets className="w-4 h-4" />}
                        title="Hydration"
                        subtitle={`${hydration || 3000}ml target`}
                        completed={hydrationCompleted}
                        onToggle={() => onQuickComplete('hydration')}
                        color="cyan-400"
                    />
                </div>

                {/* View full plan link */}
                <Link
                    to="/training-plan"
                    className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-accent/30 transition-all group/link"
                >
                    <span className="text-sm font-black text-white uppercase italic tracking-tight">
                        View Full Plan
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted group-hover/link:text-accent group-hover/link:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}

function QuickTask({ icon, title, subtitle, info, completed, onToggle, color = "accent" }) {
    return (
        <button
            onClick={onToggle}
            className={`w-full p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-${color}/30 transition-all flex items-center gap-3 group/task text-left`}
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color} group-hover/task:scale-110 transition-transform`}>
                {completed ? <Check className="w-5 h-5" /> : icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-black text-white uppercase italic tracking-tight ${completed ? 'line-through opacity-50' : ''}`}>
                    {title}
                </p>
                <p className="text-[9px] text-muted font-bold uppercase tracking-tight truncate">
                    {subtitle}
                </p>
                {info && (
                    <p className={`text-[8px] text-accent/80 font-bold uppercase italic tracking-tight mt-0.5 truncate`}>
                        {info}
                    </p>
                )}
            </div>
            {!completed && (
                <Circle className={`w-5 h-5 text-muted group-hover/task:text-${color} transition-colors`} />
            )}
        </button>
    );
}
