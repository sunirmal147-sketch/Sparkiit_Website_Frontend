"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import TextReveal from "./TextReveal";

const fallbackProjects = [
    {
        num: "01",
        title: "DEX PROTOCOL",
        category: "BLOCKCHAIN",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "02",
        title: "NFT MARKETPLACE",
        category: "WEB3",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop"
    },
    {
        num: "03",
        title: "DAO GOVERNANCE",
        category: "CRYPTO",
        image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
    },
    {
        num: "04",
        title: "WALLET APPS",
        category: "FINTECH",
        image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2787&auto=format&fit=crop"
    }
];

function ProjectCard({ project, index }: { project: any; index: number }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Fold animation: rotateX from positive to negative as it moves through viewport
    const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [30, 0, 0, -30]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <motion.div
            ref={cardRef}
            style={{
                perspective: "1000px",
                rotateX,
                opacity,
                scale,
                y
            }}
            className="group relative cursor-pointer"
        >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-2xl mb-6 bg-white/5 border border-white/10">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                    {project.category}
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-[#a8e03e] transition-colors tracking-tighter uppercase">{project.title}</h3>
                    <p className="text-gray-500 text-xs font-bold tracking-[0.2em] underline decoration-[#a8e03e]/30 underline-offset-8 uppercase">explore project</p>
                </div>
                <span className="text-4xl font-black text-white/5 group-hover:text-[#a8e03e]/20 transition-colors">{project.num}</span>
            </div>
        </motion.div>
    );
}

export default function LatestProjects() {
    const { data } = useHomepageData();
    const projects = data?.projects && data.projects.length > 0 ? data.projects : fallbackProjects;

    return (
        <section className="py-32 px-6 md:px-20 bg-[#050505] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
                    <div className="border-l-4 border-[#a8e03e] pl-8">
                        <p className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-4">Our Portfolio</p>
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter leading-none">
                            <TextReveal text="Selected <br /> Works." />
                        </h2>
                    </div>
                    <button className="text-white/40 hover:text-[#a8e03e] transition-all uppercase font-black text-xs tracking-[0.3em] pb-2 border-b border-white/10 hover:border-[#a8e03e]">
                        View All Projects —
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 lg:gap-x-20">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
