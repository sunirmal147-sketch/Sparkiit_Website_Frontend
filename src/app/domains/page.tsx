"use client";

import DynamicPage from "../[slug]/page";

export default function DomainsPage() {
    return <DynamicPage params={Promise.resolve({ slug: "domains" })} />;
}
