"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedHeadingProps {
    text: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
    className?: string;
    delay?: number;
    highlightWords?: string[];
}

export default function AnimatedHeading({
    text,
    as = "h2",
    className = "",
    delay = 0,
    highlightWords = [],
}: AnimatedHeadingProps) {
    // If the text is empty, render nothing
    if (!text) return null;

    // Standardize all line break tags and split by space
    const cleanText = text
        .replace(/<br\s*\/?>/gi, " <br> ")
        .replace(/\s+/g, " ")
        .trim();
    const words = cleanText.split(" ");
    
    // Container animation variants for stagger effect
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.04,
                delayChildren: delay,
            },
        },
    };

    // Staggered child slide-up variant
    const wordVariants: any = {
        hidden: { y: "110%" },
        visible: {
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1], // premium easeOutCubic curve
            },
        },
    };

    const hoverVariants = {
        hidden: { y: 0 },
        visible: { y: 0 },
        hovered: { y: "-100%" }
    };

    const duplicateVariants = {
        hidden: { y: "100%" },
        visible: { y: "100%" },
        hovered: { y: 0 }
    };

    const Tag = as;

    return (
        <Tag className={className}>
            <motion.span
                className="inline-flex flex-wrap items-center cursor-default"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hovered"
                viewport={{ once: true, amount: 0.15 }}
            >
                {words.map((word, index) => {
                    // Check for manual line breaks
                    if (word === "<br />" || word === "<br>") {
                        return <br key={index} className="w-full" />;
                    }

                    // Clean the word for comparison (remove common punctuation and lowercase)
                    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                    
                    // Match highlights against clean words or substrings
                    const isHighlighted = highlightWords.some(
                        (hw) => {
                            const cleanHw = hw.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                            return cleanWord === cleanHw || cleanWord.includes(cleanHw) || cleanHw.includes(cleanWord);
                        }
                    );

                    return (
                        <span 
                            key={index} 
                            className="inline-block overflow-hidden pb-1 mr-[0.22em] last:mr-0 relative"
                            style={{ verticalAlign: "bottom" }}
                        >
                            <motion.span
                                variants={wordVariants}
                                className="inline-block"
                            >
                                <span className="relative inline-flex overflow-hidden">
                                    {/* Original Word */}
                                    <motion.span
                                        variants={hoverVariants}
                                        transition={{ duration: 0.4, delay: index * 0.02, ease: [0.33, 1, 0.68, 1] }}
                                        className={`inline-block ${
                                            isHighlighted ? "text-[#00875a]" : ""
                                        }`}
                                    >
                                        {word}
                                    </motion.span>
                                    
                                    {/* Rolling green replacement */}
                                    <motion.span
                                        variants={duplicateVariants}
                                        transition={{ duration: 0.4, delay: index * 0.02, ease: [0.33, 1, 0.68, 1] }}
                                        className="absolute inset-0 text-[#00875a] inline-block"
                                    >
                                        {word}
                                    </motion.span>
                                </span>
                            </motion.span>
                        </span>
                    );
                })}
            </motion.span>
        </Tag>
    );
}
