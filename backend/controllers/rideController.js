import asyncHandler from "express-async-handler";
import Ride from "../models/rideModel.js";
import User from "../models/userModel.js";
import Driver from "../models/driverModel.js";
import Fare from "../models/fareModel.js";

// @desc    Create a new ride request
// @route   POST /api/rides
// @access  Private/Rider
const createRide = asyncHandler(async (req, res) => {
  const { pickupLocation, dropoffLocation, distance } = req.body;

  if (!pickupLocation || !dropoffLocation || !distance) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const fareRules = await Fare.findOne({ isActive: true });

  if (!fareRules) {
    res.status(404);
    throw new Error("Fare rules not found");
  }

  let calculatedFare = 0;

  if (distance < fareRules.minFareDistance) {
    calculatedFare = fareRules.minFareAmount;
  } else {
    calculatedFare = fareRules.baseFare + (distance - fareRules.minFareDistance) * fareRules.perKmRate;
  }

  const ride = await Ride.create({
    rider: req.user._id,
    pickupLocation,
    dropoffLocation,
    distance,
    fare: calculatedFare,
    status: "pending",
  });

  if (ride) {
    res.status(201).json(ride);
  } else {
    res.status(400);
    throw new Error("Invalid ride data");
  }
});

// @desc    Get all rides for a user (rider or driver)
// @route   GET /api/rides/myrides
// @access  Private
const getMyRides = asyncHandler(async (req, res) => {
  let rides;
  if (req.user.role === "Rider") {
    rides = await Ride.find({ rider: req.user._id }).populate("driver", "user vehicleModel");
  } else if (req.user.role === "Driver") {
    const driver = await Driver.findOne({ user: req.user._id });
    if (!driver) {
      res.status(404);
      throw new Error("Driver not found");
    }
    rides = await Ride.find({ driver: driver._id }).populate("rider", "name email");
  } else if (req.user.role === "Admin") {
    rides = await Ride.find({}).populate("rider", "name email").populate("driver", "user vehicleModel");
  }

  res.json(rides);
});

// @desc    Get ride by ID
// @route   GET /api/rides/:id
// @access  Private
const getRideById = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id)
    .populate("rider", "name email")
    .populate("driver", "user vehicleModel");

  if (ride) {
    if (ride.rider.toString() === req.user._id.toString() || req.user.role === "Admin") {
      res.json(ride);
    } else {
      res.status(401);
      throw new Error("Not authorized to view this ride");
    }
  } else {
    res.status(404);
    throw new Error("Ride not found");
  }
});

// @desc    Update ride status (for driver or admin)
// @route   PUT /api/rides/:id/status
// @access  Private/Driver or Admin
const updateRideStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const ride = await Ride.findById(req.params.id);

  if (ride) {
    if (req.user.role === "Driver") {
      const driver = await Driver.findOne({ user: req.user._id });
      if (!driver || ride.driver.toString() !== driver._id.toString()) {
        res.status(401);
        throw new Error("Not authorized to update this ride");
      }
    } else if (req.user.role !== "Admin") {
      res.status(401);
      throw new Error("Not authorized to update ride status");
    }

    ride.status = status || ride.status;

    const updatedRide = await ride.save();
    res.json(updatedRide);
  } else {
    res.status(404);
    throw new Error("Ride not found");
  }
});

// @desc    Accept a ride (for driver)
// @route   PUT /api/rides/:id/accept
// @access  Private/Driver
const acceptRide = asyncHandler(async (req, res) => {
  const ride = await Ride.findById(req.params.id);
  const driver = await Driver.findOne({ user: req.user._id });

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  if (ride) {
    if (ride.status === "pending") {
      ride.driver = driver._id;
      ride.status = "accepted";
      const updatedRide = await ride.save();
      res.json(updatedRide);
    } else {
      res.status(400);
      throw new Error("Ride is not pending");
    }
  } else {
    res.status(404);
    throw new Error("Ride not found");
  }
});

export {
  createRide,
  getMyRides,
  getRideById,
  updateRideStatus,
  acceptRide,
};
