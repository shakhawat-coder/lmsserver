import { prisma } from "../../lib/prisma";

export type IBanner = {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  isActive?: boolean;
};

const createBanner = async (data: IBanner) => {
  const result = await prisma.banner.create({
    data,
  });
  return result;
};

const getAllBanners = async () => {
  const result = await prisma.banner.findMany();
  return result;
};

const getActiveBanners = async () => {
  const result = await prisma.banner.findMany({
    where: {
      isActive: true,
    },
  });
  return result;
};

const getSingleBanner = async (id: string) => {
  const result = await prisma.banner.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBanner = async (id: string, data: Partial<IBanner>) => {
  const result = await prisma.banner.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteBanner = async (id: string) => {
  const result = await prisma.banner.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BannerService = {
  createBanner,
  getAllBanners,
  getActiveBanners,
  getSingleBanner,
  updateBanner,
  deleteBanner,
};
