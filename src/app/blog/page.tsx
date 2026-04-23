"use client";

import DynamicPage from "../[slug]/page";

export default function BlogPage() {
    return <DynamicPage params={Promise.resolve({ slug: "blog" })} />;
}
