import axios from 'axios';

// تكوين axios الأساسي
const http = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// interceptor للطلبات
http.interceptors.request.use(
    (config) => {
        // يمكنك إضافة token هنا لاحقاً
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// interceptor للردود
http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // معالجة عدم المصادقة
            console.error('Unauthorized');
        }
        return Promise.reject(error);
    }
);

export default http;