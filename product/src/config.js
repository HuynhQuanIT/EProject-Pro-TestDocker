require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_URL,
  rabbitMQURI: process.env.RABBITMQ_URL || "amqp://localhost",
  exchangeName: "products",
  queueName: "products_queue",
  jwtSecret: process.env.JWT_SECRET || "mysecretkey",
};
