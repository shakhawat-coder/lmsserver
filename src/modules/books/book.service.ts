import { prisma } from "../../lib/prisma";

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

const getAllBooks = async (query: Record<string, any>) => {
  const { searchTerm, categoryId, author, availability, sortBy, sortOrder, page = 1, limit = 10 } = query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const filter: any = {
    AND: [],
  };

  if (searchTerm) {
    filter.AND.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { author: { contains: searchTerm, mode: "insensitive" } },
        { isbn: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (categoryId) {
    // categoryId can be a string or an array of strings
    if (Array.isArray(categoryId)) {
      filter.AND.push({ categoryId: { in: categoryId } });
    } else {
      filter.AND.push({ categoryId: categoryId });
    }
  }

  if (author) {
    if (Array.isArray(author)) {
      filter.AND.push({ author: { in: author } });
    } else {
      filter.AND.push({ author: author });
    }
  }

  if (availability !== undefined) {
    filter.AND.push({ availability: availability === "true" || availability === true });
  }

  const result = await prisma.book.findMany({
    where: filter,
    include: {
      category: true,
    },
    orderBy: sortBy ? { [sortBy]: sortOrder || "asc" } : { createdAt: "desc" },
    skip,
    take,
  });

  const total = await prisma.book.count({ where: filter });
  const available = await prisma.book.count({ where: { ...filter, availability: true } });
  const borrowed = total - available;

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      available,
      borrowed
    },
    data: result,
  };
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
