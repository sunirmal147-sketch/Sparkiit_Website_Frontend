"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { useHomepageData } from "@/hooks/useHomepageData";
import Preloader from "@/components/Preloader";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const { data, loading, error } = useHomepageData();
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!introComplete && (
          <Preloader onComplete={() => setIntroComplete(true)} />
        )}
      </AnimatePresence>

      <main className={`min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black transition-opacity duration-1000 ${introComplete && !loading ? 'opacity-100' : 'opacity-0'}`}>
        {!loading && (
          <>
            <Navbar />
            
            {error ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
                <h2 className="text-2xl font-bold text-[#00875a] mb-4 uppercase tracking-widest">Unable to load sections</h2>
                <p className="text-white/40 text-sm max-w-md mx-auto mb-8">We encountered an issue fetching the homepage content. Please try again later or contact support if the issue persists.</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#00875a] hover:text-black transition-all">Reload Page</button>
              </div>
            ) : (
              <SectionRenderer 
                sections={data?.pageStructure?.map(s => ({
                  name: s.name,
                  enabled: s.enabled,
                  order: s.order,
                  content: s.name === 'HorizontalScroll' ? { ...s.content, items: data.horizontalScrollItems } : (s.content || {})
                })) || []} 
              />
            )}

            <Footer />
          </>
        )}
      </main>
    </>
  );
}
