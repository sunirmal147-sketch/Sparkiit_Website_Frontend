"use client";

import DynamicPage from "../[slug]/page";

export default function ContactPage() {
    return <DynamicPage params={Promise.resolve({ slug: "contact" })} />;
}
