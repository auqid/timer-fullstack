import React from "react";
import TaskItem from "./TaskItem";
import styles from "./TaskList.module.css";

export default function TaskList({ tasks, onTaskUpdate }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Tasks</h1>
      <div className={styles.listContainer}>
        <ul className={styles.list}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onTaskUpdate={onTaskUpdate}
              />
            ))
          ) : (
            <li className={styles.emptyText}>No tasks yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
