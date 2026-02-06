import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useToast } from "../components/Toast";
import { Bot, Mail, Lock, ChevronRight, Activity, UserPlus, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password || !name) return addToast("All parameters required", "error");

    try {
      setLoading(true);
      await signup(email, password, name); // signup in context handles firestore doc creation based on previous session
      addToast("Profile Created Successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast("Failed to Create Profile: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg relative overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute inset-0 bg-grid opacity-50 -z-10"></div>
        <div className="orbital-glow top-0 right-0 translate-x-1/2 -translate-y-1/2 opacity-30 bg-emerald-500/10"></div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] group-hover:rotate-12 transition-transform">
                <UserPlus className="w-7 h-7 text-black" />
              </div>
            </Link>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Start Now</h1>
            <p className="text-[10px] text-muted font-black uppercase tracking-[0.4em] mt-2">Create your fitness account</p>
          </div>

          <div className="bg-card/40 backdrop-blur-3xl border border-white/5 p-7 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Fingerprint className="w-28 h-28 text-accent" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] px-2">Full Name</label>
                <div className="relative group">
                  <Bot className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 py-4 pr-5 !pl-16 rounded-2xl outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all text-white font-bold"
                    placeholder="YOUR NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] px-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 py-4 pr-5 !pl-16 rounded-2xl outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all text-white font-bold"
                    placeholder="YOUR@EMAIL.COM"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted uppercase tracking-[0.3em] px-2">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    className="w-full bg-white/5 border border-white/10 py-4 pr-5 !pl-16 rounded-2xl outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all text-white font-bold"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full btn btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 group text-sm mt-2"
              >
                <span>{loading ? "CREATING ACCOUNT..." : "SIGN UP"}</span>
                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center relative z-10 border-t border-white/5 pt-8">
              <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-relaxed">
                Already have an account?{" "}
                <Link to="/login" className="text-accent hover:underline decoration-2 underline-offset-4">
                  Log In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center opacity-20 flex flex-col items-center gap-2">
            <div className="h-[1px] w-24 bg-white"></div>
            <p className="text-[8px] font-black text-white uppercase tracking-[0.6em]">Secure Sign Up Page</p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
