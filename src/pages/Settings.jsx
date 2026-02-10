import DashboardLayout from "../layouts/DashboardLayout";
import { useFitness } from "../context/FitnessContext";
import { useState, useEffect } from "react";
import { User, RotateCcw, Save, Shield, Fingerprint, ChevronLeft, Sparkles, Key, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";
import { AI_PROVIDERS, getAIPreference, setAIPreference } from "../services/ai";

export default function Settings() {
    const { userProfile, updateUserProfile, resetData } = useFitness();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        goal: userProfile?.goal || "",
        targetCalories: userProfile?.targetCalories || 2000,
    });
    const [aiSettings, setAiSettings] = useState({
        provider: AI_PROVIDERS.POLLINATIONS,
        geminiKey: ""
    });
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const pref = getAIPreference();
        setAiSettings(pref);
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            // Save core profile
            await updateUserProfile(formData);

            // Save AI preferences
            setAIPreference(aiSettings.provider, aiSettings.geminiKey);

            addToast("Settings Saved", "success");
        } catch (err) {
            addToast("Failed to save settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await resetData();
            addToast("All data cleared", "info");
        } catch (err) {
            addToast("Clear failed", "error");
        }
    };

    return (
        <DashboardLayout>
            <PageTransition>
                <div className="max-w-5xl mx-auto pb-20 space-y-10">
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-[0.65rem] font-black text-muted hover:text-accent transition-colors group uppercase tracking-[0.2em] opacity-60">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Hub
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-accent rounded-full"></div>
                        <div>
                            <h1 className="text-3xl font-black text-text tracking-tighter uppercase italic leading-none">Settings</h1>
                            <p className="text-[0.6rem] text-accent font-black uppercase tracking-[0.4em] mt-1.5 opacity-80">PREFERENCES</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Biometric Configuration */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-premium p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border bg-card/40 relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                                    <Fingerprint className="w-64 h-64 text-accent" />
                                </div>

                                <div className="flex items-center gap-4 mb-10 relative z-10">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/5">
                                        <User className="w-6 h-6 text-accent" />
                                    </div>
                                    <h2 className="text-2xl font-black text-text uppercase italic tracking-tighter">Profile Info</h2>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] uppercase font-black text-muted tracking-[0.2em] px-2 opacity-60">Your Name</label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-6 rounded-3xl bg-card/60 border border-border focus:border-accent/40 focus:bg-card/80 outline-none transition-all text-text font-black uppercase text-sm tracking-tight shadow-inner placeholder:opacity-20"
                                            placeholder="OPERATOR NAME"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] uppercase font-black text-muted tracking-[0.2em] px-2 opacity-60">Main Fitness Goal</label>
                                        <input
                                            value={formData.goal}
                                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                            className="w-full p-6 rounded-3xl bg-card/60 border border-border focus:border-accent/40 focus:bg-card/80 outline-none transition-all text-text font-black uppercase text-sm tracking-tight shadow-inner placeholder:opacity-20"
                                            placeholder="CONDITIONING / HYPERTROPHY"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] uppercase font-black text-muted tracking-[0.2em] px-2 opacity-60">Daily Calorie Target</label>
                                        <input
                                            value={formData.targetCalories || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({ ...formData, targetCalories: val === "" ? "" : parseInt(val) });
                                            }}
                                            type="number"
                                            className="w-full p-6 rounded-3xl bg-card/60 border border-border focus:border-accent/40 focus:bg-card/80 outline-none transition-all text-text font-black tabular-nums text-sm tracking-tight shadow-inner placeholder:opacity-20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* AI Protocol Configuration */}
                            <div className="card-premium p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-border bg-card/40 relative overflow-hidden group shadow-xl">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:-rotate-12 transition-transform duration-1000">
                                    <Sparkles className="w-64 h-64 text-accent" />
                                </div>

                                <div className="flex items-center gap-4 mb-10 relative z-10">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/5">
                                        <Globe className="w-6 h-6 text-accent" />
                                    </div>
                                    <h2 className="text-2xl font-black text-text uppercase italic tracking-tighter">AI Settings</h2>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[0.65rem] uppercase font-black text-muted tracking-[0.2em] px-2 opacity-60">AI Service</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {Object.values(AI_PROVIDERS).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setAiSettings({ ...aiSettings, provider: p })}
                                                    className={`p-4 rounded-2xl border font-black uppercase text-[0.65rem] tracking-widest transition-all ${aiSettings.provider === p
                                                        ? "bg-accent border-accent text-bg shadow-lg shadow-accent/20"
                                                        : "bg-card/60 border-border text-muted hover:border-accent/40"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[0.6rem] text-muted font-black uppercase tracking-wider opacity-60 px-2 mt-2">
                                            {aiSettings.provider === 'pollinations' && "FREE & UNLIMITED. No API key required. Stable performance."}
                                            {aiSettings.provider === 'gemini' && "HIGH PERFORMANCE. Best for complex training plans. Requires Google AI Key."}
                                            {aiSettings.provider === 'puter' && "BROWSER NATIVE. Stable access using Puter.js infrastructure."}
                                        </p>
                                    </div>

                                    {aiSettings.provider === AI_PROVIDERS.GEMINI && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="flex items-center justify-between px-2">
                                                <label className="text-[0.65rem] uppercase font-black text-muted tracking-[0.2em] opacity-60">API Key</label>
                                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[0.6rem] font-black text-accent hover:underline uppercase tracking-widest">Get Key</a>
                                            </div>
                                            <div className="relative">
                                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-30" />
                                                <input
                                                    type="password"
                                                    value={aiSettings.geminiKey}
                                                    onChange={(e) => setAiSettings({ ...aiSettings, geminiKey: e.target.value })}
                                                    className="w-full p-6 pl-14 rounded-3xl bg-card/60 border border-border focus:border-accent/40 focus:bg-card/80 outline-none transition-all text-text font-black text-sm tracking-tight shadow-inner placeholder:opacity-20"
                                                    placeholder="AIzaSy..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-6 bg-text text-bg font-black uppercase tracking-widest rounded-[2rem] flex items-center justify-center gap-3 shadow-2xl hover:bg-accent hover:text-bg transition-all active:scale-95 italic border border-white/5"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "SAVING..." : "SAVE SETTINGS"}
                            </button>
                        </div>

                        {/* System Status */}
                        <div className="space-y-8">
                            <div className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/10 shadow-sm">
                                        <Shield className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <h2 className="text-2xl font-black text-text uppercase italic tracking-tighter leading-none">Clearance</h2>
                                </div>

                                <div className="p-8 bg-card/60 rounded-3xl border border-border mb-8 shadow-inner">
                                    <p className="text-[0.65rem] uppercase font-black text-muted tracking-[0.3em] mb-2 opacity-60">PROTOCOL TIER</p>
                                    <p className="text-3xl font-black text-accent uppercase italic tracking-tighter">{userProfile?.subscriptionTier || "Standby"}</p>
                                </div>

                                <hr className="mb-8 border-white/5" />

                                <div className="space-y-4">
                                    <p className="text-[0.65rem] font-black text-muted uppercase tracking-[0.3em] px-2 opacity-60">System Maintenance</p>
                                    <button
                                        onClick={() => setConfirmOpen(true)}
                                        className="w-full flex items-center justify-between p-6 rounded-3xl border border-red-500/10 text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-[0.2em] text-xs group italic shadow-sm"
                                    >
                                        <span>Clear All Data</span>
                                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 bg-card/40 border border-border rounded-[2.5rem] opacity-60 shadow-inner">
                                <p className="text-[0.6rem] font-black text-muted uppercase tracking-[0.3em] leading-relaxed">
                                    Operational Security: AES-256 Symmetric Encryption Active. All biometric data points are localized.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleReset}
                    title="Clear Data"
                    message="You are about to delete all your data. This includes workout history and nutrition logs."
                />
            </PageTransition>
        </DashboardLayout>
    );
}

