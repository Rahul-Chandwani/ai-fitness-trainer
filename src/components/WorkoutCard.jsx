import { Timer, Layers, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkoutCard({ workout, onView }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-premium p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 relative overflow-hidden group h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Activity className="w-24 h-24 text-accent" />
      </div>

      <div className="relative z-10 flex-grow">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20 mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
          <p className="text-[8px] font-black text-accent uppercase tracking-widest">Active Protocol</p>
        </div>

        <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter group-hover:text-accent transition-colors leading-tight">
          {workout.name}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-accent/10 transition-colors">
            <div className="flex items-center gap-2 text-[8px] font-black text-muted uppercase tracking-widest mb-1">
              <Timer className="w-3 h-3 text-accent" />
              <span>Duration</span>
            </div>
            <p className="text-sm font-black text-white italic tracking-tight">{workout.duration}</p>
          </div>

          <div className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-accent/10 transition-colors">
            <div className="flex items-center gap-2 text-[8px] font-black text-muted uppercase tracking-widest mb-1">
              <Layers className="w-3 h-3 text-accent" />
              <span>Architecture</span>
            </div>
            <p className="text-sm font-black text-white italic tracking-tight">
              {Array.isArray(workout.exercises) ? workout.exercises.length : workout.exercises} EX
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onView(workout)}
        className="relative z-10 w-full bg-white text-black font-black py-4 rounded-3xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/5 group/btn hover:bg-accent"
      >
        ANALYZE PROTOCOL
        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
      </button>
    </motion.div>
  );
}
