
import axios from 'axios';

// Get base URL from environment or fallback to dynamic hostname
const baseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000/api`;

export const apiClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // Important for session cookies if backend uses them
});

// Add response interceptor for global error handling if needed
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optional: Global error logging or toast
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);
