import React from "react";
import styles from "./Header.module.css";

export default function Header({ user, handleLogout, setPage }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1 className={styles.title}>TaskTimer</h1>
        </div>

        {setPage && (
          <nav className={styles.nav}>
            <button
              onClick={() => setPage("dashboard")}
              className={styles.navButton}
            >
              Dashboard
            </button>
            <button
              onClick={() => setPage("summary")}
              className={styles.navButton}
            >
              Summary
            </button>
          </nav>
        )}

        <div className={styles.userSection}>
          <span className={styles.welcome}>Welcome, {user?.username}!</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
