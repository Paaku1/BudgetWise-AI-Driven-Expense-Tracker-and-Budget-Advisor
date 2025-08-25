import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid credentials");
        return;
      }

      const data = await response.json();
      sessionStorage.setItem("accessToken", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
     <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        
        {error && <p className="form-error" style={{ color: "red" }}>{error}</p>}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-button">Login</button>
        </form>

        <p className="form-text">
          Don’t have an account?{" "}
          <Link to="/register" className="form-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
