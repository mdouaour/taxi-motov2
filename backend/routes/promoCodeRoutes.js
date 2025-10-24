import express from "express";
const router = express.Router();
import {
  createPromoCode,
  getPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
} from "../controllers/promoCodeController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, admin, createPromoCode).get(protect, admin, getPromoCodes);
router
  .route("/:id")
  .get(protect, admin, getPromoCodeById)
  .put(protect, admin, updatePromoCode)
  .delete(protect, admin, deletePromoCode);

export default router;
