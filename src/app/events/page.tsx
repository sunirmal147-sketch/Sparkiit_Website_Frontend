"use client";
import { API_BASE_URL } from "@/lib/api-config";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin, ArrowRight, RefreshCw, Clock, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/public";

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ongoing" | "upcoming" | "past">("upcoming");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_BASE}/events`);
            const data = await res.json();
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => event.type === activeTab);

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00875a] selection:text-black">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 md:px-20 bg-gradient-to-b from-[#00875a]/10 to-transparent">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">
                            SPARKIIT <span className="text-[#00875a]">Events</span>
                        </h1>
                        <p className="text-white/40 text-lg md:text-xl uppercase tracking-widest font-medium">
                            Be part of a new era of Learning driven by Innovation, Technology, and Real World Career Growth.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Tabs Section */}
            <section className="px-6 md:px-20 border-b border-white/5 sticky top-[72px] z-40 bg-[#050505] backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex gap-4 md:gap-8 overflow-x-auto no-scrollbar py-4 border-t border-white/5">
                    {[
                        { id: "ongoing", label: "Ongoing", icon: RefreshCw },
                        { id: "upcoming", label: "Upcoming", icon: Clock },
                        { id: "past", label: "Past Events", icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs md:text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeTab === tab.id 
                                ? "bg-[#00875a] text-white shadow-[0_0_20px_rgba(0,135,90,0.3)]" 
                                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? "animate-spin-slow" : ""} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Events Grid */}
            <section className="px-6 md:px-20 py-20 min-h-[60vh]">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-20">
                            <RefreshCw className="animate-spin mb-4" size={48} />
                            <p className="font-black uppercase tracking-widest">Loading Events...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl">
                            <Calendar size={64} className="mx-auto mb-6 text-white/10" />
                            <h3 className="text-2xl font-bold uppercase text-white/40">No {activeTab} events found</h3>
                            <p className="text-white/20 mt-2 uppercase tracking-widest text-sm">Check back later or explore other sections</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredEvents.map((event, index) => (
                                    <motion.div
                                        key={event._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-[#00875a]/30 transition-all duration-500"
                                    >
                                        <div className="h-64 overflow-hidden relative">
                                            <img 
                                                src={event.image} 
                                                alt={event.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
                                            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                                {event.type}
                                            </div>
                                        </div>

                                        <div className="p-8">
                                            <div className="flex flex-col gap-2 mb-6">
                                                <div className="flex items-center gap-2 text-[#00875a] text-xs font-bold uppercase tracking-widest">
                                                    <Calendar size={14} />
                                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
                                                    <MapPin size={14} />
                                                    {event.location}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#00875a] transition-colors leading-none">
                                                {event.title}
                                            </h3>
                                            <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-3">
                                                {event.description}
                                            </p>

                                            <a 
                                                href={event.link || "#"}
                                                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all"
                                            >
                                                Learn More <ArrowRight size={16} className="text-[#00875a]" />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
