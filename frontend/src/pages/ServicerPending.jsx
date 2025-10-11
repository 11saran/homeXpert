import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ServicerPending = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 10));
      // Poll the backend by reloading token-protected dashboard; if approved, backend will allow access
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");
      if (token && userType === "servicer") {
        // Try navigating; ServicerContext will redirect if approved
        // We use replace to avoid stacking history entries
        navigate("/servicer-dashboard", { replace: true });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto text-center bg-white border rounded-2xl shadow p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
          <span className="text-2xl">⏳</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">
          Your account is pending approval
        </h1>
        <p className="text-gray-600 mb-4">
          Thanks for registering as a servicer. Our admin team is reviewing your
          documents. You’ll be redirected to your dashboard automatically once
          your account is approved.
        </p>
        <p className="text-sm text-gray-500">Auto-checking every ~3s…</p>
      </div>
    </div>
  );
};

export default ServicerPending;
