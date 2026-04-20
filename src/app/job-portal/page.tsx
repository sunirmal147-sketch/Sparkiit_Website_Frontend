"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Clock, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";

const JOBS = [
    {
        id: 1,
        title: "Senior Full Stack Developer",
        company: "Sparkiit Tech",
        location: "Remote / Bengaluru",
        type: "Full-time",
        category: "Development",
        salary: "₹18L - ₹24L",
        posted: "2 days ago"
    },
    {
        id: 2,
        title: "UI/UX Designer",
        company: "Creative Labs",
        location: "Hyderabad",
        type: "Contract",
        category: "Design",
        salary: "₹12L - ₹15L",
        posted: "5 hours ago"
    },
    {
        id: 3,
        title: "Blockchain Engineer",
        company: "Web3 Solutions",
        location: "Remote",
        type: "Full-time",
        category: "Development",
        salary: "₹25L - ₹35L",
        posted: "1 day ago"
    },
    {
        id: 4,
        title: "Digital Marketing Specialist",
        company: "Growth Media",
        location: "Mumbai",
        type: "Part-time",
        category: "Marketing",
        salary: "₹6L - ₹8L",
        posted: "3 days ago"
    },
    {
        id: 5,
        title: "Product Manager",
        company: "Sparkiit Labs",
        location: "Pune",
        type: "Full-time",
        category: "Management",
        salary: "₹20L - ₹28L",
        posted: "1 week ago"
    },
    {
        id: 6,
        title: "Social Media Intern",
        company: "Brandify",
        location: "Remote",
        type: "Internship",
        category: "Marketing",
        salary: "₹15K - ₹20K / month",
        posted: "12 hours ago"
    }
];

export default function JobPortalPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Development", "Design", "Marketing", "Management"];

    const filteredJobs = JOBS.filter(job => 
        (selectedCategory === "All" || job.category === selectedCategory) &&
        (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         job.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a]/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-6 md:px-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#00875a15,transparent_50%)]" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
                    >
                        <p className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-[10px]">Careers @ Sparkiit</p>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        FIND YOUR <br /> <span className="text-white/20">FUTURE ROLE.</span>
                    </motion.h1>

                    {/* Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-2xl md:rounded-full border border-white/10 backdrop-blur-xl shadow-2xl"
                    >
                        <div className="flex-1 flex items-center px-6 gap-3">
                            <Search size={20} className="text-[#00875a]" />
                            <input 
                                type="text" 
                                placeholder="Search Job Title or Company..."
                                className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-white/20 py-4"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="bg-[#00875a] hover:bg-[#00a86b] text-white font-black py-4 px-10 rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-[#00875a]/20">
                            EXPLORE
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="pb-32 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all border ${
                                    selectedCategory === cat 
                                    ? "bg-[#00875a] border-[#00875a] text-white shadow-lg shadow-[#00875a]/20" 
                                    : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Job Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-[#00875a]/30 transition-all hover:bg-white/[0.02] flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00875a]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Briefcase size={24} className="text-[#00875a]" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#00875a] bg-[#00875a]/5 px-3 py-1 rounded-full border border-[#00875a]/20">
                                        {job.posted}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#00875a] transition-colors">{job.title}</h3>
                                <p className="text-white/40 text-sm font-medium mb-6">{job.company}</p>
                                
                                <div className="space-y-3 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-white/60 text-xs">
                                        <MapPin size={14} className="text-[#00875a]" />
                                        <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/60 text-xs">
                                        <Clock size={14} className="text-[#00875a]" />
                                        <span>{job.type}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-white/60 text-xs">
                                        <span className="font-bold text-[#00875a]">{job.salary}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-white/5 border border-white/10 group-hover:bg-[#00875a] group-hover:border-[#00875a] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">
                                    APPLY NOW
                                    <ChevronRight size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Filter size={40} className="mx-auto text-white/10 mb-4" />
                            <p className="text-white/40 font-medium">No jobs found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 px-6 md:px-20 border-t border-white/5 bg-[#080808]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">DONT MISS AN OPPORTUNITY</h2>
                    <p className="text-white/40 mb-10 max-w-xl mx-auto">Get notified immediately when a new position that matches your skill set is posted on our portal.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="your@email.com" 
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-[#00875a]/50 outline-none transition-all"
                        />
                        <button className="bg-white text-black font-black px-8 py-4 rounded-2xl hover:bg-[#00875a] hover:text-white transition-all uppercase text-[10px] tracking-widest">
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
