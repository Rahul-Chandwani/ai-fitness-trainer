import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Wallet, Bot, ChartBar, MessageSquare, ChevronRight, Activity, Flame, Cpu } from "lucide-react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-bg relative overflow-hidden">
      <Navbar />

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid -z-20"></div>
      <div className="orbital-glow top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      <div className="orbital-glow bottom-0 right-0 translate-x-1/2 translate-y-1/2 opacity-20 bg-emerald-500/20"></div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-2 pt-10 pb-10 lg:pt-20 lg:pb-5 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-5 py-2 glass rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-12 border border-accent/15 animate-glow"
        >
          <Cpu className="w-3.5 h-3.5 text-accent" />
          AI Assistant Active
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-extrabold max-w-6xl leading-[1.1] mb-10 tracking-tight text-white mb-10"
        >
          Forge Your <span className="text-accent">Ideal</span> Body
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2lg md:text-0xl text-muted max-w-2xl mb-14 leading-relaxed font-bold uppercase tracking-tight"
        >
          The most advanced AI fitness app for personal growth. Expertly crafted workout plans for everyone.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-6 relative z-10"
        >
          <Link to="/signup" className="btn btn-primary px-12 py-5 text-black font-bold flex items-center gap-2 group text-sm">
            START TRAINING
            <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/login" className="btn btn-outline px-12 py-5 font-bold border-white/10 hover:bg-white/5 text-sm uppercase">
            LOG IN
          </Link>
          <Link to="/plans" className="text-[10px] font-black text-muted hover:text-accent uppercase tracking-[0.4em] transition-all border-b border-transparent hover:border-accent pb-1">
            VIEW MEMBERSHIP PLANS
          </Link>
        </motion.div>
      </section>

      {/* Partners */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-8xl mx-auto px-6 overflow-hidden">
          <motion.div
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex flex-nowrap justify-center gap-16 md:gap-32 opacity-20 grayscale items-center"
          >
            <span className="text-3xl font-extrabold tracking-tight">NIKE+TECH</span>
            <span className="text-3xl font-extrabold tracking-tight">EQUINOX.LABS</span>
            <span className="text-3xl font-extrabold tracking-tight">NIKE+TECH</span>
            <span className="text-3xl font-extrabold tracking-tight">PELOTON</span>
            <span className="text-3xl font-extrabold tracking-tight">EQUINOX.LABS</span>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-40 relative px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white uppercase">Smart Training</h2>
            <div className="h-1.5 w-32 bg-accent mx-auto rounded-full mb-8"></div>
            <p className="text-muted max-w-2xl mx-auto text-xl font-bold uppercase tracking-tight leading-relaxed">
              Take the guesswork out of fitness. Our AI creates the perfect plan for your body with high accuracy.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <BenefitCard
              icon={<Activity className="w-10 h-10 text-accent" />}
              title="Track Progress"
              desc="Our AI analyzes your progress and adjusts your workouts to help you reach your goals faster."
            />
            <BenefitCard
              icon={<Zap className="w-10 h-10 text-accent" />}
              title="Live Updates"
              desc="Get instant diet and workout updates based on your daily activity and recovery levels."
            />
            <BenefitCard
              icon={<ShieldCheck className="w-10 h-10 text-accent" />}
              title="Privacy First"
              desc="Your personal health data is fully protected and private. Access advanced features with ease."
            />
          </div>
        </div>
      </section>

      {/* AI Features Preview */}
      <section className="py-40 px-6 bg-card/10 border-y border-white/5 relative">
        <div className="orbital-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <div>
                <h2 className="text-5xl md:text-8xl font-black leading-none text-white tracking-tighter uppercase italic mb-6">
                  Smart <br />
                  <span className="text-accent underline decoration-accent/20 underline-offset-10 italic">Training</span>
                </h2>
                <p className="text-xl text-muted font-bold uppercase tracking-tight">The best way to stay fit and healthy.</p>
              </div>

              <div className="grid gap-12">
                <FeatureItem
                  icon={<ChartBar className="w-6 h-6 text-accent" />}
                  title="Progress Visuals"
                  desc="Clear charts and maps of your fitness journey. Track every metric that matters."
                />
                <FeatureItem
                  icon={<Flame className="w-6 h-6 text-accent" />}
                  title="Nutrition Plans"
                  desc="Custom diet strategies that adapt to your daily calorie burn automatically."
                />
                <FeatureItem
                  icon={<Bot className="w-6 h-6 text-accent" />}
                  title="AI Trainer"
                  desc="A 24/7 assistant powered by advanced AI. It knows your history to help you improve."
                />
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full -z-10 animate-pulse" />
              <div className="bg-card/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Activity className="w-48 h-48 text-accent" />
                </div>
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center border border-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
                    <Activity className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-white uppercase italic tracking-tighter">Daily Goal</h3>
                    <p className="text-xs text-accent uppercase tracking-[0.4em] font-black">AI Active</p>
                  </div>
                </div>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-muted italic">AI Precision</span>
                      <span className="text-accent">98.4%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full w-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "98.4%" }}
                        className="h-full bg-gradient-to-r from-accent to-emerald-400"
                      />
                    </div>
                  </div>
                  <div className="p-6 glass border border-white/5 rounded-3xl italic font-bold">
                    <p className="text-sm text-muted">"AI Suggestion: Your recovery is at its peak. Increase training intensity by 12% for best results today."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Interface */}
      <footer className="py-24 px-6 text-center bg-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-center gap-12 mb-16">
            <Link to="/plans" className="text-[10px] font-black text-muted hover:text-accent tracking-[0.4em] transition-colors uppercase italic">Membership Plans</Link>
            <Link to="/" className="text-[10px] font-black text-muted hover:text-accent tracking-[0.4em] transition-colors uppercase italic">AI Features</Link>
            <Link to="/" className="text-[10px] font-black text-muted hover:text-accent tracking-[0.4em] transition-colors uppercase italic">Privacy Policy</Link>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase underline decoration-accent underline-offset-4 decoration-2">SmartFit AI</h2>
          </div>
          <p className="text-[9px] font-black tracking-[0.5em] opacity-20 uppercase text-white leading-relaxed">
            © {currentYear} SmartFit AI • All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }) {
  return (
    <div className="bg-card/40 backdrop-blur-2xl border border-white/5 p-12 rounded-[3rem] hover:border-accent/30 transition-all hover:-translate-y-2 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        {icon}
      </div>
      <div className="mb-10 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-accent/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white uppercase italic tracking-tighter">{title}</h3>
      <p className="text-muted leading-relaxed font-bold uppercase tracking-tight text-sm opacity-60 group-hover:opacity-100 transition-opacity">{desc}</p>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all shadow-lg group-hover:shadow-accent/10 transform group-hover:scale-110">
        <div className="text-muted group-hover:text-accent transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-xl font-black mb-2 text-white uppercase italic tracking-tighter">{title}</h4>
        <p className="text-sm text-muted font-bold uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
