import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function PlanCard({
  title,
  price,
  features,
  active,
  highlight,
  onSelect,
  description,
  icon
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass p-6 rounded-xl border border-white/5 transition-all duration-300 relative overflow-hidden group flex flex-col
        ${highlight ? "border-accent/40 shadow-lg shadow-accent/5" : "border-white/5"}
        ${active ? "border-accent shadow-accent/10" : "hover:border-white/10"}`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${active ? 'bg-accent/20 border-accent/20' : 'bg-white/5 border-white/10 group-hover:bg-accent/10'}`}>
          <div className={active ? 'text-accent' : 'text-muted group-hover:text-accent'}>
            {icon ? React.cloneElement(icon, { size: 20 }) : null}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-black text-white uppercase italic tracking-tighter">{title}</h3>
          <p className="text-[7px] font-black text-accent uppercase tracking-[0.3em]">Tier: {active ? 'AUTHORIZED' : 'LOCKED'}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-2xl font-black text-white italic tracking-tighter mb-1">{price}</p>
        <p className="text-[9px] text-muted font-bold uppercase tracking-tight leading-relaxed">{description}</p>
      </div>

      <ul className="space-y-2.5 mb-6 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 group/item">
            <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${active ? 'text-accent' : 'text-muted group-hover/item:text-accent'}`} />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight leading-tight group-hover/item:text-white transition-colors">{f}</span>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="w-full py-2.5 text-center bg-accent/10 border border-accent/20 text-accent rounded-lg font-black uppercase tracking-widest text-[9px] italic">
          ACTIVE
        </div>
      ) : (
        <button
          onClick={onSelect}
          className="w-full bg-white text-black py-2.5 rounded-lg font-black uppercase tracking-widest hover:bg-accent transition-all text-[9px] italic shadow-sm"
        >
          SELECT TIER
        </button>
      )}
    </motion.div>
  );
}
