"use client";
import React from "react";
import Link from "next/link";
import { 
    Settings, 
    Globe, 
    Share2, 
    PanelBottom, 
    Layout, 
    ShieldCheck, 
    Palette,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const groups = [
    {
        title: "Platform Core",
        items: [
            { label: "General & Branding", desc: "Site name, logos, and contact info", href: "/admin/settings/general", icon: <Palette className="text-pink-500" /> },
            { label: "SEO & Meta", desc: "Global meta tags and search indexing", href: "/admin/settings/seo", icon: <Globe className="text-blue-500" /> },
        ]
    },
    {
        title: "Communication",
        items: [
            { label: "Social Media", desc: "Links to your profiles and handles", href: "/admin/settings/social", icon: <Share2 className="text-purple-500" /> },
            { label: "Footer Layout", desc: "Configuration for the site footer", href: "/admin/settings/footer", icon: <PanelBottom className="text-amber-500" /> },
        ]
    },
    {
        title: "System",
        items: [
            { label: "Security", desc: "Maintenance mode and access controls", href: "/admin/settings/general", icon: <ShieldCheck className="text-green-500" /> },
            { label: "Home Layout", desc: "Redirect to Page Builder", href: "/admin/page-builder", icon: <Layout className="text-cyan-500" /> },
        ]
    }
];

export default function SettingsDashboard() {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    Global <span className="text-[#00875a]">Settings</span>
                </h1>
                <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-black">Centralized Command Center</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {groups.map((group, idx) => (
                    <div key={idx} className="space-y-6">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5 pb-2">{group.title}</h3>
                        <div className="space-y-3">
                            {group.items.map((item, itemIdx) => (
                                <Link 
                                    key={itemIdx} 
                                    href={item.href}
                                    className="group flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[#00875a]/40 hover:bg-white/[0.08] transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.label}</h4>
                                        <p className="text-[10px] text-white/40 font-medium">{item.desc}</p>
                                    </div>
                                    <ArrowRight size={16} className="text-white/20 group-hover:text-[#00875a] transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-10 bg-[#00875a]/5 border border-[#00875a]/10 rounded-[32px] flex flex-col items-center text-center">
                <Settings className="text-[#00875a] mb-4 animate-spin-slow" size={48} />
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Need Advanced Config?</h2>
                <p className="max-w-md text-sm text-white/40 mt-2 italic font-medium">"System-level environment variables and direct database modifications should only be handled by the core engineering team."</p>
                <button className="mt-8 px-8 py-3 bg-[#00875a] text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 active:scale-95 transition-all">
                    System Health Check
                </button>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
