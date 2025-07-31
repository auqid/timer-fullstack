import api from "./api";

export const startTimer = async (taskId) => {
  try {
    const response = await api.post("/timelogs/start", { taskId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to start timer");
  }
};

export const stopTimer = async (taskId) => {
  try {
    const response = await api.post("/timelogs/stop", { taskId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to stop timer");
  }
};
