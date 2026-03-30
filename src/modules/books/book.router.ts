import { Router } from "express";
import { BookController } from "./book.controller";
import { upload } from "../../app/config/multer.config";
import { authMiddleware, authorizeRoles } from "../../app/middlewares/authMiddleware";

const router = Router();

// Publicly available routes
router.get("/", BookController.getAllBooks);
router.get("/:id", BookController.getSingleBook);

// Management routes requiring Admin/SuperAdmin privileges
router.post("/", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), upload.single("coverImage"), BookController.createBook);
router.patch("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), upload.single("coverImage"), BookController.updateBook);
router.delete("/:id", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), BookController.deleteBook);

export const bookRouter = router;
