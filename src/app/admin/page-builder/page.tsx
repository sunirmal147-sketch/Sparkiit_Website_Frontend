"use client";
import { API_BASE_URL } from "@/lib/api-config";

import React, { useState, useEffect } from "react";
import { 
    Save, 
    RefreshCw, 
    Eye, 
    EyeOff, 
    ChevronUp, 
    ChevronDown, 
    CheckCircle2,
    AlertCircle,
    Layout,
    Settings,
    X,
    Plus,
    Trash2,
    Type,
    Image as ImageIcon,
    Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

interface Section {
    name: string;
    enabled: boolean;
    order: number;
    content: any;
}

interface PageData {
    _id: string;
    name: string;
    sections: Section[];
}

export default function PageBuilder() {
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    
    // UI State
    const [activeSection, setActiveSection] = useState<number | null>(null);

    useEffect(() => {
        fetchPageData();
    }, []);

    const fetchPageData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/pages`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const home = data.data.find((p: any) => p.name === "Home");
                if (home) {
                    home.sections.sort((a: Section, b: Section) => a.order - b.order);
                    setPageData(home);
                }
            }
        } catch (error) {
            console.error("Error fetching page data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!pageData) return;
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem("adminToken");
            const updatedSections = pageData.sections.map((s, idx) => ({
                ...s,
                order: idx + 1
            }));

            const res = await fetch(`${API_BASE}/pages/${pageData._id}`, {
                method: "PUT",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sections: updatedSections
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Page layout & content saved!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: data.message || "Failed to save layout" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Server error occurred" });
        } finally {
            setSaving(false);
        }
    };

    const toggleSection = (index: number) => {
        if (!pageData) return;
        const newSections = [...pageData.sections];
        newSections[index].enabled = !newSections[index].enabled;
        setPageData({ ...pageData, sections: newSections });
    };

    const moveSection = (index: number, direction: "up" | "down") => {
        if (!pageData) return;
        const newSections = [...pageData.sections];
        const newPos = direction === "up" ? index - 1 : index + 1;
        if (newPos < 0 || newPos >= newSections.length) return;
        [newSections[index], newSections[newPos]] = [newSections[newPos], newSections[index]];
        setPageData({ ...pageData, sections: newSections });
    };

    const updateSectionContent = (index: number, content: any) => {
        if (!pageData) return;
        const newSections = [...pageData.sections];
        newSections[index].content = content;
        setPageData({ ...pageData, sections: newSections });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    if (!pageData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-white/40 text-center p-10">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Home configuration not found</p>
                <p className="mt-2 opacity-50 text-sm">Please initialize the database with a "Home" page record.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 flex gap-8">
            {/* Main Builder Area */}
            <div className="flex-1">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                            Page <span className="text-[#00875a]">Builder</span>
                        </h1>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">
                            Orchestrating the Digital Experience
                        </p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-[#00875a] hover:bg-[#00c978] disabled:opacity-50 text-black font-black px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                        {saving ? "Deploying..." : "Save Layout"}
                    </button>
                </header>

                {message && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                        {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {pageData.sections.map((section, index) => (
                        <div key={section.name} className={`group bg-white/5 border rounded-2xl p-4 flex items-center gap-4 transition-all ${activeSection === index ? "border-[#00875a] bg-white/[0.08]" : "border-white/10 hover:border-white/20"} ${!section.enabled ? "opacity-40" : ""}`}>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => moveSection(index, "up")} disabled={index === 0} className="p-1 hover:text-[#00875a] disabled:opacity-0"><ChevronUp size={20} /></button>
                                <button onClick={() => moveSection(index, "down")} disabled={index === pageData.sections.length - 1} className="p-1 hover:text-[#00875a] disabled:opacity-0"><ChevronDown size={20} /></button>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.enabled ? "bg-[#00875a]/20 text-[#00875a]" : "bg-white/5 text-white/20"}`}>
                                <Layout size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-black text-white uppercase tracking-wider truncate">
                                    {section.name.replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{section.name}</span>
                                    {section.enabled && <span className="w-1 h-1 rounded-full bg-[#00875a]"></span>}
                                    {section.enabled && <span className="text-[9px] font-black text-[#00875a] uppercase tracking-widest">Active</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setActiveSection(index)}
                                    className={`p-2 rounded-xl transition-all ${activeSection === index ? "bg-[#00875a] text-black" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"}`}
                                >
                                    <Settings size={18} />
                                </button>
                                <button 
                                    onClick={() => toggleSection(index)}
                                    className={`p-2 rounded-xl transition-all ${section.enabled ? "text-[#00875a] hover:bg-[#00875a]/10" : "text-white/20 hover:text-white"}`}
                                >
                                    {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Editor Panel */}
            <AnimatePresence>
                {activeSection !== null && (
                    <motion.div 
                        initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
                        className="w-96 bg-[#141414] border-l border-white/10 p-6 flex flex-col h-[calc(100vh-100px)] sticky top-24 rounded-3xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Content <span className="text-[#00875a]">Editor</span></h2>
                            <button onClick={() => setActiveSection(null)} className="text-white/20 hover:text-white transition-colors"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                           <SectionContentForm 
                                section={pageData.sections[activeSection]} 
                                onChange={(content) => updateSectionContent(activeSection, content)} 
                           />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SectionContentForm({ section, onChange }: { section: Section, onChange: (content: any) => void }) {
    const content = section.content || {};

    const handleChange = (key: string, value: any) => {
        onChange({ ...content, [key]: value });
    };

    const labelStyle = "text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block";
    const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#00875a] outline-none transition-all placeholder:text-white/10";

    // Dynamic fields based on section name
    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-white/5">
                <p className="text-[10px] font-black text-[#00875a] uppercase tracking-widest mb-1">Target Section</p>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{section.name}</h4>
            </div>

            {/* Standard Hero Schema */}
            {section.name === "Hero" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Headline</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Sub-Headline</label>
                        <textarea className={`${inputStyle} min-h-[100px]`} value={content.subtitle || ""} onChange={(e: any) => handleChange("subtitle", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>Button Text</label>
                            <input className={inputStyle} value={content.ctaText || ""} onChange={(e: any) => handleChange("ctaText", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelStyle}>Button Link</label>
                            <input className={inputStyle} value={content.ctaLink || ""} onChange={(e: any) => handleChange("ctaLink", e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Background Image URL</label>
                        <input className={inputStyle} value={content.bgImage || ""} onChange={(e: any) => handleChange("bgImage", e.target.value)} />
                    </div>
                </div>
            )}

            {/* Standard Features Schema */}
            {section.name === "Features" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Feature Items</label>
                    <div className="space-y-4">
                        {(content.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group">
                                <button 
                                    onClick={() => {
                                        const newItems = [...content.items];
                                        newItems.splice(idx, 1);
                                        handleChange("items", newItems);
                                    }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-black"
                                >
                                    <X size={12} />
                                </button>
                                <div className="space-y-3">
                                    <input className={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e: any) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...item, title: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                    <textarea className={`${inputStyle} text-xs`} placeholder="Description" value={item.desc || ""} onChange={(e: any) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...item, desc: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => handleChange("items", [...(content.items || []), { title: "", desc: "", icon: "" }])}
                            className="w-full py-3 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center gap-2 text-white/20 hover:text-[#00875a] hover:border-[#00875a]/30 transition-all text-xs font-black uppercase tracking-widest"
                        >
                            <Plus size={16} /> Add Feature
                        </button>
                    </div>
                </div>
            )}

            {/* Generic Schema for others */}
            {!["Hero", "Features"].includes(section.name) && (
                <div className="space-y-6">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Visual Editor for {section.name} is coming soon.</p>
                        <p className="mt-2 text-[9px] font-bold text-[#00875a] uppercase tracking-widest">Only reordering & visibility are currently supported.</p>
                    </div>
                </div>
            )}
        </div>
    );
}