"use client";
import { API_BASE_URL } from "@/lib/api-config";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/public/dashboard`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCourses(data.data?.enrolledCourses || []);
            } catch (error) {
                console.error("Courses fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight uppercase">My <span className="text-[#00875a]">Enrolled</span> Courses</h1>
                <p className="text-gray-400 mt-2">Access your learning materials and track your progress.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.length > 0 ? courses.map((course, i) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 hover:border-[#00875a]/30 transition-all flex flex-col"
                        >
                            <div className="relative h-48">
                                <Image 
                                    src={course.image || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0"} 
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-[#00875a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                                        {course.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col gap-4">
                                <h3 className="text-xl font-bold uppercase line-clamp-2">{course.title}</h3>
                                
                                <div className="mt-auto space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase text-gray-400">
                                        <span>Progress</span>
                                        <span>{Math.floor(Math.random() * 100)}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-[#00875a]" 
                                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold uppercase text-xs hover:bg-white/10 transition-all">
                                    Continue Learning
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <p className="text-gray-500 uppercase font-bold tracking-widest leading-relaxed">
                                You haven't enrolled in any courses yet.<br />
                                <Link href="/courses" className="text-[#00875a] cursor-pointer hover:underline">Browse our catalog</Link>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
