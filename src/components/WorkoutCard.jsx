import { Timer, Layers, ChevronRight, Activity, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkoutCard({ workout, onView, onRemove }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card-premium p-3 rounded-xl border border-white/5 relative overflow-hidden group h-full flex flex-col"
    >
      {/* Removal Button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 flex items-center justify-center transition-all active:scale-95 group/remove"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      )}
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Activity className="w-24 h-24 text-accent" />
      </div>

      <div className="relative z-10 flex-grow">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent/10 rounded-full border border-accent/20 mb-3">
          <span className="w-1 h-1 bg-accent rounded-full"></span>
          <p className="text-[7px] font-black text-accent uppercase tracking-widest">Protocol</p>
        </div>

        <h3 className="text-sm font-black text-white mb-3 uppercase italic tracking-tighter group-hover:text-accent transition-colors leading-tight line-clamp-1">
          {workout.name}
        </h3>

        <div className="grid grid-cols-2 gap-1.5 mb-3">
          <div className="flex flex-col gap-0.5 p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-accent/10 transition-colors">
            <div className="flex items-center gap-1 text-[6px] font-black text-muted uppercase tracking-widest mb-0.5">
              <Timer className="w-2.5 h-2.5 text-accent opacity-50" />
              <span>Time</span>
            </div>
            <p className="text-[10px] font-black text-white italic tracking-tight">{workout.duration}</p>
          </div>

          <div className="flex flex-col gap-0.5 p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-accent/10 transition-colors">
            <div className="flex items-center gap-1 text-[6px] font-black text-muted uppercase tracking-widest mb-0.5">
              <Layers className="w-2.5 h-2.5 text-accent opacity-50" />
              <span>Build</span>
            </div>
            <p className="text-[10px] font-black text-white italic tracking-tight">
              {Array.isArray(workout.exercises) ? workout.exercises.length : workout.exercises} EX
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(workout)}
        className="relative z-10 w-full bg-white text-black font-black py-2 rounded-lg text-[8px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md group/btn hover:bg-accent"
      >
        ANALYSIS
        <ChevronRight className="w-2.5 h-2.5 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  );
}
