"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsConditions() {
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
                        Rules & Regulations
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
                    >
                        Terms & <br /> <span className="text-white/20">Conditions.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest"
                    >
                        <span>Last Updated: 20 April 2026</span>
                        <div className="w-1 h-1 rounded-full bg-[#00875a]" />
                        <span>SPARKIIT EDTECH LLP</span>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-24 px-6 md:px-20">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-invert max-w-none space-y-16">
                        {/* Welcome */}
                        <div>
                            <p className="text-xl text-white/60 leading-relaxed">
                                Welcome to <span className="text-white font-bold">SPARKIIT EDTECH LLP</span>. By accessing our website, you agree to these terms.
                            </p>
                        </div>

                        {/* Sections */}
                        <div className="grid grid-cols-1 gap-16">
                            {/* Acceptance */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                    <span className="w-8 h-[2px] bg-[#00875a]" />
                                    1. Acceptance of Terms
                                </h2>
                                <p className="text-white/60 leading-relaxed">
                                    By using our website, you agree to these Terms and our Privacy Policy.
                                </p>
                            </section>

                            {/* Intellectual Property */}
                            <section className="space-y-4">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                    <span className="w-8 h-[2px] bg-[#00875a]" />
                                    2. Intellectual Property
                                </h2>
                                <p className="text-white/60 leading-relaxed">
                                    All content including courses, branding, and materials belongs to SPARKIIT EDTECH LLP or its licensors. Content is for personal use only.
                                </p>
                            </section>

                            {/* Restrictions */}
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                    <span className="w-8 h-[2px] bg-[#00875a]" />
                                    3. Restrictions
                                </h2>
                                <p className="text-white/60">You may not:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                    {[
                                        "Copy or distribute content commercially",
                                        "Modify or transmit content without permission",
                                        "Use bots or scrapers",
                                        "Disrupt website functionality"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white/80">
                                            <span className="text-[#00875a] font-black">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* User Accounts & Content */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#00875a]">4. User Accounts</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        You must provide accurate information and keep login credentials confidential.
                                    </p>
                                </section>
                                <section className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#00875a]">5. User Content</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">
                                        Users may submit reviews or posts. You are responsible for ensuring your content does not violate intellectual property and is not illegal, offensive, or harmful.
                                    </p>
                                </section>
                            </div>

                            {/* Disclaimer & Liability */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <h3 className="text-xs font-black uppercase text-white/40 mb-2 underline decoration-[#00875a] underline-offset-4">Disclaimer</h3>
                                    <p className="text-sm text-white/60">All content is provided “as is” without warranties.</p>
                                </div>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <h3 className="text-xs font-black uppercase text-white/40 mb-2 underline decoration-[#00875a] underline-offset-4">Liability</h3>
                                    <p className="text-sm text-white/60">We are not liable for damages arising from use of our services.</p>
                                </div>
                            </div>

                            {/* Footer Legal */}
                            <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-white/40">
                                <section className="space-y-2">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Governing Law</h4>
                                    <p>These terms are governed by Indian law. Jurisdiction: Tripura courts.</p>
                                </section>
                                <section className="space-y-2 flex flex-col items-end">
                                    <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Contact Admin</h4>
                                    <a href="mailto:support@sparkiit.net" className="text-[#00875a] font-bold">support@sparkiit.net</a>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
