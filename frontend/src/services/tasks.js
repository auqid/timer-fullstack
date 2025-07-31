import api from "./api";

export const fetchTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch tasks");
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create task");
  }
};
