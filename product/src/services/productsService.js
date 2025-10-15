const ProductsRepository = require("../repositories/productsRepository");

/**
 * Class that ties together the business logic and the data access layer
 */
class ProductsService {
  constructor() {
    this.productsRepository = new ProductsRepository();
  }

  async createProduct(product) {
    const createdProduct = await this.productsRepository.create(product);
    return createdProduct;
  }

  async getProductById(productId) {
    const product = await this.productsRepository.findById(productId);
    return product;
  }

  async getProducts() {
    const products = await this.productsRepository.findAll();
    return products;
  }

  async updateProductQuantity(productId, newQuantity) {
    try {
      const product = await this.productsRepository.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      product.quantity = newQuantity;
      return await this.productsRepository.update(productId, { quantity: newQuantity });
    } catch (error) {
      throw new Error(`Error updating product quantity: ${error.message}`);
    }
  }

  async validateAndReduceProductQuantities(orderItems) {
    try {
      const results = [];
      
      // Validate all products first
      for (const item of orderItems) {
        const product = await this.productsRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }
        
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        }
      }

      // If all validations pass, reduce quantities
      for (const item of orderItems) {
        const product = await this.productsRepository.findById(item.productId);
        const newQuantity = product.quantity - item.quantity;
        
        await this.productsRepository.update(item.productId, { quantity: newQuantity });
        
        results.push({
          productId: item.productId,
          productName: product.name,
          reducedQuantity: item.quantity,
          remainingQuantity: newQuantity
        });
        
        console.log(`Updated product ${product.name}: quantity decreased by ${item.quantity}, new quantity: ${newQuantity}`);
      }

      return results;
    } catch (error) {
      throw new Error(`Error processing product quantities: ${error.message}`);
    }
  }

  async processOrderInventoryUpdate(orderData) {
    try {
      const { products } = orderData;
      
      if (!products || !Array.isArray(products)) {
        throw new Error("Invalid products data in order");
      }

      // Map order products to the format expected by validateAndReduceProductQuantities
      const orderItems = products.map(product => ({
        productId: product.productId,
        quantity: product.quantity
      }));

      return await this.validateAndReduceProductQuantities(orderItems);
    } catch (error) {
      console.error("Error processing order inventory update:", error.message);
      throw error;
    }
  }
}

module.exports = ProductsService;
