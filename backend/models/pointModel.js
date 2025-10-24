import mongoose from "mongoose";

const pointSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    history: [
      {
        amount: {
          type: Number,
          required: true,
        },
        type: {
          type: String,
          enum: ["earned", "redeemed"],
          required: true,
        },
        ride: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ride",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Point = mongoose.model("Point", pointSchema);

export default Point;
