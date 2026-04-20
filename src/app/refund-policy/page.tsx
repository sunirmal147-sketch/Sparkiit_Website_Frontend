"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function RefundPolicy() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black">
            <Navbar />

            {/* Header */}
            <section className="pt-40 pb-20 px-6 md:px-20 border-b border-white/5">
                <div className="max-w-4xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#00875a] font-black uppercase tracking-[0.4em] text-[10px] mb-6"
                    >
                        Payment & Returns
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
                    >
                        Refund <br /> <span className="text-white/20">Policy.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest"
                    >
                        <span>Effective Date: 29 December 2024</span>
                        <div className="w-1 h-1 rounded-full bg-[#00875a]" />
                        <span>SPARKIIT EDTECH LLP</span>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 px-6 md:px-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-invert max-w-none space-y-12">
                        {/* Thank You */}
                        <div>
                            <p className="text-xl text-white/60 leading-relaxed italic">
                                Thank you for choosing <span className="text-[#00875a] not-italic font-black">SPARKIIT EDTECH LLP</span>.
                            </p>
                        </div>

                        {/* policy Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    id: "01",
                                    title: "Non-Refundable Fees",
                                    desc: "All course fees (live or recorded) are non-refundable once payment is made."
                                },
                                {
                                    id: "02",
                                    title: "Content Concerns",
                                    desc: "If content does not match expectations or technical issues occur, contact support within 7 days."
                                },
                                {
                                    id: "03",
                                    title: "Internship Disclaimer",
                                    desc: "We provide assistance but do not guarantee placements."
                                },
                                {
                                    id: "04",
                                    title: "Technical Requirements",
                                    desc: "Users must ensure device and internet compatibility."
                                },
                                {
                                    id: "05",
                                    title: "Approved Refunds",
                                    desc: "If approved, refunds are processed within 7-10 business days."
                                },
                                {
                                    id: "06",
                                    title: "Course Cancellation",
                                    desc: "If a course is cancelled by SPARKIIT EDTECH LLP, a full refund will be issued."
                                }
                            ].map((policy) => (
                                <div key={policy.id} className="group p-8 bg-white/5 border border-white/5 rounded-[32px] hover:border-[#00875a]/30 transition-all duration-500">
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="text-[10px] font-black text-[#00875a] border border-[#00875a]/20 px-3 py-1 rounded-full uppercase tracking-widest">{policy.id}</span>
                                    </div>
                                    <h3 className="text-lg font-black uppercase tracking-tight mb-3 text-white group-hover:text-[#00875a] transition-colors">{policy.title}</h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-medium">{policy.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Switching Programs */}
                        <div className="bg-[#00875a]/10 border border-[#00875a]/20 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
                            <div className="flex-1">
                                <h3 className="text-xl font-black uppercase text-[#00875a] mb-2 tracking-tighter">Switching Programs?</h3>
                                <p className="text-sm text-white/60 font-medium">Users may switch programs by contacting our academic support team.</p>
                            </div>
                            <a 
                                href="mailto:support@sparkiit.net" 
                                className="bg-[#00875a] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
