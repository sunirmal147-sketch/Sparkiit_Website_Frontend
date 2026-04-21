"use client";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useHomepageData } from "@/hooks/useHomepageData";

const DynamicIcon = ({ name, className, size }: { name: string, className?: string, size?: number }) => {
    // Map of known icons to fallback to if the name doesn't match a Lucide icon
    const IconComponent = (Icons as any)[name] || Icons.Globe;
    return <IconComponent className={className} size={size} />;
};

export default function DomainSelectionPage() {
    const { data, loading } = useHomepageData();
    const domains = data?.services || [];

    if (loading) {
        return (
            <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00875a]"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-20"
                    >
                        <p className="text-[#00875a] font-bold uppercase tracking-[0.4em] text-xs mb-6">Expertise Hub</p>
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                            Select Your <br /> <span className="text-white/20">Domain.</span>
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
                            Explore our specialized fields of expertise. Each domain represents a pillar of excellence at SPARKIIT.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domains.map((domain, index) => (
                            <Link 
                                key={index} 
                                href={`/courses?category=${encodeURIComponent(domain.title)}`}
                                className="group block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="h-full bg-white/5 border border-white/10 rounded-[40px] p-10 hover:border-[#00875a]/40 hover:bg-[#00875a]/5 transition-all duration-500 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="text-[#00875a]" size={24} />
                                    </div>
                                    
                                    <div className="mb-8 w-full aspect-video rounded-2xl overflow-hidden bg-white/5 group-hover:bg-[#00875a]/5 transition-colors">
                                        {domain.thumbnailUrl ? (
                                            <img 
                                                src={domain.thumbnailUrl} 
                                                alt={domain.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icons.Image size={40} className="text-white/10" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold mb-4 group-hover:text-[#00875a] transition-colors">{domain.title}</h3>
                                    <p className="text-gray-400 leading-relaxed font-medium line-clamp-3">
                                        {domain.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#00875a] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                        View Solutions <ArrowRight size={14} />
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
