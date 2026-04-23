import { NextResponse } from 'next/server';

const GSHEET_URL = "https://script.google.com/macros/s/AKfycbxRpuQDYmzYhVWD-ttNUBpAaFcNVZdCqnbI3kjGo3EV0-t5D6nJGw31XJl9qTjagBlx/exec";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log('Constructing GET request for GSheet:', body);

        // Standardizing data for Google Sheets
        const formData = new URLSearchParams();
        formData.append('fullName', body.fullName || '');
        formData.append('email', body.email || '');
        formData.append('phone', body.phone || '');
        formData.append('message', body.message || '');

        console.log('Forwarding to GSheet:', GSHEET_URL);

        // Using POST with form-urlencoded which is more robust for Google Scripts
        const response = await fetch(GSHEET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
            redirect: 'follow'
        });

        const rawText = await response.text();
        console.log('Google Response Status:', response.status);
        console.log('Google Response Body:', rawText);

        if (!response.ok) {
            return NextResponse.json({ 
                error: 'Google Script Error', 
                status: response.status,
                details: rawText 
            }, { status: 500 });
        }

        // Check for HTML error pages (Authorization issues)
        if (rawText.includes("<!DOCTYPE html>") || rawText.includes("google-site-verification") || rawText.includes("Login")) {
             return NextResponse.json({ 
                error: 'Authorization Error', 
                message: 'Google returned an HTML/Login page. Please ensure you have deployed the script as "Anyone" and with "Execute as: Me".' 
            }, { status: 401 });
        }

        try {
            const jsonResponse = JSON.parse(rawText);
            return NextResponse.json(jsonResponse);
        } catch (e) {
            // If it's 200 OK but not JSON, it might still have worked
            if (rawText.toLowerCase().includes("success")) {
                return NextResponse.json({ result: 'success', message: 'Data logged' });
            }
            return NextResponse.json({ result: 'partial_success', message: 'Request sent but response was not JSON', raw: rawText });
        }
    } catch (error: any) {
        console.error('Proxy Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to forward request' }, { status: 500 });
    }
}
