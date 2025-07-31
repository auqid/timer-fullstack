const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");
const JWT_SECRET = require("../utils/config").JWT_SECRET;

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};
const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and is correctly formatted
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the "Bearer <token>" string
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, JWT_SECRET);

      // Find the user by the ID from the token's payload
      // .select('-password') ensures the user's password hash is not attached to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user not found" });
      }

      // If everything is successful proceed to the next middleware or the route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  // If no token is found in the header
  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  protect,
};
