import React, { useContext, useState, useEffect } from "react";
import { ServicerContext } from "../context/ServicerContext";
import ServicerNavbar from "../components/ServicerNavbar";
import { toast } from "react-toastify";
import axios from "axios";

const ManageAppointments = () => {
  const { servicerData, servicerToken } = useContext(ServicerContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/servicer/update-appointment`,
        { appointmentId, status },
        {
          headers: {
            Authorization: `Bearer ${servicerToken}`,
          },
        }
      );

      if (res.data.success) {
        if (status === "completed") {
          toast.success(
            `${res.data.message} The customer will be automatically notified.`
          );
        } else {
          toast.success(res.data.message);
        }
        fetchAppointments(); // Refresh the list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Update appointment error:", error);
      toast.error("Failed to update appointment");
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this appointment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/servicer/delete-appointment`,
        { appointmentId },
        {
          headers: {
            Authorization: `Bearer ${servicerToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Appointment deleted successfully");
        fetchAppointments(); // Refresh the list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Delete appointment error:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    // Handle different date formats
    if (typeof dateString === "string" && dateString.includes("/")) {
      // Handle "day/month/year" format
      const [day, month, year] = dateString.split("/");
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (typeof dateString === "number") {
      // Handle timestamp
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      // Handle ISO string
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "No time";

    // Handle different time formats
    if (timeString.includes(":")) {
      // Handle "HH:MM" format
      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    } else {
      // Handle other formats
      return timeString;
    }
  };

  if (loading) {
    return (
      <>
        <ServicerNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ServicerNavbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Appointments
            </h1>
            <p className="text-lg text-gray-600">
              View and manage all your appointments
            </p>
          </div>

          {/* Appointments List */}
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Appointments Yet
              </h3>
              <p className="text-gray-600">
                You don't have any appointments at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Customer: {appointment.userName}
                          </h3>
                          <p className="text-gray-600 mb-1">
                            <strong>Email:</strong> {appointment.userEmail}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Phone:</strong> {appointment.userPhone}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Service:</strong> {appointment.serviceType}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">
                            <strong>Date:</strong>{" "}
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-gray-600 mb-1">
                            <strong>Time:</strong>{" "}
                            {formatTime(appointment.time)}
                          </p>
                          <p className="text-gray-600 mb-2">
                            <strong>Description:</strong>{" "}
                            {appointment.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <strong className="text-gray-900">
                          Service Address:{" "}
                        </strong>
                        <span className="text-gray-600">
                          {typeof appointment.address === "string"
                            ? appointment.address
                            : appointment.address?.address1
                            ? `${appointment.address.address1}, ${appointment.address.address2}`
                            : "No address provided"}
                        </span>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleAppointmentStatus(
                                  appointment._id,
                                  "confirmed"
                                )
                              }
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              ✅ Accept
                            </button>
                            <button
                              onClick={() =>
                                handleAppointmentStatus(
                                  appointment._id,
                                  "rejected"
                                )
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <button
                            onClick={() =>
                              handleAppointmentStatus(
                                appointment._id,
                                "completed"
                              )
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            ✅ Mark Complete
                          </button>
                        )}
                        {appointment.status === "rejected" && (
                          <button
                            onClick={() =>
                              handleAppointmentStatus(
                                appointment._id,
                                "pending"
                              )
                            }
                            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                          >
                            🔄 Restore
                          </button>
                        )}
                        {appointment.status === "completed" && (
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment._id)
                            }
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      appointments.filter((apt) => apt.status === "pending")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Confirmed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      appointments.filter((apt) => apt.status === "confirmed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      appointments.filter((apt) => apt.status === "completed")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rejected</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {
                      appointments.filter((apt) => apt.status === "rejected")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAppointments;
