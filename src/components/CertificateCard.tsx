"use client";

import { motion } from "framer-motion";
import { Award, Calendar, User, BookOpen, CheckCircle } from "lucide-react";

interface CertificateProps {
    certificateId: string;
    candidateName: string;
    courseName: string;
    issueDate: string;
    grade?: string;
}

export default function CertificateCard({
    certificateId,
    candidateName,
    courseName,
    issueDate,
    grade,
}: CertificateProps) {
    const formattedDate = new Date(issueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group"
        >
            {/* Animated background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a8e03e]/10 blur-[100px] rounded-full group-hover:bg-[#a8e03e]/20 transition-colors duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700" />

            <div className="p-8 md:p-12 relative z-10">
                <div className="flex justify-between items-start mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-[#a8e03e]/10 flex items-center justify-center text-[#a8e03e]">
                        <Award size={40} />
                    </div>
                    <div className="flex items-center gap-2 bg-[#a8e03e]/10 text-[#a8e03e] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-[#a8e03e]/20">
                        <CheckCircle size={14} />
                        Verified
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">Certificate ID</p>
                        <h3 className="text-xl font-mono text-white tracking-wider">{certificateId}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center gap-2 text-white/40 mb-2">
                                <User size={14} />
                                <p className="text-xs font-bold uppercase tracking-[0.2em]">Candidate Name</p>
                            </div>
                            <p className="text-2xl font-bold text-white tracking-tight">{candidateName}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-white/40 mb-2">
                                <BookOpen size={14} />
                                <p className="text-xs font-bold uppercase tracking-[0.2em]">Course Completed</p>
                            </div>
                            <p className="text-2xl font-bold text-white tracking-tight">{courseName}</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                <Calendar size={14} />
                                <p className="text-xs font-bold uppercase tracking-[0.2em]">Date of Issue</p>
                            </div>
                            <p className="text-white/80 font-medium">{formattedDate}</p>
                        </div>
                        {grade && (
                            <div className="text-right">
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-1">Grade / Performance</p>
                                <p className="text-3xl font-black text-[#a8e03e]">{grade}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom accent bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#a8e03e] via-blue-500 to-[#a8e03e]" />
        </motion.div>
    );
}
