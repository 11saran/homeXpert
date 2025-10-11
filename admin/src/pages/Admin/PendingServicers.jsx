import React, { useContext, useEffect } from "react";
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
  } = useContext(AdminContext);

  const { loading, setLoading } = useContext(AppContext);

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
                className="flex items-center gap-3 px-6 py-4 hover:bg-gray-100 border-b"
              >
                <img
                  src={item.image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
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
                      <p className="text-sm text-gray-600 mb-1">
                        Fees: <span className="font-medium">₹{item.fees}</span>
                      </p>
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
                        onClick={() => rejectServicer(item._id)}
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
    </div>
  );
};

export default PendingServicers;
