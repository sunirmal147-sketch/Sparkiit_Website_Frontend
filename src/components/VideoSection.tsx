"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface VideoSectionProps {
    videoUrl?: string;
    videoFile?: string; // Base64
    title?: string;
    description?: string;
    overlay?: boolean;
}

export default function VideoSection({ 
    videoUrl, 
    videoFile, 
    title, 
    description,
    overlay = true 
}: VideoSectionProps) {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const source = videoFile || videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-screen-close-up-34407-large.mp4";

    return (
        <section ref={containerRef} className="py-24 bg-[#050505] px-6 md:px-20 overflow-hidden">
            <motion.div 
                style={{ scale, opacity }}
                className="max-w-7xl mx-auto"
            >
                <div className="relative w-full aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl">
                    <video 
                        src={source}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    
                    {overlay && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-start justify-end p-8 md:p-20 transition-all duration-500">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="max-w-3xl"
                            >
                                {title && (
                                    <h2 className="text-3xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight mb-6">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-white/60 text-lg md:text-2xl font-medium max-w-2xl leading-relaxed">
                                        {description}
                                    </p>
                                )}
                            </motion.div>
                        </div>
                    )}
                    
                    {/* Premium Play Indicator (Visual Only) */}
                    <div className="absolute top-10 right-10">
                        <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 group-hover:scale-110 transition-transform duration-500">
                            <div className="w-3 h-3 rounded-full bg-[#00875a] animate-pulse" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
