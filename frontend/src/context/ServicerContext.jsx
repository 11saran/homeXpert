import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ServicerContext = createContext();

const ServicerContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [servicerToken, setServicerToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [servicerData, setServicerData] = useState(false);
  const [loading, setLoading] = useState(false);

  // Normalize image URL (supports Cloudinary full URLs and local filenames)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath === "string" && imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // Sync token from localStorage and load profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    console.log("ServicerContext: Token check", { token: !!token, userType });

    if (token && userType === "servicer") {
      setServicerToken(token);
      // Automatically load servicer profile when token is available
      loadServicerProfileInternal(token);
    } else {
      setServicerToken(false);
      console.log("ServicerContext: No token or wrong user type");
    }
  }, []);

  const loadServicerProfileInternal = async (token) => {
    if (!token) {
      console.log(
        "ServicerContext: No token provided to loadServicerProfileInternal"
      );
      return;
    }

    console.log("ServicerContext: Loading servicer profile...");
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/servicer/profile",
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );
      console.log("ServicerContext: Profile response:", data);

      if (data.success) {
        setServicerData(data.servicerData);
        console.log("ServicerContext: Profile loaded successfully");
      } else {
        console.error("ServicerContext: Profile load failed:", data.message);
        toast.error(data.message);
        // If servicer is not approved, redirect to login
        if (
          data.message.includes("not approved") ||
          data.message.includes("rejected")
        ) {
          // Keep token but route to pending page
          window.location.href = "/servicer-pending";
        }
      }
    } catch (error) {
      console.error("ServicerContext: Profile load error:", error);
      if (error.response) {
        console.error("API Error:", error.response.data);
      }
      toast.error("Failed to load servicer profile");
    } finally {
      setLoading(false);
    }
  };

  const loadServicerProfile = async () => {
    await loadServicerProfileInternal(servicerToken);
  };

  const updateServicerProfile = async (profileData) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/servicer/update-profile",
        profileData,
        { headers: { authorization: `Bearer ${servicerToken}` } }
      );
      if (data.success) {
        // Update servicerData with new information
        if (data.data) {
          setServicerData((prev) => ({
            ...prev,
            name: data.data.name,
            image: data.data.image,
          }));
        }
        toast.success(data.message);
        // Reload profile to ensure all data is fresh
        loadServicerProfile();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateWorkingHours = async (workingHours) => {
    if (!servicerToken) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/servicer/update-working-hours",
        {
          working_hours: JSON.parse(JSON.stringify(workingHours)),
        },
        { headers: { authorization: `Bearer ${servicerToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        loadServicerProfile(); // Reload profile data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const toggleDayAvailability = async (day) => {
    if (!servicerToken) return;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/servicer/toggle-day-availability",
        { day },
        { headers: { authorization: `Bearer ${servicerToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        loadServicerProfile(); // Reload profile data
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value = {
    servicerToken,
    setServicerToken,
    servicerData,
    setServicerData,
    loadServicerProfile,
    updateServicerProfile,
    updateWorkingHours,
    toggleDayAvailability,
    loading,
    setLoading,
    getImageUrl,
  };

  // Auto-load servicer profile when token exists
  React.useEffect(() => {
    if (servicerToken) {
      loadServicerProfile();
    } else {
      setServicerData(false);
    }
  }, [servicerToken]);

  return (
    <ServicerContext.Provider value={value}>
      {props.children}
    </ServicerContext.Provider>
  );
};

export default ServicerContextProvider;
