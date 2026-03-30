import { Request, Response } from "express";
import { UserService } from "./users.service";
import { apiError, apiResponse } from "../../utils/apiResponse";
import { uploadToCloudinary } from "../../config/multer.config";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers();
    apiResponse(res, 200, "Users fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch users", err);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
    }

    if (req.file) {
      // Upload image buffer to Cloudinary and store secure URL in user record
      if (req.file.buffer) {
        const cloudinaryUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "users",
        );
        data.image = cloudinaryUrl;
      } else if (req.file.path) {
        // Fallback if path is set for disk storage configuration
        data.image = req.file.path;
      }
    }

    const result = await UserService.updateUser(id as string, data);
    apiResponse(res, 200, "User updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update user", err);
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await UserService.softDeleteUser(id as string);
    apiResponse(res, 200, "User soft-deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to soft-delete user", err);
  }
};

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req.body);
    apiResponse(res, 201, "Admin created successfully", result);
  } catch (err: any) {
    const status = err.message?.includes("already exists") ? 409 : 500;
    apiError(res, status, err.message || "Failed to create admin", err);
  }
};

export const UserController = {
  getAllUsers,
  updateUser,
  softDeleteUser,
  createAdmin,
};
