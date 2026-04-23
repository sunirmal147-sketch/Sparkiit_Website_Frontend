"use client";

import DynamicPage from "../[slug]/page";

export default function AboutPage() {
    return <DynamicPage params={Promise.resolve({ slug: "about" })} />;
}
