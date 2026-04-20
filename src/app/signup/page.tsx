"use client";
import { API_BASE_URL } from "@/lib/api-config";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function SignupPage() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

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

    return (
        <div className="min-h-dvh bg-[#050505] flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00875a]/10 via-transparent to-transparent">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Create Account</h1>
                    <p className="text-white/40 text-sm">Join SPARKIIT and start your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Full Name</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Password</label>
                        <input 
                            required
                            type="password" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#00875a]/40 focus:ring-1 focus:ring-[#00875a]/40 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs font-medium pl-1">{error}</p>}

                    <button 
                        disabled={loading}
                        className="w-full bg-[#00875a] text-white font-bold py-4 rounded-2xl mt-6 hover:bg-[#00a86b] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-white/40">
                    Already have an account? <Link href="/login" className="text-[#00875a] font-bold">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
}
