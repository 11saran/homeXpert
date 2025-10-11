import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  serId: { type: String, required: true },
  servicerId: { type: String, required: true }, // Add servicerId for servicer queries
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  serData: { type: Object, required: true },
  serviceType: { type: String, default: "" },
  description: { type: String, default: "" },
  address: { type: Object, default: {} },
  status: { type: String, default: "pending" }, // pending, confirmed, rejected, completed
  date: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
