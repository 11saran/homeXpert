import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home";
import Servicers from "./pages/Servicers";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";
import MyBookings from "./pages/MyBookings";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ServicerDashboard from "./pages/ServicerDashboard";
import ManageAvailability from "./pages/ManageAvailability";
import ManageAppointments from "./pages/ManageAppointments";
import ServicerPending from "./pages/ServicerPending";
import AppContextProvider from "./context/AppContext";
import ServicerContextProvider from "./context/ServicerContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected Route Component for Customer pages
const ProtectedCustomerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userType === "servicer") {
      navigate("/servicer-dashboard");
    }
  }, [token, userType, navigate]);

  return token && userType === "user" ? children : null;
};

// Protected Route Component for Servicer pages
const ProtectedServicerRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userType === "user") {
      navigate("/");
    }
  }, [token, userType, navigate]);

  return token && userType === "servicer" ? children : null;
};

const App = () => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.02,
    },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <AppContextProvider>
      <ServicerContextProvider>
        <div className="mx-4 sm:mx-[10%] min-h-screen">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Navbar />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/servicers" element={<Servicers />} />
                <Route path="/servicers/:speciality" element={<Servicers />} />
                <Route path="/servicers/_/:location" element={<Servicers />} />
                <Route
                  path="/servicers/:speciality/:location"
                  element={<Servicers />}
                />

                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Customer Routes */}
                <Route
                  path="/my-profile"
                  element={
                    <ProtectedCustomerRoute>
                      <MyProfile />
                    </ProtectedCustomerRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <ProtectedCustomerRoute>
                      <MyBookings />
                    </ProtectedCustomerRoute>
                  }
                />

                <Route path="/booking/:serId" element={<Booking />} />

                {/* Protected Servicer Routes */}
                <Route
                  path="/servicer-dashboard"
                  element={
                    <ProtectedServicerRoute>
                      <ServicerDashboard />
                    </ProtectedServicerRoute>
                  }
                />
                <Route path="/servicer-pending" element={<ServicerPending />} />
                <Route
                  path="/servicer-dashboard/manage-availability"
                  element={
                    <ProtectedServicerRoute>
                      <ManageAvailability />
                    </ProtectedServicerRoute>
                  }
                />
                <Route
                  path="/servicer-dashboard/appointments"
                  element={
                    <ProtectedServicerRoute>
                      <ManageAppointments />
                    </ProtectedServicerRoute>
                  }
                />
              </Routes>
            </motion.div>
          </AnimatePresence>

          <Footer />
          <ScrollToTop />
        </div>
      </ServicerContextProvider>
    </AppContextProvider>
  );
};

export default App;
