import { Request, Response } from "express";
import { BookService } from "./book.service";
import { apiError, apiResponse } from "../../utils/apiResponse";
import { uploadToCloudinary } from "../../config/multer.config";

const createBook = async (req: Request, res: Response) => {
  try {
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.pages === "string") data.pages = parseInt(data.pages, 10);
      if (typeof data.availability === "string")
        data.availability = data.availability === "true";
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "books",
        );
        data.coverImage = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload cover image to Cloudinary");
      }
    } else if (!req.file && req.body.coverImage) {
      // If no file but image URL provided in body
      data.coverImage = req.body.coverImage;
    }

    const result = await BookService.createBook(data);
    apiResponse(res, 201, "Book created successfully", result);
  } catch (err: any) {
    // Handle multer errors
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return apiError(res, 400, "Unexpected field in file upload. Please use 'coverImage' as the field name.");
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return apiError(res, 400, "File too large. Maximum size is 5MB.");
    }
    if ((req as any).fileValidationError) {
      return apiError(res, 400, (req as any).fileValidationError);
    }

    // Handle Prisma P2003 (Foreign key constraint violation)
    if (err.code === 'P2003') {
      return apiError(res, 400, "Invalid category ID. Please provide a valid category.");
    }

    apiError(res, 500, err.message || "Failed to create book", err);
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await BookService.getAllBooks(req.query);
    apiResponse(res, 200, "Books fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch books", err);
  }
};

const getSingleBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BookService.getSingleBook(id as string);
    if (!result) {
      return apiError(res, 404, "Book not found");
    }
    apiResponse(res, 200, "Book fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch book", err);
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    } else {
      data = req.body;
      if (typeof data.pages === "string") data.pages = parseInt(data.pages, 10);
    }

    // Handle file upload
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(
          req.file.buffer,
          req.file.originalname,
          "books",
        );
        data.coverImage = imageUrl;
      } catch (uploadErr) {
        return apiError(res, 400, "Failed to upload cover image to Cloudinary");
      }
    }

    const result = await BookService.updateBook(id as string, data);
    apiResponse(res, 200, "Book updated successfully", result);
  } catch (err: any) {
    // Handle multer errors
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return apiError(res, 400, "Unexpected field in file upload. Please use 'coverImage' as the field name.");
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
      return apiError(res, 400, "File too large. Maximum size is 5MB.");
    }
    if ((req as any).fileValidationError) {
      return apiError(res, 400, (req as any).fileValidationError);
    }

    apiError(res, 500, err.message || "Failed to update book", err);
  }
};

const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BookService.deleteBook(id as string);
    apiResponse(res, 200, "Book deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete book", err);
  }
};

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
