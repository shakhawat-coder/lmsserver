import { prisma } from "../../lib/prisma";

export type IBlog = {
  title: string;
  content: string;
  image?: string;
  author?: string;
  category?: string;
  published?: boolean;
};

const createBlog = async (data: IBlog) => {
  const result = await prisma.blog.create({
    data,
  });
  return result;
};

const getAllBlogs = async () => {
  const result = await prisma.blog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getPublishedBlogs = async () => {
  const result = await prisma.blog.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleBlog = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateBlog = async (id: string, data: Partial<IBlog>) => {
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data,
  });
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
