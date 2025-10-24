import express from "express";
const router = express.Router();
import {
  createRide,
  getMyRides,
  getRideById,
  updateRideStatus,
  acceptRide,
} from "../controllers/rideController.js";
import { protect, driver, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, createRide);
router.route("/myrides").get(protect, getMyRides);
router.route("/:id").get(protect, getRideById);
router.route("/:id/status").put(protect, updateRideStatus);
router.route("/:id/accept").put(protect, driver, acceptRide);

export default router;
