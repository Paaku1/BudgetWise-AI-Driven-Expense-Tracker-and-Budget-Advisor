import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/home", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          sessionStorage.removeItem("accessToken");
          navigate("/login");
        }
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={logout} style={{ marginTop: "15px" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
