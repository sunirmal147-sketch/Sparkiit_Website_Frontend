import { API_BASE_URL } from "@/lib/api-config";
import { useState, useEffect } from 'react';

const API_BASE = API_BASE_URL + '/api/public';

interface Section {
    name: string;
    enabled: boolean;
    order: number;
    content: any;
}

export interface PageData {
    name: string;
    slug: string;
    sections: Section[];
}

export function usePageData(slug: string) {
    const [data, setData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        
        setLoading(true);
        fetch(`${API_BASE}/pages/${slug}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setData(json.data);
                } else {
                    setError(json.message);
                }
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [slug]);

    return { data, loading, error };
}
