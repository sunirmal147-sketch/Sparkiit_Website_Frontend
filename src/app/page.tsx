"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { useHomepageData } from "@/hooks/useHomepageData";
import Preloader from "@/components/Preloader";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const { data, loading } = useHomepageData();
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
            
          <>
            <Navbar />
            
            <SectionRenderer 
              sections={data?.pageStructure?.map(s => ({
                name: s.name,
                enabled: s.enabled,
                order: s.order,
                content: {} // Homepage currently uses global store/content, but we can transition this later
              })) || []} 
            />

            <Footer />
          </>
          </>
        )}
      </main>
    </>
  );
}
