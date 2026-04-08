import { Router } from "express";
import { ChatController } from "./chat.controller";

const router = Router();

router.post("/message", ChatController.sendMessage);

export const ChatRouter: Router = router;
