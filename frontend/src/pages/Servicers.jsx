import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { specialityData } from "../assets/assets";

const Servicers = () => {
  const { speciality = "_", location = "_" } = useParams();
  const [filterServicers, setFilterServicers] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { servicers, getImageUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const applyFilter = () => {
    let filtered = [...servicers];

    if (speciality !== "_") {
      filtered = filtered.filter(
        (servicer) => servicer.speciality === speciality
      );
    }

    if (location !== "_") {
      filtered = filtered.filter((servicer) => servicer.district === location);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (servicer) =>
          servicer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          servicer.speciality
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          servicer.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilterServicers(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [servicers, speciality, location, searchTerm]);

  const buildPath = (newSpeciality, newLocation) => {
    const s = newSpeciality === "_" ? null : newSpeciality;
    const l = newLocation === "_" ? null : newLocation;

    if (!s && !l) return "/servicers";
    if (s && !l) return `/servicers/${s}`;
    if (!s && l) return `/servicers/_/${l}`;
    return `/servicers/${s}/${l}`;
  };

  return (
    <div>
      <p className="font-semibold">Browse through the servicers specialist.</p>

      {/* Search Bar */}
      <div className="mt-5 mb-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Search servicers by name, speciality, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border  rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col  gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <h3 className="font-medium text-gray-900">Speciality</h3>
          {specialityData.map((item) => (
            <p
              key={item.speciality}
              onClick={() => navigate(buildPath(item.speciality, location))}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === item.speciality ? "bg-primary  text-white" : ""
              }`}
            >
              {item.speciality}
            </p>
          ))}
          <p
            onClick={() => navigate(buildPath("_", location))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer ${
              speciality === "_"
                ? "bg-primary text-white border-gray-300"
                : "border-red-300 text-red-600"
            }`}
          >
            Clear Speciality Filter
          </p>

          <h3 className="font-medium text-gray-900 mt-4">Location</h3>
          {["Colombo", "Jaffna"].map((dist) => (
            <p
              key={dist}
              onClick={() => navigate(buildPath(speciality, dist))}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                location === dist ? "bg-primary text-white" : ""
              }`}
            >
              {dist}
            </p>
          ))}
          <p
            onClick={() => navigate(buildPath(speciality, "_"))}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border rounded transition-all cursor-pointer mt-1 ${
              location === "_"
                ? "bg-primary text-white border-gray-300"
                : "border-red-300 text-red-600"
            }`}
          >
            Clear Location Filter
          </p>
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterServicers.length > 0 ? (
            filterServicers.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  if (item.available) navigate(`/booking/${item._id}`);
                }}
                className={`border border-gray-300 rounded-xl overflow-hidden transition-all duration-500 
                  ${
                    item.available
                      ? "cursor-pointer hover:translate-y-[-10px]"
                      : "cursor-not-allowed opacity-60"
                  }`}
              >
                <img
                  src={
                    item.image
                      ? getImageUrl(item.image)
                      : "/placeholder-service.jpg"
                  }
                  alt=""
                  className="bg-blue-50 hover:bg-primary w-full h-64 object-cover"
                />
                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${
                      item.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <p
                      className={`w-2 h-2 rounded-full ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></p>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium ">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="text-gray-600 font-medium">
                      Available District:
                    </span>{" "}
                    {item.district}
                  </p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10 justify-center items-center">
              <p className="text-gray-500">
                No servicers found matching your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Servicers;
