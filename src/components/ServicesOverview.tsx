"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import TextReveal from "./TextReveal";
import PremiumButton from "./PremiumButton";

const fallbackServices = [
    "Application Development",
    "UI/UX Strategy & Design",
    "Blockchain Solutions",
    "Smart Contract Audit",
    "Digital Marketing",
    "Content Strategy"
];

export default function ServicesOverview() {
    const { data } = useHomepageData();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xParallax = useTransform(scrollYProgress, [0, 1], [-50, 50]);

    const services = data?.services && data.services.length > 0
        ? data.services.map(s => s.title)
        : fallbackServices;

    return (
        <section id="expertise" ref={containerRef} className="py-16 px-6 md:px-20 bg-[#050505] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
                <motion.div style={{ x: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : xParallax }} className="lg:w-1/3">
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6"
                    >
                        Our Expertise
                    </motion.p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter mb-8 lg:mb-10 leading-tight">
                        <TextReveal text="Tailored solutions for modern brands." />
                    </h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 leading-relaxed mb-10 lg:mb-12 text-base md:text-lg font-medium"
                    >
                        We provide end-to-end digital services that help companies scale, innovate, and lead in their respective markets.
                    </motion.p>
                    <div className="mb-12 lg:mb-0">
                        <PremiumButton text="View All Services" variant="secondary" />
                    </div>
                </motion.div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 overflow-hidden rounded-2xl md:rounded-3xl">
                    {services.map((service, index) => (
                        <Link 
                            key={index}
                            href={`/courses?category=${encodeURIComponent(service)}`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="group bg-[#050505] p-6 sm:p-8 md:p-12 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00875a]/0 to-[#00875a]/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                                <h3 className="text-lg md:text-2xl font-bold text-white/50 group-hover:text-white transition-colors tracking-tight relative z-10">{service}</h3>
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00875a] group-hover:border-[#00875a] group-hover:text-black transition-all relative z-10">
                                    <ArrowRight size={18} className="md:w-5 md:h-5" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
