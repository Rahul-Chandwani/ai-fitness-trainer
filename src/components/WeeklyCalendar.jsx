import { motion } from "framer-motion";
import { Check, Circle, Dumbbell, Moon } from "lucide-react";

export default function WeeklyCalendar({ weekData, onDayClick, currentDay }) {
    if (!weekData || !weekData.days) return null;

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {daysOfWeek.map((dayName, index) => {
                const dayData = weekData.days.find(d => d.dayOfWeek === dayName) || {};
                const isToday = currentDay === dayName;
                const isRestDay = dayData.type === "rest";
                const isCompleted = dayData.workoutCompleted && dayData.meals?.every(m => m.completed);

                // Calculate completion percentage
                const totalTasks = isRestDay ? 2 : (1 + (dayData.meals?.length || 0) + 2);
                const completedTasks = [
                    dayData.workoutCompleted,
                    ...(dayData.meals?.map(m => m.completed) || []),
                    dayData.hydrationCompleted,
                    dayData.sleepCompleted
                ].filter(Boolean).length;
                const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

                return (
                    <motion.button
                        key={dayName}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onDayClick(dayData)}
                        className={`p-3.5 rounded-xl border transition-all group relative overflow-hidden ${isToday
                            ? 'bg-accent/10 border-accent/40 shadow-lg shadow-accent/10'
                            : isCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-white/5 border-white/5 hover:border-accent/20'
                            }`}
                    >
                        {/* Background icon */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            {isRestDay ? (
                                <Moon className="w-16 h-16 text-blue-400" />
                            ) : (
                                <Dumbbell className="w-16 h-16 text-accent" />
                            )}
                        </div>

                        <div className="relative z-10 text-left">
                            {/* Day name */}
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[10px] font-black text-white uppercase italic tracking-tight">
                                    {dayName.substring(0, 3)}
                                </h4>
                                {isCompleted && (
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5 text-black" />
                                    </div>
                                )}
                                {!isCompleted && !isToday && (
                                    <Circle className="w-5 h-5 text-muted" />
                                )}
                                {isToday && !isCompleted && (
                                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                                )}
                            </div>

                            {/* Workout name or rest */}
                            {isRestDay ? (
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1.5 opacity-80">
                                    Rest Cycle
                                </p>
                            ) : (
                                <p className="text-[9px] font-black text-white uppercase tracking-tight mb-1.5 line-clamp-1 opacity-90 italic">
                                    {dayData.workout?.name || "Ready"}
                                </p>
                            )}

                            {/* Progress bar */}
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-1.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    className={`h-full ${isCompleted
                                        ? 'bg-emerald-500'
                                        : 'bg-gradient-to-r from-accent to-emerald-400'
                                        }`}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                />
                            </div>

                            {/* Completion percentage */}
                            <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em]">
                                {completionPercentage}%
                            </p>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
