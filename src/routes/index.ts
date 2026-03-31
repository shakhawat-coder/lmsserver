import { Router } from "express";
import { bookRouter } from "../modules/books/book.router";
import { categoryRouter } from "../modules/category/category.router";

import { UserRouter } from "../modules/users/users.router";
import { membershipRouter } from "../modules/membership/membership.router";
import { membershipPlanRouter } from "../modules/membership-plan/membership-plan.router";
import { paymentRouter } from "../modules/payment/payment.router";
import { contactRouter } from "../modules/contact/contact.router";
import { borrowingRouter } from "../modules/borrowing/borrowing.router";

import { bannerRouter } from "../modules/banner/banner.router";

const router = Router();

router.use("/category", categoryRouter);
router.use("/books", bookRouter);
router.use("/users", UserRouter);
router.use("/borrowings", borrowingRouter);
router.use("/memberships", membershipRouter);
router.use("/membership-plans", membershipPlanRouter);
router.use("/payments", paymentRouter);
router.use("/contact", contactRouter);
router.use("/banners", bannerRouter);

export const IndexRoutes = router;
