import { Response } from "express";

export const apiResponse = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success: true,
    message: message,
    data: data,
  });
};

export const apiError = (
  res: Response,
  status: number,
  message: string,
  data?: any
) => {
  return res.status(status).json({
    success: false,
    message: message,
    data: data,
  });
};
