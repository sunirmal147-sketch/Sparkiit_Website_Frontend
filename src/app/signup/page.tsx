"use client";
import { API_BASE_URL } from "@/lib/api-config";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Cookies from "js-cookie";

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

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
        setError("");

        try {
            const res = await fetch(`${API_BASE_URL}/api/public/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.data));
                localStorage.setItem("token", data.data.token);
                // Save token to cookies
                Cookies.set("token", data.data.token, { 
                    expires: 30,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                });
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
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
                staggerChildren: 0.05,
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
                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Create Account</h1>
                    <p className="text-white/40 text-sm">Join SPARKIIT and start your learning journey</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Password</label>
                        <input 
                            required
                            type="password" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </motion.div>
                    
                    {error && (
                        <motion.p variants={itemVariants} className="text-red-500 text-xs font-medium pl-1">
                            {error}
                        </motion.p>
                    )}

                    <motion.div variants={itemVariants}>
                        <button 
                            disabled={loading}
                            className="w-full bg-[#00875a] text-white font-bold py-4 rounded-2xl mt-4 hover:bg-[#00a86b] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_-2px_rgba(0,135,90,0.3)] hover:shadow-[0_8px_30px_rgba(0,135,90,0.5)] cursor-pointer"
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </motion.div>
                </form>

                <motion.p variants={itemVariants} className="text-center mt-8 text-sm text-white/40">
                    Already have an account? <Link href="/login" className="text-[#00875a] font-bold hover:text-[#00a86b] transition-colors">Sign In</Link>
                </motion.p>
            </motion.div>
        </div>
    );
}
