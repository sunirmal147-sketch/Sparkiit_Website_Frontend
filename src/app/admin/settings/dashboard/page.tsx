"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Trophy,
    Plus,
    X,
    Layout,
    Edit3
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

interface SkillCategory {
    id: string;
    name: string;
}

export default function DashboardSettings() {
    const [categories, setCategories] = useState<SkillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/settings?group=dashboard`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const skillSetting = data.data.find((s: any) => s.key === "skill_categories");
                if (skillSetting && skillSetting.value) {
                    try {
                        // Try to parse as JSON first
                        const parsed = JSON.parse(skillSetting.value);
                        if (Array.isArray(parsed)) {
                            setCategories(parsed);
                        } else {
                            throw new Error("Not an array");
                        }
                    } catch (e) {
                        // Fallback to comma-separated string
                        const legacy = skillSetting.value.split(",").map((s: string) => s.trim()).filter(Boolean);
                        setCategories(legacy.map((name: string) => ({ id: name.toLowerCase().replace(/\s+/g, '_'), name })));
                    }
                } else {
                    // Default categories
                    const defaults = ["Tech", "Soft Skills", "Blockchain", "Smart Contracts", "Frontend", "AI", "System Design"];
                    setCategories(defaults.map(name => ({ id: name.toLowerCase().replace(/\s+/g, '_'), name })));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);
        try {
            const token = localStorage.getItem("adminToken");
            
            const payload = {
                settings: {
                    skill_categories: { value: JSON.stringify(categories), group: "dashboard" }
                }
            };

            const res = await fetch(`${API_BASE}/settings/bulk`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (data.success) {
                setStatus({ type: 'success', msg: 'Dashboard configuration updated!' });
                setTimeout(() => setStatus(null), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update settings' });
        } finally {
            setSaving(false);
        }
    };

    const addCategory = () => {
        if (newCategoryName) {
            const id = newCategoryName.toLowerCase().replace(/\s+/g, '_') + "_" + Date.now();
            setCategories([...categories, { id, name: newCategoryName }]);
            setNewCategoryName("");
        }
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const updateCategoryName = (id: string, newName: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Loading Dashboard Config...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-6">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Dashboard <span className="text-[#00875a]">Config</span>
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Customize student metrics & skill matrices</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-[#00875a] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving..." : "Save Config"}
                </button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 text-center text-white/20 italic text-sm">
                    All student metrics are currently managed via the candidate profiles.
                </div>

                {status && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                        <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
