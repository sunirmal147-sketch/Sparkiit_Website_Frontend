"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("user", JSON.stringify(data.data));
                localStorage.setItem("token", data.data.token);
                router.push("/");
                router.refresh();
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#a8e03e]/10 via-transparent to-transparent">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Welcome Back</h1>
                    <p className="text-white/40 text-sm">Sign in to your SparkIIT account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-white/60 mb-2 block uppercase tracking-widest pl-1">Email Address</label>
                        <input 
                            required
                            type="email" 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#a8e03e]/40 focus:ring-1 focus:ring-[#a8e03e]/40 transition-all outline-none"
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
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-[#a8e03e]/40 focus:ring-1 focus:ring-[#a8e03e]/40 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    
                    {error && <p className="text-red-500 text-xs font-medium pl-1">{error}</p>}

                    <button 
                        disabled={loading}
                        className="w-full bg-[#a8e03e] text-black font-bold py-4 rounded-2xl mt-6 hover:bg-[#96c937] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-white/40">
                    Don't have an account? <Link href="/signup" className="text-[#a8e03e] font-bold">Sign Up</Link>
                </p>
            </motion.div>
        </div>
    );
}
