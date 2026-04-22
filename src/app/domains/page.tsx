"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCatalog from "@/components/CourseCatalog";

export default function DomainSelectionPage() {
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
