"use client";
import { API_BASE_URL } from "@/lib/api-config";

import React, { useState, useEffect, useCallback } from "react";
import { 
    Search, 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    EyeOff, 
    Tags as TagsIcon, 
    Globe, 
    User as UserIcon,
    Calendar,
    Save,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";


interface Blog {
    _id: string;
    title: string;
    slug: string;
    content: string;
    authorId?: { _id: string; name: string };
    category: string;
    imageUrl: string;
    tags: string[];
    status: 'publish' | 'draft';
    metaTitle?: string;
    metaDescription?: string;
    createdAt: string;
}

interface BlogForm {
    title: string;
    slug: string;
    content: string;
    authorId: string;
    category: string;
    imageUrl: string;
    tags: string[];
    status: 'publish' | 'draft';
    metaTitle: string;
    metaDescription: string;
}

const emptyBlog: BlogForm = { 
    title: "", 
    slug: "",
    content: "", 
    authorId: "", 
    category: "", 
    imageUrl: "", 
    tags: [],
    status: "draft",
    metaTitle: "",
    metaDescription: ""
};

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);
    const [form, setForm] = useState(emptyBlog);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [newTag, setNewTag] = useState("");

    const fetchBlogs = useCallback(() => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (statusFilter) params.append("status", statusFilter);

        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/blogs?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then((r) => r.json())
            .then((d) => { setBlogs(d.data || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search, statusFilter]);

    useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

    const openCreate = () => { setEditing(null); setForm(emptyBlog); setModalOpen(true); };
    const openEdit = (b: Blog) => { 
        setEditing(b); 
        setForm({ 
            title: b.title, 
            slug: b.slug,
            content: b.content, 
            authorId: b.authorId?._id || "", 
            category: b.category, 
            imageUrl: b.imageUrl,
            tags: b.tags || [],
            status: b.status || "draft",
            metaTitle: b.metaTitle || "",
            metaDescription: b.metaDescription || ""
        }); 
        setModalOpen(true); 
    };

    const handleSave = async () => {
        setSaving(true);
        const url = editing ? `${API_BASE}/blogs/${editing._id}` : `${API_BASE}/blogs`;
        const method = editing ? "PUT" : "POST";
        const token = localStorage.getItem("adminToken");
        try {
            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            setModalOpen(false);
            fetchBlogs();
        } catch { /* noop */ }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/blogs/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        setDeleteConfirm(null);
        fetchBlogs();
    };

    const addTag = () => {
        if (newTag.trim() && !form.tags.includes(newTag.trim())) {
            setForm({ ...form, tags: [...form.tags, newTag.trim()] });
            setNewTag("");
        }
    };

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "#fff",
        fontSize: 14,
        outline: "none",
        fontFamily: "inherit",
    };

    const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.1em" };

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header / Search */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        Blog <span className="text-[#00875a]">Management</span>
                    </h1>
                    <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Advanced CMS Module</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search articles..." 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-[#00875a] outline-none transition-all w-64"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-[#00875a] text-black font-black px-6 py-2.5 rounded-xl flex items-center gap-2 uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                    >
                        <Plus size={18} /> New Article
                    </button>
                </div>
            </header>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-20 text-center text-white/20 font-black uppercase tracking-[0.2em]">Loading articles...</div>
                ) : !blogs.length ? (
                    <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-white/20 font-black uppercase tracking-[0.2em]">No articles found</p>
                    </div>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog._id} className="group bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-6 items-center hover:border-[#00875a]/30 transition-all">
                            <div className="w-full md:w-32 h-20 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                                {blog.imageUrl ? <img src={blog.imageUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-white/10 font-black italic">No Image</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${blog.status === 'publish' ? 'bg-[#00875a]/20 text-[#00875a]' : 'bg-amber-500/20 text-amber-500'}`}>
                                        {blog.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{blog.category}</span>
                                </div>
                                <h3 className="text-lg font-black text-white truncate uppercase tracking-tight">{blog.title}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                                        <UserIcon size={12} /> {blog.authorId?.name || "Anonymous"}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                                        <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => openEdit(blog)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => setDeleteConfirm(blog._id)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-red-500 transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md overflow-y-auto pt-20 pb-20">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl p-8 my-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {editing ? 'Edit' : 'Create'} <span className="text-[#00875a]">Article</span>
                                </h2>
                                <button onClick={() => setModalOpen(false)} className="text-white/20 hover:text-white transition-colors"><X size={24} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* General Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label style={labelStyle}>Article Title</label>
                                        <input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Master Next.js 14" />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Custom Slug</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                                            <input style={{...inputStyle, paddingLeft: 38}} value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().split(' ').join('-')})} placeholder="master-nextjs-14" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label style={labelStyle}>Category</label>
                                            <input style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Status</label>
                                            <select style={inputStyle} value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                                                <option value="draft">Draft (Private)</option>
                                                <option value="publish">Publish (Live)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Article Content (Markdown/HTML Support)</label>
                                        <textarea style={{...inputStyle, minHeight: 200}} value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Write your masterpiece..." />
                                    </div>
                                </div>

                                {/* Media & SEO */}
                                <div className="space-y-6">
                                    <div>
                                        <label style={labelStyle}>Featured Image URL</label>
                                        <input style={inputStyle} value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
                                        {form.imageUrl && <img src={form.imageUrl} className="mt-2 w-full h-32 object-cover rounded-xl border border-white/10" alt="" />}
                                    </div>

                                    <div>
                                        <label style={labelStyle}>Tags</label>
                                        <div className="flex gap-2 mb-3">
                                            <input style={inputStyle} value={newTag} onChange={e => setNewTag(e.target.value)} onKeyPress={e => e.key === 'Enter' && addTag()} placeholder="Add Tag..." />
                                            <button onClick={addTag} className="bg-white/5 px-4 rounded-xl text-white/60 hover:text-white transition-all"><Plus size={20} /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {form.tags.map(tag => (
                                                <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-[#00875a]/10 border border-[#00875a]/20 rounded-lg text-[#00875a] text-[10px] font-black uppercase tracking-widest">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Globe size={16} className="text-[#00875a]" />
                                            <h3 className="text-xs font-black text-white uppercase tracking-widest">SEO Settings</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label style={labelStyle}>Meta Title</label>
                                                <input style={inputStyle} value={form.metaTitle} onChange={e => setForm({...form, metaTitle: e.target.value})} />
                                            </div>
                                            <div>
                                                <label style={labelStyle}>Meta Description</label>
                                                <textarea style={{...inputStyle, minHeight: 80}} value={form.metaDescription} onChange={e => setForm({...form, metaDescription: e.target.value})} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <footer className="mt-10 pt-8 border-t border-white/5 flex justify-end gap-3">
                                <button onClick={() => setModalOpen(false)} className="px-8 py-3 rounded-xl text-white/40 font-black uppercase tracking-widest text-xs hover:text-white transition-all">Cancel</button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-[#00875a] text-black font-black px-10 py-3 rounded-xl flex items-center gap-2 uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    <Save size={18} /> {saving ? 'Writing...' : 'Publish Article'}
                                </button>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#141414] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center"
                        >
                            <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Delete Article?</h3>
                            <p className="text-white/40 text-sm mb-8 font-medium italic">"Once deleted, this article cannot be recovered from the digital void."</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setDeleteConfirm(null)} className="px-6 py-3 rounded-xl bg-white/5 text-white/60 font-black uppercase tracking-widest text-xs hover:bg-white/10">Wait, Go Back</button>
                                <button onClick={() => handleDelete(deleteConfirm)} className="px-6 py-3 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600">Delete Forever</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}