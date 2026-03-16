"use client";

import { motion } from "framer-motion";
import { LineChart, ArrowUpRight, Target, Zap, Waves } from "lucide-react";

export default function PerformancePage() {
    const metrics = [
        { title: "Average Score", value: "88%", delta: "+5%", icon: Target, color: "text-[#a8e03e]" },
        { title: "Course Progress", value: "64%", delta: "+12%", icon: Zap, color: "text-orange-500" },
        { title: "Attendance", value: "95%", delta: "Stable", icon: Waves, color: "text-blue-500" },
    ];

    return (
        <div className="space-y-12 pb-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight uppercase">Performance <span className="text-[#a8e03e]">Analytics</span></h1>
                <p className="text-gray-400 mt-2">Data-driven insights into your learning curve.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl bg-white/5 ${m.color}`}>
                                <m.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-[#a8e03e] bg-[#a8e03e]/10 px-3 py-1 rounded-full flex items-center gap-1">
                                <ArrowUpRight size={12} /> {m.delta}
                            </span>
                        </div>
                        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-widest">{m.title}</h3>
                        <p className="text-4xl font-black mt-2">{m.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="p-10 rounded-[3rem] bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div>
                        <h3 className="text-2xl font-bold uppercase tracking-tight">Skill Matrix</h3>
                        <p className="text-gray-500 text-sm mt-1">Growth distribution across core domains.</p>
                   </div>
                   <div className="flex gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-2 h-2 rounded-full bg-[#a8e03e]"/> Tech</span>
                        <span className="flex items-center gap-2 text-[10px] font-bold uppercase"><div className="w-2 h-2 rounded-full bg-blue-500"/> Soft Skills</span>
                   </div>
                </div>

                <div className="space-y-8">
                    {["Blockchain Architecture", "Smart Contract Dev", "Frontend Systems", "AI Integration", "System Design"].map((skill, i) => {
                        const val = [85, 92, 78, 65, 80][i];
                        return (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/50">{skill}</span>
                                    <span className="text-sm font-black text-[#a8e03e]">{val}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${val}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="h-full bg-gradient-to-r from-[#a8e03e]/50 to-[#a8e03e]"
                                     />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
