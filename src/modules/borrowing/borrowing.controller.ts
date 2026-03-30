import { Request, Response } from "express";
import { BorrowingService } from "./borrowing.service";
import { apiError, apiResponse } from "../../app/utils/apiResponse";

const createBorrowing = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return apiError(res, 401, "Unauthorized");
    }

    // Default dueDate if not provided (e.g. 14 days from now)
    const dueDate = req.body.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const result = await BorrowingService.createBorrowing({
      userId,
      ...req.body,
      dueDate
    });
    apiResponse(res, 201, "Book borrowed successfully", result);
  } catch (err: any) {
    if (err.message === "ACTIVE_MEMBERSHIP_REQUIRED") {
      return apiError(res, 403, "You must have an active membership to borrow books.");
    }
    apiError(res, 500, err.message || "Failed to borrow book", err);
  }
};

const getAllBorrowings = async (req: Request, res: Response) => {
  try {
    const result = await BorrowingService.getAllBorrowings();
    apiResponse(res, 200, "Borrowings fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch borrowings", err);
  }
};

const getSingleBorrowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BorrowingService.getSingleBorrowing(id as string);
    if (!result) {
      return apiError(res, 404, "Borrowing record not found");
    }
    apiResponse(res, 200, "Borrowing fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch borrowing", err);
  }
};

const returnBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BorrowingService.returnBook(id as string);
    if (!result) {
      return apiError(res, 404, "Borrowing record not found");
    }
    apiResponse(res, 200, "Book returned successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to return book", err);
  }
};

const updateBorrowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BorrowingService.updateBorrowing(id as string, req.body);
    apiResponse(res, 200, "Borrowing updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update borrowing", err);
  }
};

const deleteBorrowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await BorrowingService.deleteBorrowing(id as string);
    apiResponse(res, 200, "Borrowing deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete borrowing", err);
  }
};

const getMyBorrowings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return apiError(res, 401, "Unauthorized");
    }
    const result = await BorrowingService.getMyBorrowings(userId);
    apiResponse(res, 200, "My borrowings fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch my borrowings", err);
  }
};

export const BorrowingController = {
  createBorrowing,
  getAllBorrowings,
  getSingleBorrowing,
  returnBook,
  updateBorrowing,
  deleteBorrowing,
  getMyBorrowings,
};
