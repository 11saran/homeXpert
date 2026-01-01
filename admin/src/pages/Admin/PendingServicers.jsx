import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loader from "../../components/Loader";

const PendingServicers = () => {
  const {
    aToken,
    getPendingServicers,
    approveServicer,
    rejectServicer,
    pendingServicers,
    getImageUrl,
  } = useContext(AdminContext);

  const { loading, setLoading } = useContext(AppContext);

  const [previewUrl, setPreviewUrl] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedServicerId, setSelectedServicerId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  console.log("Pending Servicers Data:", pendingServicers);

  useEffect(() => {
    if (aToken) {
      setLoading(true);
      getPendingServicers().finally(() => setLoading(false));
    }
  }, [aToken]);

  if (loading) {
    return <Loader />;
  }

  console.log("Rendering PendingServicers. Data:", {
    pendingServicers,
    length: pendingServicers?.length,
    aToken: !!aToken,
  });

  return (
    <div className="m-5">
      <div className="bg-white border rounded-lg">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border">
          <img src={assets.users_icon} alt="" />
          <p className="font-semibold">
            Pending Servicer Registrations ({pendingServicers?.length || 0})
          </p>
        </div>
        <div className="pt-4 border border-t-0">
          {!pendingServicers ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading servicers...</p>
            </div>
          ) : pendingServicers && pendingServicers.length > 0 ? (
            pendingServicers.map((item, index) => (
              <div
                key={index}
                className="relative px-6 py-4 hover:bg-gray-100 border-b"
              >
                {/* Servicer avatar pinned to the top-left corner */}
                <img
                  src={getImageUrl(item.image)}
                  alt="Servicer avatar"
                  className="absolute top-4 left-6 w-16 h-16 rounded-full object-cover border cursor-pointer"
                  onClick={() => setPreviewUrl(getImageUrl(item.image))}
                />
                <div className="flex-1 pl-24">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">{item.email}</p>
                      <p className="text-sm text-gray-600 mb-1">
                        Speciality:{" "}
                        <span className="font-medium">{item.speciality}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Experience:{" "}
                        <span className="font-medium">{item.experience}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Phone: <span className="font-medium">{item.phone}</span>
                      </p>
                      {/* <p className="text-sm text-gray-600 mb-1">
                        Fees: <span className="font-medium">₹{item.fees}</span>
                      </p> */}
                      <p className="text-sm text-gray-600">
                        District:{" "}
                        <span className="font-medium">{item.district}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => approveServicer(item._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedServicerId(item._id);
                          setShowRejectModal(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">About:</span> {item.about}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Address:</span>{" "}
                      {item.address?.address1}, {item.address?.address2}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-medium">NIC Documents:</span>
                    </p>
                    <div className="flex gap-4">
                      {item.nicFront && (
                        <div className="text-center">
                          <img
                            src={`http://localhost:4000/uploads/${item.nicFront}`}
                            alt="NIC Front"
                            className="w-24 h-16 object-cover border rounded cursor-pointer hover:scale-105 transition-transform"
                            onClick={() =>
                              window.open(
                                `http://localhost:4000/uploads/${item.nicFront}`,
                                "_blank"
                              )
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            NIC Front
                          </p>
                        </div>
                      )}
                      {item.nicBack && (
                        <div className="text-center">
                          <img
                            src={`http://localhost:4000/uploads/${item.nicBack}`}
                            alt="NIC Back"
                            className="w-24 h-16 object-cover border rounded cursor-pointer hover:scale-105 transition-transform"
                            onClick={() =>
                              window.open(
                                `http://localhost:4000/uploads/${item.nicBack}`,
                                "_blank"
                              )
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">NIC Back</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Registration Date:{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No pending servicer registrations
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Image Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl("")}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full w-8 h-8 shadow flex items-center justify-center"
              onClick={() => setPreviewUrl("")}
              aria-label="Close preview"
            >
              ✕
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="rounded-lg shadow-2xl object-contain max-w-[90vw] max-h-[90vh]"
            />
          </div>
        </div>
      )}
      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Reject Servicer Registration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejection. This will be sent to the
              servicer via email.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
              required
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedServicerId(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (rejectionReason.trim()) {
                    rejectServicer(selectedServicerId, rejectionReason.trim());
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedServicerId(null);
                  }
                }}
                disabled={!rejectionReason.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingServicers;
