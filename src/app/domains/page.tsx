"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesOverview from "@/components/ServicesOverview";
import WorkingProcess from "@/components/WorkingProcess";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DomainsPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/courses`);
                const data = await res.json();
                if (data.success) {
                    setCourses(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleBuyNow = async (courseId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            // 1. Create Order in Backend
            const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/payments/create-order`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ courseId }),
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                alert(orderData.message || "Failed to initiate payment");
                return;
            }

            // 2. Open Razorpay Checkout (Simulated for now as keys are pending)
            // In real scenario, we would load the script and do new window.Razorpay(options).open()
            // Here we simulate a successful payment trigger
            const confirmed = window.confirm(`Proceed to pay ₹${orderData.data.amount / 100} for this course? (Simulation)`);
            
            if (confirmed) {
                const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/public/payments/verify`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        razorpay_order_id: orderData.data.id,
                        razorpay_payment_id: "pay_sim_" + Date.now(),
                        razorpay_signature: "sig_sim_" + Date.now(),
                        dbOrderId: orderData.data.dbOrderId
                    }),
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    alert("Course Purchased Successfully!");
                    router.push("/profile");
                } else {
                    alert("Payment verification failed");
                }
            }

        } catch (err) {
            console.error("Payment error", err);
            alert("Something went wrong with the payment process");
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <section className="pt-40 pb-20 px-6 md:px-20">
                <div className="max-w-7xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#a8e03e] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                    >
                        Our Domains
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-12"
                    >
                        EXPERT <br /> <span className="text-white/20">SOLUTIONS.</span>
                    </motion.h1>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[#a8e03e] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {courses.length > 0 ? courses.map((course, index) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 hover:border-[#a8e03e]/30 transition-all flex flex-col group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8">
                                        <span className="text-[#a8e03e] font-black text-2xl">₹{course.price}</span>
                                    </div>

                                    <h2 className="text-3xl font-bold mb-4 pr-24 group-hover:text-[#a8e03e] transition-colors">{course.title}</h2>
                                    <p className="text-gray-400 leading-relaxed mb-8 text-lg line-clamp-3">{course.description}</p>
                                    
                                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                                {course.category}
                                            </span>
                                            <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                                {course.duration}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleBuyNow(course._id)}
                                            className="bg-[#a8e03e] text-black font-black px-8 py-4 rounded-2xl hover:bg-white transition-all active:scale-95 whitespace-nowrap"
                                        >
                                            BUY NOW
                                        </button>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-2 text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                    <p className="text-white/40 uppercase tracking-widest font-bold">No courses available at the moment</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <ServicesOverview />
            <WorkingProcess />

            <Footer />
        </main>
    );
}
