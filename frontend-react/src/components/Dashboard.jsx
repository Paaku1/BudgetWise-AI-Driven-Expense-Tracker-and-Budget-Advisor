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
        <h2 className="navbar-welcome"> WELCOME, {firstname}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Body Cards */}
      <div className="dashboard-body">
        <div
          className="dashboard-card add-card"
          onClick={() => navigate("/daily-log")}
        >
          <div className="card-icon">➕</div>
          <h3>Add Transaction</h3>
          <p>Record your income or expense entry quickly.</p>
        </div>

        <div
          className="dashboard-card view-card"
          onClick={() => navigate("/transactions")}
        >
          <div className="card-icon">📊</div>
          <h3>View Transactions</h3>
          <p>Analyze your financial activities in detail.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
