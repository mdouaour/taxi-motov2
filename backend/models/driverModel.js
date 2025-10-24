import mongoose from "mongoose";

const driverSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleColor: {
      type: String,
      required: true,
    },
    vehicleRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    totalRatings: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
