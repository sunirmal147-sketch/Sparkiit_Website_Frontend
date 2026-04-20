"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
                        Legal & Compliance
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8"
                    >
                        Privacy <br /> <span className="text-white/20">Policy.</span>
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
                        {/* Introduction */}
                        <div>
                            <p className="text-xl text-white/60 leading-relaxed">
                                At <span className="text-white font-bold">SPARKIIT EDTECH LLP</span>, accessible from <a href="https://www.sparkiit.net" className="text-[#00875a] underline decoration-green-900 underline-offset-4">www.sparkiit.net</a>, safeguarding your privacy is a top priority. This Privacy Policy explains what information we collect and how we use and protect it.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#00875a]" />
                                Information We Collect
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Personal Information</h3>
                                    <p className="text-white/60 leading-relaxed text-sm">
                                        When you create an account, enroll in a course, subscribe to updates, or contact us, we may collect your name, email address, phone number, and company name (if applicable). We may also collect information shared through reviews, discussions, and other interactive features.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Non-Personal Information</h3>
                                    <p className="text-white/60 leading-relaxed text-sm">
                                        We may automatically collect technical data such as browser type, IP address, referring pages, operating system, and usage details. This includes data collected through cookies to enhance your browsing experience. You can manage cookies through your browser settings.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How We Use Information */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#00875a]" />
                                How We Use Your Information
                            </h2>
                            <p className="text-white/60 leading-relaxed">We use collected data to:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                {[
                                    "Operate and maintain our platform",
                                    "Improve and personalize user experience",
                                    "Provide updates and respond to queries",
                                    "Analyze usage to enhance services",
                                    "Develop new features and offerings",
                                    "Prevent fraud and ensure platform security"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl text-sm font-medium text-white/80">
                                        <span className="text-[#00875a] font-black">•</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sharing Information */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className="w-8 h-[2px] bg-[#00875a]" />
                                Sharing Your Information
                            </h2>
                            <p className="text-white/60 leading-relaxed">
                                We do not sell your personal data. We may share it only in the following cases:
                            </p>
                            <div className="space-y-6">
                                <div className="p-8 bg-[#00875a]/5 border border-[#00875a]/10 rounded-3xl">
                                    <h3 className="text-white font-bold mb-2">Service Providers</h3>
                                    <p className="text-sm text-white/50">Trusted partners assisting in operating our services under confidentiality agreements.</p>
                                </div>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <h3 className="text-white font-bold mb-2">Legal Requirements</h3>
                                    <p className="text-sm text-white/50">When required by law or necessary to protect rights, safety, and property.</p>
                                </div>
                            </div>
                        </div>

                        {/* Rights & Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                            <div className="space-y-4">
                                <h2 className="text-lg font-black uppercase tracking-tight">Your Rights</h2>
                                <ul className="text-sm text-white/50 space-y-2 list-none p-0">
                                    <li>• Access to your data</li>
                                    <li>• Correction of inaccurate data</li>
                                    <li>• Deletion of personal data</li>
                                    <li>• Restricted processing</li>
                                    <li>• Objection to data usage</li>
                                    <li>• Data portability</li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-lg font-black uppercase tracking-tight">Policies</h2>
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black uppercase text-white/40 mb-1">Children’s Information</h3>
                                        <p className="text-xs text-white/30 italic">We do not knowingly collect data from children under 13. If discovered, it will be deleted immediately.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-black uppercase text-white/40 mb-1">Updates</h3>
                                        <p className="text-xs text-white/30">This policy may be updated periodically. Changes will be posted on the website.</p>
                                    </div>
                                    <a href="mailto:support@sparkiit.net" className="inline-block mt-4 text-[#00875a] font-black uppercase tracking-widest text-xs border-b border-[#00875a] pb-1">
                                        Contact Us: support@sparkiit.net
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
