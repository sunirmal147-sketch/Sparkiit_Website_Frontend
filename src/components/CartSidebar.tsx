"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBasket, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartSidebar() {
    const { cartItems, removeFromCart, clearCart, isCartOpen, setIsCartOpen } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-[100dvh] w-full max-w-[450px] bg-[#0a0a0a] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#00875a]/10 rounded-xl flex items-center justify-center">
                                    <ShoppingBasket className="text-[#00875a]" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Your Cart</h2>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                        {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} Selected
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/50 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
                            {cartItems.length > 0 ? (
                                <div className="space-y-6">
                                    {cartItems.map((item) => (
                                        <motion.div 
                                            key={item._id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00875a]/20 transition-all"
                                        >
                                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#00875a]/20 font-black text-xs">
                                                        COURSE
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h3 className="text-sm font-bold text-white uppercase tracking-tight truncate group-hover:text-[#00875a] transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <button 
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="text-white/20 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">
                                                    {item.category}
                                                </p>
                                                <p className="text-base font-black text-white">
                                                    ₹{item.price}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBasket size={32} className="text-white/10" />
                                    </div>
                                    <p className="text-white/40 uppercase tracking-[0.2em] font-black text-sm mb-8">
                                        Your cart is empty
                                    </p>
                                    <Link 
                                        href="/domains"
                                        onClick={() => setIsCartOpen(false)}
                                        className="bg-[#00875a] text-white font-black px-8 py-3 rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs"
                                    >
                                        Browse Courses
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">Subtotal</p>
                                        <p className="text-3xl font-black text-white">₹{subtotal}</p>
                                    </div>
                                    <button 
                                        onClick={clearCart}
                                        className="text-xs font-black text-red-500 hover:text-red-400 uppercase tracking-widest"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <Link 
                                    href="/enroll" 
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-[#00875a] hover:bg-white text-white hover:text-[#00875a] font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all group active:scale-95"
                                >
                                    <span className="uppercase tracking-[0.2em] text-sm">Proceed to Checkout</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                
                                <p className="text-center mt-4 text-[9px] text-white/20 uppercase tracking-widest font-black">
                                    Secure Checkout Powered by Razorpay
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
