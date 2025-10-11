import express from "express";
import {
  servicerList,
  registerServicer,
  loginServicer,
  getServicerProfile,
  updateServicerProfile,
  updateWorkingHours,
  toggleDayAvailability,
  getAppointments,
  updateAppointmentStatus,
  updateAppointmentAddress,
  deleteAppointment,
} from "../controllers/servicerController.js";
import authServicer from "../middlewares/authServicer.js";
import upload from "../middlewares/multer.js";

const servicerRouter = express.Router();

// Public routes
servicerRouter.get("/list", servicerList);
servicerRouter.post(
  "/register",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
  ]),
  registerServicer
);
servicerRouter.post("/login", loginServicer);

// Protected routes (require servicer authentication)
servicerRouter.post("/profile", authServicer, getServicerProfile);
servicerRouter.post(
  "/update-profile",
  authServicer,
  upload.single("image"),
  updateServicerProfile
);
servicerRouter.post("/update-working-hours", authServicer, updateWorkingHours);
servicerRouter.post(
  "/toggle-day-availability",
  authServicer,
  toggleDayAvailability
);
servicerRouter.post("/get-appointments", authServicer, getAppointments);
servicerRouter.post(
  "/update-appointment",
  authServicer,
  updateAppointmentStatus
);
servicerRouter.post(
  "/update-appointment-address",
  authServicer,
  updateAppointmentAddress
);
servicerRouter.post("/delete-appointment", authServicer, deleteAppointment);

export default servicerRouter;
