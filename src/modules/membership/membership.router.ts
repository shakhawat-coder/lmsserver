import { Router } from "express";
import { MembershipController } from "./membership.controller";

import { authMiddleware, authorizeRoles } from "../../app/middlewares/authMiddleware";
const router = Router();

router.post("/", authMiddleware, MembershipController.createMembership);
router.get("/", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), MembershipController.getAllMemberships);
router.get("/my-membership", authMiddleware, MembershipController.getMyMembership);
router.get("/user/:userId", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), MembershipController.getMembershipByUser);
router.get("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), MembershipController.getSingleMembership);
router.patch("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), MembershipController.updateMembership);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), MembershipController.deleteMembership);

export const membershipRouter: Router = router;
