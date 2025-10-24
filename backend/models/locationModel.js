import mongoose from "mongoose";

const locationSchema = mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
      unique: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({ "currentLocation": "2dsphere" });

const Location = mongoose.model("Location", locationSchema);

export default Location;
