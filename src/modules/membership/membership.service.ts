import { prisma } from "../../lib/prisma";

export type IMembership = {
  userId: string;
  membershipPlanId: string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  startDate?: Date | string;
  endDate?: Date | string | null;
  price?: number;
};

const createMembership = async (data: IMembership) => {
  const result = await prisma.membership.create({
    data: {
      userId: data.userId,
      membershipPlanId: data.membershipPlanId,
      status: data.status || "ACTIVE",
      price: data.price ?? 0,
      ...(data.startDate && { startDate: new Date(data.startDate) }),
      ...(data.endDate && { endDate: new Date(data.endDate) }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
  });
  return result;
};

const getAllMemberships = async () => {
  const result = await prisma.membership.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleMembership = async (id: string) => {
  const result = await prisma.membership.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
  });
  return result;
};

const getMembershipByUser = async (userId: string) => {
  const result = await prisma.membership.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const updateMembership = async (id: string, data: Partial<IMembership>) => {
  const { startDate, endDate, ...updateData } = data as any;
  if (startDate) updateData.startDate = new Date(startDate);
  if (endDate) updateData.endDate = new Date(endDate);

  // Remove undefined properties to satisfy exactOptionalPropertyTypes
  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key],
  );

  const result = await prisma.membership.update({
    where: { id },
    data: updateData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
  });
  return result;
};

const deleteMembership = async (id: string) => {
  const result = await prisma.membership.delete({
    where: { id },
  });
  return result;
};

export const MembershipService = {
  createMembership,
  getAllMemberships,
  getSingleMembership,
  getMembershipByUser,
  updateMembership,
  deleteMembership,
};
