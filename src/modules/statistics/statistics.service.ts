import { prisma } from "../../lib/prisma";

const getStatistics = async () => {
    const totalBooks = await prisma.book.count();

    const activeMembers = await prisma.user.count({
        where: { 
            isDeleted: false,
            status: "ACTIVE",
            role: "USER" // only count normal users
        }
    });

    const premiumMembers = await prisma.membership.count({
        where: { status: "ACTIVE" }
    });

    return {
        totalBooks,
        activeMembers,
        premiumMembers
    };
};

export const StatisticsService = {
    getStatistics
};
