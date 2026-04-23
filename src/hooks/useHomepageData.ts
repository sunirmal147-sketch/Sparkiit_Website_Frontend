import { API_BASE_URL } from "@/lib/api-config";
import { useState, useEffect } from 'react';

const API_BASE = API_BASE_URL + '/api/public';


export interface Project {
    num: string;
    title: string;
    category: string;
    image: string;
}

export interface Service {
    _id?: string;
    title: string;
    description?: string;
    category?: string;
    link?: string;
    icon?: string;
    thumbnailUrl?: string;
}

export interface HorizontalScrollItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    num: string;
    order: number;
}

export interface Recognition {
    _id: string;
    name: string;
    logoUrl: string;
    link?: string;
    order: number;
}

export interface Brand {
    _id: string;
    name: string;
    logoUrl?: string;
    link?: string;
    order?: number;
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    avatar?: string;
}

export interface HomepageData {
    projects: Project[];
    services: Service[];
    horizontalScrollItems: HorizontalScrollItem[];
    testimonials?: Testimonial[];
    recognitions?: Recognition[];
    brands?: Brand[];
    content: {
        hero?: {
            word1?: string;
            word2?: string;
            word3?: string;
            tagline?: string;
            ctaText?: string;
        };
        story?: {
            title?: string;
            subtitle?: string;
            description?: string;
        };
        process?: {
            title?: string;
            description?: string;
            step1Title?: string;
            step1Desc?: string;
            step2Title?: string;
            step2Desc?: string;
            step3Title?: string;
            step3Desc?: string;
        };
        site?: {
            logoText?: string;
            footerDesc?: string;
            copyright?: string;
            github?: string;
            twitter?: string;
            linkedin?: string;
            instagram?: string;
        };
        review?: {
            rating?: string;
        };
        testimonials?: {
            title?: string;
            subtitle?: string;
        };
    };
    settings?: {
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        slot_booking_url?: string;
        full_registration_url?: string;
        [key: string]: string | number | boolean | null | undefined | object;
    };
    pageStructure: {
        name: string;
        enabled: boolean;
        order: number;
        content?: any;
    }[];
}

export function useHomepageData() {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${API_BASE}/homepage`, { cache: 'no-store' })
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
    }, []);

    return { data, loading, error };
}
