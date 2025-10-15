const amqp = require("amqplib");
const ProductsService = require("../services/productsService");

class MessageBroker {
  constructor() {
    this.channel = null;
    this.productsService = new ProductsService();
  }

  async connect() {
    console.log("Connecting to RabbitMQ...");

    setTimeout(async () => {
      try {
        const connection = await amqp.connect("amqp://rabbitmq:5672");
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("products");
        console.log("RabbitMQ connected");
        
        // Start consuming messages from products queue
        this.consumeProductMessages();
      } catch (err) {
        console.error("Failed to connect to RabbitMQ:", err.message);
      }
    }, 20000); // delay 20 seconds to wait for RabbitMQ to start
  }

  async consumeProductMessages() {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume("products", async (message) => {
        if (message) {
          const content = message.content.toString();
          const parsedContent = JSON.parse(content);
          console.log("Received order in product service:", parsedContent);
          
          // Process the order and update product quantities
          await this.updateProductQuantities(parsedContent);
          
          this.channel.ack(message);
        }
      });
    } catch (err) {
      console.error("Error consuming product messages:", err);
    }
  }

  async updateProductQuantities(orderData) {
    try {
      // Delegate to ProductsService for business logic
      const results = await this.productsService.processOrderInventoryUpdate(orderData);
      console.log("Inventory updated successfully:", results);
      return results;
    } catch (err) {
      console.error("Error updating product quantities:", err.message);
      throw err;
    }
  }

  async publishMessage(queue, message) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message))
      );
    } catch (err) {
      console.log(err);
    }
  }

  async consumeMessage(queue, callback) {
    if (!this.channel) {
      console.error("No RabbitMQ channel available.");
      return;
    }

    try {
      await this.channel.consume(queue, (message) => {
        const content = message.content.toString();
        const parsedContent = JSON.parse(content);
        callback(parsedContent);
        this.channel.ack(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new MessageBroker();
