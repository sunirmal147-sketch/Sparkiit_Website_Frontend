"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    items?: { name: string; logoUrl: string; link?: string }[];
}

export default function FeaturedIn(props: FeaturedInContent) {
    const { data } = useHomepageData();
    const title = props.title || "Featured In";
    const items = props.items || (data?.brands && data.brands.length > 0 ? data.brands : publications);

    const [selectedPdf, setSelectedPdf] = React.useState<{ url: string; name: string } | null>(null);

    const handleItemClick = (item: any) => {
        setSelectedPdf({ url: item.link || "", name: item.name });
    };

    return (
        <section className="py-20 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-16"
                >
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[#00875a] font-bold uppercase tracking-[0.2em] text-xs border border-[#00875a]/20 px-6 py-2.5 rounded-full backdrop-blur-sm">
                            As Seen On
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className={word.toLowerCase() === 'in' ? "text-[#00875a]" : ""}>
                                    {word}{" "}
                                </span>
                            ))}
                        </h2>
                    </div>

                    <div className="flex flex-nowrap justify-start md:justify-center items-center gap-4 sm:gap-6 md:gap-8 w-full max-w-7xl overflow-x-auto no-scrollbar py-4 px-6 scroll-smooth">
                        {items.map((pub, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group cursor-pointer flex flex-col items-center gap-4 flex-shrink-0 w-32 sm:w-40 md:w-48"
                                onClick={() => handleItemClick(pub)}
                            >
                                <div className="w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 group-hover:border-[#00875a]/40 bg-white/5 relative transition-all duration-500 shadow-lg group-hover:shadow-[0_10px_30px_-10px_rgba(0,135,90,0.2)]">
                                    {pub.logoUrl ? (
                                        <img 
                                            src={pub.logoUrl} 
                                            alt={pub.name} 
                                            className="w-full h-full object-contain p-5 transition-all duration-500 scale-95 group-hover:scale-105 opacity-80 group-hover:opacity-100 filter group-hover:brightness-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl font-black text-white/20 group-hover:text-[#00875a] uppercase tracking-tighter">
                                            {pub.name.substring(0, 2)}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-white uppercase tracking-[0.15em] text-center transition-colors">
                                    {pub.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Premium PDF Viewer Modal */}
            <AnimatePresence>
                {selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
                    >
                        <div 
                            onClick={() => setSelectedPdf(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md" 
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="relative w-full max-w-5xl h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[30px] overflow-hidden shadow-2xl flex flex-col z-10"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/2 flex-shrink-0">
                                <div>
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">{selectedPdf.name}</h3>
                                    <p className="text-xs text-[#00875a] font-mono tracking-widest uppercase">Secured Verification Document</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedPdf(null)}
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer font-bold text-lg"
                                >
                                    ×
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 bg-black relative" onContextMenu={(e) => e.preventDefault()}>
                                {selectedPdf.url ? (
                                    <iframe 
                                        src={`${selectedPdf.url}#toolbar=0&navpanes=0&scrollbar=1`}
                                        title={selectedPdf.name}
                                        className="w-full h-full border-none"
                                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/2">
                                        <div className="w-16 h-16 rounded-3xl bg-[#00875a]/10 border border-[#00875a]/20 flex items-center justify-center text-[#00875a] mb-6">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-white font-bold text-xl uppercase tracking-tight mb-2">Document Under Review</h4>
                                        <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                                            The secured PDF verification document is currently being compiled and will be uploaded shortly by the Administrator.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
