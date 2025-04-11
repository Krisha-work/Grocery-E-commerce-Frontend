import apiClient from "./apiHelper";

const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
};

// Define TypeScript interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  categoryId: string;
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryDetails?: Category;
  reviewDetails?: Review[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  userDetails?: User;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ProductQueryParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image_url?: File;
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// Product service methods
export const ProductService = {
  getAllProducts: async () => {
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS);
  },

  getProducts: async (params: ProductQueryParams) => {
    return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS, { params });
  },

  getProductById: async (id: string) => {
    return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },

  createProduct: async (formData: FormData) => {
    return apiClient.post<Product>(API_ENDPOINTS.PRODUCTS, formData);
  },

  updateProduct: async (id: string, formData: FormData) => {
    return apiClient.put<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), formData);
  },

  deleteProduct: async (id: string) => {
    return apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }
};

// Export type definitions for use in components
export type { 
  Product, 
  Category, 
  Review, 
  User, 
  ProductQueryParams, 
  CreateProductData, 
  UpdateProductData 
};