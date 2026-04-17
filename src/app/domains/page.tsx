"use client";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Code, Layout, Database, Shield, Megaphone, FileText } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const domains = [
    {
        title: "Application Development",
        icon: <Code className="text-[#00875a]" size={32} />,
        description: "Custom software solutions and mobile application development for enterprise scales."
    },
    {
        title: "UI/UX Strategy & Design",
        icon: <Layout className="text-[#00875a]" size={32} />,
        description: "User-centric design systems and interactive prototypes that drive engagement."
    },
    {
        title: "Blockchain Solutions",
        icon: <Globe className="text-[#00875a]" size={32} />,
        description: "Decentralized applications and custom ledger solutions for modern finance."
    },
    {
        title: "Smart Contract Audit",
        icon: <Shield className="text-[#00875a]" size={32} />,
        description: "Rigorous security audits for Ethereum and other blockchain protocols."
    },
    {
        title: "Digital Marketing",
        icon: <Megaphone className="text-[#00875a]" size={32} />,
        description: "Strategic growth hacking and data-driven marketing campaigns."
    },
    {
        title: "Content Strategy",
        icon: <FileText className="text-[#00875a]" size={32} />,
        description: "Compelling narrative development and SEO-optimized content distribution."
    }
];

export default function DomainSelectionPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <p className="text-[#00875a] font-bold uppercase tracking-[0.4em] text-xs mb-6">Expertise Hub</p>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                            Select Your <br /> <span className="text-white/20">Domain.</span>
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                            Explore our specialized fields of expertise. Each domain represents a pillar of digital excellence at Sparkiit.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domains.map((domain, index) => (
                            <Link 
                                key={index} 
                                href={`/courses?category=${encodeURIComponent(domain.title)}`}
                                className="group block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full bg-white/5 border border-white/10 rounded-[40px] p-10 hover:border-[#00875a]/40 hover:bg-[#00875a]/5 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="text-[#00875a]" size={24} />
                                    </div>
                                    
                                    <div className="mb-8 p-4 bg-white/5 inline-block rounded-2xl group-hover:bg-[#00875a]/10 transition-colors">
                                        {domain.icon}
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00875a] transition-colors">{domain.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium line-clamp-3">
                                        {domain.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00875a] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                        View Solutions <ArrowRight size={14} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
