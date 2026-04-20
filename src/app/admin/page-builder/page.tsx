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
    Link as LinkIcon,
    Edit2,
    Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
    slug: string;
    sections: Section[];
}

export default function PageBuilder() {
    const [pages, setPages] = useState<PageData[]>([]);
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    
    // UI State
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [showAddPageModal, setShowAddPageModal] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [newPageSlug, setNewPageSlug] = useState("");

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/pages`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPages(data.data);
                // By default select Home page or first page
                const home = data.data.find((p: any) => p.name === "Home") || data.data[0];
                if (home) {
                    selectPage(home);
                }
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const selectPage = (page: PageData) => {
        const sorted = { ...page, sections: [...page.sections].sort((a, b) => a.order - b.order) };
        setPageData(sorted);
        setActiveSection(null);
    };

    const handleCreatePage = async () => {
        if (!newPageName.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/pages`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name: newPageName,
                    slug: newPageSlug || newPageName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    sections: [
                        { name: "HeroSection", enabled: true, order: 1, content: {} },
                        { name: "Footer", enabled: true, order: 2, content: {} }
                    ]
                })
            });
            const data = await res.json();
            if (data.success) {
                setPages([...pages, data.data]);
                selectPage(data.data);
                setShowAddPageModal(false);
                setNewPageName("");
                setNewPageSlug("");
                setMessage({ type: "success", text: "New page created!" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to create page" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/pages/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const updated = pages.filter(p => p._id !== id);
                setPages(updated);
                if (pageData?._id === id) {
                    selectPage(updated[0] || null);
                }
                setMessage({ type: "success", text: "Page deleted!" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete page" });
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
                    sections: updatedSections,
                    slug: pageData.slug,
                    name: pageData.name
                })
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: "success", text: "Page layout & content saved!" });
                setPages(pages.map(p => p._id === data.data._id ? data.data : p));
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

    if (loading && pages.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-4 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-100px)]">
            
            {/* Sidebar: Page List */}
            <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Pages</h2>
                    <button 
                        onClick={() => setShowAddPageModal(true)}
                        className="p-2 bg-[#00875a]/20 text-[#00875a] rounded-xl hover:bg-[#00875a]/30 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="flex-1 space-y-2">
                    {pages.map(page => (
                        <div 
                            key={page._id}
                            className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${pageData?._id === page._id ? "bg-[#00875a] text-black" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
                            onClick={() => selectPage(page)}
                        >
                            <div className="flex items-center gap-3">
                                <Layout size={18} />
                                <div className="flex flex-col">
                                    <span className="text-sm font-black uppercase tracking-widest">{page.name}</span>
                                    <span className="text-[9px] opacity-40 font-bold">/{page.slug}</span>
                                </div>
                            </div>
                            {page.name !== "Home" && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeletePage(page._id); }}
                                    className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all ${pageData?._id === page._id ? "text-black/40 hover:text-black" : "text-white/20 hover:text-red-500"}`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Builder Area */}
            <div className="flex-1">
                {!pageData ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/40 text-center p-10 bg-white/5 rounded-3xl border border-white/10 border-dashed">
                        <Layers size={48} className="mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs">No Page Selected</p>
                        <p className="mt-2 opacity-50 text-sm">Select a page from the sidebar or creates a new one.</p>
                    </div>
                ) : (
                    <>
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-2">
                                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        Editing: <span className="text-[#00875a]">{pageData.name}</span>
                                    </h1>
                                    <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 group">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mr-2 group-hover:text-[#00875a] transition-colors">Slug:</span>
                                        <input 
                                            value={pageData.slug}
                                            onChange={(e) => setPageData({ ...pageData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                            className="bg-transparent border-none outline-none text-[10px] font-black text-white uppercase tracking-widest w-32"
                                        />
                                    </div>
                                </div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
                                    <LinkIcon size={12} /> Live Path: {pageData.slug === 'Home' ? '/' : `/${pageData.slug}`}
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
                                <div key={`${section.name}-${index}`} className={`group bg-white/5 border rounded-2xl p-4 flex items-center gap-4 transition-all ${activeSection === index ? "border-[#00875a] bg-white/[0.08]" : "border-white/10 hover:border-white/20"} ${!section.enabled ? "opacity-40" : ""}`}>
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
                                        <button 
                                            onClick={() => {
                                                if (confirm("Remove this section?")) {
                                                    const newSections = [...pageData.sections];
                                                    newSections.splice(index, 1);
                                                    setPageData({ ...pageData, sections: newSections });
                                                    setActiveSection(null);
                                                }
                                            }}
                                            className="p-2 text-white/10 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 text-center">Add New Component</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {[
                                        "HeroSection", "Marquee", "OurStory", "ServicesOverview", 
                                        "WorkingProcess", "CompanyInsights", "LatestProjects", 
                                        "Testimonials", "MentorsSection", "RoadmapSection", 
                                        "FaqSection", "CustomRichText", "Footer"
                                    ].map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => {
                                                const newSections = [...pageData.sections, { 
                                                    name: type, 
                                                    enabled: true, 
                                                    order: pageData.sections.length + 1, 
                                                    content: {} 
                                                }];
                                                setPageData({ ...pageData, sections: newSections });
                                                setMessage({ type: "success", text: `${type} added!` });
                                                setTimeout(() => setMessage(null), 2000);
                                            }}
                                            className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00875a]/50 hover:bg-[#00875a]/5 transition-all group"
                                        >
                                            <Layout size={16} className="text-white/20 group-hover:text-[#00875a] mb-2" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white truncate w-full text-center">
                                                {type.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Content Editor Panel */}
            <AnimatePresence>
                {activeSection !== null && pageData && (
                    <motion.div 
                        initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
                        className="w-[500px] bg-[#141414] border-l border-white/10 p-6 flex flex-col h-[calc(100vh-100px)] sticky top-24 rounded-3xl"
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

            {/* Modal: Add Page */}
            <AnimatePresence>
                {showAddPageModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/60">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-md bg-[#141414] border border-white/10 p-8 rounded-3xl shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">New <span className="text-[#00875a]">Page</span></h2>
                                <button onClick={() => setShowAddPageModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block text-center lg:text-left">Page Name</label>
                                    <input 
                                        autoFocus
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-[#00875a] outline-none transition-all placeholder:text-white/10"
                                        placeholder="e.g. Courses, About Us..."
                                        value={newPageName}
                                        onChange={(e) => {
                                            setNewPageName(e.target.value);
                                            setNewPageSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 block text-center lg:text-left">Page Slug (URL)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">/</span>
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-4 text-sm text-white focus:border-[#00875a] outline-none transition-all placeholder:text-white/10"
                                            placeholder="custom-url"
                                            value={newPageSlug}
                                            onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))}
                                            onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreatePage}
                                    className="w-full bg-[#00875a] hover:bg-[#00c978] text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs transition-all"
                                >
                                    Create Page
                                </button>
                            </div>
                        </motion.div>
                    </div>
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

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    return (
        <div className="space-y-8">
            <div className="pb-4 border-b border-white/5">
                <p className="text-[10px] font-black text-[#00875a] uppercase tracking-widest mb-1">Target Section</p>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter italic">{section.name}</h4>
                <div className="mt-4">
                    <label className={labelStyle}>Section Identifier</label>
                    <input className={inputStyle} value={section.name} onChange={(e: any) => onChange({ ...content, _name: e.target.value })} placeholder="Internal Name" />
                </div>
            </div>

            {/* Custom Rich Text Editor */}
            {section.name === "CustomRichText" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Rich Text Content</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden quill-dark">
                            <ReactQuill 
                                theme="snow"
                                value={content.html || ""}
                                onChange={(val) => handleChange("html", val)}
                                modules={quillModules}
                            />
                        </div>
                        <style jsx global>{`
                            .quill-dark .ql-toolbar {
                                background: rgba(255,255,255,0.05) !important;
                                border: none !important;
                                border-bottom: 1px solid rgba(255,255,255,0.1) !important;
                            }
                            .quill-dark .ql-container {
                                border: none !important;
                                min-height: 250px;
                                font-family: inherit;
                                font-size: 14px;
                                color: white;
                            }
                            .quill-dark .ql-stroke { stroke: rgba(255,255,255,0.6) !important; }
                            .quill-dark .ql-fill { fill: rgba(255,255,255,0.6) !important; }
                            .quill-dark .ql-picker { color: rgba(255,255,255,0.6) !important; }
                            .quill-dark .ql-editor.ql-blank::before { color: rgba(255,255,255,0.2) !important; }
                        `}</style>
                    </div>
                </div>
            )}

            {/* Standard Hero Schema */}
            {section.name.includes("Hero") && (
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
                </div>
            )}

            {/* Standard Text Content Schema */}
            {["OurStory", "CompanyInsights", "WorkingProcess"].includes(section.name) && (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Title</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Subtitle</label>
                        <textarea className={`${inputStyle} min-h-[80px]`} value={content.subtitle || ""} onChange={(e: any) => handleChange("subtitle", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Description</label>
                        <textarea className={`${inputStyle} min-h-[120px]`} value={content.description || ""} onChange={(e: any) => handleChange("description", e.target.value)} />
                    </div>
                </div>
            )}

            {/* List Components (FeaturedIn, Marquee, etc) */}
            {["Marquee", "FeaturedIn", "Colleges"].includes(section.name) && (
                <div className="space-y-6">
                    <label className={labelStyle}>Text Items</label>
                    <div className="space-y-3">
                        {(content.items || []).map((item: string, idx: number) => (
                            <div key={idx} className="flex gap-2">
                                <input className={inputStyle} value={item} onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[idx] = e.target.value;
                                    handleChange("items", newItems);
                                }} />
                                <button onClick={() => {
                                    const newItems = [...content.items];
                                    newItems.splice(idx, 1);
                                    handleChange("items", newItems);
                                }} className="p-3 bg-red-500/10 text-red-500 rounded-xl"><X size={16} /></button>
                            </div>
                        ))}
                        <button 
                            onClick={() => handleChange("items", [...(content.items || []), ""])}
                            className="w-full py-3 border border-dashed border-white/10 rounded-xl text-xs font-black uppercase text-white/40 hover:text-[#00875a] transition-all"
                        >
                            + Add Item
                        </button>
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
            {!["HeroSection", "Hero", "Features", "OurStory", "CompanyInsights", "WorkingProcess", "Marquee", "FeaturedIn", "Colleges", "CustomRichText"].includes(section.name) && (
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