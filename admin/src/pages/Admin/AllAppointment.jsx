import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointment = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    deleteAppointment,
    isRefreshing,
    getImageUrl,
  } = useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();

      // Set up polling to check for status updates every 30 seconds
      const interval = setInterval(() => {
        getAllAppointments(true);
      }, 30000); // Check every 30 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [aToken]);

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      appointment.userData?.name?.toLowerCase().includes(searchLower) ||
      appointment.servicerData?.name?.toLowerCase().includes(searchLower) ||
      appointment.servicerData?.speciality
        ?.toLowerCase()
        .includes(searchLower) ||
      appointment.servicerData?.district?.toLowerCase().includes(searchLower) ||
      appointment.status?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "confirmed":
        return "✅";
      case "rejected":
        return "❌";
      case "completed":
        return "🎉";
      case "cancelled":
        return "🚫";
      default:
        return "📋";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              All Appointments
            </h1>
            <p className="text-gray-600">
              Manage and track all appointment requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isRefreshing && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Refreshing...</span>
              </div>
            )}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
              <span className="text-sm text-gray-600">Total: </span>
              <span className="font-semibold text-gray-800">
                {appointments.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search appointments by user name, servicer name, speciality, district, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Showing {currentAppointments.length} of{" "}
              {filteredAppointments.length} appointments
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <img
                src={assets.appointments_icon}
                alt="Appointments"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Appointment Management
              </h2>
              <p className="text-blue-100 text-sm">
                Latest appointments appear first
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[60px_1fr_80px_1fr_1fr_120px_100px] gap-4 py-4 px-6 bg-gray-50 border-b font-semibold text-gray-700">
            <p>#</p>
            <p>User Details</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Servicer Details</p>
            <p>Status</p>
            <p>Actions</p>
          </div>

          <div className="divide-y divide-gray-100">
            {appointments.length > 0 ? (
              currentAppointments.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[60px_1fr_80px_1fr_1fr_120px_100px] gap-4 items-center py-4 px-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        src={getImageUrl(item.userData.image)}
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMkMyNS41MjI4IDMyIDMwIDI3LjUyMjggMzAgMjJDMzAgMTYuNDc3MiAyNS41MjI4IDEyIDIwIDEyQzE0LjQ3NzIgMTIgMTAgMTYuNDc3MiAxMCAyMkMxMCAyNy41MjI4IDE0LjQ3NzIgMzIgMjAgMzJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCAyNEMyMS4xMDQ2IDI0IDIyIDIzLjEwNDYgMjIgMjJDMjIgMjAuODk1NCAyMS4xMDQ2IDIwIDIwIDIwQzE4Ljg5NTQgMjAgMTggMjAuODk1NCAxOCAyMkMxOCAyMy4xMDQ2IDE4Ljg5NTQgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.userData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.userData.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                      {calculateAge(item.userData.dob)}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">
                      {slotDateFormat(item.slotDate)}
                    </p>
                    <p className="text-sm text-gray-500">{item.slotTime}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        src={getImageUrl(item.serData.image)}
                        alt=""
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMkMyNS41MjI4IDMyIDMwIDI3LjUyMjggMzAgMjJDMzAgMTYuNDc3MiAyNS41MjI4IDEyIDIwIDEyQzE0LjQ3NzIgMTIgMTAgMTYuNDc3MiAxMCAyMkMxMCAyNy41MjI4IDE0LjQ3NzIgMzIgMjAgMzJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yMCAyNEMyMS4xMDQ2IDI0IDIyIDIzLjEwNDYgMjIgMjJDMjIgMjAuODk1NCAyMS4xMDQ2IDIwIDIwIDIwQzE4Ljg5NTQgMjAgMTggMjAuODk1NCAxOCAyMkMxOCAyMy4xMDQ2IDE4Ljg5NTQgMjQgMjAgMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.serData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.serData.speciality}
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.cancelled ? "cancelled" : item.status || "pending"
                      )}`}
                    >
                      <span>
                        {getStatusIcon(
                          item.cancelled
                            ? "cancelled"
                            : item.status || "pending"
                        )}
                      </span>
                      {item.cancelled ? "Cancelled" : item.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    {item.cancelled ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this cancelled appointment? This action cannot be undone."
                            )
                          ) {
                            deleteAppointment(item._id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Delete Cancelled Appointment"
                      >
                        <span className="text-red-600 group-hover:scale-110 transition-transform">
                          🗑️
                        </span>
                      </button>
                    ) : item.status === "completed" ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this completed appointment? This action cannot be undone."
                            )
                          ) {
                            deleteAppointment(item._id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Delete Completed Appointment"
                      >
                        <span className="text-red-600 group-hover:scale-110 transition-transform">
                          🗑️
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Cancel Appointment"
                      >
                        <img
                          src={assets.cancel_icon}
                          className="w-5 h-5 group-hover:scale-110 transition-transform"
                          alt="Cancel"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <img
                    src={assets.appointments_icon}
                    alt=""
                    className="w-8 h-8 opacity-50"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04IDhIMjRWMjRIOFY4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjBWMjBIMTJWMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQgMTRIMThWMThIMTRWMTRaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=";
                    }}
                  />
                </div>
                <p className="text-gray-500 text-lg">No appointments found</p>
                <p className="text-gray-400 text-sm">
                  Appointments will appear here when users make bookings
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {appointments.length > 0 ? (
            <div className="p-4 space-y-4">
              {appointments.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.userData.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.userData.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.cancelled ? "cancelled" : item.status || "pending"
                      )}`}
                    >
                      <span>
                        {getStatusIcon(
                          item.cancelled
                            ? "cancelled"
                            : item.status || "pending"
                        )}
                      </span>
                      {item.cancelled ? "Cancelled" : item.status || "Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Age</p>
                      <p className="text-sm font-medium">
                        {calculateAge(item.userData.dob)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm font-medium">
                        {slotDateFormat(item.slotDate)}
                      </p>
                      <p className="text-xs text-gray-500">{item.slotTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <img
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      src={getImageUrl(item.serData.image)}
                      alt=""
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAyNkMyMS41MjI4IDI2IDI2IDIxLjUyMjggMjYgMTZDMjYgMTAuNDc3MiAyMS41MjI4IDYgMTYgNkMxMC40NzcyIDYgNiAxMC40NzcyIDYgMTZDNiAyMS41MjI4IDEwLjQ3NzIgMjYgMTYgMjZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNiAyMEMxNy4xMDQ2IDIwIDE4IDE5LjEwNDYgMTggMThDMTggMTYuODk1NCAxNy4xMDQ2IDE2IDE2IDE2QzE0Ljg5NTQgMTYgMTQgMTYuODk1NCAxNCAxOEMxNCAxOS4xMDQ2IDE0Ljg5NTQgMjAgMTYgMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                      }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {item.serData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.serData.speciality}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {item.cancelled ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this cancelled appointment? This action cannot be undone."
                            )
                          ) {
                            deleteAppointment(item._id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Delete Cancelled Appointment"
                      >
                        <span className="text-red-600 group-hover:scale-110 transition-transform">
                          🗑️
                        </span>
                      </button>
                    ) : item.status === "completed" ? (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this completed appointment? This action cannot be undone."
                            )
                          ) {
                            deleteAppointment(item._id);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Delete Completed Appointment"
                      >
                        <span className="text-red-600 group-hover:scale-110 transition-transform">
                          🗑️
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                        title="Cancel Appointment"
                      >
                        <img
                          src={assets.cancel_icon}
                          className="w-5 h-5 group-hover:scale-110 transition-transform"
                          alt="Cancel"
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src={assets.appointments_icon}
                  alt=""
                  className="w-8 h-8 opacity-50"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04IDhIMjRWMjRIOFY4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIgMTJIMjBWMjBIMTJWMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQgMTRIMThWMThIMTRWMTRaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=";
                  }}
                />
              </div>
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm">
                Appointments will appear here when users make bookings
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredAppointments.length)} of{" "}
              {filteredAppointments.length} appointments
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointment;
