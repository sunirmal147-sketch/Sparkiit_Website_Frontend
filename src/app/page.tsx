"use client";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import ParallaxImage from "@/components/ParallaxImage";
import Marquee from "@/components/Marquee";
import OurStory from "@/components/OurStory";
import Collaborations from "@/components/Collaborations";
import WorkingProcess from "@/components/WorkingProcess";
import LatestProjects from "@/components/LatestProjects";
import ServicesOverview from "@/components/ServicesOverview";
import CompanyInsights from "@/components/CompanyInsights";
import RoadmapSection from "@/components/RoadmapSection";
import AmbassadorEngagement from "@/components/Testimonials";
import FeaturedIn from "@/components/FeaturedIn";
import MentorsSection from "@/components/MentorsSection";
import ReviewSection from "@/components/ReviewSection";
import Colleges from "@/components/Colleges";
import Footer from "@/components/Footer";
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
            
            {(() => {
              const sectionMap: Record<string, React.ReactNode> = {
                HeroSection: <HeroSection />,
                Marquee: <Marquee />,
                HorizontalScroll: <HorizontalScroll />,
                ServicesOverview: <ServicesOverview />,
                Collaborations: <Collaborations />,
                OurStory: <OurStory />,
                Colleges: <Colleges />,
                ReviewSection: <ReviewSection />,
                WorkingProcess: <WorkingProcess />,
                LatestProjects: <LatestProjects />,
                ParallaxImage: (
                  <section className="h-[80vh] w-full p-6 md:p-10 bg-[#050505] flex items-center justify-center">
                    <div className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative">
                      <ParallaxImage
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"
                        alt="Students collaborating"
                        className="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter mix-blend-overlay">
                          Learn Together
                        </h2>
                      </div>
                    </div>
                  </section>
                ),
                CompanyInsights: <CompanyInsights />,
                RoadmapSection: <RoadmapSection />,
                FeaturedIn: <FeaturedIn />,
                Testimonials: <AmbassadorEngagement />,
                MentorsSection: <MentorsSection />,
              };

              const defaultStructureNames = [
                "HeroSection", "Marquee", "HorizontalScroll", "ServicesOverview", 
                "Collaborations", "OurStory", "Colleges", "ReviewSection", 
                "WorkingProcess", "LatestProjects", "ParallaxImage", 
                "CompanyInsights", "RoadmapSection", "FeaturedIn", 
                "Testimonials", "MentorsSection"
              ];

              const pageStructure = data?.pageStructure && data.pageStructure.length > 0
                ? data.pageStructure
                    .filter(s => s.enabled)
                    .sort((a, b) => a.order - b.order)
                    .map(s => s.name)
                : defaultStructureNames;

              return pageStructure.map((sectionName, index) => (
                <React.Fragment key={`${sectionName}-${index}`}>
                  {sectionMap[sectionName]}
                </React.Fragment>
              ));
            })()}

            <Footer />
          </>
        )}
      </main>
    </>
  );
}
