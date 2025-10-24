import mongoose from "mongoose";

const fareSchema = mongoose.Schema(
  {
    baseFare: {
      type: Number,
      required: true,
      default: 150,
    },
    minFareDistance: {
      type: Number,
      required: true,
      default: 2,
    },
    minFareAmount: {
      type: Number,
      required: true,
      default: 200,
    },
    perKmRate: {
      type: Number,
      required: true,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Fare = mongoose.model("Fare", fareSchema);

export default Fare;
