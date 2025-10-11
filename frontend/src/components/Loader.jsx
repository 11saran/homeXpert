// components/Loader.jsx
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Loader = () => {
  const { loading } = useContext(AppContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-60 flex justify-center items-center z-50">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
