// Centralized API configuration

/**
 * The base URL for the backend API.
 * In production, this should be set to the deployed backend URL via NEXT_PUBLIC_API_URL.
 * In development, it defaults to http://localhost:5000.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Optional helpers for common API paths
export const API_PUBLIC_URL = `${API_BASE_URL}/api/public`;
export const API_ADMIN_URL = `${API_BASE_URL}/api/admin`;
export const API_USER_URL = `${API_BASE_URL}/api`; // Assuming standard user routes are under /api
