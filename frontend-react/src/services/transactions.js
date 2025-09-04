import axios from "axios";

const API_URL = "http://localhost:5000";

const axiosInstance = axios.create({
    baseURL: API_URL,
});

// 🔑 Add interceptor to inject token dynamically
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getTransactions = async (userId) => {
    return await axiosInstance.get(`/transactions/user/${userId}`);
};

export const addTransaction = async (userId, transactionData) => {
    return await axiosInstance.post(`/transactions/${userId}`, transactionData);
};

export const updateTransaction = async (id, transactionData) => {
    return await axiosInstance.put(`/transactions/${id}`, transactionData);
};

export const deleteTransaction = async (id) => {
    return await axiosInstance.delete(`/transactions/${id}`);
};
