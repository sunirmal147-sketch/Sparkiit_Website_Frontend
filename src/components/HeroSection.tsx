"use client";

import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { useRef } from "react";

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Parallax and fade effects for the text
    const xIdea = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const xInnovate = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const xTransform = useTransform(scrollYProgress, [0, 1], [0, 450]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    const textAnimation: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
            },
        }),
    };

    const xTransforms = [xIdea, xInnovate, xTransform];

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-32 overflow-hidden">
            {/* Background gradients/effects mimicking the reference */}
            <div className="absolute top-0 right-0 w-[80vw] h-[80vh] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.9] tracking-tighter">
                    {["IDEA", "INNOVATE", "TRANSFORM"].map((word, index) => (
                        <div key={index} className="overflow-hidden flex items-center">
                            <motion.div
                                style={{
                                    x: xTransforms[index],
                                    opacity: opacity,
                                }}
                                className="flex items-center"
                            >
                                {index === 1 && (
                                    <motion.span
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        className="inline-block mr-4 text-[#a8e03e]"
                                    >
                                        ✦
                                    </motion.span>
                                )}
                                <motion.span
                                    custom={index}
                                    variants={textAnimation}
                                    initial="hidden"
                                    animate="visible"
                                    className="inline-block"
                                >
                                    {word}
                                </motion.span>
                            </motion.div>
                        </div>
                    ))}
                </h1>
            </div>

            <div className="relative z-10 mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-t border-white/10 pt-10">
                <div className="max-w-md">
                    <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest leading-relaxed">
                        Design and development for Blockchain, DeFi, Web3, and Crypto Start-ups.
                    </p>
                    <button className="mt-8 flex items-center gap-2 bg-[#a8e03e] text-black px-6 py-3 rounded-full font-bold uppercase text-sm hover:bg-[#96c937] transition-colors">
                        <span className="border border-black rounded-full p-1 border-opacity-30">→</span>
                        Let&apos;s Talk
                    </button>
                </div>

                <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-md">
                    <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-blue-900/50 to-red-900/50 flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <Play className="text-[#a8e03e] ml-1" size={20} fill="#a8e03e" />
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6 text-right drop-shadow-lg">
                        <p className="text-2xl font-light">DESIGN</p>
                        <p className="text-2xl font-bold">
                            TRENDS <span className="text-[#a8e03e]">2026</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
