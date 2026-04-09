import { Request, Response } from "express";
import { apiResponse, apiError } from "../../utils/apiResponse";
import { StatisticsService } from "./statistics.service";

const getStatistics = async (req: Request, res: Response) => {
    try {
        const result = await StatisticsService.getStatistics();
        return apiResponse(res, 200, "Statistics retrieved successfully", result);
    } catch (error: any) {
        return apiError(res, 500, error.message);
    }
};

export const StatisticsController = {
    getStatistics
};
