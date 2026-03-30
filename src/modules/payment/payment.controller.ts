import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { membershipPlanId, amount, currency } = req.body;
    const result = await PaymentService.initiatePayment({
      userId: req.user!.id,
      membershipPlanId,
      amount,
      currency,
    });
    apiResponse(res, 200, "Payment initiated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to initiate payment", err);
  }
};

const paymentSuccess = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const tranIdString = Array.isArray(transactionId)
      ? transactionId[0]
      : transactionId;
    const membershipPlanId = req.query.planId as string | undefined;

    const result = await PaymentService.handleSuccess(
      tranIdString as string,
      membershipPlanId,
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(
      `${frontendUrl}/payment/success?transactionId=${tranIdString}`,
    );
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to handle payment success", err);
  }
};

const paymentFail = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const tranIdString = Array.isArray(transactionId)
      ? transactionId[0]
      : transactionId;

    await PaymentService.handleFail(tranIdString as string);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(
      `${frontendUrl}/payment/fail?transactionId=${tranIdString}`,
    );
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to handle payment failure", err);
  }
};

const paymentCancel = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const tranIdString = Array.isArray(transactionId)
      ? transactionId[0]
      : transactionId;

    await PaymentService.handleCancel(tranIdString as string);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    return res.redirect(
      `${frontendUrl}/payment/cancel?transactionId=${tranIdString}`,
    );
  } catch (err: any) {
    apiError(
      res,
      500,
      err.message || "Failed to handle payment cancellation",
      err,
    );
  }
};

const getAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await PaymentService.getAllPayments();
    apiResponse(res, 200, "Payments fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch payments", err);
  }
};

const getPaymentByTransactionId = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const result = await PaymentService.getPaymentByTransactionId(
      transactionId as string,
    );
    apiResponse(res, 200, "Payment fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch payment", err);
  }
};

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getAllPayments,
  getPaymentByTransactionId,
};
