// src/components/BudgetForm.jsx
import { useState } from "react";
import { addBudget } from "../services/budgetService";

const BudgetForm = ({ userId, onBudgetAdded }) => {
    const [formData, setFormData] = useState({
        category: "",
        limitAmount: 0,
        startDate: "",
        endDate: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addBudget(userId, formData);
        onBudgetAdded();
        setFormData({ category: "", limitAmount: 0, startDate: "", endDate: "" });
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
            <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
                className="border p-2 mr-2"
            />
            <input
                type="number"
                name="limitAmount"
                placeholder="Limit"
                value={formData.limitAmount}
                onChange={handleChange}
                required
                className="border p-2 mr-2"
            />
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 mr-2"
            />
            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add Budget
            </button>
        </form>
    );
};

export default BudgetForm;
