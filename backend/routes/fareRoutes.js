import express from "express";
const router = express.Router();
import {
  getFareRules,
  updateFareRules,
  calculateFare,
} from "../controllers/fareController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").get(getFareRules);
router.route("/:id").put(protect, admin, updateFareRules);
router.route("/calculate").post(protect, calculateFare);

export default router;
