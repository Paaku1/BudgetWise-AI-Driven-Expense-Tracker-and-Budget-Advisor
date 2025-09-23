// src/services/budgetService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/budgets";

const token = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export const getBudgets = (userId) =>
    axiosInstance.get(`/user/${userId}`);

export const addBudget = (userId, budget) =>
    axiosInstance.post(`/${userId}`, budget);

export const updateBudget = (id, budget) =>
    axiosInstance.put(`/${id}`, budget);

export const deleteBudget = (id) =>
    axiosInstance.delete(`/${id}`);

export const getBudgetSummary = (userId) =>
    axiosInstance.get(`/user/${userId}/summary`);
