import axios from 'axios';

// API Base URL - Update this to match your backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL;


// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        // Check if this is an admin request
        const isAdminRequest = config.url && (
            config.url.includes('/admin') ||
            window.location.pathname.includes('/admin')
        );

        if (isAdminRequest) {
            // Use admin token for admin requests
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                config.headers.Authorization = `Bearer ${adminToken}`;
            }
        } else {
            // Use regular user token for regular requests
            const token = localStorage.getItem('jwtToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Check if this was an admin request
            const isAdminPage = window.location.pathname.includes('/admin');

            if (isAdminPage) {
                // Unauthorized admin - clear admin token and redirect to admin login
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUsername');
                window.location.href = '/admin-login';
            } else {
                // Unauthorized user - clear token and redirect to login
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
