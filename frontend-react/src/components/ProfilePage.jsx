import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfilePage() {
    const [formData, setFormData] = useState({
        income: "",
        savings: "",
        targetExpenses: ""
    });

    const navigate = useNavigate();

    // fetch token + userId from localStorage
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `http://localhost:5000/api/profile/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Redirect to home/dashboard after profile creation
            navigate("/home");
        } catch (error) {
            console.error("Profile creation failed:", error);
            alert(error.response?.data || "Profile creation failed, try again!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Complete Your Profile
                </h2>

                <input
                    type="number"
                    name="income"
                    placeholder="Monthly Income"
                    value={formData.income}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="number"
                    name="savings"
                    placeholder="Current Savings"
                    value={formData.savings}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <input
                    type="number"
                    name="targetExpenses"
                    placeholder="Target Expenses"
                    value={formData.targetExpenses}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-3 border rounded"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Save Profile
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;
