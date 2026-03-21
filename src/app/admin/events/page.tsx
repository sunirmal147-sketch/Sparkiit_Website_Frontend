"use client";

import React, { useState, useEffect } from "react";
import { 
    Plus, Search, Edit2, Trash2, Calendar, MapPin, 
    Save, X, RefreshCw, AlertCircle, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        image: "",
        type: "upcoming",
        link: ""
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/events`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
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

    const handleOpenModal = (event: any = null) => {
        if (event) {
            setEditingEvent(event);
            setFormData({
                title: event.title,
                description: event.description,
                date: new Date(event.date).toISOString().split('T')[0],
                location: event.location,
                image: event.image,
                type: event.type,
                link: event.link || ""
            });
        } else {
            setEditingEvent(null);
            setFormData({
                title: "",
                description: "",
                date: "",
                location: "",
                image: "",
                type: "upcoming",
                link: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const token = localStorage.getItem("adminToken");
            const url = editingEvent ? `${API_BASE}/events/${editingEvent._id}` : `${API_BASE}/events`;
            const method = editingEvent ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: `Event ${editingEvent ? "updated" : "created"} successfully!` });
                setIsModalOpen(false);
                fetchEvents();
            } else {
                setMessage({ type: "error", text: data.message || "Operation failed" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/events/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchEvents();
                setMessage({ type: "success", text: "Event deleted successfully" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete event" });
        }
    };

    return (
        <div className="p-6 md:p-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                        Manage <span className="text-[#a8e03e]">Events</span>
                    </h1>
                    <p className="text-white/40 text-sm uppercase tracking-widest font-medium">Create and manage Sparkiit community events</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-[#a8e03e] hover:bg-[#bef251] text-black font-black px-8 py-4 rounded-2xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                >
                    <Plus size={18} strokeWidth={3} />
                    Add New Event
                </button>
            </header>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
                        message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                >
                    {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="text-xs font-bold uppercase tracking-widest">{message.text}</p>
                </motion.div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 grayscale opacity-20">
                    <RefreshCw className="animate-spin mb-4" size={48} />
                    <p className="font-black uppercase tracking-widest">Loading Catalog...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-[#a8e03e]/40 transition-all duration-500">
                            <div className="h-48 relative overflow-hidden">
                                <img src={event.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 text-white">
                                    {event.type}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 uppercase truncate">{event.title}</h3>
                                <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-4">
                                    <Calendar size={12} /> {new Date(event.date).toLocaleDateString()}
                                    <span className="mx-1">•</span>
                                    <MapPin size={12} /> {event.location}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleOpenModal(event)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(event._id)}
                                        className="w-12 h-12 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                    {editingEvent ? "Edit" : "Create"} <span className="text-[#a8e03e]">Event</span>
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Title</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Type</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all"
                                            value={formData.type}
                                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="ongoing" className="bg-[#0a0a0a]">Ongoing</option>
                                            <option value="upcoming" className="bg-[#0a0a0a]">Upcoming</option>
                                            <option value="past" className="bg-[#0a0a0a]">Past</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Description</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Date</label>
                                        <input 
                                            type="date" 
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all"
                                            value={formData.date}
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Location</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Image URL</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#a8e03e] outline-none transition-all"
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={saving}
                                        className="flex-1 bg-[#a8e03e] text-black font-black py-4 rounded-xl hover:bg-[#bef251] disabled:opacity-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                    >
                                        {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                                        {saving ? "Saving..." : "Save Event"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
