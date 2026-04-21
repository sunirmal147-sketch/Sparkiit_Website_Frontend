"use client";

import React from "react";
import { motion } from "framer-motion";

import { useHomepageData } from "@/hooks/useHomepageData";

const publications = [
    { name: "The Times of India", logoUrl: "" },
    { name: "Hindustan Times", logoUrl: "" },
    { name: "Economic Times", logoUrl: "" },
    { name: "YourStory", logoUrl: "" },
    { name: "Indian Express", logoUrl: "" },
    { name: "Outlook India", logoUrl: "" },
    { name: "Inc42", logoUrl: "" }
];

export interface FeaturedInContent {
    title?: string;
    items?: { name: string; logoUrl: string }[];
}

export default function FeaturedIn(props: FeaturedInContent) {
    const { data } = useHomepageData();
    const title = props.title || "Featured In";
    const items = props.items || (data?.recognitions || publications);

    return (
        <section className="py-10 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6 md:px-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-12"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#00875a]/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            As Seen On
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={word.toLowerCase() === 'in' ? "text-[#00875a]" : ""}>
                                    {word}{" "}
                                </span>
                            ))}
                        </h2>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20">
                        {items.map((pub, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-center"
                            >
                                {pub.logoUrl ? (
                                    <img 
                                        src={pub.logoUrl} 
                                        alt={pub.name} 
                                        className="h-6 sm:h-8 md:h-10 object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                                    />
                                ) : (
                                    <span className="text-lg sm:text-2xl md:text-3xl font-black text-white hover:text-[#00875a] hover:opacity-100 transition-all duration-300 cursor-default uppercase tracking-tighter">
                                        {pub.name}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
