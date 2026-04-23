"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Lock, ShieldCheck, Save, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/public/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.data.name || "",
                        email: data.data.email || "",
                        phone: data.data.phone || "",
                    }));
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password && formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/public/dashboard/profile`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    password: formData.password || undefined
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Profile updated successfully");
                // Update local storage user data if needed
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    user.name = data.data.name;
                    localStorage.setItem("user", JSON.stringify(user));
                }
                setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("An error occurred while updating profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[#00875a]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight uppercase">Update <span className="text-[#00875a]">Profile</span></h1>
                <p className="text-gray-400 mt-2">Manage your personal information and account security.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/5"
            >
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} className="text-[#00875a]" /> Full Name
                            </label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a] focus:ring-1 focus:ring-[#00875a] outline-none transition-all"
                                placeholder="Your full name"
                                required
                            />
                        </div>

                        {/* Email Field (Read Only) */}
                        <div className="space-y-2 opacity-60">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} className="text-[#00875a]" /> Email Address
                            </label>
                            <input 
                                type="email"
                                value={formData.email}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none cursor-not-allowed"
                                readOnly
                            />
                            <p className="text-[10px] text-gray-500 italic">Email cannot be changed.</p>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={14} className="text-[#00875a]" /> Phone Number
                            </label>
                            <input 
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a] focus:ring-1 focus:ring-[#00875a] outline-none transition-all"
                                placeholder="Your phone number"
                            />
                        </div>

                        {/* Status (Read Only) */}
                        <div className="space-y-2 opacity-60">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} className="text-[#00875a]" /> Account Status
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#00875a]" />
                                <span className="font-medium uppercase text-sm">Active Member</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <h3 className="text-xl font-bold mb-6 uppercase flex items-center gap-2">
                            <Lock size={20} className="text-[#00875a]" /> Change Password
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                                <input 
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a] focus:ring-1 focus:ring-[#00875a] outline-none transition-all"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confirm Password</label>
                                <input 
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-[#00875a] focus:ring-1 focus:ring-[#00875a] outline-none transition-all"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-[#00875a] hover:bg-[#00875a]/90 text-white font-bold py-4 px-10 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#00875a]/20"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                            {saving ? "SAVING..." : "UPDATE PROFILE"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
