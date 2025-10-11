import mongoose from "mongoose";

const servicerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAABCcAAAQnAEmzTo0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA5uSURBVHgB7d0JchvHFcbxN+C+iaQolmzFsaWqHMA5QXID+wZJTmDnBLZu4BvER4hvYJ/AvoHlimPZRUngvoAg4PkwGJOiuGCd6df9/1UhoJZYJIBvXndPL5ndofljd8NW7bP8y79bZk+tmz8ATFdmu3nWfuiYfdNo2383389e3P5Xb9B82X1qs/YfU3AB1Cuzr+3cnt8U5Mb132i+7n5mc/a9EV4gDF37Z15Qv3/9a/fz63/0VgXOw/uFdexLAxCqLze3s+flL/4IcK/yduwrAxC0zoX9e+u9rJfVXoB7fV41m7u2YQBCt2tt+6v6xEUfeM6+ILyAGxv9QWbL+iPOPxoAX2Zts9GZtU8NgDudln3eyNvQnxgAd/Lw/k194I8NgD+ZPc2aO92uAXCpYQDcIsCAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMAAOOEWDAMQIMOEaAAccIMOAYAQYcI8CAYwQYcIwAA44RYMAxAgw4RoABxwgw4BgBBhwjwIBjBBhwjAADjhFgwDECDDhGgAHHCDDgGAEGHCPAgGMEGHCMQKPAjwBnxkEfvKcVAAAAAElFTkSuQmCC",
    },
    speciality: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    phone: { type: String, required: true },
    fees: { type: Number, default: 0 },
    address: { type: Object, required: true },
    district: { type: String, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    working_hours: {
      type: {
        monday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        tuesday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        wednesday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        thursday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        friday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        saturday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: true },
        },
        sunday: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "18:00" },
          available: { type: Boolean, default: false },
        },
      },
      default: {},
    },
    nicFront: { type: String, default: "" },
    nicBack: { type: String, default: "" },
    blocked: { type: Boolean, default: false },
    gender: { type: String, required: false, default: "" },
    dob: { type: String, required: false, default: "" },
  },
  { minimize: false }
);

const servicerModel =
  mongoose.models.servicer || mongoose.model("servicer", servicerSchema);
export default servicerModel;
