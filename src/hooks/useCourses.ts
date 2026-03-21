import { useState, useEffect } from 'react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/public';


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
        fetch(`${API_BASE}/courses`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setCourses(json.data);
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
