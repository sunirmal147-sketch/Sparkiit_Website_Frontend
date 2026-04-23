"use client";
import { API_BASE_URL } from "@/lib/api-config";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

// React 19 compatibility polyfill for react-quill
if (typeof window !== "undefined") {
    (ReactDOM as any).findDOMNode = (instance: any) => {
        if (!instance) return null;
        if (instance instanceof HTMLElement) return instance;
        return null;
    };
}
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
    Layers,
    ChevronLeft,
    ArrowLeft
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
    status?: 'active' | 'inactive';
    isSimple?: boolean;
    sections: Section[];
}

export default function PageBuilder() {
    const [pages, setPages] = useState<PageData[]>([]);
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    
    // UI State
    const [viewMode, setViewMode] = useState<"LIST" | "CREATE" | "EDIT">("LIST");
    const [activeSection, setActiveSection] = useState<number | null>(null);
    const [newPageData, setNewPageData] = useState({
        name: "",
        slug: "",
        content: "",
        status: "active" as "active" | "inactive"
    });

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
        if (!newPageData.name.trim()) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            
            // Create page with a CustomRichText section if content is provided
            const sections = [
                { name: "HeroSection", enabled: true, order: 1, content: {} },
                { 
                    name: "CustomRichText", 
                    enabled: true, 
                    order: 2, 
                    content: { html: newPageData.content } 
                },
                { name: "Footer", enabled: true, order: 3, content: {} }
            ];

            const res = await fetch(`${API_BASE}/pages`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    name: newPageData.name,
                    slug: newPageData.slug || newPageData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                    status: newPageData.status,
                    isSimple: true,
                    sections: sections
                })
            });
            const data = await res.json();
            if (data.success) {
                setPages([...pages, data.data]);
                selectPage(data.data);
                setViewMode("LIST");
                setNewPageData({ name: "", slug: "", content: "", status: "active" });
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

    const handleInitializePages = async () => {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const missingPages = [
            { name: "Domains", slug: "domains", sections: [{ name: "CourseCatalogSection", enabled: true, order: 0, content: {} }] },
            { name: "About Us", slug: "about", sections: [
                { name: "HeroSection", enabled: true, order: 0, content: { title: "WE ARE SPARKIIT.", subtitle: "Who We Are" } }, 
                { name: "OurStory", enabled: true, order: 1, content: {
                    subtitle: "SPARKIIT EDTECH LLP was created to solve a real problem—students often finish courses with theory, but lack the practical exposure companies expect.",
                    description: "From live training and guided mentorship to hands-on projects and structured internships, SPARKIIT designs programs that help learners move beyond classrooms and step confidently toward their careers."
                } }
            ] },
            { name: "Contact Us", slug: "contact", sections: [{ name: "ContactSection", enabled: true, order: 0, content: {} }] },
            { name: "Verification", slug: "verify", sections: [{ name: "VerifySection", enabled: true, order: 0, content: {} }] },
            { name: "Job Portal", slug: "job-portal", sections: [{ name: "JobPortalSection", enabled: true, order: 0, content: {} }] },
            { name: "Blogs", slug: "blog", sections: [{ name: "CustomRichText", enabled: true, order: 0, content: { html: "<h1>Coming Soon</h1>" } }] },
            { name: "FAQ", slug: "faqs", sections: [{ name: "FaqSection", enabled: true, order: 0, content: {} }] },
            { name: "Events", slug: "events", sections: [{ name: "CustomRichText", enabled: true, order: 0, content: { html: "<h1>Latest Events</h1>" } }] }
        ];

        try {
            for (const page of missingPages) {
                // Check if page already exists
                if (pages.some(p => p.slug === page.slug)) continue;

                await fetch(`${API_BASE}/pages`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(page)
                });
            }
            await fetchPages();
            setMessage({ type: "success", text: "CMS Pages Initialized Successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: "Failed to initialize some pages." });
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
        const newSections = pageData.sections.map((s, i) => 
            i === index ? { ...s, content: content } : s
        );
        setPageData({ ...pageData, sections: newSections });
    };

    if (loading && pages.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="animate-spin text-[#00875a]" size={32} />
            </div>
        );
    }

    if (viewMode === "CREATE") {
        const labelStyle = "text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 block";
        const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-[#00875a] outline-none transition-all placeholder:text-white/10";
        
        return (
            <div className="max-w-5xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-12 bg-white/5 p-6 rounded-[32px] border border-white/10">
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Create <span className="text-[#00875a]">Page</span></h1>
                        <p className="text-white/20 text-[10px] uppercase tracking-widest font-black mt-1">Design a new entry in your platform's architecture</p>
                    </div>
                    <button 
                        onClick={() => setViewMode("LIST")}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10 shadow-xl"
                    >
                        <ArrowLeft size={16} /> Back to Archive
                    </button>
                </div>

                <div className="space-y-10 bg-white/[0.02] p-10 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#00875a]/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div>
                            <label className={labelStyle}>Page Name <span className="text-red-500">*</span></label>
                            <input 
                                className={inputStyle}
                                placeholder="e.g. About Us, Service Details"
                                value={newPageData.name}
                                onChange={(e) => setNewPageData({ 
                                    ...newPageData, 
                                    name: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                                })}
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>URL Slug <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">/</span>
                                <input 
                                    className={`${inputStyle} pl-8`}
                                    placeholder="custom-slug"
                                    value={newPageData.slug}
                                    onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <label className={labelStyle}>Content <span className="text-red-500">*</span></label>
                        <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden quill-dark shadow-inner min-h-[400px]">
                            <ReactQuill 
                                theme="snow"
                                value={newPageData.content}
                                onChange={(val) => setNewPageData({ ...newPageData, content: val })}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'clean']
                                    ]
                                }}
                            />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <label className={labelStyle}>Visibility Status <span className="text-red-500">*</span></label>
                        <select 
                            className={`${inputStyle} cursor-pointer appearance-none`}
                            value={newPageData.status}
                            onChange={(e: any) => setNewPageData({ ...newPageData, status: e.target.value })}
                        >
                            <option value="active" className="bg-[#141414]">Active (Live on Website)</option>
                            <option value="inactive" className="bg-[#141414]">Inactive (Draft Mode)</option>
                        </select>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex justify-end relative z-10">
                        <button
                            onClick={handleCreatePage}
                            disabled={loading || !newPageData.name.trim()}
                            className="bg-[#00875a] hover:bg-[#00c978] disabled:opacity-30 text-black font-black px-12 py-5 rounded-[24px] uppercase tracking-widest text-xs transition-all shadow-[0_10px_40px_rgba(0,135,90,0.3)] hover:shadow-[0_15px_50px_rgba(0,135,90,0.4)] transform hover:scale-[1.02] active:scale-95 flex items-center gap-3"
                        >
                            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                            {loading ? "Generating Page..." : "Deploy New Page"}
                        </button>
                    </div>
                </div>

                <style jsx global>{`
                    .quill-dark .ql-toolbar {
                        background: rgba(255,255,255,0.03) !important;
                        border: none !important;
                        border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                        padding: 20px !important;
                    }
                    .quill-dark .ql-container {
                        border: none !important;
                        min-height: 350px;
                        font-family: 'Inter', sans-serif;
                        font-size: 15px;
                        color: white;
                    }
                    .quill-dark .ql-editor {
                        padding: 30px !important;
                    }
                    .quill-dark .ql-stroke { stroke: rgba(255,255,255,0.5) !important; }
                    .quill-dark .ql-fill { fill: rgba(255,255,255,0.5) !important; }
                    .quill-dark .ql-picker { color: rgba(255,255,255,0.5) !important; }
                    .quill-dark .ql-editor.ql-blank::before { color: rgba(255,255,255,0.15) !important; left: 30px !important; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-4 flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-100px)] animate-in fade-in duration-700">
            
            {/* Sidebar: Page List */}
            <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Pages</h2>
                    <button 
                        onClick={() => setViewMode("CREATE")}
                        className="p-2 bg-[#00875a]/20 text-[#00875a] rounded-xl hover:bg-[#00875a]/30 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <div className="flex-1 space-y-2 custom-scrollbar overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
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
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleInitializePages}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#00875a] hover:border-[#00875a]/30 transition-all flex items-center gap-2"
                                >
                                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                    Initialize CMS Pages
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-8 py-3 bg-[#00875a] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/20 flex items-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
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
                                        "FaqSection", "CustomRichText", "Footer",
                                        "Colleges", "FeaturedIn", "ReviewSection", 
                                        "Collaborations", "HorizontalScroll", "ParallaxImage", "ContactSection"
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
            </div>            {/* Content Editor Panel */}
            <AnimatePresence>
                {activeSection !== null && pageData && (
                    <motion.div 
                        initial={{ x: 500, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        exit={{ x: 500, opacity: 0 }}
                        className="fixed top-24 right-6 w-[500px] bg-[#141414] border border-white/10 p-8 flex flex-col h-[calc(100vh-140px)] rounded-[40px] shadow-[-20px_20px_80px_rgba(0,0,0,0.8)] z-[100] backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-10 shrink-0">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Content</h2>
                                <p className="text-[10px] font-black text-[#00875a] uppercase tracking-[0.3em] mt-1">Editor Panel</p>
                            </div>
                            <button 
                                onClick={() => setActiveSection(null)} 
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-editor-scrollbar scroll-smooth">
                           <SectionContentForm 
                                section={pageData.sections[activeSection]} 
                                onChange={(content) => updateSectionContent(activeSection, content)} 
                           />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-editor-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-editor-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-editor-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-editor-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 135, 90, 0.4);
                }
            `}</style>
        </div>
    );
}

