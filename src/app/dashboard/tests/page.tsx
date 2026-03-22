"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, PlayCircle, Clock, AlertTriangle } from "lucide-react";

export default function TestsPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/dashboard/tests`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setTests(data);
            } catch (error) {
                console.error("Tests fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight uppercase">Assessments & <span className="text-[#00875a]">Tests</span></h1>
                <p className="text-gray-400 mt-2">Evaluate your knowledge and track your certification readiness.</p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-24 rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : tests.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {tests.map((test, i) => (
                        <motion.div
                            key={test._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-8 group hover:border-[#00875a]/30 transition-all"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#00875a]/10 flex items-center justify-center text-[#00875a]">
                                <ClipboardList size={32} />
                            </div>
                            
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold uppercase tracking-tight">{test.title}</h3>
                                <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest">{test.category}</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-8">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={18} />
                                    <span className="text-sm font-bold">{test.duration} MINS</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <ClipboardList size={18} />
                                    <span className="text-sm font-bold">{test.questions?.length || 0} Qs</span>
                                </div>
                            </div>

                            <button className="px-8 py-4 bg-[#00875a] text-white font-black text-xs uppercase rounded-2xl hover:scale-105 transition-transform flex items-center gap-2">
                                <PlayCircle size={18} /> Start Test
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="py-24 bg-white/5 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-center px-6">
                    <AlertTriangle className="text-yellow-500 mb-6" size={48} />
                    <h3 className="text-xl font-bold uppercase mb-2">No Tests Available</h3>
                    <p className="text-gray-500 max-w-sm">
                        Tests will appear here once you progress through your enrolled courses. 
                        Keep learning to unlock your first assessment!
                    </p>
                </div>
            )}
        </div>
    );
}
