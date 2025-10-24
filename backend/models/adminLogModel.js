import mongoose from "mongoose";

const adminLogSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export default AdminLog;
