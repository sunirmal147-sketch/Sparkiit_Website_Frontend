"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Mouse Tracking for 3D Parallax & Hover tilt
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) - 0.5;
        const y = (clientY / innerHeight) - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const springConfig = { damping: 25, stiffness: 120 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Dynamic 3D transforms for the card
    const cardRotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
    const cardRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

    // Dynamic translations for background orbs (Parallax)
    const orbX1 = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
    const orbY1 = useTransform(smoothY, [-0.5, 0.5], [-50, 50]);

    const orbX2 = useTransform(smoothX, [-0.5, 0.5], [50, -50]);
    const orbY2 = useTransform(smoothY, [-0.5, 0.5], [50, -50]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call for premium UX
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1] as any,
                staggerChildren: 0.06,
                delayChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
        }
    };

    return (
        <div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-dvh bg-[#050505] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
            style={{ perspective: 1000 }}
        >
            {/* Animated Glowing Background Orbs with 3D Parallax */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    style={{ x: orbX1, y: orbY1 }}
                    className="absolute -top-40 -left-40"
                >
                    <motion.div
                        animate={{
                            y: [0, -30, 20, 0],
                            scale: [1, 1.1, 0.95, 1]
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-[450px] h-[450px] rounded-full bg-[#00875a]/10 blur-[130px]"
                    />
                </motion.div>

                <motion.div
                    style={{ x: orbX2, y: orbY2 }}
                    className="absolute -bottom-40 -right-40"
                >
                    <motion.div
                        animate={{
                            y: [0, 30, -20, 0],
                            scale: [1, 0.95, 1.05, 1]
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-[450px] h-[450px] rounded-full bg-[#00875a]/8 blur-[130px]"
                    />
                </motion.div>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                    rotateX: cardRotateX, 
                    rotateY: cardRotateY, 
                    transformStyle: "preserve-3d" 
                }}
                className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[36px] shadow-2xl transition-all duration-500 hover:border-white/15"
            >
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="reset-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div variants={itemVariants} className="text-center mb-10">
                                <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Reset Password</h1>
                                <p className="text-white/40 text-sm">Enter your email and we'll send you a password reset link</p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <motion.div variants={itemVariants}>
                                    <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <input 
                                            required
                                            type="email" 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                                            placeholder="john@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/20">
                                            <Mail size={18} />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <button 
                                        disabled={loading}
                                        className="w-full bg-[#00875a] text-white font-bold py-4 rounded-2xl mt-4 hover:bg-[#00a86b] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_-2px_rgba(0,135,90,0.3)] hover:shadow-[0_8px_30px_rgba(0,135,90,0.5)] cursor-pointer uppercase tracking-widest text-xs"
                                    >
                                        {loading ? "Sending..." : "Send Reset Link"}
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div variants={itemVariants} className="text-center mt-8">
                                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    Back to Sign In
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="reset-success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-6"
                        >
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                                className="w-20 h-20 bg-[#00875a]/10 border border-[#00875a]/20 rounded-full flex items-center justify-center text-[#00875a] mx-auto mb-8 shadow-xl shadow-[#00875a]/5"
                            >
                                <CheckCircle2 size={40} />
                            </motion.div>

                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-4">Link Sent!</h2>
                            
                            <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed mb-8">
                                If <span className="text-white font-medium">{email}</span> is registered with us, you will receive a secure password reset link shortly.
                            </p>

                            <Link 
                                href="/login" 
                                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white font-bold px-8 py-4 rounded-2xl transition-all uppercase tracking-widest text-xs"
                            >
                                <ArrowLeft size={14} /> Back to Sign In
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
