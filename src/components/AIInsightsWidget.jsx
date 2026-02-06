import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";

export default function AIInsightsWidget({ insights, loading = false }) {
    if (loading) {
        return (
            <div className="card-premium p-5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20">
                        <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase italic tracking-tight">AI Insights</h3>
                </div>
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (!insights || insights.length === 0) {
        return null;
    }

    const getIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-emerald-400" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-amber-400" />;
            case "alert":
                return <TrendingDown className="w-5 h-5 text-red-400" />;
            default:
                return <TrendingUp className="w-5 h-5 text-accent" />;
        }
    };

    const getColors = (type) => {
        switch (type) {
            case "success":
                return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
            case "warning":
                return "bg-amber-500/10 border-amber-500/30 text-amber-400";
            case "alert":
                return "bg-red-500/10 border-red-500/30 text-red-400";
            default:
                return "bg-accent/10 border-accent/30 text-accent";
        }
    };

    return (
        <div className="card-premium p-4 rounded-xl border border-white/5 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32 text-accent" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/10">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight">AI Insights</h3>
                </div>

                {/* Insights */}
                <div className="space-y-2">
                    {insights.slice(0, 3).map((insight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-2.5 rounded-xl border ${getColors(insight.type)} transition-all`}
                        >
                            <div className="flex items-start gap-2.5">
                                <div className="flex-shrink-0 mt-0.5 scale-[0.65]">
                                    {getIcon(insight.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest mb-0.5">
                                        {insight.title}
                                    </h4>
                                    <p className="text-[8px] text-muted font-black uppercase tracking-tight leading-normal opacity-80">
                                        {insight.message}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
