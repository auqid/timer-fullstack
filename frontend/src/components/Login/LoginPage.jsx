import React, { useState } from "react";
import { loginUser } from "../../services/login";
import styles from "./LoginPage.module.css";

export default function LoginPage({ setPage, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back!</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Using basic inputs for simplicity, can be replaced with InputField component */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className={styles.linkText}>
          Don't have an account?{" "}
          <button onClick={() => setPage("signup")} className={styles.link}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
