"use client";

import { API_BASE_URL } from "@/lib/api-config";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderKanban, ExternalLink, Github, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/public/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setProjects(data.data.projects || []);
                }
            } catch (error) {
                console.error("Projects fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

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

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-64 rounded-[2rem] bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map((project, i) => {
                        const title = project.projectId?.title || "Project Assignment";
                        const id = project.projectId?.num || "PRJ";
                        const refCode = `${id}-S-${title.substring(0, 3).toUpperCase()}`;

                        return (
                            <motion.div
                                key={project._id || i}
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
                                        project.status === 'reviewed' 
                                            ? 'bg-[#00875a]/10 text-[#00875a]' 
                                            : project.status === 'rejected' 
                                            ? 'bg-red-500/10 text-red-500' 
                                            : 'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                        {project.status === 'reviewed' ? (
                                            <CheckCircle2 size={12}/>
                                        ) : project.status === 'rejected' ? (
                                            <XCircle size={12}/>
                                        ) : (
                                            <Clock size={12}/>
                                        )}
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 group-hover:text-[#00875a] transition-colors">{title}</h3>
                                <p className="text-gray-500 text-sm font-mono mb-8 uppercase">REF: {refCode}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        {project.repoUrl && (
                                            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                                                <Github size={20} />
                                            </a>
                                        )}
                                    </div>
                                    {project.grade && (
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Grade</p>
                                            <p className="text-2xl font-black text-[#00875a]">{project.grade}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}

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
            ) : (
                <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600 mb-6">
                        <FolderKanban size={40} />
                    </div>
                    <p className="text-gray-500 uppercase font-bold tracking-widest text-center leading-relaxed mb-4">
                        You have not submitted any projects yet.
                    </p>
                    <p className="text-[#00875a] font-bold uppercase tracking-widest text-xs cursor-pointer hover:underline">
                        Submit your first project
                    </p>
                </div>
            )}
        </div>
    );
}
