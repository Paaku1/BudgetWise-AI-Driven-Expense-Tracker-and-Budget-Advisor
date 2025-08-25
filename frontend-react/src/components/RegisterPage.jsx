import { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "USER", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/register", formData);

                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("userId", response.data.userId);

                navigate("/profile");
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed, please try again.");
        }
    };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create Your Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-input"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" className="form-button">
            Register
          </button>
        </form>

        <p className="form-text">

          Already have an account?{" "}
          <span
            className="form-link"
            style={{ cursor: "pointer", color: "#007bff" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;