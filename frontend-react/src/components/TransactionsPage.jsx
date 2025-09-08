import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getTransactions,
    deleteTransaction,
    updateTransaction,
} from "../services/transactions";
import "../styles/TransactionsPage.css";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const userId = localStorage.getItem("userId");
    const firstname=localStorage.getItem("firstname");
    const navigate = useNavigate();

    const fetchTransactions = async () => {
        try {
            const res = await getTransactions(userId);
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this transaction?")) {
            await deleteTransaction(id);
            fetchTransactions();
        }
    };

    const handleEdit = (transaction) => {
        setEditing(transaction.id);
        setEditData({ ...transaction });
    };

    const handleSave = async () => {
        await updateTransaction(editing, editData);
        setEditing(null);
        fetchTransactions();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="transactions-container">
            {/* Navbar */}
            <nav className="transactions-navbar">
                <h1 className="transactions-title">WELCOME, {firstname}</h1>
                <button className="back-btn" onClick={() => navigate("/dashboard")}>
                    ← Back to Dashboard
                </button>
            </nav>

            {/* Table */}
            <div className="transactions-content">
                <h2 className="transactions-heading">Transactions</h2>
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id}>
                                <td>
                                    {editing === t.id ? (
                                        <input
                                            type="date"
                                            name="date"
                                            value={editData.date || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        t.date
                                    )}
                                </td>

                                <td>
                                    {editing === t.id ? (
                                        <select
                                            name="type"
                                            value={editData.type || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="INCOME">INCOME</option>
                                            <option value="EXPENSE">EXPENSE</option>
                                        </select>
                                    ) : (
                                        t.type
                                    )}
                                </td>

                                <td>
                                    {editing === t.id ? (
                                        <input
                                            type="text"
                                            name="category"
                                            value={editData.category || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        t.category
                                    )}
                                </td>

                                <td>
                                    {editing === t.id ? (
                                        <input
                                            type="number"
                                            name="amount"
                                            value={editData.amount || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        t.amount
                                    )}
                                </td>

                                <td>
                                    {editing === t.id ? (
                                        <input
                                            type="text"
                                            name="description"
                                            value={editData.description || ""}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        t.description
                                    )}
                                </td>

                                <td>
                                    {editing === t.id ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="save-btn"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditing(null)}
                                                className="cancel-btn"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="delete-btn"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsPage;
