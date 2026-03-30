import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

const createCategory = async (req: Request, res: Response) => {
  try {
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
    }

    // if (req.file) {
    //   data.image = req.file.path;
    // }

    const result = await CategoryService.createCategory(data);
    apiResponse(res, 201, "Category created successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to create category", err);
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await CategoryService.getAllCategories();
    apiResponse(res, 200, "Categories fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch categories", err);
  }
};

const getSingleCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.getSingleCategory(id as string);
    if (!result) {
      return apiError(res, 404, "Category not found");
    }
    apiResponse(res, 200, "Category fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch category", err);
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
    }

    // if (req.file) {
    //   data.image = req.file.path;
    // }

    const result = await CategoryService.updateCategory(id as string, data);
    apiResponse(res, 200, "Category updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update category", err);
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await CategoryService.deleteCategory(id as string);
    apiResponse(res, 200, "Category deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete category", err);
  }
};

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
