"use client";

import DynamicPage from "../[slug]/page";

export default function VerifyPage() {
    return <DynamicPage params={Promise.resolve({ slug: "verify" })} />;
}
