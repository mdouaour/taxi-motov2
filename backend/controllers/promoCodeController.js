import asyncHandler from "express-async-handler";
import PromoCode from "../models/promoCodeModel.js";

// @desc    Create a new promo code
// @route   POST /api/promocodes
// @access  Private/Admin
const createPromoCode = asyncHandler(async (req, res) => {
  const { code, discount, expirationDate } = req.body;

  const promoCodeExists = await PromoCode.findOne({ code });

  if (promoCodeExists) {
    res.status(400);
    throw new Error("Promo code already exists");
  }

  const promoCode = await PromoCode.create({
    code,
    discount,
    expirationDate,
  });

  if (promoCode) {
    res.status(201).json(promoCode);
  } else {
    res.status(400);
    throw new Error("Invalid promo code data");
  }
});

// @desc    Get all promo codes
// @route   GET /api/promocodes
// @access  Private/Admin
const getPromoCodes = asyncHandler(async (req, res) => {
  const promoCodes = await PromoCode.find({});
  res.json(promoCodes);
});

// @desc    Get promo code by ID
// @route   GET /api/promocodes/:id
// @access  Private/Admin
const getPromoCodeById = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);

  if (promoCode) {
    res.json(promoCode);
  } else {
    res.status(404);
    throw new Error("Promo code not found");
  }
});

// @desc    Update promo code
// @route   PUT /api/promocodes/:id
// @access  Private/Admin
const updatePromoCode = asyncHandler(async (req, res) => {
  const { code, discount, expirationDate, isActive } = req.body;

  const promoCode = await PromoCode.findById(req.params.id);

  if (promoCode) {
    promoCode.code = code || promoCode.code;
    promoCode.discount = discount || promoCode.discount;
    promoCode.expirationDate = expirationDate || promoCode.expirationDate;
    promoCode.isActive = isActive !== undefined ? isActive : promoCode.isActive;

    const updatedPromoCode = await promoCode.save();
    res.json(updatedPromoCode);
  } else {
    res.status(404);
    throw new Error("Promo code not found");
  }
});

// @desc    Delete promo code
// @route   DELETE /api/promocodes/:id
// @access  Private/Admin
const deletePromoCode = asyncHandler(async (req, res) => {
  const promoCode = await PromoCode.findById(req.params.id);

  if (promoCode) {
    await promoCode.deleteOne();
    res.json({ message: "Promo code removed" });
  } else {
    res.status(404);
    throw new Error("Promo code not found");
  }
});

export {
  createPromoCode,
  getPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
