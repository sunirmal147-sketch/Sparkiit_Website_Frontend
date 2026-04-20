import { NextResponse } from 'next/server';

const GSHEET_URL = "https://script.google.com/macros/s/AKfycbyjhPqet9-oYoGh7JhhlozvOIBZySMgxVHRhj70G8nEuNDmn15aFgjyaRd8CD6UJ6Cw/exec";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('Constructing GET request for GSheet:', body);

        // Standardizing query parameters for the GET request
        const params = new URLSearchParams({
            fullName: body.fullName || '',
            email: body.email || '',
            message: body.message || ''
        });

        const targetUrl = `${GSHEET_URL}?${params.toString()}`;
        console.log('Target URL:', targetUrl);

        const response = await fetch(targetUrl, {
            method: 'GET',
            redirect: 'follow'
        });

        const rawText = await response.text();
        console.log('Google Response Status:', response.status);

        if (!response.ok) {
            return NextResponse.json({ 
                error: 'Google Script Error', 
                status: response.status,
                details: rawText 
            }, { status: 500 });
        }

        // Check for HTML error pages (Authorization issues)
        if (rawText.includes("<!DOCTYPE html>") || rawText.includes("google-site-verification")) {
             return NextResponse.json({ 
                error: 'Authorization Error', 
                message: 'Google returned an HTML page. Please ensure you have deployed the script as "Anyone".' 
            }, { status: 401 });
        }

        try {
            return NextResponse.json(JSON.parse(rawText));
        } catch (e) {
            // Treat as success if status was 200 OK
            return NextResponse.json({ result: 'success', message: 'Data logged' });
        }
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to forward request' }, { status: 500 });
    }
}
