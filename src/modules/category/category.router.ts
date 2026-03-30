import { Router } from "express";
import { CategoryController } from "./category.controller";
import { upload } from "../../config/multer.config";
// import { authMiddleware, authorizeRoles } from "../../app/middlewares/authMiddleware";

const router = Router();

// Public routes
router.post("/", upload.single("image"), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getSingleCategory);
router.patch("/:id", upload.single("image"), CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

// Management routes (protected)
// router.post("/", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), upload.single("image"), CategoryController.createCategory);
// router.patch("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), upload.single("image"), CategoryController.updateCategory);
// router.delete("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), CategoryController.deleteCategory);

export const categoryRouter = router;
