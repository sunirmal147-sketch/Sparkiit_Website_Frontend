"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Clock, Filter, ChevronRight } from "lucide-react";
import { useState } from "react";

const JOBS = [
    { id: 1, title: "Senior Full Stack Developer", company: "Sparkiit Tech", location: "Remote / Bengaluru", type: "Full-time", category: "Development", salary: "₹18L - ₹24L", posted: "2 days ago" },
    { id: 2, title: "UI/UX Designer", company: "Creative Labs", location: "Hyderabad", type: "Contract", category: "Design", salary: "₹12L - ₹15L", posted: "5 hours ago" },
    { id: 3, title: "Blockchain Engineer", company: "Web3 Solutions", location: "Remote", type: "Full-time", category: "Development", salary: "₹25L - ₹35L", posted: "1 day ago" },
    { id: 4, title: "Digital Marketing Specialist", company: "Growth Media", location: "Mumbai", type: "Part-time", category: "Marketing", salary: "₹6L - ₹8L", posted: "3 days ago" },
    { id: 5, title: "Product Manager", company: "Sparkiit Labs", location: "Pune", type: "Full-time", category: "Management", salary: "₹20L - ₹28L", posted: "1 week ago" },
    { id: 6, title: "Social Media Intern", company: "Brandify", location: "Remote", type: "Internship", category: "Marketing", salary: "₹15K - ₹20K / month", posted: "12 hours ago" }
];

export default function JobPortalSection() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Development", "Design", "Marketing", "Management"];

    const filteredJobs = JOBS.filter(job => 
        (selectedCategory === "All" || job.category === selectedCategory) &&
        (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         job.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <section className="py-24 px-6 md:px-20 bg-[#050505]">
            <div className="max-w-7xl mx-auto">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 bg-white/5 p-2 rounded-2xl md:rounded-full border border-white/10 backdrop-blur-xl shadow-2xl mb-20">
                    <div className="flex-1 flex items-center px-6 gap-3">
                        <Search size={20} className="text-[#00875a]" />
                        <input type="text" placeholder="Search Job Title or Company..." className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-white/20 py-4" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all border ${selectedCategory === cat ? "bg-[#00875a] border-[#00875a] text-white shadow-lg shadow-[#00875a]/20" : "bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30"}`}>{cat}</button>
                    ))}
                </div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredJobs.map((job, index) => (
                        <motion.div key={job.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="group bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-[#00875a]/30 transition-all hover:bg-white/[0.02] flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#00875a]/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Briefcase size={24} className="text-[#00875a]" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#00875a] bg-[#00875a]/5 px-3 py-1 rounded-full border border-[#00875a]/20">{job.posted}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-[#00875a] transition-colors">{job.title}</h3>
                            <p className="text-white/40 text-sm font-medium mb-6">{job.company}</p>
                            <div className="space-y-3 mb-8 flex-1 text-white/60 text-xs">
                                <div className="flex items-center gap-3"><MapPin size={14} className="text-[#00875a]" /><span>{job.location}</span></div>
                                <div className="flex items-center gap-3"><Clock size={14} className="text-[#00875a]" /><span>{job.type}</span></div>
                                <div className="font-bold text-[#00875a]">{job.salary}</div>
                            </div>
                            <button className="w-full bg-white/5 border border-white/10 group-hover:bg-[#00875a] group-hover:border-[#00875a] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2">APPLY NOW <ChevronRight size={14} /></button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
