const Product = require("../models/product");
const messageBroker = require("../utils/messageBroker");
const uuid = require('uuid');

/**
 * Class to hold the API implementation for the product services
 */
class ProductController {

  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();

  }

  async createProduct(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = new Product(req.body);

      // Set default quantity if not provided
      if (!product.quantity && product.quantity !== 0) {
        product.quantity = 0;
      }

      const validationError = product.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      await product.save({ timeout: 30000 });

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { items } = req.body; // items should be array of {productId, quantity}
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ message: "Items array is required" });
      }

      // Check product availability and get product details
      const orderProducts = [];
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
        }
        
        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
          });
        }

        orderProducts.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });
      }
  
      const orderId = uuid.v4(); // Generate a unique order ID
      this.ordersMap.set(orderId, { 
        status: "pending", 
        products: orderProducts, 
        username: req.user.username
      });
  
      await messageBroker.publishMessage("orders", {
        products: orderProducts,
        username: req.user.username,
        orderId, // include the order ID in the message to orders queue
      });

      // Set up one-time consumer for this specific order
      messageBroker.consumeMessage("products", (data) => {
        const orderData = JSON.parse(JSON.stringify(data));
        const { orderId: responseOrderId } = orderData;
        const order = this.ordersMap.get(responseOrderId);
        if (order) {
          // update the order in the map
          this.ordersMap.set(responseOrderId, { ...order, ...orderData, status: 'completed' });
          console.log("Updated order:", responseOrderId);
        }
      });
  
      // Return immediate response with pending status
      const currentOrder = this.ordersMap.get(orderId);
      return res.status(201).json({
        ...currentOrder,
        message: "Order created successfully and being processed",
        status: "pending"
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  

  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  }

  async getProducts(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const products = await Product.find({});

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async updateProductQuantity(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity < 0) {
        return res.status(400).json({ message: "Quantity cannot be negative" });
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { quantity },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async getProductById(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = ProductController;
