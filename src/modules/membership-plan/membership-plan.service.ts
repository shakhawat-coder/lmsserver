import { prisma } from "../../lib/prisma";

export type IMembershipPlan = {
  name: "BASIC" | "SILVER" | "GOLD";
  description: string;
  price: number;
  interval?: string;
  features: string[];
  borrowLimit: number;
  durationDays: number;
};

const createMembershipPlan = async (data: IMembershipPlan) => {
  const result = await prisma.membershipPlan.create({
    data,
  });
  return result;
};

const getAllMembershipPlans = async () => {
  const result = await prisma.membershipPlan.findMany({
    orderBy: {
      price: "asc",
    },
  });
  return result;
};

const getSingleMembershipPlan = async (id: string) => {
  const result = await prisma.membershipPlan.findUnique({
    where: { id },
  });
  return result;
};

const updateMembershipPlan = async (
  id: string,
  data: Partial<IMembershipPlan>,
) => {
  const result = await prisma.membershipPlan.update({
    where: { id },
    data,
  });
  return result;
};

const deleteMembershipPlan = async (id: string) => {
  const result = await prisma.membershipPlan.delete({
    where: { id },
  });
  return result;
};

export const MembershipPlanService = {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};
