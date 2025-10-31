import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyBookings = () => {
  const { backendUrl, token, getServicerData, getImageUrl } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("/");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsRefreshing(true);
      }

      const { data } = await axios.get(
        backendUrl + "/api/user/my-appointments",
        { headers: { token } }
      );
      if (data.success) {
        const newAppointments = data.appointments.reverse();

        // Check if any status has changed and show notification
        if (appointments.length > 0) {
          newAppointments.forEach((newAppointment, index) => {
            const oldAppointment = appointments.find(
              (apt) => apt._id === newAppointment._id
            );
            if (
              oldAppointment &&
              oldAppointment.status !== newAppointment.status
            ) {
              if (newAppointment.status === "completed") {
                toast.success(
                  `✅ Your appointment with ${newAppointment.serData.name} has been completed!`
                );
              } else if (newAppointment.status === "confirmed") {
                toast.info(
                  `📅 Your appointment with ${newAppointment.serData.name} has been confirmed!`
                );
              } else if (newAppointment.status === "rejected") {
                toast.warning(
                  `❌ Your appointment with ${newAppointment.serData.name} has been rejected.`
                );
              }
            }
          });
        }

        setAppointments(newAppointments);
        //console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // console.log(appointmentId);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getServicerData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this appointment? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/delete-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Appointment deleted successfully");
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete appointment");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();

      // Set up polling to check for status updates every 30 seconds
      const interval = setInterval(() => {
        getUserAppointments();
      }, 30000); // Check every 30 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6  py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 h-24 bg-indigo-50 object-cover border rounded"
                src={
                  item.serData && item.serData.image
                    ? getImageUrl(item.serData.image)
                    : "/placeholder-service.jpg"
                }
                alt={item.serData?.name || "Servicer"}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-service.jpg";
                }}
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.serData.name}
              </p>
              <p>{item.serData.speciality}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-800 font-medium">
                  District:
                </span>{" "}
                {item.serData.district}
              </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-800 font-medium">
                  Date & Time:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {/* Status Badge */}
              <div className="text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.cancelled
                      ? "bg-red-100 text-red-800"
                      : item.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : item.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : item.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : item.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.cancelled ? "Cancelled" : item.status || "Pending"}
                </span>
              </div>

              {/* Action Buttons */}
              {!item.cancelled &&
                item.status !== "completed" &&
                item.status !== "rejected" &&
                item.status !== "confirmed" && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel Appointment
                  </button>
                )}

              {item.cancelled && (
                <button
                  onClick={() => deleteAppointment(item._id)}
                  className="sm:min-w-48 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  🗑️ Delete
                </button>
              )}

              {item.status === "completed" && (
                <button
                  onClick={() => deleteAppointment(item._id)}
                  className="sm:min-w-48 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  🗑️ Delete
                </button>
              )}

              {item.status === "rejected" && (
                <button
                  onClick={() => deleteAppointment(item._id)}
                  className="sm:min-w-48 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
