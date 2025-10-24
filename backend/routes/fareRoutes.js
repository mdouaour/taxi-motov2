import express from "express";
const router = express.Router();
import {
  createFareRule,
  getAllFareRules,
  getFareRules,
  getFareRuleById,
  updateFareRules,
  deleteFareRule,
  activateFareRule,
  calculateFare,
} from "../controllers/fareController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, admin, createFareRule).get(getFareRules);
router.route("/all").get(protect, admin, getAllFareRules);
router.route("/calculate").post(protect, calculateFare);
router
  .route("/:id")
  .get(protect, admin, getFareRuleById)
  .put(protect, admin, updateFareRules)
  .delete(protect, admin, deleteFareRule);
router.route("/:id/activate").put(protect, admin, activateFareRule);

export default router;
