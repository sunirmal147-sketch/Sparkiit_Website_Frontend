"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Mail, 
    Phone, 
    MapPin,
    ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const API_BASE = API_BASE_URL + "/api/admin";

export default function ContactSettings() {
    const [formData, setFormData] = useState({
        contact_email: "",
        contact_phone: "",
        contact_address: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', msg: string} | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/settings?group=contact_page`, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                const updated = { ...formData };
                data.data.forEach((s: any) => {
                    if (s.key in updated) {
                        (updated as any)[s.key] = s.value;
                    }
                });
                setFormData(updated);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus(null);
        try {
            const token = localStorage.getItem("adminToken");
            
            const payload: any = {};
            Object.entries(formData).forEach(([key, value]) => {
                payload[key] = { value, group: "contact_page" };
            });

            const res = await fetch(`${API_BASE}/settings/bulk`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ settings: payload })
            });
            const data = await res.json();
            
            if (data.success) {
                setStatus({ type: 'success', msg: 'Contact settings updated successfully!' });
                setTimeout(() => setStatus(null), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update contact settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Loading Settings...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-6">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <Link href="/admin/settings" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
                        <ArrowLeft size={14} /> Back to Settings
                    </Link>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Contact <span className="text-[#00875a]">Settings</span>
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Manage public contact information</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-[#00875a] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-[32px] p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="md:col-span-2">
                             <InputField 
                                label="Physical Address / Office Location" 
                                value={formData.contact_address} 
                                onChange={(val: string) => setFormData({...formData, contact_address: val})} 
                                placeholder="123 Design St, Creative City" 
                                icon={<MapPin size={16} />}
                            />
                        </div>

                        <InputField 
                            label="Contact Email Address" 
                            value={formData.contact_email} 
                            onChange={(val: string) => setFormData({...formData, contact_email: val})} 
                            placeholder="hello@sparkiit.com" 
                            icon={<Mail size={16} />}
                        />

                        <InputField 
                            label="Contact Phone Number" 
                            value={formData.contact_phone} 
                            onChange={(val: string) => setFormData({...formData, contact_phone: val})} 
                            placeholder="+1 (234) 567-890" 
                            icon={<Phone size={16} />}
                        />
                    </div>

                    <div className="mt-16 p-8 border border-[#00875a]/10 rounded-2xl bg-[#00875a]/5 flex gap-4 items-start">
                        <div className="p-2 bg-[#00875a] rounded-lg text-black mt-1">
                            <CheckCircle2 size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Live Updates</p>
                            <p className="text-[11px] text-white/40 font-medium leading-relaxed">System settings updated here will reflect immediately on the public website's Contact Us page and footer components that consume this data.</p>
                        </div>
                    </div>

                    {status && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-8 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                            <p className="text-[10px] font-black uppercase tracking-widest">{status.msg}</p>
                        </motion.div>
                    )}
                </div>
            </form>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, icon }: any) {
    return (
        <div className="flex flex-col gap-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                {icon} {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 w-full"
            />
        </div>
    );
}
