import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // const currencySympol = "Rs.";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [servicers, setServicers] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [loading, setLoading] = useState(false);

  const getServicerData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/servicer/list");
      if (data.success) {
        setServicers(data.servicers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Normalize image URL (Cloudinary full URLs vs local filenames)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (typeof imagePath === "string" && imagePath.startsWith("http")) {
      return imagePath;
    }
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const loadUserProfileData = async () => {
    try {
      console.log("Loading user profile data...", { token: !!token });
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      console.log("Profile data response:", data);
      if (data.success) {
        setUserData(data.userData);
        console.log("User data set:", data.userData);
      } else {
        console.error("Profile data error:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Profile loading error:", error);
      toast.error(error.message);
    }
  };

  const value = {
    servicers,
    getServicerData,
    // currencySympol,
    token,
    setToken,
    backendUrl,
    getImageUrl,
    userData,
    setUserData,
    loadUserProfileData,
    loading,
    setLoading,
  };

  useEffect(() => {
    getServicerData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
