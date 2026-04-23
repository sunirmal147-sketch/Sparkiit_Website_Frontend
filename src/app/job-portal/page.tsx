"use client";

import DynamicPage from "../[slug]/page";

export default function JobPortalPage() {
    return <DynamicPage params={Promise.resolve({ slug: "job-portal" })} />;
}
