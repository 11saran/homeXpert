import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);

  return (
    <div className="h-full sticky top-0 bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointe ${
                isActive ? "bg-[#ABDEBE] border-r-4 border-primary" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointe ${
                isActive ? "bg-[#ABDEBE] border-r-4 border-primary" : ""
              }`
            }
            to={"/all-appointments"}
          >
            <img src={assets.appointment_icon} alt="" />
            <p>Appointments</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointe ${
                isActive ? "bg-[#ABDEBE] border-r-4 border-primary" : ""
              }`
            }
            to={"/add-servicers"}
          >
            <img src={assets.add_icon} alt="" />
            <p>Add Servicer</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointe ${
                isActive ? "bg-[#ABDEBE] border-r-4 border-primary" : ""
              }`
            }
            to={"/servicers-list"}
          >
            <img src={assets.people_icon} alt="" />
            <p>Servicers List</p>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointe ${
                isActive ? "bg-[#ABDEBE] border-r-4 border-primary" : ""
              }`
            }
            to={"/users-list"}
          >
            <img src={assets.people_icon} alt="" />
            <p>Users List</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
