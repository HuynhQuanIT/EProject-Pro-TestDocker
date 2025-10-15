const uuid = require('uuid');

/**
 * Service class to manage orders
 */
class OrderService {
  constructor() {
    // In-memory storage for orders (in production, use database)
    this.ordersMap = new Map();
  }

  /**
   * Create a new order
   * @param {Object} orderData - Order data containing products and username
   * @returns {Object} Created order with orderId
   */
  createOrder(orderData) {
    const { products, username } = orderData;
    
    if (!products || !Array.isArray(products)) {
      throw new Error('Products array is required');
    }

    if (!username) {
      throw new Error('Username is required');
    }

    const orderId = uuid.v4();
    const order = {
      orderId,
      status: 'pending',
      products,
      username,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.ordersMap.set(orderId, order);
    console.log(`Order created: ${orderId}`);
    
    return order;
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order object or null if not found
   */
  getOrderById(orderId) {
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return null;
    }
    return order;
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Object|null} Updated order or null if not found
   */
  updateOrderStatus(orderId, status) {
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return null;
    }

    order.status = status;
    order.updatedAt = new Date();
    this.ordersMap.set(orderId, order);
    
    console.log(`Order ${orderId} status updated to: ${status}`);
    return order;
  }

  /**
   * Update order with additional data
   * @param {string} orderId - Order ID
   * @param {Object} data - Additional data to merge
   * @returns {Object|null} Updated order or null if not found
   */
  updateOrder(orderId, data) {
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return null;
    }

    const updatedOrder = {
      ...order,
      ...data,
      orderId, // Preserve orderId
      updatedAt: new Date()
    };

    this.ordersMap.set(orderId, updatedOrder);
    console.log(`Order ${orderId} updated`);
    
    return updatedOrder;
  }

  /**
   * Get all orders for a specific user
   * @param {string} username - Username
   * @returns {Array} Array of orders
   */
  getOrdersByUsername(username) {
    const orders = [];
    for (const [orderId, order] of this.ordersMap.entries()) {
      if (order.username === username) {
        orders.push(order);
      }
    }
    return orders;
  }

  /**
   * Get all orders
   * @returns {Array} Array of all orders
   */
  getAllOrders() {
    return Array.from(this.ordersMap.values());
  }

  /**
   * Delete order by ID
   * @param {string} orderId - Order ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteOrder(orderId) {
    return this.ordersMap.delete(orderId);
  }
}

module.exports = OrderService;
