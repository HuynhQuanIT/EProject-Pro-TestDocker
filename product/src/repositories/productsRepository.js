const Product = require("../models/product");

/**
 * Class that contains the data access logic for the product repository
 */
class ProductsRepository {
  async create(product) {
    const createdProduct = await Product.create(product);
    return createdProduct.toObject();
  }

  async findById(productId) {
    const product = await Product.findById(productId).lean();
    return product;
  }

  async findAll() {
    const products = await Product.find().lean();
    return products;
  }

  async update(productId, updateData) {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId, 
      updateData, 
      { new: true, runValidators: true }
    );
    return updatedProduct;
  }

  async delete(productId) {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  }
}

module.exports = ProductsRepository;
