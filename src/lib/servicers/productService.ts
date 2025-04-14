import { ProductService } from "../api/products";
import { Product, ProductFilterParams } from "../api/products";

// Get all products
export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const products = await ProductService.getAllProducts();
    return products.data;
  } catch (error) {
    console.error('Products fetch error:', error);
    throw error;
  }
};

// Get filtered products
export const fetchFilteredProducts = async (params: ProductFilterParams): Promise<{ products: Product[]; total: number }> => {
  try {
    const response = await ProductService.getProducts(params);
    if (!response) {
      throw new Error('Invalid response format from server');
    }
    return {
      products: Array.isArray(response.products) ? response.products : [],
      total: response.total || 0
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch filtered products';
    console.error('Filtered products fetch error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Get product by id
export const getProductById = async (productId: string): Promise<Product> => {
  try {
    const product = await ProductService.getProductById(productId);
    console.log(product, "------------");
    return product.data;
  } catch (error) {
    console.error('Product fetch error:', error);
    throw error;
  }
};

// Create product
export const createNewProduct = async (productData: Partial<Product>, imageFile?: File): Promise<Product> => {
  try {
    const newProduct = await ProductService.createProduct({
      ...productData,
      image_url: imageFile
    });
    return newProduct;
  } catch (error) {
    console.error('Product creation error:', error);
    throw error;
  }
};

// Update product
export const updateExistingProduct = async (productId: string, productData: Partial<Product>): Promise<Product> => {
  try {
    const updatedProduct = await ProductService.updateProduct(productId, productData);
    return updatedProduct;
  } catch (error) {
    console.error('Product update error:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await ProductService.deleteProduct(productId);
  } catch (error) {
    console.error('Product deletion error:', error);
    throw error;
  }
};