function SectionContentForm({ section, onChange }: { section: Section, onChange: (content: any) => void }) {
    const content = section.content || {};

    const handleChange = (key: string, value: any) => {
        console.log(`[PageBuilder] Changing ${key}:`, value);
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
        <div className="space-y-10 pb-20">
            <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[32px] mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#00875a]/10 flex items-center justify-center text-[#00875a]">
                        <Settings size={16} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#00875a] uppercase tracking-widest">Active Section</p>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter italic leading-none mt-1 break-words max-w-[300px]">{section.name}</h4>
                    </div>
                </div>
                
                <div className="pt-4 border-t border-white/5">
                    <label className={labelStyle}>Section Identifier</label>
                    <div className="relative">
                        <input className={`${inputStyle} pl-10`} value={section.name} onChange={(e: any) => onChange({ ...content, _name: e.target.value })} placeholder="Internal Name" />
                        <Layout size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    </div>
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
                    </div>
                </div>
            )}
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

            {/* Hero Schema */}
            {section.name.includes("Hero") && (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelStyle}>Word 1</label>
                            <input className={inputStyle} value={content.word1 || ""} onChange={(e: any) => handleChange("word1", e.target.value)} placeholder="IDEA" />
                        </div>
                        <div>
                            <label className={labelStyle}>Word 2</label>
                            <input className={inputStyle} value={content.word2 || ""} onChange={(e: any) => handleChange("word2", e.target.value)} placeholder="INNOVATE" />
                        </div>
                        <div>
                            <label className={labelStyle}>Word 3</label>
                            <input className={inputStyle} value={content.word3 || ""} onChange={(e: any) => handleChange("word3", e.target.value)} placeholder="TRANSFORM" />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyle}>Tagline / Description</label>
                        <textarea className={`${inputStyle} min-h-[80px]`} value={content.tagline || ""} onChange={(e: any) => handleChange("tagline", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyle}>CTA Text</label>
                            <input className={inputStyle} value={content.ctaText || ""} onChange={(e: any) => handleChange("ctaText", e.target.value)} />
                        </div>
                        <div>
                            <label className={labelStyle}>CTA Link</label>
                            <input className={inputStyle} value={content.ctaLink || ""} onChange={(e: any) => handleChange("ctaLink", e.target.value)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Section Schema */}
            {section.name === "ContactSection" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Headline</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Email</label>
                        <input className={inputStyle} value={content.email || ""} onChange={(e: any) => handleChange("email", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Phone</label>
                        <input className={inputStyle} value={content.phone || ""} onChange={(e: any) => handleChange("phone", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Address</label>
                        <textarea className={inputStyle} value={content.address || ""} onChange={(e: any) => handleChange("address", e.target.value)} />
                    </div>
                </div>
            )}

            {/* Standard Text Content Schema */}
            {["OurStory", "CompanyInsights", "WorkingProcess", "ServicesOverview", "RoadmapSection", "Testimonials", "Colleges", "FeaturedIn", "ReviewSection", "Collaborations", "FaqSection", "HorizontalScroll", "MentorsSection", "Marquee", "ParallaxImage"].includes(section.name) ? (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Title</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                    {["MentorsSection", "ReviewSection", "FaqSection", "HorizontalScroll", "Collaborations", "OurStory"].includes(section.name) && (
                        <div>
                            <label className={labelStyle}>Subtitle / Slogan</label>
                            <textarea className={`${inputStyle} min-h-[80px]`} value={content.subtitle || ""} onChange={(e: any) => handleChange("subtitle", e.target.value)} />
                        </div>
                    )}
                    <div>
                        <label className={labelStyle}>Description</label>
                        <textarea className={`${inputStyle} min-h-[120px]`} value={content.description || ""} onChange={(e: any) => handleChange("description", e.target.value)} />
                    </div>
                </div>
            ) : !section.name.includes("Hero") && section.name !== "ContactSection" && section.name !== "CustomRichText" && (
                <div className="space-y-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-4 tracking-widest">Generic Properties</p>
                    <div>
                        <label className={labelStyle}>Title</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Description</label>
                        <textarea className={`${inputStyle} min-h-[120px]`} value={content.description || ""} onChange={(e: any) => handleChange("description", e.target.value)} />
                    </div>
                </div>
            )}

            {/* List Items Schema */}
            {["Marquee", "FeaturedIn"].includes(section.name) && (
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

            {/* Complex List: Working Process Steps */}
            {section.name === "WorkingProcess" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Steps</label>
                    <div className="space-y-4">
                        {(content.items || []).map((step: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button onClick={() => {
                                    const newItems = [...content.items];
                                    newItems.splice(idx, 1);
                                    handleChange("items", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div>
                                    <label className={labelStyle}>Number</label>
                                    <input className={inputStyle} value={step.num || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...step, num: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Title</label>
                                    <input className={inputStyle} value={step.title || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...step, title: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelStyle}>Description</label>
                                    <textarea className={inputStyle} value={step.description || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...step, description: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => handleChange("items", [...(content.items || []), { num: "", title: "", description: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Step</button>
                    </div>
                </div>
            )}

            {/* Complex List: Mentors */}
            {section.name === "MentorsSection" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Mentors</label>
                    <div className="space-y-4">
                        {(content.mentors || []).map((mentor: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const newItems = [...content.mentors];
                                    newItems.splice(idx, 1);
                                    handleChange("mentors", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Name" value={mentor.name || ""} onChange={(e) => {
                                        const newItems = [...content.mentors];
                                        newItems[idx] = { ...mentor, name: e.target.value };
                                        handleChange("mentors", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Image URL" value={mentor.photo || ""} onChange={(e) => {
                                        const newItems = [...content.mentors];
                                        newItems[idx] = { ...mentor, photo: e.target.value };
                                        handleChange("mentors", newItems);
                                    }} />
                                </div>
                                <textarea className={inputStyle} placeholder="Expertise / Role" value={mentor.description || ""} onChange={(e) => {
                                    const newItems = [...content.mentors];
                                    newItems[idx] = { ...mentor, description: e.target.value };
                                    handleChange("mentors", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("mentors", [...(content.mentors || []), { name: "", photo: "", description: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Mentor</button>
                    </div>
                </div>
            )}

            {/* Complex List: Roadmap Nodes */}
            {section.name === "RoadmapSection" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Roadmap Steps</label>
                    <div className="space-y-4">
                        {(content.items || []).map((node: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4 border-l-4 border-[#00875a]/30">
                                <button onClick={() => {
                                    const newItems = [...content.items];
                                    newItems.splice(idx, 1);
                                    handleChange("items", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelStyle}>Step Number</label>
                                        <input type="number" className={inputStyle} value={node.step || idx + 1} onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[idx] = { ...node, step: parseInt(e.target.value) };
                                            handleChange("items", newItems);
                                        }} />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Label Side</label>
                                        <select className={inputStyle} value={node.labelSide || "top"} onChange={(e) => {
                                            const newItems = [...content.items];
                                            newItems[idx] = { ...node, labelSide: e.target.value };
                                            handleChange("items", newItems);
                                        }}>
                                            <option value="top">Top</option>
                                            <option value="bottom">Bottom</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea className={inputStyle} placeholder="Step Title" value={node.title || ""} onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[idx] = { ...node, title: e.target.value };
                                    handleChange("items", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("items", [...(content.items || []), { step: (content.items?.length || 0) + 1, title: "", labelSide: "top" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Roadmap Step</button>
                    </div>
                </div>
            )}

            {/* Complex List: Horizontal Scroll Items */}
            {section.name === "HorizontalScroll" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Scroll Items (Domains)</label>
                    <div className="space-y-4">
                        {(content.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const newItems = [...content.items];
                                    newItems.splice(idx, 1);
                                    handleChange("items", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...item, title: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Category" value={item.category || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...item, category: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                                <input className={inputStyle} placeholder="Image URL" value={item.image || ""} onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[idx] = { ...item, image: e.target.value };
                                    handleChange("items", newItems);
                                }} />
                                <textarea className={inputStyle} placeholder="Description" value={item.description || ""} onChange={(e) => {
                                    const newItems = [...content.items];
                                    newItems[idx] = { ...item, description: e.target.value };
                                    handleChange("items", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("items", [...(content.items || []), { title: "", category: "", image: "", description: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Domain Card</button>
                    </div>
                </div>
            )}

            {/* Complex List: Testimonials */}
            {section.name === "Testimonials" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Testimonials</label>
                    <div className="space-y-4">
                        {(content.testimonials || []).map((t: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const newItems = [...content.testimonials];
                                    newItems.splice(idx, 1);
                                    handleChange("testimonials", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Name" value={t.name || ""} onChange={(e) => {
                                        const newItems = [...content.testimonials];
                                        newItems[idx] = { ...t, name: e.target.value };
                                        handleChange("testimonials", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Role" value={t.role || ""} onChange={(e) => {
                                        const newItems = [...content.testimonials];
                                        newItems[idx] = { ...t, role: e.target.value };
                                        handleChange("testimonials", newItems);
                                    }} />
                                </div>
                                <textarea className={inputStyle} placeholder="Testimonial Content" value={t.content || ""} onChange={(e) => {
                                    const newItems = [...content.testimonials];
                                    newItems[idx] = { ...t, content: e.target.value };
                                    handleChange("testimonials", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("testimonials", [...(content.testimonials || []), { name: "", role: "", content: "", avatar: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Testimonial</button>
                    </div>
                </div>
            )}

            {/* Complex List: Company Insights Stats */}
            {section.name === "CompanyInsights" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Key Stats</label>
                    <div className="space-y-4">
                        {(content.stats || []).map((s: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group grid grid-cols-2 gap-4">
                                <button onClick={() => {
                                    const newItems = [...content.stats];
                                    newItems.splice(idx, 1);
                                    handleChange("stats", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <input className={inputStyle} placeholder="Label (e.g. PROJECTS)" value={s.label || ""} onChange={(e) => {
                                    const newItems = [...content.stats];
                                    newItems[idx] = { ...s, label: e.target.value };
                                    handleChange("stats", newItems);
                                }} />
                                <input type="number" className={inputStyle} placeholder="Value" value={s.val || 0} onChange={(e) => {
                                    const newItems = [...content.stats];
                                    newItems[idx] = { ...s, val: parseInt(e.target.value) };
                                    handleChange("stats", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("stats", [...(content.stats || []), { label: "", val: 0 }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Stat Card</button>
                    </div>
                </div>
            )}

            {/* Complex List: FAQs */}
            {section.name === "FaqSection" && (
                <div className="space-y-6">
                    <label className={labelStyle}>FAQ Items</label>
                    <div className="space-y-4">
                        {(content.faqs || []).map((faq: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const newItems = [...content.faqs];
                                    newItems.splice(idx, 1);
                                    handleChange("faqs", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <input className={inputStyle} placeholder="Question" value={faq.question || ""} onChange={(e) => {
                                    const newItems = [...content.faqs];
                                    newItems[idx] = { ...faq, question: e.target.value };
                                    handleChange("faqs", newItems);
                                }} />
                                <textarea className={inputStyle} placeholder="Answer" value={faq.answer || ""} onChange={(e) => {
                                    const newItems = [...content.faqs];
                                    newItems[idx] = { ...faq, answer: e.target.value };
                                    handleChange("faqs", newItems);
                                }} />
                            </div>
                        ))}
                        <button onClick={() => handleChange("faqs", [...(content.faqs || []), { question: "", answer: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add FAQ</button>
                    </div>
                </div>
            )}

            {/* List Items Schema (String Array) */}
            {["Marquee", "FeaturedIn"].includes(section.name) && (
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

            {/* Complex List: Collaborations / Testimonials Generic */}
            {["Collaborations", "Testimonials", "HorizontalScroll", "ServicesOverview", "Colleges"].includes(section.name) && (
                <div className="space-y-6">
                    <label className={labelStyle}>Section Items</label>
                    <div className="space-y-4">
                        {(content.items || content.stats || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const listKey = content.items ? "items" : "stats";
                                    const newItems = [...(content[listKey] || [])];
                                    newItems.splice(idx, 1);
                                    handleChange(listKey, newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder={content.stats ? "Label" : "Title / Name"} value={item.title || item.name || item.label || ""} onChange={(e) => {
                                        const listKey = content.items ? "items" : "stats";
                                        const valKey = item.title ? "title" : (item.name ? "name" : "label");
                                        const newItems = [...(content[listKey] || [])];
                                        newItems[idx] = { ...item, [valKey]: e.target.value };
                                        handleChange(listKey, newItems);
                                    }} />
                                    <input className={inputStyle} placeholder={content.stats ? "Value" : (section.name === "Collaborations" ? "Logo Initial" : "Subtitle / Icon / Number")} value={item.subtitle || item.value || item.logo || item.num || item.category || ""} onChange={(e) => {
                                        const listKey = content.items ? "items" : "stats";
                                        const valKey = item.value ? "value" : (item.logo ? "logo" : (item.num ? "num" : (item.category ? "category" : "subtitle")));
                                        const newItems = [...(content[listKey] || [])];
                                        newItems[idx] = { ...item, [valKey]: e.target.value };
                                        handleChange(listKey, newItems);
                                    }} />
                                </div>
                                {["Testimonials", "HorizontalScrollSection", "ServicesOverview"].includes(section.name) && (
                                    <textarea className={`${inputStyle} text-xs`} placeholder="Description / Content" value={item.content || item.description || ""} onChange={(e) => {
                                        const listKey = "items";
                                        const valKey = item.content ? "content" : "description";
                                        const newItems = [...(content[listKey] || [])];
                                        newItems[idx] = { ...item, [valKey]: e.target.value };
                                        handleChange(listKey, newItems);
                                    }} />
                                )}
                                {["Testimonials", "HorizontalScrollSection"].includes(section.name) && (
                                    <input className={inputStyle} placeholder="Image URL" value={item.image || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...item, image: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                )}
                            </div>
                        ))}
                        <button 
                            onClick={() => {
                                const listKey = section.name === "Colleges" ? "stats" : "items";
                                const newItem = section.name === "Colleges" ? { label: "", value: "" } : 
                                               (section.name === "Collaborations" ? { name: "", logo: "" } : 
                                               (section.name === "HorizontalScrollSection" ? { title: "", num: "", category: "", description: "", image: "" } : { title: "", description: "" }));
                                handleChange(listKey, [...(content[listKey] || []), newItem]);
                            }} 
                            className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]"
                        >
                            + Add Section Item
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

            {/* Complex List: Latest Projects / RecognisedBy */}
            {section.name === "LatestProjects" && (
                <div className="space-y-6">
                    <label className={labelStyle}>Project Items</label>
                    <div className="space-y-4">
                        {(content.items || []).map((project: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl relative group space-y-4">
                                <button onClick={() => {
                                    const newItems = [...content.items];
                                    newItems.splice(idx, 1);
                                    handleChange("items", newItems);
                                }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-black z-10"><X size={12} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Project Title" value={project.title || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, title: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Category" value={project.category || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, category: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Date (e.g. 2024)" value={project.date || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, date: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Link URL" value={project.link || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, link: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className={inputStyle} placeholder="Logo URL / Text" value={project.logo || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, logo: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                    <input className={inputStyle} placeholder="Preview Image URL" value={project.image || ""} onChange={(e) => {
                                        const newItems = [...content.items];
                                        newItems[idx] = { ...project, image: e.target.value };
                                        handleChange("items", newItems);
                                    }} />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => handleChange("items", [...(content.items || []), { title: "", category: "", date: "", link: "", logo: "", image: "" }])} className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-xs font-black uppercase text-white/20 hover:text-[#00875a]">+ Add Project</button>
                    </div>
                </div>
            )}

            {/* Parallax Image Schema */}
            {section.name === "ParallaxImage" && (
                <div className="space-y-6">
                    <div>
                        <label className={labelStyle}>Image URL</label>
                        <input className={inputStyle} value={content.src || ""} onChange={(e: any) => handleChange("src", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Alt Text</label>
                        <input className={inputStyle} value={content.alt || ""} onChange={(e: any) => handleChange("alt", e.target.value)} />
                    </div>
                    <div>
                        <label className={labelStyle}>Overlay Title</label>
                        <input className={inputStyle} value={content.title || ""} onChange={(e: any) => handleChange("title", e.target.value)} />
                    </div>
                </div>
            )}

            {/* Generic Schema for others */}
            {!["HeroSection", "Hero", "Features", "OurStory", "CompanyInsights", "WorkingProcess", "Marquee", "FeaturedIn", "Colleges", "CustomRichText", "ServicesOverview", "RoadmapSection", "Testimonials", "ReviewSection", "Collaborations", "FaqSection", "HorizontalScrollSection", "MentorsSection", "LatestProjects", "ParallaxImage"].includes(section.name) && (
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