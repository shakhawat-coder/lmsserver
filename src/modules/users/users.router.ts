import express, { Router } from "express";
import { UserController } from "./users.controller";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";
import { upload } from "../../config/multer.config";

const router = express.Router();

// Public auth routes
router.post("/forgot-password", UserController.forgotPassword);
router.post("/verify-otp", UserController.verifyOTP);
router.post("/reset-password", UserController.resetPassword);

// All routes below require a valid session
router.use(authMiddleware);

// SUPERADMIN only: create a new admin
router.post(
  "/create-admin",
  authorizeRoles("SUPERADMIN"),
  UserController.createAdmin,
);

// ADMIN + SUPERADMIN: manage users
router.get(
  "/",
  authorizeRoles("ADMIN", "SUPERADMIN"),
  UserController.getAllUsers,
);
router.patch(
  "/:id",
  authorizeRoles("ADMIN", "SUPERADMIN", "USER"),
  upload.single("image"),
  UserController.updateUser,
);
router.delete(
  "/:id",
  authorizeRoles("ADMIN", "SUPERADMIN"),
  UserController.softDeleteUser,
);

export const UserRouter: Router = router;
