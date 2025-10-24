import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";
import User from "../models/userModel.js";
import { driverApplicationSchema } from "../utils/validationSchemas.js";

// @desc    Apply to become a driver
// @route   POST /api/drivers/apply
// @access  Private (Rider)
const applyForDriver = asyncHandler(async (req, res) => {
  try {
    const { licenseNumber, vehicleModel, vehicleColor, vehicleRegistrationNumber } = driverApplicationSchema.parse(req.body);

    const driverExists = await Driver.findOne({ user: req.user._id });

    if (driverExists) {
      res.status(400);
      throw new Error("You have already applied to be a driver.");
    }

    const driver = await Driver.create({
      user: req.user._id,
      licenseNumber,
      vehicleModel,
      vehicleColor,
      vehicleRegistrationNumber,
      isVerified: false, // Initially not verified
    });

    if (driver) {
      res.status(201).json({
        message: "Driver application submitted successfully. Awaiting admin approval.",
        driver,
      });
    } else {
      res.status(400);
      throw new Error("Invalid driver application data");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.errors ? error.errors[0].message : error.message);
  }
});

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private/Admin
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({}).populate("user", "name email");
  res.json(drivers);
});

// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private/Admin
const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id).populate("user", "name email");

  if (driver) {
    res.json(driver);
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});

// @desc    Update driver information
// @route   PUT /api/drivers/:id
// @access  Private/Admin
const updateDriver = asyncHandler(async (req, res) => {
  const { licenseNumber, vehicleModel, vehicleColor, vehicleRegistrationNumber, isVerified } = req.body;

  const driver = await Driver.findById(req.params.id);

  if (driver) {
    driver.licenseNumber = licenseNumber || driver.licenseNumber;
    driver.vehicleModel = vehicleModel || driver.vehicleModel;
    driver.vehicleColor = vehicleColor || driver.vehicleColor;
    driver.vehicleRegistrationNumber = vehicleRegistrationNumber || driver.vehicleRegistrationNumber;
    driver.isVerified = isVerified !== undefined ? isVerified : driver.isVerified;

    const updatedDriver = await driver.save();
    res.json(updatedDriver);
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});

// @desc    Approve/Reject driver verification
// @route   PUT /api/drivers/:id/verify
// @access  Private/Admin
const verifyDriver = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;

  const driver = await Driver.findById(req.params.id);

  if (driver) {
    driver.isVerified = isVerified;

    const updatedDriver = await driver.save();

    // If driver is verified, update the user's role to 'Driver'
    if (isVerified) {
      const user = await User.findById(updatedDriver.user);
      if (user) {
        user.role = "Driver";
        await user.save();
      }
    }

    res.json(updatedDriver);
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});

export {
  applyForDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  verifyDriver,
};
