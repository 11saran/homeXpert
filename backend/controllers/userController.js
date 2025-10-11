import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import servicerModel from "../models/servicerModel.js";
import appointmentModel from "../models/appointmentModel.js";

//Api register user

const registerUser = async (req, res) => {
  try {
    const { name, email, password, address, district, gender, dob, phone } =
      req.body;
    if (!name || !email || !password || !address || !gender || !dob || !phone) {
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

    //Validate phone number

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    //Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
      address,
      district,
      gender,
      dob,
      phone,
    };
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to get user profile data

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel.findById(userId).select("-password");
    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, dob, gender, district } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !address || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Details" });
    }
    const updateData = await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
      district,
    });
    console.log(updateData);

    if (imageFile) {
      try {
        // Check file size before uploading (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (imageFile.size > maxSize) {
          return res.status(400).json({
            success: false,
            message:
              "File size too large. Please select an image smaller than 10MB.",
          });
        }

        //Upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
          resource_type: "image",
        });
        const imageUrl = imageUpload.secure_url;

        const updateImage = await userModel.findByIdAndUpdate(userId, {
          image: imageUrl,
        });
        console.log(updateImage);
      } catch (cloudinaryError) {
        console.log("Cloudinary error:", cloudinaryError);
        return res.status(400).json({
          success: false,
          message:
            cloudinaryError.message ||
            "Image upload failed. Please try again with a smaller image.",
        });
      }
    }
    res.status(200).json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to book appointment

const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serId, slotDate, slotTime } = req.body;

    const serData = await servicerModel.findById(serId).select("-password");

    if (!serData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Servicer not available" });
    }

    //Checking for slot availability
    let slots_booked = serData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");
    delete serData.slots_booked;

    const appointmentData = {
      userId,
      serId,
      servicerId: serId, // Add servicerId for servicer queries
      userData,
      serData,
      serviceType: serData.speciality,
      description: req.body.description || "",
      address: req.body.address || {},
      status: "pending",
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    //save new slots data in serData
    await servicerModel.findByIdAndUpdate(serId, { slots_booked });
    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to get user appointment in frontend

const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModel
      .find({ userId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Api to cancel appointment

const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    //Verify appointment user

    if (appointmentData.userId !== userId) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized Action" });
    }

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

//Api to delete appointment (for cancelled appointments)

const deleteAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    //Verify appointment user
    if (appointmentData.userId !== userId) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized Action" });
    }

    //Only allow deletion of cancelled or completed appointments
    if (!appointmentData.cancelled && appointmentData.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only cancelled or completed appointments can be deleted",
      });
    }

    await appointmentModel.findByIdAndDelete(appointmentId);
    res
      .status(200)
      .json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  deleteAppointment,
};
