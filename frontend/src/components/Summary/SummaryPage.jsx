import React, { useState, useEffect } from "react";
import { getTodaySummary } from "../../services/timelogs";
import { formatDuration } from "../../utils/formatters";
import Header from "../Dashboard/Header";
import styles from "./SummaryPage.module.css";

export default function SummaryPage({ user, handleLogout, setPage }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await getTodaySummary();
      setSummary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductivityLevel = (totalHours) => {
    if (totalHours >= 8) return { level: "Excellent", color: "#16a34a" };
    if (totalHours >= 6) return { level: "Good", color: "#eab308" };
    if (totalHours >= 4) return { level: "Fair", color: "#f97316" };
    return { level: "Low", color: "#ef4444" };
  };

  if (loading) {
    return (
      <div>
        <Header user={user} handleLogout={handleLogout} setPage={setPage} />
        <main className={styles.main}>
          <div className={styles.loading}>Loading today's summary...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header user={user} handleLogout={handleLogout} setPage={setPage} />
        <main className={styles.main}>
          <div className={styles.error}>{error}</div>
        </main>
      </div>
    );
  }

  const totalHours = summary.totalDuration / 3600;
  const productivity = getProductivityLevel(totalHours);

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} setPage={setPage} />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Today's Productivity Summary</h1>
          <p className={styles.date}>{new Date().toLocaleDateString()}</p>

          {/* Overview Cards */}
          <div className={styles.overviewGrid}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>⏱️</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Total Time</h3>
                <p className={styles.cardValue}>
                  {formatDuration(summary.totalDuration)}
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📋</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Tasks Worked On</h3>
                <p className={styles.cardValue}>{summary.tasksWorkedOn}</p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>📊</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Productivity Level</h3>
                <p
                  className={styles.cardValue}
                  style={{ color: productivity.color }}
                >
                  {productivity.level}
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardIcon}>🎯</div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Sessions</h3>
                <p className={styles.cardValue}>{summary.timeLogs.length}</p>
              </div>
            </div>
          </div>

          {/* Detailed Time Logs */}
          <div className={styles.detailsSection}>
            <h2 className={styles.sectionTitle}>Detailed Time Logs</h2>

            {summary.timeLogs.length === 0 ? (
              <div className={styles.noData}>
                <p>No time logs recorded today. Start tracking your tasks!</p>
              </div>
            ) : (
              <div className={styles.timeLogsList}>
                {summary.timeLogs.map((log) => (
                  <div key={log._id} className={styles.timeLogItem}>
                    <div className={styles.timeLogHeader}>
                      <h4 className={styles.taskTitle}>{log.task.title}</h4>
                      <span className={styles.duration}>
                        {formatDuration(log.duration)}
                      </span>
                    </div>
                    <div className={styles.timeLogDetails}>
                      <span className={styles.timeRange}>
                        {new Date(log.startTime).toLocaleTimeString()} -{" "}
                        {new Date(log.endTime).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <h2 className={styles.sectionTitle}>Daily Goal Progress</h2>
            <div className={styles.progressContainer}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min((totalHours / 8) * 100, 100)}%`,
                    backgroundColor: productivity.color,
                  }}
                />
              </div>
              <div className={styles.progressLabels}>
                <span>0h</span>
                <span>4h</span>
                <span>8h (Goal)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
