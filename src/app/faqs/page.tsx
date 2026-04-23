"use client";

import DynamicPage from "../[slug]/page";

export default function FaqPage() {
    return <DynamicPage params={Promise.resolve({ slug: "faqs" })} />;
}
