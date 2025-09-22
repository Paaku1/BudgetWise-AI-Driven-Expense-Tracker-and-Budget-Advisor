import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const firstname = localStorage.getItem("firstname") || "User";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("firstname");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {/* Navbar */}
            <nav className="dashboard-navbar">
                <h2 className="navbar-welcome">WELCOME, {firstname}</h2>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            {/* Body Cards */}
            <div className="dashboard-body">
                {/* Daily Log */}
                <div
                    className="dashboard-card add-card"
                    onClick={() => navigate("/daily-log")}
                >
                    <div className="card-icon">➕</div>
                    <h3>Add Transaction</h3>
                    <p>Record your income or expense entry quickly.</p>
                </div>

                {/* View Transactions */}
                <div
                    className="dashboard-card view-card"
                    onClick={() => navigate("/transactions")}
                >
                    <div className="card-icon">📊</div>
                    <h3>View Transactions</h3>
                    <p>Analyze your financial activities in detail.</p>
                </div>

                {/* Budgets */}
                <div
                    className="dashboard-card budget-card"
                    onClick={() => navigate("/budgets")}
                >
                    <div className="card-icon">💰</div>
                    <h3>Manage Budgets</h3>
                    <p>Set and track your spending limits.</p>
                </div>

                {/* Savings */}
                <div
                    className="dashboard-card savings-card"
                    onClick={() => navigate("/savings")}
                >
                    <div className="card-icon">🏦</div>
                    <h3>Savings Goals</h3>
                    <p>Plan and track your savings progress.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
