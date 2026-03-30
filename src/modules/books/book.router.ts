import { Router } from "express";
import { BookController } from "./book.controller";
import { upload } from "../../config/multer.config";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getSingleBook);

// Protected routes (ADMIN/SUPERADMIN only)
router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("coverImage"),
  BookController.createBook,
);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  upload.single("coverImage"),
  BookController.updateBook,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  BookController.deleteBook,
);

export const bookRouter = router;
