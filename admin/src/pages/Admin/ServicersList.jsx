import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";

const ServicersList = () => {
  const {
    servicers,
    aToken,
    getAllServicers,
    changeAvailability,
    updateServicer,
    deleteServicer,
    toggleServicerBlock,
    getImageUrl,
  } = useContext(AdminContext);

  const [editModal, setEditModal] = useState(false);
  const [selectedServicer, setSelectedServicer] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (aToken) {
      getAllServicers();
    }
  }, [aToken]);

  const handleEditServicer = (servicer) => {
    setSelectedServicer(servicer);
    setEditedData({
      name: servicer.name,
      email: servicer.email,
      phone: servicer.phone,
      speciality: servicer.speciality,
      experience: servicer.experience,
      district: servicer.district,
      about: servicer.about,
      available: servicer.available,
      blocked: servicer.blocked || false,
    });
    setEditModal(true);
  };

  const handleUpdateServicer = async () => {
    try {
      await updateServicer(selectedServicer._id, editedData);
      setEditModal(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDeleteServicer = async (servicerId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this servicer? This action cannot be undone."
      )
    ) {
      try {
        await deleteServicer(servicerId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleBlockServicer = async (servicerId, currentStatus) => {
    console.log("Block servicer clicked:", { servicerId, currentStatus });
    try {
      await toggleServicerBlock(servicerId);
    } catch (error) {
      console.error("Block/Unblock failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              All Servicers
            </h1>
            <p className="text-gray-600">
              Manage and monitor all service providers
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="font-semibold text-gray-800">
              {servicers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Servicers Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <img
                src={assets.people_icon}
                alt="Service Providers"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Service Providers
              </h2>
              <p className="text-blue-100 text-sm">
                Manage servicer profiles and availability
              </p>
            </div>
          </div>
        </div>

        {/* Servicers List */}
        <div className="p-6">
          {servicers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {servicers.map((item, index) => (
                <div
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  key={index}
                >
                  <div className="relative">
                    <img
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEyNS41MjMgMTUwIDE0NSAxMzAuNTIzIDE0NSAxMDVDMTQ1IDc5LjQ3NzEgMTI1LjUyMyA2MCAxMDAgNjBDNzQuNDc3MSA2MCA1NSA3OS40NzcxIDU1IDEwNUM1NSAxMzAuNTIzIDc0LjQ3NzEgMTUwIDEwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMC40OTMgMTIwIDEyMCAxMTAuNDkzIDEyMCAxMDBDMTIwIDg5LjUwNzEgMTEwLjQ5MyA4MCAxMDAgODBDODkuNTA3MSA4MCA4MCA4OS41MDcxIDgwIDEwMEM4MCAxMTAuNDkzIDg5LjUwNzEgMTIwIDEwMCAxMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                      }}
                    />
                    {item.blocked && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                        BLOCKED
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                          item.available
                            ? "bg-green-500 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium mb-2">
                      {item.speciality}
                    </p>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                          📧
                        </span>
                        <span className="truncate">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                          📱
                        </span>
                        <span>{item.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                          📍
                        </span>
                        <span>{item.district}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                          ⭐
                        </span>
                        <span>{item.experience}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditServicer(item)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() =>
                          handleBlockServicer(item._id, item.blocked)
                        }
                        className={`flex-1 px-3 py-2 text-xs rounded-lg transition-colors font-medium flex items-center justify-center gap-1 ${
                          item.blocked
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        <span>{item.blocked ? "🔓" : "🚫"}</span>
                        <span>{item.blocked ? "Unblock" : "Block"}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteServicer(item._id)}
                        className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src={assets.users_icon}
                  alt=""
                  className="w-8 h-8 opacity-50"
                />
              </div>
              <p className="text-gray-500 text-lg">No servicers found</p>
              <p className="text-gray-400 text-sm">
                Servicers will appear here when they register
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-xl">
              <h2 className="text-xl font-semibold text-white">
                Edit Servicer
              </h2>
              <p className="text-blue-100 text-sm">
                Update servicer information
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editedData.name}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editedData.email}
                  onChange={(e) =>
                    setEditedData({ ...editedData, email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) =>
                    setEditedData({ ...editedData, phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speciality
                </label>
                <input
                  type="text"
                  value={editedData.speciality}
                  onChange={(e) =>
                    setEditedData({ ...editedData, speciality: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={editedData.experience}
                  onChange={(e) =>
                    setEditedData({ ...editedData, experience: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <select
                  value={editedData.district}
                  onChange={(e) =>
                    setEditedData({ ...editedData, district: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Colombo">Colombo</option>
                  <option value="Jaffna">Jaffna</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  value={editedData.about}
                  onChange={(e) =>
                    setEditedData({ ...editedData, about: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows="3"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedData.available}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        available: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Available
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editedData.blocked}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        blocked: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Blocked
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={handleUpdateServicer}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
              >
                Update
              </button>
              <button
                onClick={() => setEditModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicersList;
