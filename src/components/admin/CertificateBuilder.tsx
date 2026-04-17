"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Save, Trash2, Move, Type, MousePointer2, Loader2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-config";

interface Field {
    key: string;
    label: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    bold: boolean;
}

interface Template {
    _id?: string;
    name: string;
    type: "INTERNSHIP" | "PROJECT";
    pdfUrl: string;
    width: number;
    height: number;
    fields: Field[];
}

const DEFAULT_FIELDS = [
    { key: "candidateName", label: "Student Name", x: 50, y: 50, fontSize: 24, color: "#000000", bold: true },
    { key: "courseName", label: "Domain/Course", x: 50, y: 60, fontSize: 18, color: "#000000", bold: false },
    { key: "certificateId", label: "Certificate ID", x: 50, y: 80, fontSize: 12, color: "#000000", bold: false },
    { key: "issueDate", label: "Issue Date", x: 50, y: 70, fontSize: 14, color: "#000000", bold: false },
];

export default function CertificateBuilder({ type }: { type: "INTERNSHIP" | "PROJECT" }) {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [template, setTemplate] = useState<Template | null>(null);
    const [activeField, setActiveField] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("uploadType", "templates");

        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE_URL}/api/admin/certificate-templates/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setTemplate({
                    name: name || file.name.replace(".pdf", ""),
                    type,
                    pdfUrl: data.data.url,
                    width: data.data.width,
                    height: data.data.height,
                    fields: DEFAULT_FIELDS.map(f => ({
                        ...f,
                        x: data.data.width / 2, // Default to center
                        y: data.data.height / 2
                    }))
                });
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!template) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API_BASE_URL}/api/admin/certificate-templates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ ...template, name: name || template.name })
            });
            const data = await res.json();
            if (data.success) {
                alert("Template saved successfully!");
                // Optionally reset or redirect
            }
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setLoading(false);
        }
    };

    // Mapping logic: UI Pixels <-> PDF Points
    // We display the PDF template in a container with a relative width.
    // The ratio is containerWidth / pdfWidth.
    const updateFieldPos = (key: string, x: number, y: number) => {
        if (!template || !containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const ratio = template.width / rect.width;

        const newFields = template.fields.map(f => {
            if (f.key === key) {
                return { ...f, x: x * ratio, y: y * ratio };
            }
            return f;
        });

        setTemplate({ ...template, fields: newFields });
    };

    const updateFieldStyle = (key: string, updates: Partial<Field>) => {
        if (!template) return;
        const newFields = template.fields.map(f => {
            if (f.key === key) return { ...f, ...updates };
            return f;
        });
        setTemplate({ ...template, fields: newFields });
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header / Config */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 flex flex-wrap items-end gap-6">
                <div className="flex-1 min-w-[300px]">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Template Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Summer Internship 2024"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[#00875a]/50 transition-all"
                    />
                </div>
                
                <div className="flex gap-4">
                    {!template ? (
                        <label className="bg-[#00875a] text-white px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest cursor-pointer hover:scale-[1.02] transition-all flex items-center gap-2">
                            {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                            {uploading ? "Uploading..." : "Upload PDF Template"}
                            <input type="file" accept="application/pdf" className="hidden" onChange={handleUpload} />
                        </label>
                    ) : (
                        <>
                            <button 
                                onClick={() => setTemplate(null)}
                                className="bg-red-500/10 text-red-500 border border-red-500/20 px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-red-500/20 transition-all"
                            >
                                Reset
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-[#00875a] text-white px-8 py-4 rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Template
                            </button>
                        </>
                    )}
                </div>
            </div>

            {template && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Visual Mapper (Col 1-3) */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex items-center justify-between text-gray-500 px-2">
                            <span className="text-xs font-medium uppercase tracking-widest flex items-center gap-2">
                                <MousePointer2 size={14} /> Drag elements to position them
                            </span>
                            <span className="text-xs">{Math.round(template.width)} x {Math.round(template.height)} pts</span>
                        </div>
                        
                        <div 
                            ref={containerRef}
                            className="relative bg-white rounded-lg shadow-2xl overflow-hidden active:cursor-grabbing group"
                            style={{ 
                                aspectRatio: `${template.width} / ${template.height}`,
                                width: "100%",
                                background: "rgba(255,255,255,0.05)"
                            }}
                        >
                            {/* PDF Template "Background" */}
                            <iframe 
                                src={`${API_BASE_URL}${template.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
                            />

                            {/* Overlay Fields */}
                            {template.fields.map((field) => (
                                <motion.div
                                    key={field.key}
                                    drag
                                    dragMomentum={false}
                                    onDragEnd={(e, info) => {
                                        // info.point is relative to viewport, we need relative to container
                                        const rect = containerRef.current?.getBoundingClientRect();
                                        if (rect) {
                                            const x = info.point.x - rect.left;
                                            const y = info.point.y - rect.top;
                                            updateFieldPos(field.key, x, y);
                                        }
                                    }}
                                    onClick={() => setActiveField(field.key)}
                                    className={`absolute cursor-move px-3 py-1 rounded border-2 select-none z-10 ${
                                        activeField === field.key ? "border-[#00875a] bg-[#00875a]/20" : "border-transparent bg-blue-500/10 hover:border-blue-500/50"
                                    }`}
                                    style={{
                                        // Position in UI (scaled)
                                        left: `${(field.x / template.width) * 100}%`,
                                        top: `${(field.y / template.height) * 100}%`,
                                        fontSize: `${field.fontSize}px`,
                                        color: field.color,
                                        fontWeight: field.bold ? "bold" : "normal",
                                        transform: "translate(-50%, -50%)"
                                    }}
                                >
                                    {field.label}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Properties Panel (Col 4) */}
                    <div className="space-y-6">
                        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Type size={18} className="text-[#00875a]" /> Properties
                            </h3>
                            
                            {activeField ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Active Field</p>
                                        <p className="text-sm font-semibold text-white">{template.fields.find(f => f.key === activeField)?.label}</p>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3">Font Size ({template.fields.find(f => f.key === activeField)?.fontSize}px)</label>
                                        <input 
                                            type="range" min="8" max="72" 
                                            value={template.fields.find(f => f.key === activeField)?.fontSize}
                                            onChange={(e) => updateFieldStyle(activeField, { fontSize: parseInt(e.target.value) })}
                                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00875a]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-3">Text Color</label>
                                        <div className="flex gap-2">
                                            {["#000000", "#FFFFFF", "#00875a", "#0052cc", "#d12b2b"].map(c => (
                                                <button 
                                                    key={c}
                                                    onClick={() => updateFieldStyle(activeField, { color: c })}
                                                    className={`w-8 h-8 rounded-full border-2 ${template.fields.find(f => f.key === activeField)?.color === c ? "border-white" : "border-transparent"}`}
                                                    style={{ background: c }}
                                                />
                                            ))}
                                            <input 
                                                type="color" 
                                                value={template.fields.find(f => f.key === activeField)?.color}
                                                onChange={(e) => updateFieldStyle(activeField, { color: e.target.value })}
                                                className="w-8 h-8 rounded-full p-0 border-0 bg-transparent cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="bold"
                                            checked={template.fields.find(f => f.key === activeField)?.bold}
                                            onChange={(e) => updateFieldStyle(activeField, { bold: e.target.checked })}
                                            className="w-4 h-4 rounded accent-[#00875a]"
                                        />
                                        <label htmlFor="bold" className="text-sm font-medium text-gray-300">Bold Text</label>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                            <span>X: {Math.round(template.fields.find(f => f.key === activeField)?.x || 0)}</span>
                                            <span>Y: {Math.round(template.fields.find(f => f.key === activeField)?.y || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-xs text-gray-500">Select a field on the canvas to edit its properties</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Select</h3>
                            <div className="space-y-2">
                                {template.fields.map(f => (
                                    <button 
                                        key={f.key}
                                        onClick={() => setActiveField(f.key)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                                            activeField === f.key ? "bg-[#00875a] text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                                        }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
