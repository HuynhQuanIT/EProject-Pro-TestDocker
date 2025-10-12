require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET || "secret",
};
