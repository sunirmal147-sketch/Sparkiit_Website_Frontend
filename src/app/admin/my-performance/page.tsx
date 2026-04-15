"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Target, 
    TrendingUp, 
    Calendar, 
    Loader2, 
    CheckCircle2, 
    ShieldCheck,
    Cpu,
    ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

export default function MyPerformancePage() {
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem("adminUser");
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            fetchMyPerformance(parsed._id);
        }
    }, []);

    const fetchMyPerformance = async (userId: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/performance/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPerformanceData(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Accessing Node Metrics...</p>
        </div>
    );

    const activeGoals = performanceData.length;
    const completedGoals = performanceData.filter(p => (p.achievedRevenue / p.targetRevenue) >= 1 && (p.achievedCount / p.targetCount) >= 1).length;

    return (
        <div className="max-w-6xl mx-auto py-6">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-[#00875a]/10 p-2 rounded-lg"><Cpu className="text-[#00875a]" size={20} /></div>
                    <p className="text-[#00875a] text-[10px] uppercase tracking-[0.4em] font-black">Operator Profile: {user?.username}</p>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                    Mission <span className="text-[#00875a]">Command</span>
                </h1>
                <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-medium mt-2">Personal Growth & Objective Tracking</p>
            </header>

            {/* Top Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Active Missions" value={activeGoals} sub="Assigned Objectives" />
                <StatCard label="Completed" value={completedGoals} sub="Successful Deployments" icon={<CheckCircle2 className="text-[#00875a]" />} />
                <StatCard label="Success Rate" value={activeGoals > 0 ? `${Math.round((completedGoals / activeGoals) * 100)}%` : "0%"} sub="Overall Efficiency" />
            </div>

            <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Current Objectives</h2>
                    <ShieldCheck size={16} className="text-white/10" />
                </div>

                {performanceData.length === 0 ? (
                    <div className="p-32 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[48px]">
                        <Target className="mx-auto text-white/5 mb-6 animate-pulse" size={64} />
                        <h3 className="text-xl font-black text-white/20 uppercase tracking-tight">No Active Missions</h3>
                        <p className="text-[10px] text-white/10 mt-4 uppercase tracking-[0.2em] max-w-xs mx-auto">Stand by for communication from your Command Lead regarding target allocation.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {performanceData.map((perf) => (
                            <PersonalGoalCard key={perf._id} perf={perf} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] hover:border-[#00875a]/20 transition-all group overflow-hidden relative">
            <div className="absolute -bottom-6 -right-6 text-[#00875a]/5 group-hover:scale-110 transition-transform">
                {icon ? React.cloneElement(icon, { size: 120 }) : <TrendingUp size={120} />}
            </div>
            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">{label}</p>
            <div className="flex items-end gap-3">
                <h3 className="text-4xl font-black text-white tracking-tighter">{value}</h3>
                {icon && <div className="mb-2">{icon}</div>}
            </div>
            <p className="text-[10px] text-white/20 font-medium mt-2">{sub}</p>
        </div>
    );
}

function PersonalGoalCard({ perf }: { perf: any }) {
    const revPercent = Math.min((perf.achievedRevenue / (perf.targetRevenue || 1)) * 100, 100);
    const countPercent = Math.min((perf.achievedCount / (perf.targetCount || 1)) * 100, 100);
    const overallProgress = (revPercent + countPercent) / 2;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/[0.03] border border-white/5 p-10 rounded-[40px] relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-white pointer-events-none group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
                <Target size={200} />
            </div>

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{perf.title}</h4>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/5 px-3 py-1 rounded-full">
                            <Calendar size={12} /> {new Date(perf.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-white/10">/</span>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase text-white/30 tracking-widest bg-white/5 px-3 py-1 rounded-full">
                            {new Date(perf.endDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-[#00875a]">{Math.round(overallProgress)}%</span>
                    <p className="text-[8px] font-black uppercase text-white/20 tracking-tighter">Sync</p>
                </div>
            </div>

            <div className="space-y-10 relative z-10">
                {/* Revenue Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20"><DollarSign size={14} className="group-hover:text-[#00875a] transition-colors" /></div>
                            <div>
                                <p className="text-[8px] font-black uppercase text-white/30 tracking-[0.2em]">Revenue Status</p>
                                <p className="text-sm font-black text-white">₹{perf.achievedRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-white/20 tracking-widest">AIM: ₹{perf.targetRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${revPercent}%` }}
                            viewport={{ once: true }}
                            className={`h-full rounded-full ${revPercent >= 100 ? 'bg-[#00875a] shadow-[0_0_15px_rgba(0,135,90,0.5)]' : 'bg-white/20'}`}
                        />
                    </div>
                </div>

                {/* Units Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/20"><TrendingUp size={14} className="group-hover:text-[#00875a] transition-colors" /></div>
                            <div>
                                <p className="text-[8px] font-black uppercase text-white/30 tracking-[0.2em]">Deployment Count</p>
                                <p className="text-sm font-black text-white">{perf.achievedCount} Units</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-white/20 tracking-widest">AIM: {perf.targetCount}</p>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${countPercent}%` }}
                            viewport={{ once: true }}
                            className={`h-full rounded-full ${countPercent >= 100 ? 'bg-[#00875a] shadow-[0_0_15px_rgba(0,135,90,0.5)]' : 'bg-white/20'}`}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-12 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all">
                <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] italic">"Maintain vector for mission success."</p>
                <button className="flex items-center gap-2 text-[#00875a] text-[10px] font-black uppercase tracking-widest">
                    Strategy Log <ArrowUpRight size={14} />
                </button>
            </div>
        </motion.div>
    );
}

function DollarSign({ size, className }: any) {
    return (
        <svg 
            width={size} height={size} viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
            className={className}
        >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}
