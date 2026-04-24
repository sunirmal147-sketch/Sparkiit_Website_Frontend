import { API_BASE_URL } from "@/lib/api-config";
import { useState, useEffect } from 'react';

const API_BASE = API_BASE_URL + '/api/public';

export interface Course {
    _id: string;
    title: string;
    description: string;
    price: number;
    duration: string;
    instructor: string;
    category: string;
    image: string;
    availableSlots?: {
        date: string;
        time: string;
        capacity: number;
        booked: number;
    }[];
}

export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cached = localStorage.getItem('courses_data');
        if (cached) {
            try {
                setCourses(JSON.parse(cached));
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse cached courses data", e);
            }
        }

        fetch(`${API_BASE}/courses`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setCourses(json.data);
                    localStorage.setItem('courses_data', JSON.stringify(json.data));
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

    return { courses, loading, error };
}
