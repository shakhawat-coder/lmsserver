import { Request, Response } from "express";
import { BlogService } from "./blog.service";
import { apiError, apiResponse } from "../../utils/apiResponse";
import { uploadToCloudinary } from "../../config/multer.config";

const createBlog = async (req: Request, res: Response) => {
  try {
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.published === "string")
        data.published = data.published === "true";
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "blogs",
        );
        data.image = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload blog image to Cloudinary");
      }
    }

    const result = await BlogService.createBlog(data);
    apiResponse(res, 201, "Blog created successfully", result);
  } catch (err: any) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return apiError(res, 400, "Unexpected field in file upload. Please use 'image' as the field name.");
    }
    apiError(res, 500, err.message || "Failed to create blog", err);
  }
};

const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === 'ADMIN' || (req as any).user?.role === 'SUPERADMIN';
    const result = isAdmin ? await BlogService.getAllBlogs() : await BlogService.getPublishedBlogs();
    apiResponse(res, 200, "Blogs fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch blogs", err);
  }
};

const getPublishedBlogs = async (req: Request, res: Response) => {
  try {
    const result = await BlogService.getPublishedBlogs();
    apiResponse(res, 200, "Published blogs fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch published blogs", err);
  }
};

const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BlogService.getSingleBlog(id as string);
    if (!result) {
      return apiError(res, 404, "Blog not found");
    }
    apiResponse(res, 200, "Blog fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch blog", err);
  }
};

const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.published === "string")
        data.published = data.published === "true";
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "blogs",
        );
        data.image = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload blog image to Cloudinary");
      }
    }

    const result = await BlogService.updateBlog(id as string, data);
    apiResponse(res, 200, "Blog updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update blog", err);
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BlogService.deleteBlog(id as string);
    apiResponse(res, 200, "Blog deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete blog", err);
  }
};

export const BlogController = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
