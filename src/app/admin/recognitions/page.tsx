"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect, useCallback } from "react";

const API_BASE = API_BASE_URL + "/api/admin";

interface Recognition {
    _id: string;
    name: string;
    logoUrl: string;
    link: string;
    order: number;
}

export default function RecognitionsPage() {
    const [items, setItems] = useState<Recognition[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    
    const [form, setForm] = useState({
        name: "",
        logoUrl: "",
        link: "",
        order: 0
    });

    const fetchItems = useCallback(() => {
        const token = localStorage.getItem("adminToken");
        fetch(`${API_BASE}/recognitions`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => {
            if (json.success) setItems(json.data || []);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleSave = async () => {
        setSaving(true);
        const url = editingId ? `${API_BASE}/recognitions/${editingId}` : `${API_BASE}/recognitions`;
        const method = editingId ? "PUT" : "POST";
        const token = localStorage.getItem("adminToken");

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            const json = await res.json();
            if (json.success) {
                setIsFormOpen(false);
                fetchItems();
            }
        } catch (err) {
            console.error(err);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${API_BASE}/recognitions/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchItems();
    };

    const openEdit = (item: Recognition) => {
        setEditingId(item._id);
        setForm({
            name: item.name,
            logoUrl: item.logoUrl || "",
            link: item.link || "",
            order: item.order || 0
        });
        setIsFormOpen(true);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({ name: "", logoUrl: "", link: "", order: items.length });
        setIsFormOpen(true);
    };

    const inputStyle = {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        background: "#1a1a1a",
        border: "1px solid #333",
        color: "white",
        marginBottom: "16px"
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Featured In Management</h1>
                <button 
                    onClick={openCreate}
                    className="bg-[#00875a] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006644] transition-colors"
                >
                    Add Publication
                </button>
            </div>

            {loading ? (
                <div className="text-white/50">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                {item.logoUrl ? (
                                    <img src={item.logoUrl} alt={item.name} className="h-8 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
                                ) : (
                                    <div className="h-8 min-w-[40px] flex items-center justify-center text-sm font-black text-white/20 uppercase">
                                        {item.name}
                                    </div>
                                )}
                                <div className="ml-auto">
                                    <h3 className="text-white/50 text-xs font-bold uppercase">{item.name}</h3>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                                <button onClick={() => openEdit(item)} className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 py-2 rounded-lg text-sm transition-colors">Edit</button>
                                <button onClick={() => handleDelete(item._id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2 rounded-lg transition-colors">
                                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-[#141414] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
                            {editingId ? "Edit Publication" : "Add Publication"}
                        </h2>
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Publication Name</label>
                        <input 
                            style={inputStyle}
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            placeholder="e.g. Times of India"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Logo URL (Transparent PNG Best)</label>
                        <input 
                            style={inputStyle}
                            value={form.logoUrl}
                            onChange={e => setForm({...form, logoUrl: e.target.value})}
                            placeholder="https://company.com/logo.png"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Article Link (Optional)</label>
                        <input 
                            style={inputStyle}
                            value={form.link}
                            onChange={e => setForm({...form, link: e.target.value})}
                            placeholder="https://news-site.com/article"
                        />
                        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 block">Order Index</label>
                        <input 
                            style={inputStyle}
                            type="number"
                            value={form.order}
                            onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})}
                        />
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 px-6 py-3 rounded-xl bg-[#00875a] text-white font-bold hover:bg-[#006644] transition-all disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
