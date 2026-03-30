import { prisma } from "../../app/lib/prisma";

export type IBook = {
  title: string;
  author: string;
  coverImage?: string;
  availability?: boolean;
  isbn?: string;
  language?: string;
  year?: string;
  pages?: number;
  description?: string;
  categoryId: string;
};

const createBook = async (data: IBook) => {
  const result = await prisma.book.create({
    data,
    include: {
      category: true,
    },
  });
  return result;
};

const getAllBooks = async () => {
  const result = await prisma.book.findMany({
    include: {
      category: true,
    },
  });
  return result;
};

const getSingleBook = async (id: string) => {
  const result = await prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateBook = async (id: string, data: Partial<IBook>) => {
  const result = await prisma.book.update({
    where: {
      id,
    },
    data,
    include: {
      category: true,
    },
  });
  return result;
};

const deleteBook = async (id: string) => {
  const result = await prisma.book.delete({
    where: {
      id,
    },
  });
  return result;
};

export const BookService = {
  createBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  deleteBook,
};
