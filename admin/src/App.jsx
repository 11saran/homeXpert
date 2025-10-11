import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointment from "./pages/Admin/AllAppointment";
import AddServicer from "./pages/Admin/AddServicer";
import ServicersList from "./pages/Admin/ServicersList";
import UsersList from "./pages/Admin/UsersList";
import PendingServicers from "./pages/Admin/PendingServicers";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start h-[calc(100vh-64px)]">
        <div className="w-72 shrink-0 h-full">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto h-full">
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointment />} />
            <Route path="/add-servicers" element={<AddServicer />} />
            <Route path="/servicers-list" element={<ServicersList />} />
            <Route path="/users-list" element={<UsersList />} />
            <Route path="/pending-servicers" element={<PendingServicers />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
