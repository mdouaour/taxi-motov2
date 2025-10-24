import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";
import User from "../models/userModel.js";

// @desc    Register a new driver
// @route   POST /api/drivers
// @access  Private/Admin
const registerDriver = asyncHandler(async (req, res) => {
  const { userId, licenseNumber, vehicleModel, vehicleColor, vehicleRegistrationNumber } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role !== "Driver") {
    res.status(400);
    throw new Error("User is not a driver");
  }

  const driverExists = await Driver.findOne({ user: userId });

  if (driverExists) {
    res.status(400);
    throw new Error("Driver already registered");
  }

  const driver = await Driver.create({
    user: userId,
    licenseNumber,
    vehicleModel,
    vehicleColor,
    vehicleRegistrationNumber,
  });

  if (driver) {
    res.status(201).json(driver);
  } else {
    res.status(400);
    throw new Error("Invalid driver data");
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
    res.json(updatedDriver);
  } else {
    res.status(404);
    throw new Error("Driver not found");
  }
});

export {
  registerDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  verifyDriver,
};
