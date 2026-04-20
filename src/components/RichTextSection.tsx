"use client";

import React from "react";

interface RichTextSectionProps {
    html?: string;
}

export default function RichTextSection({ html }: RichTextSectionProps) {
    if (!html) return null;

    return (
        <section className="py-20 md:py-32 bg-[#050505] text-white">
            <div className="max-w-4xl mx-auto px-6 md:px-10">
                <div 
                    className="prose prose-invert prose-emerald max-w-none 
                        prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black
                        prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg
                        prose-li:text-white/60 prose-li:text-base
                        prose-a:text-[#00875a] prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-white prose-strong:font-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </section>
    );
}
