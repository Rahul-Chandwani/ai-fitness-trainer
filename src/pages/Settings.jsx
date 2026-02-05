import DashboardLayout from "../layouts/DashboardLayout";
import { useFitness } from "../context/FitnessContext";
import { useState } from "react";
import { User, Target, Zap, RotateCcw, Save, Shield, Fingerprint, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import ConfirmModal from "../components/ConfirmModal";

export default function Settings() {
    const { userProfile, updateUserProfile, resetData } = useFitness();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        goal: userProfile?.goal || "",
        targetCalories: userProfile?.targetCalories || 2000,
    });
    const [loading, setLoading] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateUserProfile(formData);
            addToast("Settings saved", "success");
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
                    <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-accent rounded-full"></div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight">Settings</h1>
                            <p className="text-[8px] text-muted font-bold uppercase tracking-widest mt-1">Configure your fitness profile</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Biometric Configuration */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="card-premium p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
                                    <Fingerprint className="w-64 h-64 text-accent" />
                                </div>

                                <div className="flex items-center gap-4 mb-10 relative z-10">
                                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20 shadow-lg shadow-accent/5">
                                        <User className="w-6 h-6 text-accent" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Identity & Strategy</h2>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest px-2">Display Identification</label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 focus:bg-white/[0.08] outline-none transition-all text-white font-black uppercase text-sm tracking-tight"
                                            placeholder="OPERATOR NAME"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest px-2">Primary Evolutionary Goal</label>
                                        <input
                                            value={formData.goal}
                                            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                            className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 focus:bg-white/[0.08] outline-none transition-all text-white font-black uppercase text-sm tracking-tight"
                                            placeholder="CONDITIONING / HYPERTROPHY"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase font-black text-muted tracking-widest px-2">Daily Metabolic Load (kcal)</label>
                                        <input
                                            value={formData.targetCalories || ""}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFormData({ ...formData, targetCalories: val === "" ? "" : parseInt(val) });
                                            }}
                                            type="number"
                                            className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-accent/40 focus:bg-white/[0.08] outline-none transition-all text-white font-black tabular-nums text-sm tracking-tight"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="mt-12 btn btn-primary w-full py-6 text-black font-black uppercase tracking-tighter rounded-3xl flex items-center justify-center gap-3 shadow-2xl shadow-accent/10 group active:scale-95"
                                >
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    {loading ? "SAVING PARAMETERS..." : "COMMIT TO CORE"}
                                </button>
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="space-y-8">
                            <div className="glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/10">
                                        <Shield className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Clearance</h2>
                                </div>

                                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 mb-8">
                                    <p className="text-[10px] uppercase font-black text-muted tracking-widest mb-2">Protocol Tier</p>
                                    <p className="text-3xl font-black text-accent uppercase italic tracking-tighter">{userProfile?.subscriptionTier || "Standby"}</p>
                                </div>

                                <hr className="mb-8 border-white/5" />

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest px-2">System Maintenance</p>
                                    <button
                                        onClick={() => setConfirmOpen(true)}
                                        className="w-full flex items-center justify-between p-6 rounded-3xl border border-red-500/10 text-red-500 hover:bg-red-500/5 transition-all font-black uppercase tracking-tighter text-xs group italic"
                                    >
                                        <span>Purge Local Data</span>
                                        <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 glass border border-white/5 rounded-[2.5rem] opacity-40">
                                <p className="text-[8px] font-black text-muted uppercase tracking-[0.5em] leading-relaxed">
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
                    title="Purge Sequence"
                    message="You are about to initiate a full data purge. All historical workout architectures and nutritional logs will be permanently deleted."
                />
            </PageTransition>
        </DashboardLayout>
    );
}
