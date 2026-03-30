import { Router } from "express";
import { MembershipPlanController } from "./membership-plan.controller";

import { authMiddleware, authorizeRoles } from "../../app/middlewares/authMiddleware";
const router = Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  MembershipPlanController.createMembershipPlan
);
router.get("/", MembershipPlanController.getAllMembershipPlans);
router.get("/:id", MembershipPlanController.getSingleMembershipPlan);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  MembershipPlanController.updateMembershipPlan
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  MembershipPlanController.deleteMembershipPlan
);

export const membershipPlanRouter = router;
