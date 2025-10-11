import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData, getImageUrl } =
    useContext(AdminContext);

  const { slotDateFormat, loading, setLoading } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      setLoading(true);
      getDashData().finally(() => setLoading(false));

      // Set up polling to check for status updates every 30 seconds
      const interval = setInterval(() => {
        getDashData();
      }, 30000); // Check every 30 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [aToken]);

  if (loading || !dashData) {
    return <Loader />;
  }

  return (
    dashData && (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <NavLink to={"/servicers-list"}>
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-blue-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Approved Servicers
                  </p>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {dashData.approvedServicers || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <img
                    className="w-8 h-8"
                    src={assets.users_icon}
                    alt="Users"
                  />
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink to={"/pending-servicers"}>
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-orange-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Pending Servicers
                  </p>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {dashData.pendingServicers || 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 transition-colors">
                  <img
                    className="w-8 h-8"
                    src={assets.users_icon}
                    alt="Users"
                  />
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink to={"/all-appointments"}>
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Appointments
                  </p>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                    {dashData.appointments}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                  <img
                    className="w-8 h-8"
                    src={assets.appointments_icon}
                    alt="Appointments"
                  />
                </div>
              </div>
            </div>
          </NavLink>

          <NavLink to={"/users-list"}>
            <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-purple-500 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                    {dashData.users}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                  <img
                    className="w-8 h-8"
                    src={assets.users_icon}
                    alt="Users"
                  />
                </div>
              </div>
            </div>
          </NavLink>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <img
                  src={assets.list_icon}
                  alt=""
                  className="w-6 h-6 filter brightness-0 invert"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Latest Bookings
                </h2>
                <p className="text-blue-100 text-sm">
                  Recent appointment requests
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(item.serData.image)}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-semibold text-lg">
                      {item.serData.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {slotDateFormat(item.slotDate)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Service: {item.serData.speciality}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.cancelled ? (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Cancelled
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors group"
                          title="Cancel Appointment"
                        >
                          <img
                            src={assets.cancel_icon}
                            className="w-5 h-5 group-hover:scale-110 transition-transform"
                            alt="Cancel"
                          />
                        </button>
                      </div>
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
                <p className="text-gray-500 text-lg">No appointments yet</p>
                <p className="text-gray-400 text-sm">
                  New appointments will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
