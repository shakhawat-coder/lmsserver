import { Request, Response } from "express";
import { MembershipPlanService } from "./membership-plan.service";
import { apiError, apiResponse } from "../../utils/apiResponse";

const createMembershipPlan = async (req: Request, res: Response) => {
  try {
    const result = await MembershipPlanService.createMembershipPlan(req.body);
    apiResponse(res, 201, "Membership plan created successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to create membership plan", err);
  }
};

const getAllMembershipPlans = async (req: Request, res: Response) => {
  try {
    const result = await MembershipPlanService.getAllMembershipPlans();
    apiResponse(res, 200, "Membership plans fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch membership plans", err);
  }
};

const getSingleMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MembershipPlanService.getSingleMembershipPlan(
      id as string,
    );
    if (!result) {
      return apiError(res, 404, "Membership plan not found");
    }
    apiResponse(res, 200, "Membership plan fetched successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to fetch membership plan", err);
  }
};

const updateMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MembershipPlanService.updateMembershipPlan(
      id as string,
      req.body,
    );
    apiResponse(res, 200, "Membership plan updated successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to update membership plan", err);
  }
};

const deleteMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MembershipPlanService.deleteMembershipPlan(
      id as string,
    );
    apiResponse(res, 200, "Membership plan deleted successfully", result);
  } catch (err: any) {
    apiError(res, 500, err.message || "Failed to delete membership plan", err);
  }
};

export const MembershipPlanController = {
  createMembershipPlan,
  getAllMembershipPlans,
  getSingleMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
};
