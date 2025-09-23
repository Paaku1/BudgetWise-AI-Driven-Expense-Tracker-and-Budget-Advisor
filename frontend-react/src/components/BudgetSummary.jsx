// src/components/BudgetSummary.jsx
import { useEffect, useState } from "react";
import { getBudgetSummary } from "../services/budgetService";

const BudgetSummary = ({ userId }) => {
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await getBudgetSummary(userId);
            setSummary(res.data);
        };
        fetchSummary();
    }, [userId]);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Budget Summary</h2>
            {summary.map((s, i) => (
                <div
                    key={i}
                    className={`p-4 mb-2 rounded ${
                        s.exceeded ? "bg-red-200" : "bg-green-200"
                    }`}
                >
                    <p><strong>Category:</strong> {s.category}</p>
                    <p><strong>Limit:</strong> {s.limitAmount}</p>
                    <p><strong>Spent:</strong> {s.spentAmount}</p>
                    <p><strong>Remaining:</strong> {s.remainingAmount}</p>
                </div>
            ))}
        </div>
    );
};

export default BudgetSummary;
