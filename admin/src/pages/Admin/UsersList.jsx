import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const UsersList = () => {
  const { users, aToken, getAllUsers, getImageUrl, deleteUser } =
    useContext(AdminContext);
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (aToken) {
      getAllUsers();
    }
  }, [aToken]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This will also delete all their appointments. This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">All Users</h1>
            <p className="text-gray-600">
              View and manage all registered users
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="font-semibold text-gray-800">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <img
                src={assets.people_icon}
                alt="Registered Users"
                className="w-6 h-6"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Registered Users
              </h2>
              <p className="text-blue-100 text-sm">
                Manage user accounts and information
              </p>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="p-6">
          {users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((item, index) => (
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
                    <div className="absolute bottom-3 left-3">
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-medium shadow-lg">
                        Active User
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      Registered User
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
                          🏠
                        </span>
                        <span className="truncate">
                          {item.address?.line1 ||
                            item.address?.address1 ||
                            (typeof item.address === "string"
                              ? item.address
                              : "N/A")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewUser(item)}
                        className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors font-medium flex items-center justify-center gap-1"
                      >
                        <span>👤</span>
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(item._id)}
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
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm">
                Users will appear here when they register
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-xl relative">
              <h2 className="text-xl font-semibold text-white">User Details</h2>
              <p className="text-blue-100 text-sm">Complete user information</p>
              <button
                onClick={() => setViewModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <img
                  src={getImageUrl(selectedUser.image)}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00OCA3MkM2MC4xNTQ3IDcyIDcwIDYyLjE1NDcgNzAgNTBDNzAgMzcuODQ1MyA2MC4xNTQ3IDI4IDQ4IDI4QzM1Ljg0NTMgMjggMjYgMzcuODQ1MyAyNiA1MEMyNiA2Mi4xNTQ3IDM1Ljg0NTMgNzIgNDggNzJaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik00OCA1NkM1Mi40MTgzIDU2IDU2IDUyLjQxODMgNTYgNDhDNTYgNDMuNTgxNyA1Mi40MTgzIDQwIDQ4IDQwQzQzLjU4MTcgNDAgNDAgNDMuNTgxNyA0MCA0OEM0MCA1Mi40MTgzIDQzLjU4MTcgNTYgNDggNTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                  }}
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-500">Registered User</p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                        📧
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                        📱
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Address Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                        📍
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.district || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                        🏠
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Address Line 1</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.address?.line1 ||
                            selectedUser.address?.address1 ||
                            (typeof selectedUser.address === "string"
                              ? selectedUser.address
                              : "N/A")}
                        </p>
                      </div>
                    </div>
                    {(selectedUser.address?.line2 ||
                      selectedUser.address?.address2) && (
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                          🏠
                        </span>
                        <div>
                          <p className="text-sm text-gray-500">
                            Address Line 2
                          </p>
                          <p className="font-medium text-gray-800">
                            {selectedUser.address?.line2 ||
                              selectedUser.address?.address2}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Account Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                        👤
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.gender || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm">
                        🎂
                      </span>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.dob || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setViewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setViewModal(false);
                  handleDeleteUser(selectedUser._id);
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
