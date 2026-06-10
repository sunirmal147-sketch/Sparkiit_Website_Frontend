"use client";

import { useEffect } from "react";
import { useHomepageData } from "@/hooks/useHomepageData";
import { API_BASE_URL } from "@/lib/api-config";

export default function BrandingLoader() {
    const { data } = useHomepageData();

    useEffect(() => {
        if (!data) return;

        // 1. Update Document Favicon dynamically
        const faviconUrl = data.settings?.siteFavicon as string || "";
        if (faviconUrl) {
            const resolvedFavicon = faviconUrl.startsWith("/uploads")
                ? `${API_BASE_URL}${faviconUrl}`
                : faviconUrl;
            
            // Find existing favicon links (both icon and shortcut icon)
            const links = document.querySelectorAll("link[rel*='icon']");
            if (links.length > 0) {
                links.forEach((link: any) => {
                    link.href = resolvedFavicon;
                });
            } else {
                const link = document.createElement("link");
                link.rel = "icon";
                link.href = resolvedFavicon;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        }

        // 2. Update Document Title dynamically
        const siteName = data.settings?.siteName as string || "";
        if (siteName) {
            if (document.title.includes("SPARKIIT") || document.title.includes("Premium Digital Solutions")) {
                document.title = siteName;
            }
        }
    }, [data]);

    return null;
}
