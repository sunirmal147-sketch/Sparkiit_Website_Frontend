"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { useHomepageData } from '@/hooks/useHomepageData';

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="flex-shrink-0 w-[300px] sm:w-[350px] md:w-[450px] p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:border-[#00875a]/30 hover:bg-white/[0.08]"
    >
      {/* Lime accent glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00875a]/10 rounded-full blur-[80px] group-hover:bg-[#00875a]/20 transition-all duration-500" />
      
      {/* Quote Icon */}
      <div className="mb-6">
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6667 0C18.1067 0 23.3333 5.22667 23.3333 11.6667C23.3333 21.36 15.5333 28.3333 6.13333 30L5.33333 26.6667C10 25 13.3333 21.4933 13.3333 18.3333C13.3333 16.6667 12 15 10 15C7.24 15 5 12.76 5 10C5 4.48 9 0 11.6667 0ZM28.3333 0C34.7733 0 40 5.22667 40 11.6667C40 21.36 32.2 28.3333 22.8 30L22 26.6667C26.6667 25 30 21.4933 30 18.3333C30 16.6667 28.6667 15 26.6667 15C23.9067 15 21.6667 12.76 21.6667 10C21.6667 4.48 25.6667 0 28.3333 0Z" fill="#00875a" fillOpacity="0.4"/>
        </svg>
      </div>

      <p className="text-xl md:text-2xl font-medium text-gray-200 leading-relaxed mb-10 italic">
        &quot;{testimonial.content}&quot;
      </p>

      <div className="flex items-center gap-4 mt-auto">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#00875a]/20 group-hover:border-[#00875a]/50 transition-all duration-500">
          <Image
            src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=a8e03e&color=000` }
            alt={testimonial.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-lg font-bold text-white group-hover:text-[#00875a] transition-colors">
            {testimonial.name}
          </h4>
          <p className="text-sm text-gray-400 font-medium">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  testimonials?: { _id: string; name: string; role: string; content: string; avatar?: string }[];
}

const Testimonials = (props: TestimonialsContent) => {
  const { data } = useHomepageData();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const xParallax = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Fallback data if backend is empty
  const defaultTestimonials = [
    {
      _id: '1',
      name: 'Alex Rivera',
      role: 'CEO at Visionary Labs',
      content: 'SPARKIIT transformed our digital presence. Their attention to detail and innovative approach is unmatched in the industry.',
      avatar: ''
    },
    {
      _id: '2',
      name: 'Sarah Chen',
      role: 'Founder of Nexus AI',
      content: 'The team at SPARKIIT are true partners. They didn\'t just build a website; they built an experience that our customers love.',
      avatar: ''
    },
    {
      _id: '3',
      name: 'Marcus Thorne',
      role: 'Marketing Director',
      content: 'Working with SPARKIIT was the best decision for our rebranding. Their creative vision is truly world-class.',
      avatar: ''
    },
    {
      _id: '4',
      name: 'Elena Gomez',
      role: 'CTO at CloudBase',
      content: 'Highly technical and incredibly creative. SPARKIIT is the rare agency that excels at both form and function.',
      avatar: ''
    }
  ];

  const title = props.title || "Voices of Success";
  const subtitle = props.subtitle || data?.content?.testimonials?.subtitle || "Mentors Dedicated to Supporting Your Growth";
  const testimonials = props.testimonials?.length ? props.testimonials : (data?.testimonials?.length ? data.testimonials : defaultTestimonials);
  
  // Duplicate for infinite scroll
  const doubledTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section ref={containerRef} className="bg-[#050505] py-16 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#00875a]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[#00875a]/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-20 mb-20 relative z-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-4"
        >
          Testimonials
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter"
        >
          {title.split(' ').map((word, i) => (
            <React.Fragment key={i}>
              <span className={word.toLowerCase() === 'success' ? "text-transparent bg-clip-text bg-gradient-to-r from-[#00875a] to-[#00a86b]" : ""}>
                {word}{" "}
              </span>
            </React.Fragment>
          ))}
        </motion.h2>
      </div>

      <div className="relative w-full overflow-hidden py-10">
        <motion.div
          animate={{
            x: ["0%", "-33.33%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-8 w-max"
        >
          {doubledTestimonials.map((testimonial, idx) => (
            <TestimonialCard key={`${testimonial._id}-${idx}`} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center mt-20 relative z-10">
        <motion.p
          style={{ opacity }}
          className="text-white text-3xl md:text-5xl font-black max-w-4xl mx-auto uppercase tracking-tighter leading-tight"
        >
          <span className="text-[#00875a]">Mentors Dedicated to</span> <br className="hidden md:block" /> Supporting Your Growth
        </motion.p>
      </div>
    </section>
  );
};

export default Testimonials;