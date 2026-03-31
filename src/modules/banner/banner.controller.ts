import { Request, Response } from "express";
import { BannerService } from "./banner.service";
import { apiError, apiResponse } from "../../utils/apiResponse";
import { uploadToCloudinary } from "../../config/multer.config";

const createBanner = async (req: Request, res: Response) => {
  try {
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.isActive === "string")
        data.isActive = data.isActive === "true";
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "banners",
        );
        data.image = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload banner image to Cloudinary");
      }
    } else if (!req.file && req.body.image) {
      data.image = req.body.image;
    }

    if (!data.image) {
      return apiError(res, 400, "Banner image is required");
    }

    const result = await BannerService.createBanner(data);
    apiResponse(res, 201, "Banner created successfully", result);
  } catch (err: any) {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return apiError(res, 400, "Unexpected field in file upload. Please use 'image' as the field name.");
    }
    apiError(res, 500, err.message || "Failed to create banner", err);
  }
};

const getAllBanners = async (req: Request, res: Response) => {
  try {
    const { activeOnly } = req.query;
    const result = activeOnly === 'true' 
      ? await BannerService.getActiveBanners() 
      : await BannerService.getAllBanners();
    apiResponse(res, 200, "Banners fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch banners", err);
  }
};

const getSingleBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BannerService.getSingleBanner(id as string);
    if (!result) {
      return apiError(res, 404, "Banner not found");
    }
    apiResponse(res, 200, "Banner fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch banner", err);
  }
};

const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.isActive === "string")
        data.isActive = data.isActive === "true";
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "banners",
        );
        data.image = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload banner image to Cloudinary");
      }
    }

    const result = await BannerService.updateBanner(id as string, data);
    apiResponse(res, 200, "Banner updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update banner", err);
  }
};

const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BannerService.deleteBanner(id as string);
    apiResponse(res, 200, "Banner deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete banner", err);
  }
};

export const BannerController = {
  createBanner,
  getAllBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};
