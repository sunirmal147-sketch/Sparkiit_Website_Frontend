"use client";
import { API_BASE_URL } from "@/lib/api-config";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesOverview from "@/components/ServicesOverview";
import WorkingProcess from "@/components/WorkingProcess";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCart } from "@/context/CartContext";

function CoursesPageContent() {
    const { addToCart, isInCart, removeFromCart } = useCart();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const category = searchParams.get("category");

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const url = category 
                    ? `${API_BASE_URL}/api/public/courses?category=${encodeURIComponent(category)}`
                    : `${API_BASE_URL}/api/public/courses`;
                
                const res = await fetch(url);
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
    }, [category]);

    const handleBuyNow = async (course: any) => {
        if (course.paymentLink) {
            window.open(course.paymentLink, "_blank");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signin");
            return;
        }

        try {
            const orderRes = await fetch(`${API_BASE_URL}/api/public/payments/create-order`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ courseId: course._id }),
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                alert(orderData.message || "Failed to initiate payment");
                return;
            }

            const confirmed = window.confirm(`Proceed to pay ₹${orderData.data.amount / 100} for this solution? (Simulation)`);
            
            if (confirmed) {
                const verifyRes = await fetch(`${API_BASE_URL}/api/public/payments/verify`, {
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
                    alert("Solution Purchased Successfully!");
                    router.push("/dashboard");
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
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[#00875a] font-bold uppercase tracking-[0.3em] text-xs mb-6"
                            >
                                {category ? `Domains — ${category}` : "Our Solutions"}
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-4xl sm:text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
                            >
                                {category ? (
                                    <>
                                        {category.split(' ')[0]} <br /> 
                                        <span className="text-white/20">{category.split(' ').slice(1).join(' ') || "SOLUTIONS."}</span>
                                    </>
                                ) : (
                                    <>EXPERT <br /> <span className="text-white/20">SOLUTIONS.</span></>
                                )}
                            </motion.h1>
                        </div>

                        {category && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => router.push("/domains")}
                                className="text-white/40 hover:text-[#00875a] text-xs font-bold uppercase tracking-widest border border-white/10 hover:border-[#00875a]/40 px-6 py-3 rounded-full transition-all"
                            >
                                Back to Domains
                            </motion.button>
                        )}
                    </div>

                    {loading ? (
                        <div className="h-64 flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-[#00875a] border-t-transparent rounded-full animate-spin"></div>
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
                                    className="bg-white/5 p-6 md:p-10 rounded-[40px] border border-white/10 hover:border-[#00875a]/30 transition-all flex flex-col group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-8 z-10">
                                        <span className="text-[#00875a] font-black text-2xl">₹{course.price}</span>
                                    </div>

                                    {course.imageUrl && (
                                        <div className="w-full h-48 mb-8 rounded-3xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    <h2 className="text-3xl font-bold mb-4 pr-24 group-hover:text-[#00875a] transition-colors relative z-10">{course.title}</h2>
                                    <p className="text-gray-400 leading-relaxed mb-8 text-lg line-clamp-2 relative z-10">{course.description}</p>
                                    
                                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                                {course.category}
                                            </span>
                                            <span className="bg-white/5 px-4 py-2 rounded-full text-xs font-medium text-white/50 border border-white/5 uppercase tracking-wider">
                                                {course.duration}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => isInCart(course._id) ? removeFromCart(course._id) : addToCart(course)}
                                                className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                                    isInCart(course._id) 
                                                    ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                                                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                {isInCart(course._id) ? "Remove" : "Add to Cart"}
                                            </button>
                                            <button 
                                                onClick={() => handleBuyNow(course)}
                                                className="bg-[#00875a] text-white font-black px-8 py-4 rounded-2xl hover:bg-white hover:text-[#00875a] transition-all active:scale-95 whitespace-nowrap text-xs uppercase tracking-widest"
                                            >
                                                {course.paymentLink ? "ENROLL NOW" : "BUY NOW"}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-2 text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
                                    <p className="text-white/40 uppercase tracking-widest font-bold">No courses available in this category</p>
                                    <button onClick={() => router.push("/domains")} className="mt-4 text-[#00875a] font-black hover:underline uppercase tracking-widest text-sm">Select another domain</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>}>
            <CoursesPageContent />
        </Suspense>
    );
}
