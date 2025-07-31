import React, { useState } from "react";
import { signupUser } from "../../services/login";
import styles from "./SignupPage.module.css";

export default function SignupPage({ setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signupUser({ username, email, password });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => setPage("login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an Account</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
            required
          />
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
          {success && <p className={styles.success}>{success}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p className={styles.linkText}>
          Already have an account?{" "}
          <button onClick={() => setPage("login")} className={styles.link}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
