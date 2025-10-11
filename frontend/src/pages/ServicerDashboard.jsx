import React, { useContext, useEffect, useState } from "react";
import { ServicerContext } from "../context/ServicerContext";
import ServicerNavbar from "../components/ServicerNavbar";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ServicerDashboard = () => {
  const {
    servicerData,
    loadServicerProfile,
    loading,
    updateServicerProfile,
    servicerToken,
    getImageUrl,
  } = useContext(ServicerContext);

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: null,
  });
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchAppointments = async () => {
    try {
      setAppointmentsLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/servicer/get-appointments`,
        {},
        {
          headers: {
            Authorization: `Bearer ${servicerToken}`,
          },
        }
      );

      if (res.data.success) {
        setAppointments(res.data.appointments);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Fetch appointments error:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setAppointmentsLoading(false);
    }
  };

  useEffect(() => {
    // ServicerContext automatically loads the profile, so we don't need to call it here
    const userType = localStorage.getItem("userType");
    console.log(
      "ServicerDashboard: UserType check",
      userType,
      "ServicerData available:",
      !!servicerData
    );

    if (userType !== "servicer") {
      console.log("ServicerDashboard: Wrong user type, redirecting...");
      window.location.href = "/login";
    }

    // Fetch appointments when servicerToken is available
    if (servicerToken) {
      fetchAppointments();
    }
  }, [servicerData, servicerToken]);

  const handleEditProfile = () => {
    setEditData({
      name: servicerData.name,
      image: null,
    });
    setEditModal(true);
  };

  const handleUpdateProfile = async () => {
    try {
      if (!editData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", editData.name);
      if (editData.image) {
        formData.append("image", editData.image);
      }

      await updateServicerProfile(formData);
      setEditModal(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading || !servicerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading servicer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServicerNavbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-6">
              <img
                src={
                  servicerData.image
                    ? getImageUrl(servicerData.image)
                    : "/placeholder-service.jpg"
                }
                alt={servicerData.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome, {servicerData.name}
                  </h1>
                  <button
                    onClick={handleEditProfile}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
                <p className="text-lg text-gray-600 mb-2">
                  {servicerData.speciality}
                </p>
                <p className="text-gray-500">
                  {servicerData.experience} years experience
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      servicerData.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {servicerData.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">District</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {servicerData.district}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Experience
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {servicerData.experience} years
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-2xl font-semibold text-gray-900 capitalize">
                    {servicerData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Contact Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {servicerData.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {servicerData.phone}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {servicerData.gender}
                  </p>
                  <p>
                    <span className="font-medium">DOB:</span> {servicerData.dob}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Service Details
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Speciality:</span>{" "}
                    {servicerData.speciality}
                  </p>
                  <p>
                    <span className="font-medium">About:</span>
                  </p>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {servicerData.about}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Appointment Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">
                      Pending
                    </p>
                    <p className="text-2xl font-semibold text-yellow-800">
                      {appointmentsLoading
                        ? "..."
                        : appointments.filter((apt) => apt.status === "pending")
                            .length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">
                      Confirmed
                    </p>
                    <p className="text-2xl font-semibold text-green-800">
                      {appointmentsLoading
                        ? "..."
                        : appointments.filter(
                            (apt) => apt.status === "confirmed"
                          ).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">
                      Completed
                    </p>
                    <p className="text-2xl font-semibold text-blue-800">
                      {appointmentsLoading
                        ? "..."
                        : appointments.filter(
                            (apt) => apt.status === "completed"
                          ).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-600">Rejected</p>
                    <p className="text-2xl font-semibold text-red-800">
                      {appointmentsLoading
                        ? "..."
                        : appointments.filter(
                            (apt) => apt.status === "rejected"
                          ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Working Hours
              </h2>
              <div className="flex gap-3">
                <Link to="/servicer-dashboard/manage-availability">
                  <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors">
                    Edit Schedule
                  </button>
                </Link>
                <Link to="/servicer-dashboard/appointments">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Manage Appointments
                  </button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(servicerData.working_hours)
                .filter(([day]) => day !== "_id") // Filter out the _id field
                .map(([day, schedule]) => ({
                  day: day.charAt(0).toUpperCase() + day.slice(1),
                  ...schedule,
                }))
                .map((dayInfo, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      dayInfo.available
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900">
                        {dayInfo.day}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dayInfo.available
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {dayInfo.available ? "Open" : "Closed"}
                      </span>
                    </div>
                    {dayInfo.available && (
                      <p className="text-sm text-gray-600">
                        {dayInfo.start} - {dayInfo.end}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Image
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2">
                      {editData.image ? (
                        <img
                          src={URL.createObjectURL(editData.image)}
                          alt="Profile Preview"
                          className="w-24 h-24 object-cover border rounded-full"
                        />
                      ) : (
                        <img
                          src={
                            servicerData.image
                              ? getImageUrl(servicerData.image)
                              : "/placeholder-service.jpg"
                          }
                          alt="Current Profile"
                          className="w-24 h-24 object-cover border rounded-full"
                        />
                      )}
                    </div>
                    <label
                      htmlFor="profile-image-edit"
                      className="cursor-pointer"
                    >
                      <input
                        type="file"
                        id="profile-image-edit"
                        accept="image/*"
                        onChange={(e) =>
                          setEditData({ ...editData, image: e.target.files[0] })
                        }
                        className="hidden"
                      />
                      <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        {editData.image ? "Change Image" : "Upload New Image"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Update Profile
              </button>
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicerDashboard;
