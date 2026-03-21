import { useState, useEffect } from 'react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/public';


export interface Booking {
    _id: string;
    course: {
        _id: string;
        title: string;
    };
    slotDate: string;
    slotTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    createdAt: string;
}

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_BASE}/bookings/my`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    setBookings(json.data);
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

    return { bookings, loading, error };
}
