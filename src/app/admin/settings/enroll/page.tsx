"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle, 
    Link as LinkIcon,
    CalendarCheck,
    FileSignature,
    Info
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

export default function EnrollmentSettings() {
    const [formData, setFormData] = useState({
        slot_booking_url: "/enroll?type=trial",
        full_registration_url: "/enroll?type=full",
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
            const res = await fetch(`${API_BASE}/settings?group=enrollment`, {
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
                payload[key] = { value, group: "enrollment" };
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
                setStatus({ type: 'success', msg: 'Global Enrollment Links Deployed!' });
                setTimeout(() => setStatus(null), 3000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Deployment error occurred' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Loading Enrollment Rules...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-6">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Enrollment <span className="text-[#00875a]">Management</span>
                    </h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Configure Global Registration Flows</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-[#00875a] text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/20 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? "Deploying..." : "Update Links"}
                </button>
            </header>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-10">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                        <LinkIcon className="text-[#00875a]" size={20} />
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Global Navbar Destinations</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <InputField 
                            label="Slot Booking (Trial) URL" 
                            value={formData.slot_booking_url} 
                            onChange={(val: string) => setFormData({...formData, slot_booking_url: val})} 
                            placeholder="/enroll?type=trial" 
                            icon={<CalendarCheck size={16} />}
                        />
                        <InputField 
                            label="Full Registration URL" 
                            value={formData.full_registration_url} 
                            onChange={(val: string) => setFormData({...formData, full_registration_url: val})} 
                            placeholder="/enroll?type=full" 
                            icon={<FileSignature size={16} />}
                        />
                    </div>

                    <div className="mt-12 p-8 border border-white/5 rounded-2xl bg-white/[0.01] flex gap-4">
                        <Info className="text-[#00875a] flex-shrink-0" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2 italic">Routing Information</p>
                            <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                                These links control the "Slot Booking" and "Full Registration" buttons in the website's top navigation bar. 
                                Changes here are global and will apply regardless of which course a user is currently viewing.
                            </p>
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
                onChange={(e: any) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-medium"
            />
        </div>
    );
}
