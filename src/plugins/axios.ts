import axios from 'axios';

const api = axios.create({
    baseURL: 'http://103.41.204.232:81',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    });

    // Logging untuk debugging
    api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    );

    api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
