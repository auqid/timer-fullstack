import api from "./api";

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to login");
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/login/signup", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to sign up");
  }
};
