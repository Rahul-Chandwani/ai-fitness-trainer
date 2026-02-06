import { Link, useLocation } from "react-router-dom";
import { Bot, User, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const isDashboard = location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/workouts') ||
        location.pathname.startsWith('/diet') ||
        location.pathname.startsWith('/ai-coach') ||
        location.pathname.startsWith('/profile') ||
        location.pathname.startsWith('/settings') ||
        location.pathname.startsWith('/training-plan');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide the global navbar on desktop dashboard (sidebar covers it)
    // But keep it for mobile dashboard
    return (
        <nav className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-500 ${scrolled ? 'p-0' : 'px-4 pt-4'} ${isDashboard ? 'lg:hidden' : ''}`}>
            <div className={`transition-all duration-500 backdrop-blur-2xl border flex items-center justify-between ${scrolled
                ? 'bg-card/90 shadow-lg w-full rounded-none border-b border-white/10 p-3'
                : 'max-w-7xl mx-auto rounded-xl p-2 border-white/5 bg-transparent shadow-none'}`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-sm">
                        <Bot className="w-5 h-5 text-black" />
                    </div>
                    <h1 className="text-lg font-extrabold text-white tracking-tight uppercase">SmartFit <span className="text-accent">AI</span></h1>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {!user ? (
                        <>
                            <Link to="/" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">AI Features</Link>
                            <Link to="/plans" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Plans</Link>
                            <div className="h-4 w-[1px] bg-white/10"></div>
                            <Link to="/login" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Log In</Link>
                            <Link to="/signup" className="btn btn-primary px-4 py-2 text-[10px]">Start Now</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Home</Link>
                            <Link to="/dashboard" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                                <LayoutDashboard className="w-4 h-4 text-accent" />
                                Dashboard
                            </Link>
                            <Link to="/workouts" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Workouts</Link>
                            <Link to="/diet" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Diet</Link>
                            <Link to="/ai-coach" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">AI Coach</Link>
                            <Link to="/training-plan" className="text-[10px] font-bold text-muted hover:text-white uppercase tracking-widest transition-colors">Plan</Link>
                            <Link to="/profile" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-[0.3em] transition-colors">Profile</Link>
                            <div className="h-4 w-[1px] bg-white/10"></div>
                            <button
                                onClick={logout}
                                className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-[0.3em] transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-muted hover:text-white transition-colors">
                    {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="absolute top-20 left-4 right-4 bg-card/98 border border-white/10 backdrop-blur-3xl rounded-xl p-6 md:hidden z-[160] shadow-2xl"
                    >
                        <div className="flex flex-col gap-8 text-center">
                            {!user ? (
                                <>
                                    <Link onClick={() => setMobileMenu(false)} to="/" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">AI Features</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/plans" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Plans</Link>
                                    <div className="h-[1px] w-full bg-white/5"></div>
                                    <Link onClick={() => setMobileMenu(false)} to="/login" className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Log In</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/signup" className="bg-accent text-black py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.4em]">Start Now</Link>
                                </>
                            ) : (
                                <>
                                    <Link onClick={() => setMobileMenu(false)} to="/" className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mb-4 border-b border-white/5 pb-4">Home</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/dashboard" className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center justify-center gap-3 italic">
                                        <LayoutDashboard className="w-4 h-4 text-accent" />
                                        Dashboard
                                    </Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/workouts" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Workouts</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/diet" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Diet</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/ai-coach" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">AI Trainer</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/training-plan" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Training Plan</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/profile" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Profile</Link>
                                    <Link onClick={() => setMobileMenu(false)} to="/settings" className="text-[10px] font-black text-muted uppercase tracking-[0.4em]">Settings</Link>
                                    <div className="h-[1px] w-full bg-white/5"></div>
                                    <button
                                        onClick={() => { logout(); setMobileMenu(false); }}
                                        className="text-[10px] font-black text-red-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
