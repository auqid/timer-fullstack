import React, { useState, useEffect } from "react";
import { startTimer, stopTimer } from "../../services/timelogs";
import { formatDuration } from "../../utils/formatters";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task, onTaskUpdate }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalLoggedDuration = task.timeLogs.reduce(
    (acc, log) => acc + (log.duration || 0),
    0
  );

  useEffect(() => {
    const runningLog = task.timeLogs.find((log) => log.endTime === null);
    let interval;
    if (runningLog) {
      setIsTimerRunning(true);
      const startTime = new Date(runningLog.startTime).getTime();
      interval = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime) / 1000));
      }, 1000);
    } else {
      setIsTimerRunning(false);
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [task.timeLogs]);

  const handleTimerAction = async (action) => {
    try {
      const timerAction = action === "start" ? startTimer : stopTimer;
      await timerAction(task._id);
      onTaskUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li className={styles.item}>
      <div className={styles.details}>
        <p className={styles.title}>{task.title}</p>
        <p className={styles.description}>{task.description}</p>
      </div>
      <div className={styles.controls}>
        <div className={styles.timerInfo}>
          <p className={styles.duration}>
            {formatDuration(totalLoggedDuration + elapsedTime)}
          </p>
          <span className={styles.status}>{task.status}</span>
        </div>
        {isTimerRunning ? (
          <button
            onClick={() => handleTimerAction("stop")}
            className={`${styles.button} ${styles.stopButton}`}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={() => handleTimerAction("start")}
            className={`${styles.button} ${styles.startButton}`}
          >
            Start
          </button>
        )}
      </div>
    </li>
  );
}
