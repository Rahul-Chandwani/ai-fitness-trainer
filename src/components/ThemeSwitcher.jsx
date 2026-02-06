import { useTheme } from "../context/ThemeContext";
import { Palette } from "lucide-react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-2 px-1">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-3.5 h-3.5 text-muted" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Aesthetic Engine</p>
      </div>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="w-full p-3 rounded-xl bg-card border border-white/10 text-xs font-bold text-text outline-none focus:border-accent/30 transition-all cursor-pointer"
      >
        <option value="dark">Dark Fitness</option>
        <option value="amoled">AMOLED Black</option>
        <option value="light">Light Clean</option>
        <option value="gradient">Gradient Fluid</option>
      </select>
    </div>
  );
}

