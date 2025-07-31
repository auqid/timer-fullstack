require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

module.exports = { MONGODB_URI, PORT, JWT_SECRET, FRONTEND_URL };
