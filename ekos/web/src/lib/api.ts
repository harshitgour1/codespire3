import axios from 'axios';

export const api = axios.create({
    baseURL: '/api', // Proxy will handle this in dev
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors (401, 403, etc.)
        return Promise.reject(error);
    }
);
