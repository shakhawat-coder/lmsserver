import { Router } from "express";
import { BlogController } from "./blog.controller";
import { upload } from "../../config/multer.config";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", BlogController.getAllBlogs);
router.get("/published", BlogController.getPublishedBlogs);
router.get("/:id", BlogController.getSingleBlog);

// Protected routes (ADMIN/SUPERADMIN only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  BlogController.createBlog,
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  BlogController.updateBlog,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  BlogController.deleteBlog,
);

export const blogRouter = router;
