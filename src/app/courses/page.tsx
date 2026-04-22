"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCatalog from "@/components/CourseCatalog";
import { Suspense } from "react";

function CoursesPageContent() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <section className="pt-40 pb-20 px-6 md:px-20">
                <CourseCatalog />
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
