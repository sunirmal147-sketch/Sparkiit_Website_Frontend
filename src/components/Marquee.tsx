"use client";

import { motion } from "framer-motion";

const logosGroup1 = [
    "LOGOTYPE", "BLOCKCHAIN", "CRYPTO", "WEB3", "DEFI", "NFT", "SPARK", "AGENCY"
];

const logosGroup2 = [
    "STRATEGY", "DESIGN", "DEVELOPMENT", "MARKETING", "SCALING", "INNOVATION", "UI/UX", "CLOUD"
];

export default function Marquee() {
    return (
        <section className="py-24 border-y border-white/5 overflow-hidden bg-[#050505] flex flex-col gap-12">
            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-4 text-center">
                <span className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-[10px] border border-[#a8e03e]/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    Collaborators
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
                    {logosGroup1.concat(logosGroup1).map((logo, index) => (
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
                    {logosGroup1.concat(logosGroup1).map((logo, index) => (
                        <span
                            key={index}
                            className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter"
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Second Marquee - Right to Left */}
            <div className="flex whitespace-nowrap">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{
                        duration: 50,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {logosGroup2.concat(logosGroup2).map((logo, index) => (
                        <span
                            key={index}
                            className="text-5xl md:text-8xl font-black text-[#a8e03e] uppercase tracking-tighter italic outline-text"
                            style={{ WebkitTextStroke: "1px rgba(168, 224, 62, 0.3)", color: "transparent" }}
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    transition={{
                        duration: 50,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-16 pr-16"
                >
                    {logosGroup2.concat(logosGroup2).map((logo, index) => (
                        <span
                            key={index}
                            className="text-5xl md:text-8xl font-black text-[#a8e03e] uppercase tracking-tighter italic outline-text"
                            style={{ WebkitTextStroke: "1px rgba(168, 224, 62, 0.3)", color: "transparent" }}
                        >
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
