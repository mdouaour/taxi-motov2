import asyncHandler from "express-async-handler";
import Fare from "../models/fareModel.js";

// @desc    Get current fare rules
// @route   GET /api/fares
// @access  Public
const getFareRules = asyncHandler(async (req, res) => {
  const fare = await Fare.findOne({ isActive: true });

  if (fare) {
    res.json(fare);
  } else {
    res.status(404);
    throw new Error("Fare rules not found");
  }
});

// @desc    Update fare rules
// @route   PUT /api/fares/:id
// @access  Private/Admin
const updateFareRules = asyncHandler(async (req, res) => {
  const { baseFare, minFareDistance, minFareAmount, perKmRate, isActive } = req.body;

  const fare = await Fare.findById(req.params.id);

  if (fare) {
    fare.baseFare = baseFare || fare.baseFare;
    fare.minFareDistance = minFareDistance || fare.minFareDistance;
    fare.minFareAmount = minFareAmount || fare.minFareAmount;
    fare.perKmRate = perKmRate || fare.perKmRate;
    fare.isActive = isActive !== undefined ? isActive : fare.isActive;

    const updatedFare = await fare.save();
    res.json(updatedFare);
  } else {
    res.status(404);
    throw new Error("Fare rules not found");
  }
});

// @desc    Calculate ride fare
// @route   POST /api/fares/calculate
// @access  Private
const calculateFare = asyncHandler(async (req, res) => {
  const { distance } = req.body; // distance in km

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

  res.json({ fare: calculatedFare });
});

export { getFareRules, updateFareRules, calculateFare };
