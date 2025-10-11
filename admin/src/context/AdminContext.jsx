import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [servicers, setServicers] = useState([]);
  const [pendingServicers, setPendingServicers] = useState([]);
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Utility function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    // If it's already a full URL (Cloudinary), return as is
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // If it's a local filename, construct the backend URL
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const getAllServicers = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-servicers",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setServicers(data.servicers);
        // console.log(data.servicers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllUsers = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-users",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setUsers(data.users);
        // console.log(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (serId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { serId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServicers();
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = async (showLoading = false) => {
    try {
      if (showLoading) {
        setIsRefreshing(true);
      }

      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { aToken },
      });

      if (data.success) {
        const newAppointments = data.appointments;

        // Check if any status has changed and show notification
        if (appointments.length > 0 && showLoading) {
          newAppointments.forEach((newAppointment) => {
            const oldAppointment = appointments.find(
              (apt) => apt._id === newAppointment._id
            );
            if (
              oldAppointment &&
              oldAppointment.status !== newAppointment.status
            ) {
              if (newAppointment.status === "completed") {
                toast.success(
                  `✅ Appointment with ${newAppointment.serData.name} has been completed!`
                );
              } else if (newAppointment.status === "confirmed") {
                toast.info(
                  `📅 Appointment with ${newAppointment.serData.name} has been confirmed!`
                );
              } else if (newAppointment.status === "rejected") {
                toast.warning(
                  `❌ Appointment with ${newAppointment.serData.name} has been rejected.`
                );
              }
            }
          });
        }

        setAppointments(newAppointments);
        // console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        // console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPendingServicers = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/pending-servicers",
        {
          headers: { aToken },
        }
      );
      if (data.success) {
        setPendingServicers(data.pendingServicers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const approveServicer = async (servicerId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/approve-servicer",
        { servicerId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getPendingServicers();
        getDashData();
        getAllServicers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const rejectServicer = async (servicerId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/reject-servicer",
        { servicerId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getPendingServicers();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateServicer = async (servicerId, updateData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/update-servicer",
        { servicerId, updateData },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServicers();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteServicer = async (servicerId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-servicer",
        { servicerId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServicers();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleServicerBlock = async (servicerId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/toggle-servicer-block",
        { servicerId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServicers();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/delete-user",
        { userId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllUsers();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    getImageUrl,
    servicers,
    getAllServicers,
    pendingServicers,
    getPendingServicers,
    approveServicer,
    rejectServicer,
    users,
    getAllUsers,
    deleteUser,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    deleteAppointment,
    dashData,
    getDashData,
    updateServicer,
    deleteServicer,
    toggleServicerBlock,
    isRefreshing,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
