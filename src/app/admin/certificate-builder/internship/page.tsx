"use client";
import React from "react";
import CertificateBuilder from "@/components/admin/CertificateBuilder";

export default function InternshipBuilderPage() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-bold uppercase tracking-tighter mb-2">Internship Certificate Builder</h1>
                <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">Design and position fields for Internship recognition</p>
            </div>
            
            <CertificateBuilder type="INTERNSHIP" />
        </div>
    );
}