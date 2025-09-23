import { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetSummary";
import BudgetSummary from "./BudgetSummary";
import { getBudgets, addBudget, updateBudget, deleteBudget } from "../services/budgetService";

const BudgetsPage = () => {
    const [budgets, setBudgets] = useState([]);
    const userId = localStorage.getItem("userId");

    // ✅ Fetch budgets on load
    const fetchBudgets = async () => {
        try {
            const res = await getBudgets(userId);
            setBudgets(res.data);
        } catch (err) {
            console.error("Error fetching budgets:", err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    // ✅ Add new budget
    const handleAdd = async (budgetData) => {
        try {
            await addBudget(userId, budgetData);
            fetchBudgets();
        } catch (err) {
            console.error("Error adding budget:", err);
        }
    };

    // ✅ Update budget
    const handleUpdate = async (id, budgetData) => {
        try {
            await updateBudget(id, budgetData);
            fetchBudgets();
        } catch (err) {
            console.error("Error updating budget:", err);
        }
    };

    // ✅ Delete budget
    const handleDelete = async (id) => {
        try {
            await deleteBudget(id);
            fetchBudgets();
        } catch (err) {
            console.error("Error deleting budget:", err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Budgets</h2>

            {/* Add new budget */}
            <BudgetForm onSave={handleAdd} />

            {/* Budget summary (progress bars / charts) */}
            <BudgetSummary budgets={budgets} />

            {/* List of budgets */}
            <BudgetList
                budgets={budgets}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default BudgetsPage;
