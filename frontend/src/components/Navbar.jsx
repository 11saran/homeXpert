import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ServicerContext } from "../context/ServicerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const {
    token,
    setToken,
    userData,
    getImageUrl: getUserImageUrl,
  } = useContext(AppContext);
  const { servicerData, getImageUrl: getServicerImageUrl } =
    useContext(ServicerContext);
  const userType = localStorage.getItem("userType");

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
  };

  const navItems = [
    { to: "/", label: "HOME" },
    { to: "/servicers", label: "ALL SERVICERS" },
    { to: "/about", label: "ABOUT" },
    { to: "/contact", label: "CONTACT" },
  ];

  return (
    <motion.div
      className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        onClick={() => navigate("/")}
        className="cursor-pointer w-40 hover:scale-105 transition-transform duration-300"
        src={assets.logo2}
        alt="HomeXpert Logo"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      />

      <ul className="hidden md:flex items-start gap-8 font-medium">
        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <NavLink
              to={item.to}
              className={({ isActive }) => `group ${isActive ? "active" : ""}`}
            >
              <motion.li
                className="py-2 px-3 rounded-lg transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.li>
              <motion.hr className="border-none outline-none h-0.5 bg-gradient-to-r from-primary to-green-500 w-0 m-auto group-hover:w-3/5 transition-all duration-300" />
            </NavLink>
          </motion.div>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <motion.div
            className="flex items-center gap-3 cursor-pointer group relative p-2 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {userType === "servicer" ? (
              <>
                <motion.img
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors duration-300"
                  src={
                    servicerData && servicerData.image
                      ? getServicerImageUrl(servicerData.image)
                      : "/placeholder-service.jpg"
                  }
                  alt="Servicer"
                  whileHover={{ scale: 1.1 }}
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-gray-800">
                    {servicerData ? servicerData.name : "Servicer"}
                  </span>
                  <span className="text-xs text-gray-500">Dashboard</span>
                </div>
              </>
            ) : userData ? (
              <motion.img
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors duration-300"
                src={getUserImageUrl(userData.image)}
                alt="User"
                whileHover={{ scale: 1.1 }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            )}
            <motion.img
              className="w-3 group-hover:rotate-180 transition-transform duration-300"
              src={assets.dropdown_icon}
              alt="Dropdown"
            />

            <div className="absolute top-0 right-0 pt-16 text-base font-medium text-gray-600 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="min-w-48 bg-white shadow-2xl rounded-xl flex flex-col gap-1 p-2 border border-gray-100">
                  {userType === "servicer" ? (
                    <>
                      <motion.p
                        onClick={() => navigate("/servicer-dashboard")}
                        className="hover:bg-primary/10 hover:text-primary cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        Dashboard
                      </motion.p>
                      <motion.p
                        onClick={() =>
                          navigate("/servicer-dashboard/manage-availability")
                        }
                        className="hover:bg-primary/10 hover:text-primary cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        Manage Availability
                      </motion.p>
                      <motion.p
                        onClick={() =>
                          navigate("/servicer-dashboard/appointments")
                        }
                        className="hover:bg-primary/10 hover:text-primary cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        Manage Appointments
                      </motion.p>
                    </>
                  ) : (
                    <>
                      <motion.p
                        onClick={() => navigate("/my-profile")}
                        className="hover:bg-primary/10 hover:text-primary cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        My Profile
                      </motion.p>
                      <motion.p
                        onClick={() => navigate("/my-bookings")}
                        className="hover:bg-primary/10 hover:text-primary cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                        whileHover={{ x: 5 }}
                      >
                        My Bookings
                      </motion.p>
                    </>
                  )}
                  <motion.div className="border-t border-gray-100 my-1"></motion.div>
                  <motion.p
                    onClick={logout}
                    className="hover:bg-red-50 hover:text-red-600 cursor-pointer px-4 py-3 rounded-lg transition-all duration-200"
                    whileHover={{ x: 5 }}
                  >
                    Logout
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-primary to-green-600 text-white px-8 py-3 rounded-full font-semibold hidden md:block hover:shadow-lg transition-all duration-300 hover-glow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
        )}

        <motion.img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer hover:scale-110 transition-transform duration-300"
          src={assets.menu_icon}
          alt="Menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              className="fixed inset-0 z-50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowMenu(false)}
              />
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
                  <img className="w-36" src={assets.logo} alt="HomeXpert" />
                  <motion.img
                    className="w-7 cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => setShowMenu(false)}
                    src={assets.cross_icon}
                    alt="Close"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </div>
                <motion.ul
                  className="flex flex-col gap-2 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <NavLink
                        onClick={() => setShowMenu(false)}
                        to={item.to}
                        className={({ isActive }) =>
                          `block ${isActive ? "active" : ""}`
                        }
                      >
                        <motion.p
                          className="px-4 py-3 rounded-lg text-lg font-medium hover:bg-primary/10 hover:text-primary transition-all duration-300"
                          whileHover={{ x: 10 }}
                        >
                          {item.label}
                        </motion.p>
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;
