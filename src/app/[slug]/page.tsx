"use client";

import React, { use } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { usePageData } from "@/hooks/usePageData";
import Preloader from "@/components/Preloader";
import { AnimatePresence } from "framer-motion";

export default function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { data, loading, error } = usePageData(slug);
    const [introComplete, setIntroComplete] = React.useState(false);

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-10">
                <h1 className="text-6xl font-black uppercase tracking-tighter text-[#00875a] mb-4">404</h1>
                <p className="text-white/40 uppercase tracking-widest font-black text-xs">Page Not Found</p>
                <a href="/" className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00875a] hover:text-black transition-all">Back to Home</a>
            </div>
        );
    }

    return (
        <>
            <AnimatePresence>
                {!introComplete && (
                    <Preloader onComplete={() => setIntroComplete(true)} />
                )}
            </AnimatePresence>

            <main className={`min-h-screen bg-[#050505] text-white transition-opacity duration-1000 ${introComplete && !loading ? 'opacity-100' : 'opacity-0'}`}>
                {!loading && data && (
                    <>
                        <Navbar />
                        <SectionRenderer sections={data.sections} />
                        <Footer />
                    </>
                )}
            </main>
        </>
    );
}
