"use client";

import React from "react";
import HeroSection from "./HeroSection";
import Marquee from "./Marquee";
import HorizontalScroll from "./HorizontalScroll";
import ServicesOverview from "./ServicesOverview";
import Collaborations from "./Collaborations";
import OurStory from "./OurStory";
import Colleges from "./Colleges";
import ReviewSection from "./ReviewSection";
import WorkingProcess from "./WorkingProcess";
import LatestProjects from "./LatestProjects";
import ParallaxImage from "./ParallaxImage";
import CompanyInsights from "./CompanyInsights";
import RoadmapSection from "./RoadmapSection";
import FeaturedIn from "./FeaturedIn";
import MentorsSection from "./MentorsSection";
import AmbassadorEngagement from "./Testimonials";
import RichTextSection from "./RichTextSection";
import FaqSection from "./FaqSection";
import ContactSection from "./ContactSection";
import VerifySection from "./VerifySection";
import CourseCatalogSection from "./CourseCatalogSection";
import JobPortalSection from "./JobPortalSection";
import VideoSection from "./VideoSection";

interface Section {
    name: string;
    enabled: boolean;
    order: number;
    content: any;
}

interface SectionRendererProps {
    sections: Section[];
}

export default function SectionRenderer({ sections }: SectionRendererProps) {
    const sectionMap: Record<string, (content: any) => React.ReactNode> = {
        HeroSection: (content) => <HeroSection {...content} />,
        Marquee: (content) => <Marquee {...content} />,
        HorizontalScroll: (content) => <HorizontalScroll {...content} />,
        ServicesOverview: (content) => <ServicesOverview {...content} />,
        Collaborations: (content) => <Collaborations {...content} />,
        OurStory: (content) => <OurStory {...content} />,
        Colleges: (content) => <Colleges {...content} />,
        ReviewSection: (content) => <ReviewSection {...content} />,
        WorkingProcess: (content) => <WorkingProcess {...content} />,
        LatestProjects: (content) => <LatestProjects {...content} />,
        ParallaxImage: (content) => (
            <section className="h-[80vh] w-full p-6 md:p-10 bg-[#050505] flex items-center justify-center">
                <div className="w-full max-w-6xl h-[80vh] rounded-3xl overflow-hidden relative">
                    <ParallaxImage
                        src={content.src || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"}
                        alt={content.alt || "Students collaborating"}
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white uppercase tracking-tighter mix-blend-overlay">
                            {content.title || "Learn Together"}
                        </h2>
                    </div>
                </div>
            </section>
        ),
        CompanyInsights: (content) => <CompanyInsights {...content} />,
        RoadmapSection: (content) => <RoadmapSection {...content} />,
        FeaturedIn: (content) => <FeaturedIn {...content} />,
        Testimonials: (content) => <AmbassadorEngagement {...content} />,
        MentorsSection: (content) => <MentorsSection {...content} />,
        FaqSection: (content) => <FaqSection {...content} />,
        CustomRichText: (content) => <RichTextSection html={content.html} />,
        ContactSection: (content) => <ContactSection {...content} />,
        VerifySection: (content) => <VerifySection {...content} />,
        CourseCatalogSection: (content) => <CourseCatalogSection {...content} />,
        JobPortalSection: (content) => <JobPortalSection {...content} />,
        VideoSection: (content) => <VideoSection {...content} />,
    };

    const sectionsArray = Array.isArray(sections) ? sections : [];
    const sortedSections = [...sectionsArray]
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

    return (
        <>
            {sortedSections.map((section, index) => {
                // Case-insensitive lookup
                const sectionName = section.name;
                const renderFn = sectionMap[sectionName] || 
                                 sectionMap[Object.keys(sectionMap).find(k => k.toLowerCase() === sectionName.toLowerCase()) || ""];
                
                if (!renderFn) {
                    console.warn(`[SectionRenderer] No component found for section: "${sectionName}"`);
                    return null;
                }

                console.log(`[SectionRenderer] Rendering ${sectionName} with content:`, section.content);
                
                return (
                    <React.Fragment key={`${sectionName}-${index}`}>
                        {renderFn(section.content || {})}
                    </React.Fragment>
                );
            })}
        </>
    );
}
