"use client";

import { motion } from "framer-motion";

const logosGroup1 = [
    "LOGOTYPE", "BLOCKCHAIN", "CRYPTO", "WEB3", "DEFI", "NFT", "SPARK", "AGENCY"
];

export interface MarqueeContent {
    title?: string;
    items?: string[];
}

export default function Marquee(props: MarqueeContent) {
    const title = props.title || "Hiring Partners";
    const initialItems = props.items || [];
    const items = initialItems.length > 0 ? initialItems : logosGroup1;

    return (
        <section className="py-12 border-y border-white/5 overflow-hidden bg-[#050505] flex flex-col gap-12">
            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-4 text-center">
                <span className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[12px] md:text-sm border border-[#00875a]/20 px-8 py-3.5 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(0,135,90,0.1)]">
                    {title}
                </span>
            </div>

            {/* First Marquee - Left to Right */}
            <div className="flex whitespace-nowrap opacity-30">
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {items.concat(items).map((logo, index) => (
                        <span
                            key={index}
                            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {items.concat(items).map((logo, index) => (
                        <span
                            key={index}
                            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
