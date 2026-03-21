"use client";

import React from "react";
import { motion } from "framer-motion";

const collaborators = [
    { name: "Google", logo: "G" },
    { name: "Microsoft", logo: "M" },
    { name: "Amazon", logo: "A" },
    { name: "Tesla", logo: "T" },
    { name: "Apple", logo: "A" },
    { name: "Nvidia", logo: "N" },
    { name: "Meta", logo: "M" },
];

export default function Collaborations() {
    return (
        <section className="py-12 bg-[#050505] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-12 text-center">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#a8e03e]/20 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    Collaborations
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mt-6"
                >
                    Building the <span className="text-[#a8e03e]">Future Together</span>
                </motion.h2>
            </div>

            <div className="flex whitespace-nowrap overflow-hidden">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-12 md:gap-24 items-center pr-12 md:pr-24"
                >
                    {[...collaborators, ...collaborators].map((item, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-black text-[#a8e03e] group-hover:bg-[#a8e03e] group-hover:text-black transition-all duration-300">
                                {item.logo}
                            </div>
                            <span className="text-2xl md:text-4xl font-bold text-white/50 group-hover:text-white transition-colors duration-300 uppercase tracking-tighter">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
