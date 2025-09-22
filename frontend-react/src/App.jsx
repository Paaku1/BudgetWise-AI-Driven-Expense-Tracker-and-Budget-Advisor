import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import ProfilePage from "./components/ProfilePage.jsx";
import DailyLogPage from "./components/DailyLogPage.jsx";
import TransactionsPage from "./components/TransactionsPage.jsx";
import BudgetsPage from "./components/BudgetPage.jsx"

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
              path="/dashboard"
              element={
              <PrivateRoute>
                  <Dashboard />
              </PrivateRoute>
          }
          />
          <Route path="/daily-log" element={<DailyLogPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          {/*<Route path="/savings" element={<SavingsPage />} />*/}

      </Routes>
    </Router>
  );
}

export default App;
