"use client";

import React from "react";
import { motion } from "framer-motion";

import { useHomepageData } from "@/hooks/useHomepageData";

const collaborators = [
    { name: "Google", logo: "G", logoUrl: "" },
    { name: "Microsoft", logo: "M", logoUrl: "" },
    { name: "Amazon", logo: "A", logoUrl: "" },
    { name: "Tesla", logo: "T", logoUrl: "" },
    { name: "Apple", logo: "A", logoUrl: "" },
    { name: "Nvidia", logo: "N", logoUrl: "" },
    { name: "Meta", logo: "M", logoUrl: "" },
];

export interface CollaborationsContent {
    title?: string;
    subtitle?: string;
    items?: { name: string; logo: string; logoUrl?: string }[];
}

export default function Collaborations(props: CollaborationsContent) {
    const { data } = useHomepageData();
    const title = props.title || "Collaborators";
    const subtitle = props.subtitle || "Building the Future Together";
    const initialItems = props.items || (data?.brands?.map(b => ({ name: b.name, logo: b.name[0], logoUrl: b.logoUrl })) || []);
    const items = initialItems.length > 0 ? initialItems : collaborators;

    return (
        <section className="py-12 bg-[#050505] border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-12 text-center">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#00875a]/20 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                    {title}
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mt-6"
                >
                    {subtitle.split(' ').map((word, i) => (
                        <span key={i} className={i >= subtitle.split(' ').length - 2 ? "text-[#00875a]" : ""}>
                            {word}{" "}
                        </span>
                    ))}
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
                    {[...items, ...items].map((item, index) => (
                        <div key={index} className="flex items-center gap-4 group cursor-default">
                            {item.logoUrl ? (
                                <img 
                                    src={item.logoUrl} 
                                    alt={item.name} 
                                    className="w-10 h-10 md:w-12 md:h-12 object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                />
                            ) : (
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl md:text-3xl font-black text-[#00875a] group-hover:bg-[#00875a] group-hover:text-white transition-all duration-300">
                                    {item.logo}
                                </div>
                            )}
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
