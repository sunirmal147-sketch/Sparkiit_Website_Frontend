"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Play } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import TextReveal from "@/components/TextReveal";
import PremiumButton from "@/components/PremiumButton";

export interface HeroContent {
    word1?: string;
    word2?: string;
    word3?: string;
    title?: string;
    subtitle?: string;
    tagline?: string;
    ctaText?: string;
    ctaLink?: string;
    videoThumbnail?: string;
    videoUrl?: string;
}

export default function HeroSection(props: HeroContent) {
    const { data } = useHomepageData();
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    // Mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const { clientX, clientY } = e;
            const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
            // Calculate position relative to container, center as 0,0
            const x = (clientX - left - width / 2) / 25;
            const y = (clientY - top - height / 2) / 25;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);
    
    // Merge props with homepage data
    const isInternalPage = !!(props.title || props.word1);
    
    const hero = {
        word1: props.word1 || props.title || (isInternalPage ? "" : data?.content?.hero?.word1) || "IDEA",
        word2: props.word2 || props.subtitle || (isInternalPage ? "" : data?.content?.hero?.word2) || "INNOVATE",
        word3: props.word3 || (isInternalPage ? "" : data?.content?.hero?.word3) || (isInternalPage ? "" : "TRANSFORM"),
        tagline: props.tagline || (isInternalPage ? "" : data?.content?.hero?.tagline) || "Where ambition meets opportunity.",
        ctaText: props.ctaText || (isInternalPage ? "" : data?.content?.hero?.ctaText) || "Get Started",
        ctaLink: props.ctaLink || "/contact",
        videoThumbnail: props.videoThumbnail || "",
        videoUrl: props.videoUrl || ""
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Parallax and fade effects for the text - reduced for mobile
    const xIdea = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 40 : 150]);
    const xInnovate = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 80 : 300]);
    const xTransform = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 120 : 450]);
    const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

    // Star rotation based on scroll
    const starRotate = useTransform(scrollYProgress, [0, 1], [0, 360 * 2]);

    const words = [hero.word1, hero.word2, hero.word3].filter(Boolean);
    const xTransforms = [xIdea, xInnovate, xTransform];

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-24 md:pt-20 overflow-hidden">
            {/* Background gradients/effects mimicking the reference */}
            <div className="absolute top-0 right-0 w-[100vw] md:w-[80vw] h-[80vh] bg-[#00875a]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[70vw] md:w-[50vw] h-[50vh] bg-[#006644]/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-5xl">
                <h1 className="text-[12vw] xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] tracking-tighter">
                    {words.map((word, index) => (
                        <div key={index} className="flex items-center py-1 md:py-0">
                            <motion.div
                                style={{
                                    x: xTransforms[index],
                                    opacity: opacity,
                                }}
                                className="flex items-center"
                            >
                                {index === 1 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        style={{ 
                                            rotate: starRotate,
                                            x: springX,
                                            y: springY
                                        }}
                                        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        className="inline-block mr-2 md:mr-4 text-[#00875a] cursor-default text-3xl md:text-6xl lg:text-8xl"
                                    >
                                        ✦
                                    </motion.span>
                                )}
                                <TextReveal text={word || ""} delay={index * 0.2} />
                            </motion.div>
                        </div>
                    ))}
                </h1>
            </div>

            <div className="relative z-10 mt-10 md:mt-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-10 border-t border-white/10 pt-10">
                <div className="max-w-md">
                    <p className="text-sm md:text-base text-gray-400 uppercase tracking-widest leading-relaxed">
                        {hero.tagline}
                    </p>
                    <div className="mt-8">
                        <PremiumButton text={hero.ctaText || "Let's Talk"} variant="primary" href="/contact" />
                    </div>
                </div>

                <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-white/10 p-4 bg-white/5 backdrop-blur-md">
                    <div className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-[#006644]/50 to-[#00875a]/50 flex items-center justify-center group cursor-pointer">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                            <Play className="text-[#00875a] ml-1" size={20} fill="#00875a" />
                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6 text-right drop-shadow-lg">
                        <p className="text-2xl font-light">DESIGN</p>
                        <p className="text-2xl font-bold">
                            TRENDS <span className="text-[#00875a]">2026</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
