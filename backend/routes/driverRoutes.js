import express from "express";
const router = express.Router();
import {
  registerDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  verifyDriver,
} from "../controllers/driverController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, admin, registerDriver).get(protect, admin, getDrivers);
router
  .route("/:id")
  .get(protect, admin, getDriverById)
  .put(protect, admin, updateDriver);
router.route("/:id/verify").put(protect, admin, verifyDriver);

export default router;
