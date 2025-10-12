require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_URL || 'mongodb://localhost:27017/orders',
    rabbitMQURI: process.env.RABBITMQ_URL || 'amqp://localhost',
    rabbitMQQueue: 'orders',
    port: 3002,
    jwtSecret: process.env.JWT_SECRET || 'mysecretkey'
};
  