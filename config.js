// Environment configuration for API URLs
// This allows the app to work both locally (with json-server at localhost:3000)
// and in production (with a deployed backend server)

export const getApiUrl = () => {
    // In development (local): use localhost:3000
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }
    
    // In production: use the deployed backend URL
    return 'https://hotel-backend-opal.vercel.app';
};

export const setApiUrl = (url) => {
    localStorage.setItem('API_URL', url);
};

export const API_BASE_URL = getApiUrl();
