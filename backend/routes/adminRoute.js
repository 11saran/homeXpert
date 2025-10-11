import express from "express";
import {
  addServicer,
  adminDashboard,
  allServicers,
  allUsers,
  appointmentCancel,
  appointmentsAdmin,
  deleteAppointmentAdmin,
  deleteUser,
  loginAdmin,
  getPendingServicers,
  approveServicer,
  rejectServicer,
  updateServicer,
  deleteServicer,
  toggleServicerBlock,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/servicerController.js";

const adminRouter = express.Router();

adminRouter.post(
  "/add-servicer",
  authAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "nicFront", maxCount: 1 },
    { name: "nicBack", maxCount: 1 },
  ]),
  addServicer
);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-servicers", authAdmin, allServicers);
adminRouter.get("/pending-servicers", authAdmin, getPendingServicers);
adminRouter.post("/approve-servicer", authAdmin, approveServicer);
adminRouter.post("/reject-servicer", authAdmin, rejectServicer);
adminRouter.post("/update-servicer", authAdmin, updateServicer);
adminRouter.post("/delete-servicer", authAdmin, deleteServicer);
adminRouter.post("/toggle-servicer-block", authAdmin, toggleServicerBlock);
adminRouter.post("/all-users", authAdmin, allUsers);
adminRouter.post("/delete-user", authAdmin, deleteUser);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.post("/delete-appointment", authAdmin, deleteAppointmentAdmin);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
export default adminRouter;
