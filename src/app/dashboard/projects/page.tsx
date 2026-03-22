"use client";

import { motion } from "framer-motion";
import { FolderKanban, ExternalLink, Github, CheckCircle2, Clock, XCircle } from "lucide-react";

const mockProjects = [
    { title: "DeFi Exchange Frontend", id: "01", status: "reviewed", grade: "A+", date: "2024-03-10" },
    { title: "Smart Contract Security Audit", id: "02", status: "pending", date: "2024-03-15" },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase">Project <span className="text-[#00875a]">Submissions</span></h1>
                    <p className="text-gray-400 mt-2">Submit and track your practical course assignments.</p>
                </div>
                <button className="px-8 py-4 bg-white text-black font-black text-xs uppercase rounded-2xl hover:bg-[#00875a] transition-colors">
                    New Submission
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mockProjects.map((project, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 group hover:border-[#00875a]/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400">
                                <FolderKanban size={28} />
                            </div>
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                                project.status === 'reviewed' ? 'bg-[#00875a]/10 text-[#00875a]' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                                {project.status === 'reviewed' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                {project.status}
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#00875a] transition-colors">{project.title}</h3>
                        <p className="text-gray-500 text-sm font-mono mb-8 uppercase">REF: {project.id}-S-{project.title.substring(0,3)}</p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <Github className="text-gray-500 hover:text-white cursor-pointer" size={20} />
                                <ExternalLink className="text-gray-500 hover:text-white cursor-pointer" size={20} />
                            </div>
                            {project.grade && (
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Grade</p>
                                    <p className="text-2xl font-black text-[#00875a]">{project.grade}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-[2rem] min-h-[300px] text-center">
                    <div className="bg-white/5 p-6 rounded-full text-gray-600 mb-6">
                        <FolderKanban size={40} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm leading-relaxed">
                        Ready to showcase your skills?<br />
                        <span className="text-[#00875a] hover:underline cursor-pointer">Submit your next project</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
