// services/categoryService.ts
import apiClient from "./apiHelper";

interface Category {
  id: string;
  name: string;
  description: string;
  // other category fields
}

interface CreateCategoryParams {
  name: string;
  description: string;
}

interface UpdateCategoryParams {
  name?: string;
  description?: string;
}

export const CategoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    return apiClient.get("/categories");
  },

  getCategoryProducts: async (id: string): Promise<any[]> => {
    return apiClient.get(`/categories/${id}/products`);
  },

  createCategory: async (data: CreateCategoryParams): Promise<Category> => {
    return apiClient.post("/categories", data);
  },

  updateCategory: async (id: string, data: UpdateCategoryParams): Promise<Category> => {
    return apiClient.put(`/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    return apiClient.delete(`/categories/${id}`);
  },
};

export type { Category, CreateCategoryParams, UpdateCategoryParams };