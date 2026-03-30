import { Router } from "express";
import { ContactController } from "./contact.controller";
import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = Router();

// Public route to send a message
router.post("/", ContactController.createContactMessage);

// Admin-only routes to manage messages
router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  ContactController.getAllContactMessages,
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  ContactController.getSingleContactMessage,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN", "SUPERADMIN"),
  ContactController.deleteContactMessage,
);

export const contactRouter: Router = router;
