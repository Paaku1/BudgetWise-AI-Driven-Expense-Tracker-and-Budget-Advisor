import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTransaction } from "../services/transactions";
import "../styles/DailyLogPage.css"; // external css

const DailyLogPage = () => {
    const [transaction, setTransaction] = useState({
        type: "INCOME",
        amount: "",
        category: "",
        description: "",
        date: "",
    });

    const userId = localStorage.getItem("userId");
    const firstname=localStorage.getItem("firstname");
    const navigate = useNavigate();

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
            setTransaction({
                type: "INCOME",
                amount: "",
                category: "",
                description: "",
                date: "",
            });
        } catch (error) {
            console.error("Error adding transaction", error);
            alert("Failed to add transaction");
        }
    };

    return (
        <div className="dailylog-container">
            {/* Navbar */}
            <nav className="dailylog-navbar">
                <h1 className="dailylog-title">WELCOME ,  {firstname}</h1>
                <button
                    className="back-btn"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </nav>

            {/* Form */}
            <div className="dailylog-form-container">
                <form onSubmit={handleSubmit} className="dailylog-form">
                    <h2 className="form-title">Add Transaction</h2>

                    <select
                        name="type"
                        value={transaction.type}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="INCOME">💰 Income</option>
                        <option value="EXPENSE">💸 Expense</option>
                    </select>

                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={transaction.amount}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={transaction.category}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={transaction.description}
                        onChange={handleChange}
                        className="form-input"
                    />

                    <input
                        type="date"
                        name="date"
                        value={transaction.date}
                        onChange={handleChange}
                        required
                        className="form-input"
                    />

                    <button type="submit" className="submit-btn">
                        ➕ Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DailyLogPage;
