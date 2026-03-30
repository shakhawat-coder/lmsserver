import { Router } from "express";
import { BorrowingController } from "./borrowing.controller";

import { authMiddleware, authorizeRoles } from "../../app/middlewares/authMiddleware";
const router = Router();

router.post("/", authMiddleware, BorrowingController.createBorrowing);
router.get("/", authMiddleware, authorizeRoles("ADMIN", "SUPERADMIN"), BorrowingController.getAllBorrowings);
router.get("/my-borrowings", authMiddleware, BorrowingController.getMyBorrowings);
router.get("/:id", authMiddleware, BorrowingController.getSingleBorrowing);
router.patch("/:id/return", authMiddleware, BorrowingController.returnBook);
router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  BorrowingController.updateBorrowing
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  BorrowingController.deleteBorrowing
);

export const borrowingRouter: Router = router;
