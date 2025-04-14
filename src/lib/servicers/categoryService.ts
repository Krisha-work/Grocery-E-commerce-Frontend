import { CategoryService, CreateCategoryParams, UpdateCategoryParams } from "../api/category";

// Get all categories
const fetchCategories = async () => {
  try {
    const categories = await CategoryService.getAllCategories();
    console.log('All categories:', categories);
    return categories;
  } catch (error) {
    console.error('Categories fetch error:', error);
  }
};

// Get category products
const fetchCategoryProducts = async (categoryId: string) => {
  try {
    const response = await CategoryService.getCategoryProducts(categoryId);
    console.log('Category products:', response);
    return response;
  } catch (error) {
    console.error('Category products error:', error);
    throw error;
  }
};

// Create new category
const createCategory = async (data: CreateCategoryParams) => {
  try {
    const newCategory = await CategoryService.createCategory(data);
    console.log('Category created:', newCategory);
    return newCategory;
  } catch (error) {
    console.error('Category creation error:', error);
  }
};

// Update category
const updateCategory = async (id: string, data: UpdateCategoryParams) => {
  try {
    const updatedCategory = await CategoryService.updateCategory(id, data);
    console.log('Category updated:', updatedCategory);
  } catch (error) {
    console.error('Category update error:', error);
  }
};

// Delete category
const deleteCategory = async (id: string) => {
  try {
    const deletedCategory = await CategoryService.deleteCategory(id);
    console.log('Category deleted:', deletedCategory);
  } catch (error) {
    console.error('Category deletion error:', error);
  }
};

export { fetchCategories, createCategory, updateCategory, deleteCategory, fetchCategoryProducts };
