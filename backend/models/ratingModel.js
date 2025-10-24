import mongoose from "mongoose";

const ratingSchema = mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Ride",
    },
    rater: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ratee: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      required: true,
      enum: ["User", "Driver"], // Rater can be User (rider) or Driver, Ratee can be User (driver) or Driver (rider)
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
