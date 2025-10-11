import servicerModel from "../models/servicerModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const changeAvailability = async (req, res) => {
  try {
    const { serId } = req.body;
    const serData = await servicerModel.findById(serId);
    await servicerModel.findByIdAndUpdate(serId, {
      available: !serData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const servicerList = async (req, res) => {
  try {
    const servicers = await servicerModel
      .find({ status: "approved", blocked: { $ne: true } })
      .select(["-password"]);
    res.json({ success: true, servicers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Servicer Registration
const registerServicer = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      about,
      phone,
      fees,
      address,
      district,
      gender,
      dob,
    } = req.body;

    // Handle file uploads
    const profileImagePath = req.files?.profileImage
      ? req.files.profileImage[0]?.filename
      : "";
    const nicFrontPath = req.files?.nicFront
      ? req.files.nicFront[0]?.filename
      : "";
    const nicBackPath = req.files?.nicBack
      ? req.files.nicBack[0]?.filename
      : "";

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !about ||
      !phone ||
      !address ||
      !district ||
      !gender ||
      !dob
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Valid Email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter a strong password with 8 characters or above",
      });
    }

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Validate required images
    if (!profileImagePath) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile image",
      });
    }

    if (!nicFrontPath || !nicBackPath) {
      return res.status(400).json({
        success: false,
        message: "Please upload both NIC front and back images",
      });
    }

    // Check if email already exists
    const existingServicer = await servicerModel.findOne({ email });
    if (existingServicer) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create servicer with pending status
    const servicerData = {
      name,
      email,
      password: hashedPassword,
      image: profileImagePath,
      speciality,
      experience,
      about,
      phone,
      fees: fees ? parseInt(fees) : 0,
      address: typeof address === "string" ? JSON.parse(address) : address,
      district,
      gender,
      dob,
      nicFront: nicFrontPath,
      nicBack: nicBackPath,
      status: "pending",
      date: Date.now(),
    };

    const newServicer = new servicerModel(servicerData);
    await newServicer.save();

    res.status(201).json({
      success: true,
      message:
        "Registration submitted successfully! Your documents are being verified by our admin team. You will receive a response within 24 hours.",
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Servicer Login
const loginServicer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const servicer = await servicerModel.findOne({ email });

    if (!servicer) {
      return res
        .status(400)
        .json({ success: false, message: "Servicer does not exist" });
    }

    if (servicer.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "Your account is pending approval from admin. Please wait.",
      });
    }

    if (servicer.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Your registration has been rejected. Please contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, servicer.password);
    if (isMatch) {
      const token = jwt.sign(
        { id: servicer._id, role: "servicer" },
        process.env.JWT_SECRET
      );
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Servicer Profile
const getServicerProfile = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const servicerData = await servicerModel
      .findById(servicerId)
      .select("-password");
    if (servicerData.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Servicer account not approved",
      });
    }
    res.status(200).json({ success: true, servicerData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Servicer Profile
const updateServicerProfile = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { name, phone, address, fees, about, speciality, experience } =
      req.body;

    // Prepare update data - only include fields that are provided
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address)
      updateData.address =
        typeof address === "string" ? JSON.parse(address) : address;
    if (fees) updateData.fees = parseInt(fees);
    if (about) updateData.about = about;
    if (speciality) updateData.speciality = speciality;
    if (experience) updateData.experience = experience;

    // If no fields provided, return error
    if (Object.keys(updateData).length === 0 && !req.file) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
      });
    }

    // Update servicer data
    const updatedServicer = await servicerModel.findByIdAndUpdate(
      servicerId,
      updateData,
      { new: true }
    );

    // Handle image upload if provided
    if (req.file) {
      // Use local storage instead of Cloudinary for consistency
      await servicerModel.findByIdAndUpdate(servicerId, {
        image: req.file.filename,
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated",
      data: {
        name: req.file ? updatedServicer.name : name || updatedServicer.name,
        image: req.file ? req.file.filename : updatedServicer.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Working Hours
const updateWorkingHours = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { working_hours } = req.body;

    if (!working_hours) {
      return res.status(400).json({
        success: false,
        message: "Working hours data required",
      });
    }

    // Sanitize incoming working hours to allow only known day keys
    const allowedDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    const sanitized = Object.fromEntries(
      Object.entries(working_hours || {})
        .filter(([key]) => allowedDays.includes(key))
        .map(([key, value]) => [
          key,
          {
            start: value?.start || "09:00",
            end: value?.end || "18:00",
            available: Boolean(value?.available),
          },
        ])
    );

    await servicerModel.findByIdAndUpdate(servicerId, {
      working_hours: sanitized,
    });
    res
      .status(200)
      .json({ success: true, message: "Working hours updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle Day Availability
const toggleDayAvailability = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { day } = req.body;

    const servicer = await servicerModel.findById(servicerId);
    const working_hours = servicer.working_hours;

    if (working_hours[day]) {
      working_hours[day].available = !working_hours[day].available;
    }

    await servicerModel.findByIdAndUpdate(servicerId, { working_hours });
    res.status(200).json({
      success: true,
      message: `${day} availability updated successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Appointments for Servicer
const getAppointments = async (req, res) => {
  try {
    const servicerId = req.user.id;

    const { default: appointmentModel } = await import(
      "../models/appointmentModel.js"
    );

    const appointments = await appointmentModel
      .find({ servicerId })
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    // Format the response to include user information
    const formattedAppointments = appointments.map((appointment) => ({
      _id: appointment._id,
      userName: appointment.userData?.name || "Unknown User",
      userEmail: appointment.userData?.email || "Unknown Email",
      userPhone: appointment.userData?.phone || "Unknown Phone",
      serviceType:
        appointment.serviceType || appointment.serData?.speciality || "Service",
      date: appointment.slotDate,
      time: appointment.slotTime,
      description: appointment.description || "No description provided",
      address: appointment.address || appointment.userData?.address || {},
      status: appointment.status || "pending",
      createdAt: appointment.date,
    }));

    res.status(200).json({
      success: true,
      appointments: formattedAppointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { appointmentId, status } = req.body;

    const { default: appointmentModel } = await import(
      "../models/appointmentModel.js"
    );

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      servicerId: servicerId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { status });

    res.status(200).json({
      success: true,
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Appointment Address
const updateAppointmentAddress = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { appointmentId, address } = req.body;

    const { default: appointmentModel } = await import(
      "../models/appointmentModel.js"
    );

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      servicerId: servicerId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { address });

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Appointment (Servicer)
const deleteAppointment = async (req, res) => {
  try {
    const servicerId = req.user.id;
    const { appointmentId } = req.body;

    const { default: appointmentModel } = await import(
      "../models/appointmentModel.js"
    );

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      servicerId: servicerId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only allow deletion of completed appointments
    if (appointment.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed appointments can be deleted",
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

export {
  changeAvailability,
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
};
