import { Request, Response } from "express";
import { ContactService } from "./contact.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

const createContactMessage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await ContactService.createContactMessage(data);
    apiResponse(res, 201, "Message sent successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to send message", err);
  }
};

const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const result = await ContactService.getAllContactMessages();
    apiResponse(res, 200, "Contact messages fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch contact messages", err);
  }
};

const getSingleContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ContactService.getSingleContactMessage(id as string);
    if (!result) {
      return apiError(res, 404, "Message not found");
    }
    apiResponse(res, 200, "Contact message fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch contact message", err);
  }
};

const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ContactService.deleteContactMessage(id as string);
    apiResponse(res, 200, "Contact message deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete contact message", err);
  }
};

export const ContactController = {
  createContactMessage,
  getAllContactMessages,
  getSingleContactMessage,
  deleteContactMessage,
};
