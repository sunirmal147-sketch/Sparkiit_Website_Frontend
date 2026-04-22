"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OurStory from "@/components/OurStory";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AboutContent() {
    const searchParams = useSearchParams();
    const showFullStory = searchParams.get("fullstory") === "true";

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* About Hero */}
            <section className="pt-40 pb-20 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div className="lg:w-1/2">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                        >
                            Who We Are
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                        >
                            WE ARE <br /> <span className="text-white/20">SPARKIIT.</span>
                        </motion.h1>
                    </div>
                </div>
            </section>

            {/* Comprehensive Story Section - Conditional */}
            {showFullStory && (
                <section className="py-24 px-6 md:px-20 bg-[#050505]">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-12"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter border-l-4 border-[#00875a] pl-6 mb-16">
                                The Sparkiit Story
                            </h2>
                            
                            <div className="space-y-8 text-lg md:text-2xl text-gray-400 font-medium leading-relaxed">
                                <p>
                                    <span className="text-white font-bold">SPARKIIT EDTECH LLP</span> was created to solve a real problem—students often finish courses with theory, but lack the practical exposure companies expect. To change that, SPARKIIT set out to build a learning ecosystem focused on real skills, real projects, and real industry experience.
                                </p>
                                
                                <p>
                                    From live training and guided mentorship to hands-on projects and structured internships, SPARKIIT designs programs that help learners move beyond classrooms and step confidently toward their careers. The focus has always been simple: make learning practical, relevant, and aligned with what today’s industries actually need.
                                </p>
                                
                                <p>
                                    Today, <span className="text-white font-bold">SPARKIIT EDTECH LLP</span> continues to grow as a career-focused learning platform dedicated to helping students explore domains, build confidence, and become industry-ready.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            <OurStory />

            <section className="py-24 px-6 md:px-20 bg-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 border-l-4 border-[#00875a] pl-6">Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "IDEA",
                                desc: "Spark your ideas with clarity and purpose, building a strong foundation for your learning journey."
                            },
                            {
                                title: "INNOVATION",
                                desc: "Transform your ideas into impactful innovation through hands-on training and practical exposure."
                            },
                            {
                                title: "TRANSFORMATION",
                                desc: "Transform yourself with real-world experience, industry-relevant skills, and career-focused execution."
                            }
                        ].map((val, i) => (
                            <div key={i} className="p-10 rounded-3xl border border-white/10 bg-[#050505] hover:border-[#00875a]/30 transition-colors group">
                                <h3 className="text-xl font-black mb-4 group-hover:text-[#00875a] transition-colors tracking-widest">{val.title}</h3>
                                <p className="text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <Footer />
        </main>
    );
}

export default function AboutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
            <AboutContent />
        </Suspense>
    );
}

