"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";

function Counter({ value, className }: { value: string; className?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [displayValue, setDisplayValue] = useState("0");
    
    // Parse numeric value and suffix (e.g., "500+" -> 500, "+")
    const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    const suffix = value.replace(/[0-9]/g, "");

    const motionValue = useSpring(0, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(numericValue);
        }
    }, [isInView, numericValue, motionValue]);

    useEffect(() => {
        const unsubscribe = motionValue.on("change", (v) => {
            setDisplayValue(Math.floor(v).toLocaleString() + suffix);
        });
        return () => unsubscribe();
    }, [motionValue, suffix]);

    return <span ref={ref} className={className}>{displayValue}</span>;
}

const collegeStats = [
    { label: "Colleges Joined", value: "500+" },
    { label: "Students Placed", value: "10K+" },
    { label: "Career Growth", value: "85%" },
    { label: "Global Reach", value: "15+" },
];

export interface CollegesContent {
    title?: string;
    description?: string;
    stats?: { label: string; value: string }[];
}

export default function Colleges(props: CollegesContent) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
    const y2 = useTransform(scrollYProgress, [0, 1], [-40, 40]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const title = props.title || "Trusted & Chosen by 500+ Colleges Across the Nation";
    const description = props.description || "We bridge the gap between academia and industry, empowering institutions with cutting-edge resources and practical expertise.";
    const stats = props.stats || collegeStats;

    return (
        <section ref={containerRef} className="py-24 bg-[#050505] relative overflow-hidden min-h-[80vh] flex items-center">
            {/* Animated Background Text */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none overflow-hidden flex flex-col justify-center gap-10 select-none">
                <motion.div style={{ x: y1 }} className="text-[15vw] font-black whitespace-nowrap leading-none uppercase">SPARKIIT EDTECH SPARKIIT EDTECH</motion.div>
                <motion.div style={{ x: y2 }} className="text-[15vw] font-black whitespace-nowrap leading-none uppercase text-right">GLOBAL REACH FUTURE READY</motion.div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00875a]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        style={{ y: y2, opacity }}
                    >
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.2em] text-xs border border-[#00875a]/20 px-6 py-2.5 rounded-full backdrop-blur-sm">
                            Our Impact
                        </span>
                        <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mt-8 leading-[0.9] overflow-hidden">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className="inline-block overflow-hidden pb-2 mr-4">
                                    <motion.span
                                        initial={{ y: "100%" }}
                                        whileInView={{ y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            duration: 0.8, 
                                            delay: i * 0.05, 
                                            ease: [0.215, 0.61, 0.355, 1] 
                                        }}
                                        className={`inline-block ${word.includes('500+') || word.toLowerCase() === 'colleges' ? "text-[#00875a]" : ""}`}
                                    >
                                        {word}
                                    </motion.span>
                                    {i === 3 ? <br /> : null}
                                </span>
                            ))}
                        </h2>
                        <p className="text-white/50 mt-8 text-lg md:text-xl max-w-xl font-medium leading-relaxed">
                            {description}
                        </p>
                    </motion.div>

                    <motion.div 
                        style={{ y: y1 }}
                        className="grid grid-cols-2 gap-4 md:gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-[#00875a]/30 transition-all duration-300 group"
                            >
                                <Counter 
                                    value={stat.value} 
                                    className="text-4xl md:text-5xl font-black text-[#00875a] mb-2 block group-hover:scale-110 transition-transform duration-300 origin-left" 
                                />
                                <div className="text-white/40 font-bold uppercase tracking-wider text-xs md:text-sm">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
