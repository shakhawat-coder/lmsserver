import { Router } from "express";
import { BannerController } from "./banner.controller";
import { upload } from "../../config/multer.config";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", BannerController.getAllBanners);
router.get("/:id", BannerController.getSingleBanner);

// Protected routes (ADMIN/SUPERADMIN only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  BannerController.createBanner,
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("image"),
  BannerController.updateBanner,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  BannerController.deleteBanner,
);

export const bannerRouter = router;
