// services/productService.ts
import apiClient from "./apiHelper";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: File;
}

interface UpdateProductParams {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  image_url?: File;
}

interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const ProductService = {
  getAllProducts: async (): Promise<Product[]> => {
    return apiClient.get("/products/all");
  },

  getProducts: async (params: ProductFilterParams): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.category) queryParams.append('category', params.category);
    
    return apiClient.get(`/products?${queryParams.toString()}`);
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: async (data: CreateProductParams): Promise<Product> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('category', data.category);
    formData.append('stock', data.stock.toString());
    formData.append('image_url', data.image_url);

    return apiClient.post("/products", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: async (id: string, data: UpdateProductParams): Promise<Product> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price) formData.append('price', data.price.toString());
    if (data.category) formData.append('category', data.category);
    if (data.stock) formData.append('stock', data.stock.toString());
    if (data.image_url) formData.append('image_url', data.image_url);

    return apiClient.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },
};

export type { 
  Product, 
  ProductListResponse, 
  CreateProductParams, 
  UpdateProductParams, 
  ProductFilterParams 
};