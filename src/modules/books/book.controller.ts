import { Request, Response } from "express";
import { BookService } from "./book.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

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

    // if (req.file) {
    //   data.coverImage = req.file.path;
    // }

    const result = await BookService.createBook(data);
    apiResponse(res, 201, "Book created successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to create book", err);
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const result = await BookService.getAllBooks();
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

    // if (req.file) {
    //   data.coverImage = req.file.path;
    // }

    const result = await BookService.updateBook(id as string, data);
    apiResponse(res, 200, "Book updated successfully", result);
  } catch (err: any) {
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
