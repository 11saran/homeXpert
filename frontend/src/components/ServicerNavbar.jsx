import React, { useContext } from "react";
import { ServicerContext } from "../context/ServicerContext";
import { Link } from "react-router-dom";

const ServicerNavbar = () => {
  const { servicerToken, setServicerToken } = useContext(ServicerContext);

  const handleLogout = () => {
    localStorage.removeItem("servicerToken");
    setServicerToken(false);
    window.location.href = "/login";
  };

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  if (!servicerToken) return null;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/servicer-dashboard"
                className="text-xl font-bold text-primary"
              >
                🔧 Servicer Dashboard
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/servicer-dashboard"
                className={`${
                  isActive("/servicer-dashboard")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                to="/servicer-dashboard/appointments"
                className={`${
                  isActive("/servicer-dashboard/appointments")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Manage Appointments
              </Link>
              <Link
                to="/servicer-dashboard/manage-availability"
                className={`${
                  isActive("/servicer-dashboard/manage-availability")
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Manage Schedule
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              title="Exit"
              aria-label="Exit"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path d="M15.75 3a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0V4.5h-6a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h6v-2.25a.75.75 0 011.5 0v3a.75.75 0 01-.75.75h-6A3 3 0 016 18V6a3 3 0 013-3h6z" />
                <path d="M21.53 12.53a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H10.5a.75.75 0 000 1.5h8.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" />
              </svg> */}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ServicerNavbar;
