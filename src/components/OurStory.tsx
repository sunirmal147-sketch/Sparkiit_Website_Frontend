"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import TextReveal from "./TextReveal";
import PremiumButton from "./PremiumButton";

export interface OurStoryContent {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
}

export default function OurStory(props: OurStoryContent) {
    const { data } = useHomepageData();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const opacityFade = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const story = {
        title: props.title || data?.content?.story?.title || "The journey of SPARKIIT",
        subtitle: props.subtitle || data?.content?.story?.subtitle || "Since our inception, we have been empowering learners with industry-focused education across diverse domains, helping them build real-world skills, explore career paths, and stay ahead in an ever-evolving digital world.",
        description: props.description || data?.content?.story?.description || "Our mission is to empower learners with the knowledge, skills, and guidance they need to shape their future. We believe education should open doors, not create barriers. By combining practical learning with industry expertise, we deliver experiences that are engaging, career-focused, and built for real-world success.",
        image: props.image || ""
    };

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-20 bg-[#050505] overflow-hidden">
            <motion.div 
                style={{ y: yParallax, opacity: opacityFade }}
                className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start"
            >
                <div className="lg:sticky lg:top-32 w-full lg:w-1/3">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        Our Story
                    </motion.p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter leading-tight">
                        <TextReveal text={(story.title || "").replace(' <br /> ', ' ')} />
                    </h2>
                </div>

                <div className="w-full lg:w-2/3 space-y-10">
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-xl md:text-3xl text-gray-300 leading-tight font-medium"
                    >
                        {story.subtitle}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-gray-500 leading-relaxed font-medium"
                    >
                        {story.description}
                    </motion.p>
                    <div className="pt-10">
                        <PremiumButton text="Read Full Story" variant="secondary" href="/about?fullstory=true" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
