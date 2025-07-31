import React, { useState, useEffect, useCallback } from "react";
import {
  fetchTasks as fetchTasksService,
  createTask,
} from "../../services/tasks";
import Header from "./Header";
import TaskList from "./TaskList";
import styles from "./DashboardPage.module.css";

export default function DashboardPage({ user, handleLogout, setPage }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasksService();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      await createTask(newTask);
      setNewTask({ title: "", description: "" });
      setShowCreateForm(false);
      fetchTasks(); // Refresh the task list
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewTask({ title: "", description: "" });
    setShowCreateForm(false);
    setError("");
  };

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} setPage={setPage} />
      <main className={styles.main}>
        {/* Task Creation Section */}
        <div className={styles.createTaskSection}>
          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className={styles.createTaskButton}
            >
              + Create New Task
            </button>
          ) : (
            <div className={styles.createTaskForm}>
              <h3 className={styles.formTitle}>Create New Task</h3>
              <form onSubmit={handleCreateTask} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                    className={styles.input}
                    disabled={creating}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <textarea
                    placeholder="Description (optional)"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className={styles.textarea}
                    disabled={creating}
                    rows="3"
                  />
                </div>
                <div className={styles.formActions}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Task"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className={styles.cancelButton}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && <div className={styles.error}>{error}</div>}

        {/* Loading State */}
        {loading && <div className={styles.loading}>Loading tasks...</div>}

        {/* Task List */}
        {!loading && !error && (
          <TaskList tasks={tasks} onTaskUpdate={fetchTasks} />
        )}
      </main>
    </div>
  );
}
