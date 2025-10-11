import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const TopServicers = () => {
  const navigate = useNavigate();
  const { servicers, getImageUrl } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium"> Top Servicers to Book</h1>
      <p className="sm:1/3 text-center text-sm">
        Simply explore our wide range of trusted home service professionals.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {servicers.slice(0, 10).map((item, index) => (
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
                className={`flex items-center gap-2 text-sm font-medium 
                      ${item.available ? "text-green-500" : "text-red-500"}`}
              >
                <p
                  className={`w-2 h-2 rounded-full 
                      ${item.available ? "bg-green-500" : "bg-red-500"}`}
                ></p>
                <p>{item.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium ">{item.name}</p>
              <p className="text-gray-600 text-sm">
                <span className="text-gray-600 font-medium">
                  Available District:
                </span>{" "}
                {""}
                {item.district}
              </p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/servicers");
          scrollTo(0, 0);
        }}
        className="bg-primary text-white px-12 py-3 rounded-full mt-10 font-bold"
      >
        More
      </button>
    </div>
  );
};

export default TopServicers;
