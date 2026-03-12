"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LatestProjects from "@/components/LatestProjects";
import { motion } from "framer-motion";

export default function ProjectsPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        Portfolio
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        SELECTED <br /> <span className="text-white/20">WORKS.</span>
                    </motion.h1>

                    <div className="flex flex-wrap gap-8 mb-16 border-b border-white/5 pb-8">
                        {["All", "Branding", "Webflow", "UX/UI", "Blockchain"].map((filter, i) => (
                            <button key={i} className={`uppercase text-sm font-bold tracking-widest ${i === 0 ? "text-[#a8e03e]" : "text-gray-500 hover:text-white"} transition-colors`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <LatestProjects />

            <section className="py-24 px-6 md:px-20">
                <div className="max-w-7xl mx-auto text-center border-t border-white/5 pt-24">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12">HAVE A PROJECT IN <br /> MIND?</h2>
                    <button className="bg-[#a8e03e] text-black px-12 py-6 rounded-full font-bold uppercase text-sm tracking-widest hover:scale-105 transition-transform">
                        Let&apos;s Talk
                    </button>
                </div>
            </section>

            <Footer />
        </main>
    );
}
