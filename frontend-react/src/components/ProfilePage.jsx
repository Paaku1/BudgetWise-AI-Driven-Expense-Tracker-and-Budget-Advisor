import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css";

function ProfilePage() {
  const [formData, setFormData] = useState({
    income: "",
    savings: "",
    targetExpenses: "",
  });

  const navigate = useNavigate();

  // fetch token + userId from localStorage
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Profile creation failed:", error);
      alert(error.response?.data || "Profile creation failed, try again!");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Complete Your Profile</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            type="number"
            name="income"
            placeholder="Monthly Income"
            value={formData.income}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="number"
            name="savings"
            placeholder="Current Savings"
            value={formData.savings}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="number"
            name="targetExpenses"
            placeholder="Target Expenses"
            value={formData.targetExpenses}
            onChange={handleChange}
            required
            className="form-input"
          />

          <button type="submit" className="form-button">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
