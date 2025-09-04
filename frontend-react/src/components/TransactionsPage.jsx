import { useEffect, useState } from "react";
import { getTransactions, deleteTransaction, updateTransaction } from "../services/transactions";

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [editing, setEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const userId = localStorage.getItem("userId");

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
        setEditData({ ...transaction }); // copy transaction into editData
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
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Transactions</h2>
            <table className="w-full border-collapse border">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Description</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((t) => (
                    <tr key={t.id}>
                        {/* Date */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <input
                                    type="date"
                                    name="date"
                                    value={editData.date || ""}
                                    onChange={handleChange}
                                    className="border px-2"
                                />
                            ) : (
                                t.date
                            )}
                        </td>

                        {/* Type */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <select
                                    name="type"
                                    value={editData.type || ""}
                                    onChange={handleChange}
                                    className="border px-2"
                                >
                                    <option value="INCOME">INCOME</option>
                                    <option value="EXPENSE">EXPENSE</option>
                                </select>
                            ) : (
                                t.type
                            )}
                        </td>

                        {/* Category */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <input
                                    type="text"
                                    name="category"
                                    value={editData.category || ""}
                                    onChange={handleChange}
                                    className="border px-2"
                                />
                            ) : (
                                t.category
                            )}
                        </td>

                        {/* Amount */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <input
                                    type="number"
                                    name="amount"
                                    value={editData.amount || ""}
                                    onChange={handleChange}
                                    className="border px-2"
                                />
                            ) : (
                                t.amount
                            )}
                        </td>

                        {/* Description */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <input
                                    type="text"
                                    name="description"
                                    value={editData.description || ""}
                                    onChange={handleChange}
                                    className="border px-2"
                                />
                            ) : (
                                t.description
                            )}
                        </td>

                        {/* Actions */}
                        <td className="border p-2">
                            {editing === t.id ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditing(null)}
                                        className="bg-gray-400 text-white px-2 py-1 rounded"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
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
    );
};

export default TransactionsPage;
