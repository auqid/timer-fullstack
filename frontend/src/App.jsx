import React, { useState, useEffect } from "react";
import LoginPage from "./components/Login/LoginPage";
import SignupPage from "./components/Signup/SignupPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import "./App.css"; // Global styles

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setPage("login");
  };

  const renderPage = () => {
    switch (page) {
      case "signup":
        return <SignupPage setPage={setPage} />;
      case "dashboard":
        return <DashboardPage user={user} handleLogout={handleLogout} />;
      case "login":
      default:
        return (
          <LoginPage setPage={setPage} onLoginSuccess={handleLoginSuccess} />
        );
    }
  };

  return <div className="app-container">{renderPage()}</div>;
}
