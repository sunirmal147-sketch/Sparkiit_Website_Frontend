import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HorizontalScroll from "@/components/HorizontalScroll";
import ParallaxImage from "@/components/ParallaxImage";
import Marquee from "@/components/Marquee";
import OurStory from "@/components/OurStory";
import WorkingProcess from "@/components/WorkingProcess";
import LatestProjects from "@/components/LatestProjects";
import ServicesOverview from "@/components/ServicesOverview";
import CompanyInsights from "@/components/CompanyInsights";
import RoadmapSection from "@/components/RoadmapSection";
import AmbassadorEngagement from "@/components/Testimonials";
import MentorsSection from "@/components/MentorsSection";
import ReviewSection from "@/components/ReviewSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#a8e03e] selection:text-black">
      <Navbar />
      <HeroSection />

      {/* Ticker / Marquee Section */}
      <Marquee />

      {/* Services Horizontal Scroll (Existing) */}
      <HorizontalScroll />

      {/* Services Overview Section */}
      <ServicesOverview />

      {/* Our Story Section */}
      <OurStory />

      {/* Review / Rating Section */}
      <ReviewSection />

      {/* Working Process Section */}
      <WorkingProcess />

      {/* Latest Projects Section */}
      <LatestProjects />

      {/* Parallax Image Section (Existing) */}
      <section className="h-screen w-full p-6 md:p-20 bg-[#050505] flex items-center justify-center">
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

      {/* Company Insights Section */}
      <CompanyInsights />

      {/* Roadmap Section */}
      <RoadmapSection />

      <AmbassadorEngagement />

      {/* Final Call to Action / Footer Area */}
      <MentorsSection />

      <Footer />
    </main>
  );
}
