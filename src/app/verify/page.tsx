"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, Mail, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificateCard from "@/components/CertificateCard";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/public';


export default function VerifyPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const response = await fetch(`${API_BASE}/validate-certificate?email=${encodeURIComponent(email)}`);
            const json = await response.json();

            if (json.success) {
                setCertificates(json.data);
            } else {
                setCertificates([]);
                setError(json.message || "No certificates found for this email.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 md:px-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00875a]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <p className="text-[#00875a] font-bold uppercase tracking-widest text-sm mb-6">Verification Portal</p>
                        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.9]">
                            Validate your <br /> <span className="text-white/20">Achievement.</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
                            Enter the email address you used during enrollment to verify and download your digital certificates.
                        </p>

                        <form onSubmit={handleVerify} className="relative max-w-xl group">
                            <div className="relative">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00875a] transition-colors" size={20} />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-40 text-lg focus:outline-none focus:border-[#00875a]/50 focus:ring-1 focus:ring-[#00875a]/50 transition-all placeholder:text-gray-600"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#00875a] text-white px-8 py-3 rounded-xl font-bold uppercase text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            Verify <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <section className="pb-40 px-6 md:px-20 min-h-[40vh]">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20"
                            >
                                <div className="w-20 h-20 rounded-full border-4 border-[#00875a]/20 border-t-[#00875a] animate-spin mb-6" />
                                <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Searching Database...</p>
                            </motion.div>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-xl mx-auto bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No Certificates Found</h3>
                                <p className="text-gray-400 mb-8">{error}</p>
                                <button 
                                    onClick={() => setError(null)}
                                    className="text-white font-bold uppercase text-xs tracking-widest hover:text-[#00875a] transition-colors"
                                >
                                    Try Another Email
                                </button>
                            </motion.div>
                        ) : certificates.length > 0 ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-12"
                            >
                                <div className="text-center mb-16">
                                    <h2 className="text-3xl font-bold mb-2">Found {certificates.length} Certificate{certificates.length > 1 ? 's' : ''}</h2>
                                    <p className="text-gray-500">Recognition of your hard work and dedication.</p>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 max-w-4xl mx-auto">
                                    {certificates.map((cert, index) => (
                                        <CertificateCard key={cert._id || index} {...cert} />
                                    ))}
                                </div>
                            </motion.div>
                        ) : hasSearched && (
                            <motion.div 
                                key="no-results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <p className="text-gray-500">Enter your email above to start the verification.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <Footer />
        </main>
    );
}
