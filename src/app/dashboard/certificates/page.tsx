"use client";
import { API_BASE_URL } from "@/lib/api-config";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Award, ShieldCheck } from "lucide-react";

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/public/dashboard/certificates`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCertificates(data.data || []);
            } catch (error) {
                console.error("Certificates fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCerts();
    }, []);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase">My <span className="text-[#00875a]">Certificates</span></h1>
                    <p className="text-gray-400 mt-2">Verified proof of your technical expertise.</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                    <ShieldCheck className="text-[#00875a]" />
                    <span className="text-xs font-bold uppercase tracking-widest">Global Validator Active</span>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00875a]/5 blur-3xl rounded-full" />
                            
                            <div className="flex gap-6 items-start">
                                <div className="w-16 h-16 rounded-2xl bg-[#00875a]/10 flex items-center justify-center text-[#00875a]">
                                    <Award size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold uppercase tracking-tight mb-2">{cert.courseName}</h3>
                                    <p className="text-gray-500 text-sm font-mono uppercase mb-6">ID: {cert.certificateId}</p>
                                    
                                    <div className="flex flex-wrap gap-4">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-[#00875a] text-white font-black text-xs uppercase rounded-xl hover:scale-105 transition-transform">
                                            <Download size={16} /> Download PDF
                                        </button>
                                        <button className="px-6 py-3 bg-white/5 border border-white/10 font-bold text-xs uppercase rounded-xl hover:bg-white/10 transition-all">
                                            Share Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                        <Award size={40} />
                    </div>
                    <p className="text-gray-500 uppercase font-bold tracking-widest text-center leading-relaxed">
                        Complete your courses and pass <br /> the final assessments to earn certificates.
                    </p>
                </div>
            )}
        </div>
    );
}
