import { useState } from "react";
import { addTransaction } from "../services/transactions";

const DailyLogPage = () => {
    const [transaction, setTransaction] = useState({
        type: "INCOME",
        amount: "",
        category: "",
        description: "",
        date: "",
    });

    const userId = localStorage.getItem("userId");

    const handleChange = (e) => {
        setTransaction({
            ...transaction,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTransaction(userId, transaction);
            alert("Transaction added successfully");
            setTransaction({ type: "INCOME", amount: "", category: "", description: "", date: "" });
        } catch (error) {
            console.error("Error adding transaction", error);
            alert("Failed to add transaction");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

                <select
                    name="type"
                    value={transaction.type}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border rounded"
                >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={transaction.amount}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={transaction.category}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={transaction.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="date"
                    name="date"
                    value={transaction.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                    Add Transaction
                </button>
            </form>
        </div>
    );
};

export default DailyLogPage;
