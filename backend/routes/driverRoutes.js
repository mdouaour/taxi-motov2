import express from "express";
const router = express.Router();
import {
  applyForDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  verifyDriver,
} from "../controllers/driverController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").get(protect, admin, getDrivers);
router.route("/apply").post(protect, applyForDriver);
router
  .route("/:id")
  .get(protect, admin, getDriverById)
  .put(protect, admin, updateDriver);
router.route("/:id/verify").put(protect, admin, verifyDriver);

export default router;
