import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

const sendMessage = async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: "user" | "model" | "assistant"; parts: string }>;
    };

    if (!message || typeof message !== "string" || !message.trim()) {
      return apiError(res, 400, "Message is required");
    }

    const data = await ChatService.sendMessage(
      message,
      Array.isArray(history) ? history : [],
    );

    return apiResponse(res, 200, "Chat response generated successfully", data);
  } catch (err: any) {
    return apiError(res, 500, err.message || "Failed to generate chat response");
  }
};

export const ChatController = {
  sendMessage,
};
