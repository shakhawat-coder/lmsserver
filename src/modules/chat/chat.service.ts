import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { prisma } from "../../lib/prisma";

type ChatHistoryItem = {
  role: "user" | "model" | "assistant";
  parts: string;
};

const SYSTEM_PROMPT = `You are BookNest AI, a helpful assistant for a library management platform.
Keep responses concise, practical, and friendly.
If users ask about books, membership, borrowing, profile, dashboard, or contact, provide actionable guidance.
You MUST prioritize the provided DATABASE CONTEXT.
Never invent books, plans, counts, prices, or availability.
If a requested item is not in the DATABASE CONTEXT, clearly say it is not found in the current database data.`;

const getKeywords = (message: string) => {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3)
    .slice(0, 8);
};

const buildDatabaseContext = async (message: string) => {
  const keywords = getKeywords(message);

  const [totalBooks, availableBooks, totalCategories, membershipPlans, recentBlogs] =
    await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { availability: true } }),
      prisma.category.count(),
      prisma.membershipPlan.findMany({
        select: {
          name: true,
          price: true,
          borrowLimit: true,
          durationDays: true,
        },
        orderBy: { price: "asc" },
      }),
      prisma.blog.findMany({
        where: { published: true },
        select: { title: true, category: true },
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const primaryKeyword = keywords[0];
  const secondaryKeyword = keywords[1];

  const matchedBooks =
    primaryKeyword
      ? await prisma.book.findMany({
          where: {
            OR: [
              { title: { contains: primaryKeyword, mode: "insensitive" as const } },
              { author: { contains: primaryKeyword, mode: "insensitive" as const } },
              ...(secondaryKeyword
                ? [{ title: { contains: secondaryKeyword, mode: "insensitive" as const } }]
                : []),
            ],
          },
          select: {
            title: true,
            author: true,
            availability: true,
            category: { select: { name: true } },
          },
          take: 8,
          orderBy: { createdAt: "desc" },
        })
      : await prisma.book.findMany({
          select: {
            title: true,
            author: true,
            availability: true,
            category: { select: { name: true } },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        });

  const categories = await prisma.category.findMany({
    select: { name: true },
    take: 10,
    orderBy: { name: "asc" },
  });

  return {
    summary: {
      totalBooks,
      availableBooks,
      unavailableBooks: totalBooks - availableBooks,
      totalCategories,
      totalMembershipPlans: membershipPlans.length,
    },
    membershipPlans,
    categories,
    matchedBooks,
    recentBlogs,
  };
};

const sendMessage = async (message: string, history: ChatHistoryItem[] = []) => {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error("GROQ_API_KEY is not configured on the server");
  }

  const dbContext = await buildDatabaseContext(message);

  const messages = [
    {
      role: "system" as const,
      content: `${SYSTEM_PROMPT}\n\nDATABASE CONTEXT (LIVE):\n${JSON.stringify(dbContext, null, 2)}`,
    },
    ...history
      .filter((item) => typeof item?.parts === "string" && item.parts.trim().length > 0)
      .slice(-12)
      .map((item) => ({
        role: item.role === "model" ? ("assistant" as const) : ("user" as const),
        content: item.parts.trim(),
      })),
    { role: "user" as const, content: message.trim() },
  ];

  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    messages,
    maxOutputTokens: 500,
    temperature: 0.4,
  });

  return text;
};

export const ChatService = {
  sendMessage,
};
