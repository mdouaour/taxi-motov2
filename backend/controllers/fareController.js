import asyncHandler from "express-async-handler";
import Fare from "../models/fareModel.js";
import { fareRuleSchema } from "../utils/validationSchemas.js";

// @desc    Create new fare rules
// @route   POST /api/fares
// @access  Private/Admin
const createFareRule = asyncHandler(async (req, res) => {
  try {
    const validatedData = fareRuleSchema.parse(req.body);

    if (validatedData.isActive) {
      // Deactivate all other fare rules if this one is set to active
      await Fare.updateMany({ isActive: true }, { $set: { isActive: false } });
    }

    const fare = await Fare.create(validatedData);

    res.status(201).json(fare);
  } catch (error) {
    res.status(400);
    throw new Error(error.errors ? error.errors[0].message : error.message);
  }
});

// @desc    Get all fare rules (for admin)
// @route   GET /api/fares/all
// @access  Private/Admin
const getAllFareRules = asyncHandler(async (req, res) => {
  const fares = await Fare.find({});
  res.json(fares);
});

// @desc    Get current active fare rules (for public/riders)
// @route   GET /api/fares
// @access  Public
const getFareRules = asyncHandler(async (req, res) => {
  const fare = await Fare.findOne({ isActive: true });

  if (fare) {
    res.json(fare);
  } else {
    res.status(404);
    throw new Error("Active fare rules not found");
  }
});

// @desc    Get fare rule by ID (for admin)
// @route   GET /api/fares/:id
// @access  Private/Admin
const getFareRuleById = asyncHandler(async (req, res) => {
  const fare = await Fare.findById(req.params.id);

  if (fare) {
    res.json(fare);
  } else {
    res.status(404);
    throw new Error("Fare rule not found");
  }
});

// @desc    Update fare rules
// @route   PUT /api/fares/:id
// @access  Private/Admin
const updateFareRules = asyncHandler(async (req, res) => {
  try {
    const validatedData = fareRuleSchema.parse(req.body);

    const fare = await Fare.findById(req.params.id);

    if (fare) {
      if (validatedData.isActive) {
        // Deactivate all other fare rules if this one is set to active
        await Fare.updateMany({ isActive: true, _id: { $ne: fare._id } }, { $set: { isActive: false } });
      }

      Object.assign(fare, validatedData);

      const updatedFare = await fare.save();
      res.json(updatedFare);
    } else {
      res.status(404);
      throw new Error("Fare rules not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.errors ? error.errors[0].message : error.message);
  }
});

// @desc    Delete fare rule
// @route   DELETE /api/fares/:id
// @access  Private/Admin
const deleteFareRule = asyncHandler(async (req, res) => {
  const fare = await Fare.findById(req.params.id);

  if (fare) {
    await fare.deleteOne();
    res.json({ message: "Fare rule removed" });
  } else {
    res.status(404);
    throw new Error("Fare rule not found");
  }
});

// @desc    Activate a fare rule
// @route   PUT /api/fares/:id/activate
// @access  Private/Admin
const activateFareRule = asyncHandler(async (req, res) => {
  const fare = await Fare.findById(req.params.id);

  if (fare) {
    // Deactivate all other fare rules
    await Fare.updateMany({ isActive: true }, { $set: { isActive: false } });

    // Activate the selected fare rule
    fare.isActive = true;
    const updatedFare = await fare.save();
    res.json(updatedFare);
  } else {
    res.status(404);
    throw new Error("Fare rule not found");
  }
});

export {
  createFareRule,
  getAllFareRules,
  getFareRules,
  getFareRuleById,
  updateFareRules,
  deleteFareRule,
  activateFareRule,
  calculateFare,
};
