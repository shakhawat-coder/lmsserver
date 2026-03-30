import { prisma } from "../../app/lib/prisma";
import { initiateSSLCommerzPayment } from "./payment.utils";
import crypto from "crypto";

interface InitiatePaymentData {
  userId: string;
  membershipPlanId?: string;
  amount: number;
  currency?: string;
}

const initiatePayment = async (data: InitiatePaymentData) => {
  console.log("Initiating payment for user:", data.userId);
  
  const tran_id = `TXN_${crypto.randomBytes(8).toString("hex")}`;

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let membershipPlanName = "General Payment";
  if (data.membershipPlanId) {
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: data.membershipPlanId },
    });
    if (plan) {
      membershipPlanName = `${plan.name} Membership - ${plan.durationDays} Days`;
    }
  }

  const payment = await prisma.payment.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      currency: data.currency || "BDT",
      transactionId: tran_id,
      status: "UNPAID",
    },
  });

  const backendUrl = process.env.BETTER_AUTH_URL || "http://localhost:5000";

  const sslData = {
    total_amount: payment.amount,
    currency: payment.currency,
    tran_id: payment.transactionId as string,
    success_url: `${backendUrl}/api/v1/payments/success/${payment.transactionId}?planId=${data.membershipPlanId || ""}`,
    fail_url: `${backendUrl}/api/v1/payments/fail/${payment.transactionId}`,
    cancel_url: `${backendUrl}/api/v1/payments/cancel/${payment.transactionId}`,
    ipn_url: `${backendUrl}/api/v1/payments/ipn`,
    cus_name: user.name || "Customer Name",
    cus_email: user.email || "customer@example.com",
    cus_add1: user.address || "Dhaka",
    cus_city: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: user.phoneNumber || "01700000000",
    product_name: membershipPlanName,
    product_category: "Membership Subscription",
    product_profile: "general",
  };

  const response = await initiateSSLCommerzPayment(sslData);

  if (response?.status === "SUCCESS") {
    return { paymentUrl: response.GatewayPageURL };
  } else {
    console.log("SSLCommerz error response:", response);
    throw new Error(response?.failedreason || "Failed to generate payment url");
  }
};

const handleSuccess = async (transactionId: string, membershipPlanId?: string) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "PAID") {
    return { status: "ALREADY_PAID", payment };
  }

  const result = await prisma.payment.update({
    where: { transactionId },
    data: {
      status: "PAID",
    },
  });

  if (membershipPlanId) {
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: membershipPlanId },
    });

    if (plan && payment.userId) {
      await prisma.membership.create({
        data: {
          userId: payment.userId,
          membershipPlanId: membershipPlanId,
          status: "ACTIVE",
          startDate: new Date(),
          endDate: new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000),
          price: payment.amount,
        },
      });
    }
  }

  return result;
};

const handleFail = async (transactionId: string) => {
  // Can either delete or just leave it UNPAID and mark failed
  return { transactionId, status: "FAILED" };
};

const handleCancel = async (transactionId: string) => {
  return { transactionId, status: "CANCELLED" };
};

const getAllPayments = async () => {
  return await prisma.payment.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      membership: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getPaymentByTransactionId = async (transactionId: string) => {
  return await prisma.payment.findUnique({
    where: { transactionId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const PaymentService = {
  initiatePayment,
  handleSuccess,
  handleFail,
  handleCancel,
  getAllPayments,
  getPaymentByTransactionId,
};
