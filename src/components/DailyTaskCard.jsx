import { motion } from "framer-motion";
import { Check, Circle, Dumbbell, Utensils, Droplets, Moon } from "lucide-react";

export default function DailyTaskCard({ day, onTaskComplete, onViewWorkout, isToday = false }) {
    if (!day) return null;

    const { dayOfWeek, type, workout, meals = [], hydration, sleepTarget, workoutCompleted, hydrationCompleted, sleepCompleted } = day;

    const isRestDay = type === "rest";

    // Calculate completion percentage
    const totalTasks = isRestDay ? 2 : (1 + meals.length + 2); // workout + meals + hydration + sleep
    const completedTasks = [
        workoutCompleted,
        ...meals.map(m => m.completed),
        hydrationCompleted,
        sleepCompleted
    ].filter(Boolean).length;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`card-premium p-4 rounded-xl border ${isToday ? 'border-accent/40 shadow-sm shadow-accent/5' : 'border-white/5'} relative overflow-hidden group h-full flex flex-col`}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Dumbbell className="w-32 h-32 text-accent" />
            </div>

            {/* Header */}
            <div className="relative z-10 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">
                            {dayOfWeek}
                        </h3>
                        {isToday && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-accent/20 text-accent text-[9px] font-black uppercase tracking-widest rounded-lg border border-accent/30">
                                Today
                            </span>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-black text-white italic tracking-tighter leading-none">{completionPercentage}%</p>
                        <p className="text-[9px] text-muted font-black uppercase tracking-widest leading-none mt-1">Status</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        className="h-full bg-gradient-to-r from-accent to-emerald-400"
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3 relative z-10">
                {/* Workout */}
                {!isRestDay && workout && (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <button
                                onClick={() => onViewWorkout && onViewWorkout(workout)}
                                className="flex-1 p-2.5 bg-accent/10 hover:bg-accent/20 rounded-xl border border-accent/20 transition-all flex items-center gap-3 group/btn text-left"
                            >
                                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-black shadow-lg shadow-accent/10 transition-transform">
                                    <Dumbbell className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-accent transition-colors leading-tight line-clamp-1">
                                        {workout.name}
                                    </h3>
                                    <p className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5">
                                        {workout.duration} • {workout.exercises?.length || 0} EX
                                    </p>
                                </div>
                                <div className="px-3 py-1.5 bg-white text-zinc-950 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    SYNC
                                </div>
                            </button>
                        </div>

                        {/* Detailed Exercise List */}
                        {workout.exercises && workout.exercises.length > 0 && (
                            <div className="pl-4 space-y-2">
                                <p className="text-[9px] text-muted font-black uppercase tracking-widest ml-1 mb-1 opacity-50">Exercises</p>
                                {workout.exercises.map((ex, exIdx) => (
                                    <div key={exIdx} className="flex items-center gap-2.5 group/ex">
                                        <button
                                            onClick={() => onTaskComplete(dayOfWeek, 'exercise', exIdx)}
                                            className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${ex.completed
                                                ? 'bg-accent border-accent text-zinc-950'
                                                : 'bg-white/5 border-white/10 hover:border-accent/50 text-transparent'
                                                }`}
                                        >
                                            <Check className="w-3 h-3" />
                                        </button>
                                        <div className={`flex-1 p-2 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center ${ex.completed ? 'opacity-50' : ''}`}>
                                            <span className={`text-[11px] font-bold text-white ${ex.completed ? 'line-through' : ''}`}>{ex.name}</span>
                                            <span className="font-mono text-[9px] text-accent/80 font-bold">{ex.sets}x{ex.reps}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {isRestDay && (
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                        <Moon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <p className="text-xs font-black text-white uppercase italic tracking-tight">Recovery Alpha</p>
                        <p className="text-[9px] text-muted font-bold uppercase tracking-tight mt-0.5">Focus on systemic repair</p>
                    </div>
                )}

                {/* Meals */}
                {meals.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-[9px] text-muted font-black uppercase tracking-widest mb-2">Nutrition</p>
                        {meals.map((meal, idx) => (
                            <TaskItem
                                key={idx}
                                icon={<Utensils className="w-3.5 h-3.5" />}
                                title={meal.name}
                                label={meal.type ? meal.type.toUpperCase() : null}
                                subtitle={`${meal.calories} kcal • P:${meal.protein}g C:${meal.carbs}g F:${meal.fats}g`}
                                info={meal.food}
                                completed={meal.completed}
                                onToggle={() => onTaskComplete(dayOfWeek, 'meal', idx)}
                                accentColor="blue-400"
                                compact
                            />
                        ))}
                    </div>
                )}

                {/* Hydration & Sleep */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    <TaskItem
                        icon={<Droplets className="w-3.5 h-3.5" />}
                        title="Hydrate"
                        subtitle={`${hydration || 3000}ml`}
                        completed={hydrationCompleted}
                        onToggle={() => onTaskComplete(dayOfWeek, 'hydration')}
                        accentColor="cyan-400"
                        compact
                    />
                    <TaskItem
                        icon={<Moon className="w-3.5 h-3.5" />}
                        title="Sleep"
                        subtitle={`${sleepTarget || 8}hr`}
                        completed={sleepCompleted}
                        onToggle={() => onTaskComplete(dayOfWeek, 'sleep')}
                        accentColor="purple-400"
                        compact
                    />
                </div>
            </div>
        </motion.div>
    );
}

function TaskItem({ icon, title, subtitle, info, label, completed, onToggle, accentColor = "accent", compact = false }) {
    const colorClasses = {
        "accent": {
            bg: "bg-accent/10",
            border: "border-accent/20",
            text: "text-accent",
            label: "text-accent border-accent/20",
            circle: "group-hover/task:text-accent"
        },
        "blue-400": {
            bg: "bg-blue-400/10",
            border: "border-blue-400/20",
            text: "text-blue-400",
            label: "text-blue-400 border-blue-400/20",
            circle: "group-hover/task:text-blue-400"
        },
        "cyan-400": {
            bg: "bg-cyan-400/10",
            border: "border-cyan-400/20",
            text: "text-cyan-400",
            label: "text-cyan-400 border-cyan-400/20",
            circle: "group-hover/task:text-cyan-400"
        },
        "purple-400": {
            bg: "bg-purple-400/10",
            border: "border-purple-400/20",
            text: "text-purple-400",
            label: "text-purple-400 border-purple-400/20",
            circle: "group-hover/task:text-purple-400"
        }
    };

    const colors = colorClasses[accentColor] || colorClasses.accent;

    return (
        <button
            onClick={onToggle}
            className={`w-full ${compact ? 'p-2' : 'p-3'} bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all flex items-center gap-2.5 group/task text-left`}
        >
            <div className={`flex-shrink-0 ${compact ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} transition-transform`}>
                {completed ? <Check className={compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'} /> : icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    {label && (
                        <span className={`text-[8px] font-black ${colors.label} uppercase tracking-widest border px-1.5 rounded`}>
                            {label}
                        </span>
                    )}
                    <p className={`${compact ? 'text-[11px]' : 'text-xs'} font-black text-white uppercase italic tracking-tight truncate ${completed ? 'line-through opacity-50' : ''}`}>
                        {title}
                    </p>
                </div>
                {subtitle && (
                    <p className={`${compact ? 'text-[8px]' : 'text-[9px]'} text-muted font-bold uppercase tracking-tight truncate`}>
                        {subtitle}
                    </p>
                )}
                {info && (
                    <p className={`${compact ? 'text-[7px]' : 'text-[8px]'} text-accent/80 font-bold uppercase italic tracking-tight mt-0.5 line-clamp-1`}>
                        {info}
                    </p>
                )}
            </div>
            {!completed && (
                <Circle className={`w-4 h-4 text-muted/40 ${colors.circle} transition-colors`} />
            )}
        </button>
    );
}
