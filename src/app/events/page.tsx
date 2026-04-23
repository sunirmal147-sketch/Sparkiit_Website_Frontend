"use client";

import DynamicPage from "../[slug]/page";

export default function EventsPage() {
    return <DynamicPage params={Promise.resolve({ slug: "events" })} />;
}
