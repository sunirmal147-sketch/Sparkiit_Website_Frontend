"use client";
import React from "react";
import CertificateBuilder from "@/components/admin/CertificateBuilder";

export default function ProjectBuilderPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">Project Certificate Builder</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">Design and position fields for Project completion certificates</p>
            </div>
            
            <CertificateBuilder type="PROJECT" />
        </div>
    );
}