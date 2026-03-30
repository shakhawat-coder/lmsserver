import { prisma } from "../../lib/prisma";

export type IContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const createContactMessage = async (data: IContactMessage) => {
  const result = await prisma.contactMessage.create({
    data,
  });
  return result;
};

const getAllContactMessages = async () => {
  const result = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const getSingleContactMessage = async (id: string) => {
  const result = await prisma.contactMessage.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const deleteContactMessage = async (id: string) => {
  const result = await prisma.contactMessage.delete({
    where: {
      id,
    },
  });
  return result;
};

export const ContactService = {
  createContactMessage,
  getAllContactMessages,
  getSingleContactMessage,
  deleteContactMessage,
};
