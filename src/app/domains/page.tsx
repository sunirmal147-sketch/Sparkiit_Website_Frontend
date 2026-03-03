"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesOverview from "@/components/ServicesOverview";
import WorkingProcess from "@/components/WorkingProcess";
import { motion } from "framer-motion";

const detailedServices = [
    {
        title: "Brand Identity",
        desc: "We create distinctive and memorable brand identities that resonate with your target audience and stand the test of time.",
        tags: ["Logo Design", "Typography", "Color Palette", "Brand Guidelines"]
    },
    {
        title: "UI/UX Design",
        desc: "Our design process is user-centric, ensuring that every interface we build is intuitive, accessible, and delightful to use.",
        tags: ["User Research", "Wireframing", "Prototyping", "Visual Design"]
    },
    {
        title: "Web Development",
        desc: "We build high-performance, responsive websites and web applications using the latest technologies and best practices.",
        tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"]
    },
    {
        title: "Blockchain & Web3",
        desc: "Navigating the decentralized world with secure and innovative solutions for DeFi, NFTs, and smart contracts.",
        tags: ["Solidity", "Smart Contracts", "DApp Development", "Audit"]
    }
];

export default function DomainsPage() {
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
                        Our Domains
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        EXPERT <br /> <span className="text-white/20">SOLUTIONS.</span>
                    </motion.h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {detailedServices.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white/5 p-12 rounded-[40px] border border-white/10 hover:border-[#a8e03e]/30 transition-all group"
                            >
                                <h2 className="text-3xl font-bold mb-6 group-hover:text-[#a8e03e] transition-colors">{service.title}</h2>
                                <p className="text-gray-400 leading-relaxed mb-8 text-lg">{service.desc}</p>
                                <div className="flex flex-wrap gap-3">
                                    {service.tags.map((tag, i) => (
                                        <span key={i} className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <ServicesOverview />
            <WorkingProcess />

            <Footer />
        </main>
    );
}
