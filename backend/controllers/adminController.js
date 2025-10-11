import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import servicerModel from "../models/servicerModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

//API for adding Servicers

const addServicer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      speciality,
      experience,
      about,
      // fees,
      address,
      district,
      gender = "",
      dob = "",
    } = req.body;

    // Handle files: image (profile), nicFront, nicBack
    const imageFile = req.file || req.files?.image?.[0] || null;
    const nicFrontFile = req.files?.nicFront?.[0] || null;
    const nicBackFile = req.files?.nicBack?.[0] || null;

    //Checking for all data to add servicer
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !speciality ||
      !experience ||
      !about ||
      // !fees ||
      !district ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please Enter Valid Email" });
    }

    //Validate strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter Strong Password(Above 8 character)",
      });
    }

    //Validate phone number

    if (!validator.isMobilePhone(phone, "any")) {
      return res.json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Parse address if it was sent as JSON string
    let parsedAddress = address;
    if (typeof address === "string") {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        return res.json({ success: false, message: "Invalid address format" });
      }
    }

    //Hashing servicer password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Upload image in cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // Optional NIC uploads
    let nicFrontUrl = "";
    let nicBackUrl = "";
    if (nicFrontFile) {
      const up = await cloudinary.uploader.upload(nicFrontFile.path, {
        resource_type: "image",
      });
      nicFrontUrl = up.secure_url;
    }
    if (nicBackFile) {
      const up = await cloudinary.uploader.upload(nicBackFile.path, {
        resource_type: "image",
      });
      nicBackUrl = up.secure_url;
    }

    const servicerData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      phone,
      speciality,
      experience,
      about,
      district,
      // fees,
      address: parsedAddress,
      status: "approved", // Admin added servicers are automatically approved
      date: Date.now(),
      gender,
      dob,
      nicFront: nicFrontUrl,
      nicBack: nicBackUrl,
    };

    const newServicer = new servicerModel(servicerData);
    await newServicer.save();
    res.json({ success: true, message: "Servicer Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for admin Login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Api to get all servicers list

const allServicers = async (req, res) => {
  try {
    const servicers = await servicerModel.find({}).select("-password");
    res.json({ success: true, servicers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Api to get all Users List
const allUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find({})
      .sort({ createdAt: -1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Cancel appointment by admin

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //Releasing servicer slot
    const { serId, slotDate, slotTime } = appointmentData;
    const serData = await servicerModel.findById(serId);
    let slots_booked = serData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await servicerModel.findByIdAndUpdate(serId, { slots_booked });
    res.status(200).json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const servicers = await servicerModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      servicers: servicers.length,
      users: users.length,
      appointments: appointments.length,
      pendingServicers: servicers.filter((s) => s.status === "pending").length,
      approvedServicers: servicers.filter((s) => s.status === "approved")
        .length,
      latestAppointments: appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to get pending servicer registrations
const getPendingServicers = async (req, res) => {
  try {
    const pendingServicers = await servicerModel
      .find({ status: "pending" })
      .select("-password");
    res.json({ success: true, pendingServicers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to approve servicer registration
const approveServicer = async (req, res) => {
  try {
    const { servicerId } = req.body;

    if (!servicerId) {
      return res.status(400).json({
        success: false,
        message: "Servicer ID required",
      });
    }

    const servicer = await servicerModel.findById(servicerId);
    if (!servicer) {
      return res.status(404).json({
        success: false,
        message: "Servicer not found",
      });
    }

    await servicerModel.findByIdAndUpdate(servicerId, {
      status: "approved",
    });

    res.json({
      success: true,
      message: "Servicer approved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to reject servicer registration
const rejectServicer = async (req, res) => {
  try {
    const { servicerId } = req.body;

    if (!servicerId) {
      return res.status(400).json({
        success: false,
        message: "Servicer ID required",
      });
    }

    const servicer = await servicerModel.findById(servicerId);
    if (!servicer) {
      return res.status(404).json({
        success: false,
        message: "Servicer not found",
      });
    }

    await servicerModel.findByIdAndUpdate(servicerId, {
      status: "rejected",
    });

    res.json({
      success: true,
      message: "Servicer rejected successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to update servicer
const updateServicer = async (req, res) => {
  try {
    const { servicerId, updateData } = req.body;

    if (!servicerId || !updateData) {
      return res
        .status(400)
        .json({ success: false, message: "Missing servicerId or updateData" });
    }

    const updatedServicer = await servicerModel
      .findByIdAndUpdate(servicerId, { $set: updateData }, { new: true })
      .select("-password");

    if (!updatedServicer) {
      return res
        .status(404)
        .json({ success: false, message: "Servicer not found" });
    }

    res.json({
      success: true,
      message: "Servicer updated successfully",
      servicer: updatedServicer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to delete servicer
const deleteServicer = async (req, res) => {
  try {
    const { servicerId } = req.body;

    if (!servicerId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing servicerId" });
    }

    // Check if servicer has any appointments
    const appointments = await appointmentModel.find({ servicer: servicerId });
    if (appointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete servicer with existing appointments",
      });
    }

    const deletedServicer = await servicerModel.findByIdAndDelete(servicerId);

    if (!deletedServicer) {
      return res
        .status(404)
        .json({ success: false, message: "Servicer not found" });
    }

    res.json({ success: true, message: "Servicer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to block/unblock servicer
const toggleServicerBlock = async (req, res) => {
  try {
    const { servicerId } = req.body;

    if (!servicerId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing servicerId" });
    }

    const servicer = await servicerModel.findById(servicerId);

    if (!servicer) {
      return res
        .status(404)
        .json({ success: false, message: "Servicer not found" });
    }

    servicer.blocked = !servicer.blocked;
    await servicer.save();

    const action = servicer.blocked ? "blocked" : "unblocked";

    res.json({
      success: true,
      message: `Servicer ${action} successfully`,
      blocked: servicer.blocked,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete appointment by admin
const deleteAppointmentAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only allow deletion of cancelled or completed appointments
    if (!appointmentData.cancelled && appointmentData.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled or completed appointments can be deleted",
      });
    }

    await appointmentModel.findByIdAndDelete(appointmentId);
    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user by admin
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if user exists
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete all appointments associated with this user
    await appointmentModel.deleteMany({ userId });

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User and associated appointments deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  addServicer,
  loginAdmin,
  allServicers,
  allUsers,
  appointmentsAdmin,
  appointmentCancel,
  deleteAppointmentAdmin,
  deleteUser,
  adminDashboard,
  getPendingServicers,
  approveServicer,
  rejectServicer,
  updateServicer,
  deleteServicer,
  toggleServicerBlock,
};
