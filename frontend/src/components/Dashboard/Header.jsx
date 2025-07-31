import React from "react";
import styles from "./Header.module.css";

export default function Header({ user, handleLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <span className={styles.logo}>TaskTrack</span>
        <div className={styles.userInfo}>
          <span>Welcome, {user?.username || "User"}!</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
