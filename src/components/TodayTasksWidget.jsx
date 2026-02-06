import { motion } from "framer-motion";
import { Dumbbell, Utensils, Droplets, ChevronRight, Circle, Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function TodayTasksWidget({ todayTasks, onQuickComplete }) {
    if (!todayTasks) {
        return (
            <div className="card-premium p-5 rounded-xl border border-white/5">
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-3">
                    Today's Tasks
                </h3>
                <p className="text-xs text-muted font-bold uppercase tracking-tight">
                    No active plan.
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
        <div className="card-premium p-4 rounded-xl border border-white/5 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Dumbbell className="w-32 h-32 text-accent" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase italic tracking-tight">
                            Daily Missions
                        </h3>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5">
                            {dayOfWeek}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-white italic tracking-tighter leading-none">{completionPercentage}%</p>
                        <p className="text-[8px] text-muted font-black uppercase tracking-widest mt-0.5">Sync</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        className="h-full bg-accent"
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Quick tasks */}
                <div className="space-y-1.5 mb-3">
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
                    className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 transition-all group/link"
                >
                    <span className="text-[10px] font-black text-white uppercase italic tracking-widest px-1">
                        Full Trajectory
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted group-hover/link:text-accent group-hover/link:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}

function QuickTask({ icon, title, subtitle, info, completed, onToggle, color = "accent" }) {
    const colorClasses = {
        "accent": {
            border: "hover:border-accent/30",
            bg: "bg-accent/10",
            borderColor: "border-accent/20",
            text: "text-accent",
            circle: "group-hover/task:text-accent"
        },
        "blue-400": {
            border: "hover:border-blue-400/30",
            bg: "bg-blue-400/10",
            borderColor: "border-blue-400/20",
            text: "text-blue-400",
            circle: "group-hover/task:text-blue-400"
        },
        "cyan-400": {
            border: "hover:border-cyan-400/30",
            bg: "bg-cyan-400/10",
            borderColor: "border-cyan-400/20",
            text: "text-cyan-400",
            circle: "group-hover/task:text-cyan-400"
        }
    };

    const colors = colorClasses[color] || colorClasses.accent;

    return (
        <button
            onClick={onToggle}
            className={`w-full p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 ${colors.border} transition-all flex items-center gap-2.5 group/task text-left relative overflow-hidden`}
        >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${colors.bg} border ${colors.borderColor} flex items-center justify-center ${colors.text} group-hover/task:scale-105 transition-transform shrink-0`}>
                {completed ? <Check className="w-4 h-4" /> : icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-black text-white uppercase italic tracking-tight ${completed ? 'line-through opacity-50' : ''} truncate`}>
                    {title}
                </p>
                <p className="text-[7px] text-muted font-black uppercase tracking-widest truncate">
                    {subtitle}
                </p>
                {info && (
                    <p className={`text-[8px] text-accent/80 font-black uppercase italic tracking-widest mt-0.5 truncate`}>
                        {info}
                    </p>
                )}
            </div>
            {!completed && (
                <Circle className={`w-4 h-4 text-muted/30 ${colors.circle} transition-colors shrink-0`} />
            )}
        </button>
    );
}
