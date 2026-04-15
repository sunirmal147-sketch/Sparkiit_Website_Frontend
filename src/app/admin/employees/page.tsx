"use client";
import { API_BASE_URL } from "@/lib/api-config";
import React, { useState, useEffect } from "react";
import { 
    Users, 
    Target, 
    TrendingUp, 
    Plus, 
    Calendar, 
    DollarSign, 
    Info, 
    Loader2, 
    ChevronRight, 
    CheckCircle2, 
    XCircle,
    Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = API_BASE_URL + "/api/admin";

export default function ManageTeamPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [performanceData, setPerformanceData] = useState<any[]>([]);
    const [showTargetModal, setShowTargetModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [targetForm, setTargetForm] = useState({
        title: "",
        startDate: "",
        endDate: "",
        targetRevenue: 0,
        targetCount: 0,
        manualAdjustmentAmount: 0,
        manualAdjustmentCount: 0
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/team`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setTeam(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPerformance = async (userId: string) => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/performance/${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setPerformanceData(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSetTarget = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE}/employees/target`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ ...targetForm, userId: selectedUser._id })
            });
            const data = await res.json();
            if (data.success) {
                setShowTargetModal(false);
                fetchUserPerformance(selectedUser._id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <Loader2 className="animate-spin text-[#00875a]" size={48} />
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Loading Team Data...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-6">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                    Team <span className="text-[#00875a]">Management</span>
                </h1>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-black mt-1">Lead Your Squad To Victory</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Team Sidebar */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Users size={14} /> My Subordinates
                    </h3>
                    {team.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 border border-white/5 rounded-3xl">
                            <p className="text-xs text-white/20 font-bold uppercase">No members found</p>
                        </div>
                    ) : team.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => {
                                setSelectedUser(user);
                                fetchUserPerformance(user._id);
                            }}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                selectedUser?._id === user._id 
                                ? 'bg-[#00875a]/10 border-[#00875a]/30 scale-[1.02]' 
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-xl bg-[#00875a] text-white flex items-center justify-center font-black uppercase text-sm shadow-lg shadow-[#00875a]/20">
                                {user.username.charAt(0)}
                            </div>
                            <div className="text-left flex-1">
                                <h4 className="text-sm font-black text-white uppercase tracking-tight">{user.username}</h4>
                                <p className="text-[10px] text-white/30 font-bold uppercase">{user.role}</p>
                            </div>
                            <ChevronRight size={16} className={selectedUser?._id === user._id ? 'text-[#00875a]' : 'text-white/10'} />
                        </button>
                    ))}
                </div>

                {/* Performance View */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div 
                                key={selectedUser._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{selectedUser.username}'s <span className="text-[#00875a]">Goals</span></h2>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowTargetModal(true)}
                                        className="bg-[#00875a] text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00875a]/10"
                                    >
                                        <Plus size={14} /> Set New Target
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {performanceData.length === 0 ? (
                                        <div className="md:col-span-2 p-20 text-center bg-white/[0.03] border border-dashed border-white/10 rounded-[40px]">
                                            <Target className="mx-auto text-white/10 mb-4" size={48} />
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest">No active targets found for this user</p>
                                        </div>
                                    ) : (
                                        performanceData.map((perf) => (
                                            <PerformanceCard key={perf._id} perf={perf} />
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-20 text-center bg-white/[0.02] border border-white/5 rounded-[40px]">
                                <Users className="text-white/10 mb-6" size={64} />
                                <h3 className="text-xl font-black text-white/20 uppercase">Select a team member</h3>
                                <p className="text-xs text-white/10 mt-2 max-w-xs font-medium uppercase tracking-widest">Choose a subordinate from the left to view and manage their goals.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Target Modal */}
            {showTargetModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#111] border border-white/10 rounded-[32px] w-full max-w-2xl p-10 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none"><Target size={128} /></div>
                        
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Mission <span className="text-[#00875a]">Parameters</span></h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Set targets for {selectedUser?.username}</p>
                            </div>
                            <button onClick={() => setShowTargetModal(false)} className="text-white/20 hover:text-white transition-colors">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSetTarget} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Target Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Q2 Performance Sprint"
                                        value={targetForm.title}
                                        onChange={e => setTargetForm({...targetForm, title: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={targetForm.startDate}
                                        onChange={e => setTargetForm({...targetForm, startDate: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">End Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={targetForm.endDate}
                                        onChange={e => setTargetForm({...targetForm, endDate: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Revenue Target (INR)</label>
                                    <input 
                                        type="number" 
                                        value={targetForm.targetRevenue}
                                        onChange={e => setTargetForm({...targetForm, targetRevenue: parseFloat(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Sales Count Target</label>
                                    <input 
                                        type="number" 
                                        value={targetForm.targetCount}
                                        onChange={e => setTargetForm({...targetForm, targetCount: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-[#00875a]/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Manual Rev Adjustment</label>
                                    <input 
                                        type="number" 
                                        value={targetForm.manualAdjustmentAmount}
                                        onChange={e => setTargetForm({...targetForm, manualAdjustmentAmount: parseFloat(e.target.value)})}
                                        className="w-full bg-white/5 border border-amber-500/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest ml-1">Manual Sales Adjustment</label>
                                    <input 
                                        type="number" 
                                        value={targetForm.manualAdjustmentCount}
                                        onChange={e => setTargetForm({...targetForm, manualAdjustmentCount: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-amber-500/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-amber-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#00875a] text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 shadow-xl shadow-[#00875a]/20 mt-4"
                            >
                                {submitting ? <Loader2 className="animate-spin mx-auto" /> : "Authorize Target Deployment"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function PerformanceCard({ perf }: { perf: any }) {
    const revProgress = Math.min((perf.achievedRevenue / (perf.targetRevenue || 1)) * 100, 100);
    const countProgress = Math.min((perf.achievedCount / (perf.targetCount || 1)) * 100, 100);

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all group">
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#00875a] transition-colors">{perf.title}</h4>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                        <Calendar size={12} /> {new Date(perf.startDate).toLocaleDateString()} - {new Date(perf.endDate).toLocaleDateString()}
                    </p>
                </div>
                {revProgress >= 100 && countProgress >= 100 ? (
                    <CheckCircle2 size={24} className="text-[#00875a] drop-shadow-[0_0_10px_rgba(0,135,90,0.5)]" />
                ) : (
                    <TrendingUp size={24} className="text-white/10" />
                )}
            </div>

            <div className="space-y-8">
                {/* Revenue Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Revenue Achievement</span>
                            <span className="text-sm font-black text-white">₹{perf.achievedRevenue.toLocaleString()} / <span className="text-white/40">₹{perf.targetRevenue.toLocaleString()}</span></span>
                        </div>
                        <span className={`text-xs font-black ${revProgress >= 100 ? 'text-[#00875a]' : 'text-white/20'}`}>{Math.round(revProgress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${revProgress}%` }}
                            className={`h-full rounded-full ${revProgress >= 100 ? 'bg-[#00875a]' : 'bg-white/20'}`}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Count Bar */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Units Achievement</span>
                            <span className="text-sm font-black text-white">{perf.achievedCount} Units / <span className="text-white/40">{perf.targetCount} Units</span></span>
                        </div>
                        <span className={`text-xs font-black ${countProgress >= 100 ? 'text-[#00875a]' : 'text-white/20'}`}>{Math.round(countProgress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${countProgress}%` }}
                            className={`h-full rounded-full ${countProgress >= 100 ? 'bg-[#00875a]' : 'bg-white/20'}`}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                <div className="flex-1 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <p className="text-[8px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">System Contribution</p>
                    <p className="text-[10px] font-black text-white/60">₹{perf.systemRevenue.toLocaleString()} ({perf.systemCount} Sales)</p>
                </div>
                <div className="flex-1 p-3 bg-amber-500/[0.02] rounded-xl border border-amber-500/5">
                    <p className="text-[8px] font-black uppercase text-amber-500/20 tracking-[0.2em] mb-1">Manual Overrides</p>
                    <p className="text-[10px] font-black text-amber-500/60">₹{perf.manualRevenue.toLocaleString()} ({perf.manualCount} Adjust.)</p>
                </div>
            </div>
        </div>
    );
}
