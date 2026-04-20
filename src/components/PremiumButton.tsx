"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface PremiumButtonProps {
    text: string;
    onClick?: () => void;
    href?: string;
    className?: string;
    variant?: "primary" | "secondary";
}

export default function PremiumButton({ text, onClick, href, className = "", variant = "primary" }: PremiumButtonProps) {
    const baseStyles = "relative px-8 py-4 rounded-full font-bold uppercase text-sm overflow-hidden transition-all duration-300 group inline-block";
    const variants = {
        primary: "bg-[#00875a] text-white hover:scale-105 active:scale-95",
        secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:scale-105 active:scale-95",
    };

    const ButtonContent = () => (
        <div className="relative h-5 overflow-hidden">
            <motion.div
                className="flex flex-col transition-transform duration-500 ease-[0.76, 0, 0.24, 1] group-hover:-translate-y-full"
            >
                <span className="flex items-center justify-center gap-2 h-5">
                    {text}
                </span>
                <span className="flex items-center justify-center gap-2 h-5 text-center">
                    {text}
                </span>
            </motion.div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
                <ButtonContent />
            </Link>
        );
    }

    return (
        <button 
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <ButtonContent />
        </button>
    );
}
