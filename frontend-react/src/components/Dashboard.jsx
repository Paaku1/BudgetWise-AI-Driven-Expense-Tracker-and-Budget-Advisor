import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username") || "User";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-6">Welcome, {username} 👋</h1>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate("/daily-log")}
                        className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                    >
                        ➕ Add Transaction
                    </button>

                    <button
                        onClick={() => navigate("/transactions")}
                        className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                    >
                        📊 View Transactions
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
