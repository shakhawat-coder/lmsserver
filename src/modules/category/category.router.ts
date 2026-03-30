import { Router } from "express";
import { CategoryController } from "./category.controller";
import { upload } from "../../config/multer.config";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getSingleCategory);

// Management routes (protected)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  CategoryController.createCategory,
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  CategoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  CategoryController.deleteCategory,
);

export const categoryRouter = router;
