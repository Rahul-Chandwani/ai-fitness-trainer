import { useNavigate, Link } from "react-router-dom";
import PlanCard from "../components/PlanCard";
import { useFitness } from "../context/FitnessContext";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
import { motion } from "framer-motion";
import { Shield, Zap, Target, Cpu, ChevronLeft } from "lucide-react";

export default function Plans() {
  const { userProfile, updateUserProfile } = useFitness();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSelectPlan = async (tier) => {
    try {
      await updateUserProfile({ subscriptionTier: tier.toLowerCase() });
      addToast(`${tier.toUpperCase()} PLAN ACTIVATED`, "success");
      navigate("/dashboard");
    } catch (err) {
      addToast("ERROR: Failed to update plan", "error");
    }
  };

  const currentTier = userProfile?.subscriptionTier || "free";

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col pt-10 pb-10">
      <Navbar />
      <div className="absolute inset-0 bg-grid opacity-50 -z-10"></div>
      <div className="orbital-glow top-0 right-0 opacity-20 bg-accent/10 pointer-events-none"></div>

      <PageTransition>
        <div className="max-w-7xl mx-auto px-6 pt-5 pb-5">
          <div className="text-center mb-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-accent/20"
            >
              <Shield className="w-3 h-3 text-accent" />
              Choose Your Membership
            </motion.div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-accent transition-colors group mx-auto mb-8">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
              Membership <span className="text-accent">Plans</span>
            </h1>
            <p className="text-muted text-xl max-w-2xl mx-auto font-bold uppercase tracking-tight opacity-70">
              Get started with AI-powered training. Pick the best plan for your fitness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            <PlanCard
              title="Standard"
              price="₹0"
              icon={<Shield className="w-8 h-8" />}
              features={[
                "Basic Workout Logging",
                "Calorie Tracking",
                "Simple Progress Charts",
                "Standard AI Features",
              ]}
              active={currentTier === "free"}
              onSelect={() => handleSelectPlan("Free")}
              description="Essential features for all beginners."
            />

            <PlanCard
              title="Enhanced"
              price="₹199/mo"
              icon={<Zap className="w-8 h-8" />}
              features={[
                "AI Workout Recommendations",
                "Detailed Calorie Analysis",
                "Weekly Progress Report",
                "Personalized Fitness Tips",
              ]}
              active={currentTier === "basic"}
              onSelect={() => handleSelectPlan("Basic")}
              description="Better insights to help you grow faster."
            />

            <PlanCard
              title="Prophet"
              price="₹399/mo"
              icon={<Target className="w-8 h-8" />}
              features={[
                "Custom Workout Plans",
                "Instant Diet Feedback",
                "Deep Progress Insights",
                "Personalized AI Dashboard",
              ]}
              active={currentTier === "intermediate"}
              highlight={true}
              onSelect={() => handleSelectPlan("Intermediate")}
              description="The perfect plan for consistent results."
            />

            <PlanCard
              title="Neural"
              price="₹699/mo"
              icon={<Cpu className="w-8 h-8" />}
              features={[
                "Advanced AI Personal Trainer",
                "Plateau Prevention",
                "Automatic Goal Updates",
                "Priority AI Support",
              ]}
              active={currentTier === "advanced"}
              onSelect={() => handleSelectPlan("Advanced")}
              description="Our most powerful AI for maximum results."
            />
          </div>

          {/* Verification Bar */}
          <div className="text-center">
            <p className="text-[10px] font-black text-muted uppercase tracking-[0.5em] mb-10 opacity-40">Verified Industry Integration</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-20 grayscale hover:grayscale-0 transition-all duration-700 items-center">
              <span className="text-2xl font-black italic tracking-tighter">EQUINOX</span>
              <span className="text-2xl font-black italic tracking-tighter">WHOOP.BIOS</span>
              <span className="text-2xl font-black italic tracking-tighter">GARMIN.SYNC</span>
              <span className="text-2xl font-black italic tracking-tighter">ATHLETIC.GEN</span>
            </div>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}
