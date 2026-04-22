"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#00875a] font-bold uppercase tracking-[0.4em] text-xs mb-6"
                    >
                        Our Blog
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        COMPANY <br /> <span className="text-white/20">INSIGHTS.</span>
                    </motion.h1>

                    {/* Blog posts content removed as per request to keep it empty for now */}
                    <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-[40px]">
                        <p className="text-white/20 uppercase tracking-[0.3em] font-bold text-xs italic">
                            Insights coming soon...
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
