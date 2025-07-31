import React, { useState, useEffect } from "react";
import { startTimer, stopTimer } from "../../services/timelogs";
import { updateTask, deleteTask } from "../../services/tasks";
import { formatDuration } from "../../utils/formatters";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task, onTaskUpdate }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
  });

  const totalLoggedDuration = task.timeLogs.reduce(
    (acc, log) => acc + (log.duration || 0),
    0
  );

  useEffect(() => {
    console.log("TaskItem: task.timeLogs", task.timeLogs); // Debug log
    const runningLog = task.timeLogs.find((log) => log.endTime === null);
    console.log("TaskItem: runningLog", runningLog); // Debug log
    let interval;

    if (runningLog) {
      console.log("Timer is running!"); // Debug log
      setIsTimerRunning(true);
      const startTime = new Date(runningLog.startTime).getTime();

      // Calculate initial elapsed time
      const initialElapsed = Math.floor(
        (new Date().getTime() - startTime) / 1000
      );
      setElapsedTime(initialElapsed);

      // Update every second
      interval = setInterval(() => {
        const newElapsed = Math.floor(
          (new Date().getTime() - startTime) / 1000
        );
        console.log("Timer tick:", newElapsed); // Debug log
        setElapsedTime(newElapsed);
      }, 1000);
    } else {
      console.log("No running timer found"); // Debug log
      setIsTimerRunning(false);
      setElapsedTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.timeLogs]);

  const handleTimerAction = async (action) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (action === "start") {
        await startTimer(task._id);
      } else {
        await stopTimer(task._id);
      }
      // Refresh tasks to get updated timer state
      await onTaskUpdate();
    } catch (error) {
      console.error("Timer action failed:", error);
      alert(`Failed to ${action} timer: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    // Show confirmation if completing a task with running timer
    if (newStatus === "Completed" && isTimerRunning) {
      const confirmed = window.confirm(
        "This will stop the running timer and mark the task as completed. Continue?"
      );
      if (!confirmed) return;
    }

    setIsLoading(true);
    try {
      // If marking as completed and timer is running, stop the timer first
      if (newStatus === "Completed" && isTimerRunning) {
        await stopTimer(task._id);
      }

      await updateTask(task._id, { status: newStatus });
      await onTaskUpdate();
      setShowActions(false);
    } catch (error) {
      console.error("Status update failed:", error);
      alert(`Failed to update status: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateTask(task._id, editData);
      await onTaskUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error("Edit failed:", error);
      alert(`Failed to update task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(true);
    try {
      await deleteTask(task._id);
      await onTaskUpdate();
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`Failed to delete task: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#16a34a";
      case "In Progress":
        return "#eab308";
      default:
        return "#6b7280";
    }
  };

  if (isEditing) {
    return (
      <li className={styles.item}>
        <form onSubmit={handleEdit} className={styles.editForm}>
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className={styles.editInput}
            required
            disabled={isLoading}
          />
          <textarea
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            className={styles.editTextarea}
            disabled={isLoading}
          />
          <select
            value={editData.status}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
            className={styles.editSelect}
            disabled={isLoading}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className={styles.editActions}>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

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
            {isTimerRunning && (
              <span className={styles.runningIndicator}>●</span>
            )}
          </p>
          <span
            className={styles.status}
            style={{ color: getStatusColor(task.status) }}
          >
            {task.status}
          </span>
        </div>

        <div className={styles.buttonGroup}>
          {isTimerRunning ? (
            <button
              onClick={() => handleTimerAction("stop")}
              className={`${styles.button} ${styles.stopButton}`}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Stop"}
            </button>
          ) : (
            <button
              onClick={() => handleTimerAction("start")}
              className={`${styles.button} ${styles.startButton}`}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Start"}
            </button>
          )}

          <button
            onClick={() => setShowActions(!showActions)}
            className={`${styles.button} ${styles.moreButton}`}
            disabled={isLoading}
          >
            ⋯
          </button>
        </div>
      </div>

      {showActions && (
        <div className={styles.actionMenu}>
          <div className={styles.statusButtons}>
            <button
              onClick={() => handleStatusChange("Pending")}
              className={`${styles.statusButton} ${
                task.status === "Pending" ? styles.active : ""
              }`}
              data-status="Pending"
              disabled={isLoading}
            >
              📋 Pending
            </button>
            <button
              onClick={() => handleStatusChange("In Progress")}
              className={`${styles.statusButton} ${
                task.status === "In Progress" ? styles.active : ""
              }`}
              data-status="In Progress"
              disabled={isLoading}
            >
              ⚡ In Progress
            </button>
            <button
              onClick={() => handleStatusChange("Completed")}
              className={`${styles.statusButton} ${
                task.status === "Completed" ? styles.active : ""
              }`}
              data-status="Completed"
              disabled={isLoading}
              title={
                isTimerRunning
                  ? "Complete task and stop timer"
                  : "Mark as completed"
              }
            >
              ✅ Completed{isTimerRunning && " & Stop"}
            </button>
          </div>
          <div className={styles.actionButtons}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
              disabled={isLoading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={styles.deleteButton}
              disabled={isLoading}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
