"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Edit2, Save, X, Award, Mail, Book } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/admin";

interface Certificate {
    _id: string;
    certificateId: string;
    candidateName: string;
    candidateEmail: string;
    courseName: string;
    issueDate: string;
    grade?: string;
}

export default function CertificateManagement() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCert, setEditingCert] = useState<Partial<Certificate> | null>(null);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCertificates();
    }, [search]);

    const fetchCertificates = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/certificates?search=${search}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCertificates(data.data);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("adminToken");
            const isNew = !editingCert?._id;
            const url = isNew ? `${API_BASE}/certificates` : `${API_BASE}/certificates/${editingCert?._id}`;
            const method = isNew ? "POST" : "DELETE"; // Backend only supports POST and DELETE for now based on previous impl

            // Re-checking my backend implementation...
            // Post for creation, DELETE for deletion. No update route was added in previous steps.
            // I'll stick to creation and deletion as per the current backend routes.

            if (editingCert?._id) {
                // Should use delete if deleting, but modal implies save. 
                // I'll only implement creation here for now to avoid breaking routes.
                alert("Editing is not yet supported at route level. Please delete and recreate.");
                setSaving(false);
                return;
            }

            const res = await fetch(`${API_BASE}/certificates`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editingCert)
            });

            const data = await res.json();
            if (data.success) {
                fetchCertificates();
                setEditingCert(null);
            }
        } catch (error) {
            console.error("Error saving certificate:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this certificate?")) return;
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/certificates/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                fetchCertificates();
            }
        } catch (error) {
            console.error("Error deleting certificate:", error);
        }
    };

    if (loading && !search) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-[#a8e03e]" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Certificates</h2>
                    <p className="text-white/40">Manage and issue certificates to students.</p>
                </div>
                <button 
                    onClick={() => setEditingCert({ certificateId: "", candidateName: "", candidateEmail: "", courseName: "", issueDate: new Date().toISOString().split('T')[0], grade: "" })}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#a8e03e] text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={20} />
                    Issue Certificate
                </button>
            </div>

            <div className="mb-8 relative">
                <input 
                    type="text"
                    placeholder="Search by name, email, or certificate ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#a8e03e]/40 transition-all"
                />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                            <th className="px-8 py-5">Certificate ID</th>
                            <th className="px-8 py-5">Candidate</th>
                            <th className="px-8 py-5">Course</th>
                            <th className="px-8 py-5">Issue Date</th>
                            <th className="px-8 py-5">Grade</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {certificates.map((cert) => (
                            <tr key={cert._id} className="hover:bg-white/2 transition-colors">
                                <td className="px-8 py-6 font-mono text-sm text-[#a8e03e]">{cert.certificateId}</td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-white">{cert.candidateName}</div>
                                    <div className="text-xs text-white/40 lowercase">{cert.candidateEmail}</div>
                                </td>
                                <td className="px-8 py-6 text-white/80">{cert.courseName}</td>
                                <td className="px-8 py-6 text-white/40 text-sm">
                                    {new Date(cert.issueDate).toLocaleDateString()}
                                </td>
                                <td className="px-8 py-6">
                                    <span className="bg-[#a8e03e]/10 text-[#a8e03e] px-3 py-1 rounded-full text-xs font-black">
                                        {cert.grade || "N/A"}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button 
                                        onClick={() => handleDelete(cert._id)}
                                        className="p-2 text-white/20 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {certificates.length === 0 && (
                    <div className="py-20 text-center text-white/20">
                        <Award size={48} className="mx-auto mb-4 opacity-10" />
                        <p>No certificates found.</p>
                    </div>
                )}
            </div>

            {/* Modal for Issuing */}
            {editingCert && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Issue Certificate</h3>
                            <button onClick={() => setEditingCert(null)} className="text-white/40 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                        <Award size={12} /> ID
                                    </label>
                                    <input 
                                        type="text" 
                                        value={editingCert.certificateId}
                                        onChange={e => setEditingCert({...editingCert, certificateId: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                        placeholder="SPK-2026-X"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Grade</label>
                                    <input 
                                        type="text" 
                                        value={editingCert.grade}
                                        onChange={e => setEditingCert({...editingCert, grade: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                        placeholder="A+"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    Candidate Name
                                </label>
                                <input 
                                    type="text" 
                                    value={editingCert.candidateName}
                                    onChange={e => setEditingCert({...editingCert, candidateName: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={12} /> Candidate Email
                                </label>
                                <input 
                                    type="email" 
                                    value={editingCert.candidateEmail}
                                    onChange={e => setEditingCert({...editingCert, candidateEmail: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Book size={12} /> Course Name
                                </label>
                                <input 
                                    type="text" 
                                    value={editingCert.courseName}
                                    onChange={e => setEditingCert({...editingCert, courseName: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#a8e03e]/40"
                                />
                            </div>
                        </div>
                        <div className="p-8 bg-white/2 flex justify-end gap-4">
                            <button 
                                onClick={() => setEditingCert(null)}
                                className="px-6 py-2 rounded-xl text-white/60 hover:text-white transition-all font-bold"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-8 py-2 rounded-xl bg-[#a8e03e] text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Award size={18} />}
                                Issue Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
