import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [userType, setUserType] = useState("user"); // "user" or "servicer"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Servicer specific fields
  const [speciality, setSpeciality] = useState("");
  const [experience, setExperience] = useState("");
  const [about, setAbout] = useState("");
  const [district, setDistrict] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [nicFront, setNicFront] = useState(null);
  const [nicBack, setNicBack] = useState(null);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        if (userType === "user") {
          // User registration
          const { data } = await axios.post(backendUrl + "/api/user/register", {
            name,
            password,
            email,
            address: {
              address1,
              address2,
            },
            district,
            gender,
            dob,
            phone,
          });
          if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
          } else {
            toast.error(data.message);
          }
        } else {
          // Servicer registration
          const formData = new FormData();
          formData.append("name", name);
          formData.append("password", password);
          formData.append("email", email);
          formData.append("address", JSON.stringify({ address1, address2 }));
          formData.append("gender", gender);
          formData.append("dob", dob);
          formData.append("phone", phone);
          formData.append("speciality", speciality);
          formData.append("experience", experience);
          formData.append("about", about);
          formData.append("district", district);

          if (profileImage) {
            formData.append("profileImage", profileImage);
          }
          if (nicFront) {
            formData.append("nicFront", nicFront);
          }
          if (nicBack) {
            formData.append("nicBack", nicBack);
          }

          const { data } = await axios.post(
            backendUrl + "/api/servicer/register",
            formData
          );
          if (data.success) {
            toast.success(data.message);
            // Reset form after successful registration
            setName("");
            setEmail("");
            setPassword("");
            setAddress1("");
            setAddress2("");
            setGender("");
            setDob("");
            setPhone("");
            setSpeciality("");
            setExperience("");
            setAbout("");
            setDistrict("");
            setProfileImage(null);
            setNicFront(null);
            setNicBack(null);
          } else {
            toast.error(data.message);
          }
        }
      } else {
        // Login for both user and servicer
        if (userType === "user") {
          const { data } = await axios.post(backendUrl + "/api/user/login", {
            password,
            email,
          });
          if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userType", "user");
            setToken(data.token);
            toast.success("Login successful! Welcome back.");
            // User stays on customer website
          } else {
            toast.error(data.message);
          }
        } else {
          const { data } = await axios.post(
            backendUrl + "/api/servicer/login",
            {
              password,
              email,
            }
          );
          if (data.success) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userType", "servicer");
            setToken(data.token);
            toast.success("Login successful! Redirecting to dashboard...");
            // Redirect servicer to their dashboard
            setTimeout(() => {
              window.location.href = "/servicer-dashboard";
            }, 1500);
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 400) {
        toast.error("Invalid data provided. Please check all fields.");
      } else if (error.code === "ECONNREFUSED" || !error.response) {
        toast.error(
          "Cannot connect to server. Please check if backend is running."
        );
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
      <form onSubmit={onSubmitHandler} className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {state === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-600">
              {state === "Sign Up" ? "Join us as a" : "Login as"}{" "}
              <span className="font-medium text-indigo-600">
                {userType === "user" ? "customer" : "servicer"}
              </span>
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  userType === "user"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                onClick={() => setUserType("user")}
              >
                👤 Customer
              </button>
              <button
                type="button"
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  userType === "servicer"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                onClick={() => setUserType("servicer")}
              >
                🔧 Servicer
              </button>
            </div>
          </div>
          {state === "Sign Up" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1
                    </label>
                    <input
                      onChange={(e) => setAddress1(e.target.value)}
                      value={address1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      type="text"
                      placeholder="Street address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      onChange={(e) => setAddress2(e.target.value)}
                      value={address2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      type="text"
                      placeholder="Apartment, suite, etc."
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    onChange={(e) => setDistrict(e.target.value)}
                    value={district}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value="">Select District</option>
                    <option value="Colombo">Colombo</option>
                    <option value="Gampaha">Gampaha</option>
                    <option value="Kalutara">Kalutara</option>
                    <option value="Kandy">Kandy</option>
                    <option value="Matale">Matale</option>
                    <option value="Nuwara Eliya">Nuwara Eliya</option>
                    <option value="Galle">Galle</option>
                    <option value="Matara">Matara</option>
                    <option value="Hambantota">Hambantota</option>
                    <option value="Jaffna">Jaffna</option>
                    <option value="Kilinochchi">Kilinochchi</option>
                    <option value="Mannar">Mannar</option>
                    <option value="Vavuniya">Vavuniya</option>
                    <option value="Mullaitivu">Mullaitivu</option>
                    <option value="Batticaloa">Batticaloa</option>
                    <option value="Ampara">Ampara</option>
                    <option value="Trincomalee">Trincomalee</option>
                    <option value="Kurunegala">Kurunegala</option>
                    <option value="Puttalam">Puttalam</option>
                    <option value="Anuradhapura">Anuradhapura</option>
                    <option value="Polonnaruwa">Polonnaruwa</option>
                    <option value="Badulla">Badulla</option>
                    <option value="Monaragala">Monaragala</option>
                    <option value="Ratnapura">Ratnapura</option>
                    <option value="Kegalle">Kegalle</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      onChange={(e) => setGender(e.target.value)}
                      value={gender}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      type="date"
                      onChange={(e) => setDob((prev) => e.target.value)}
                      value={dob}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,10}$/.test(value)) {
                        setPhone(value);
                      }
                    }}
                    value={phone}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    type="tel"
                    placeholder="Enter phone number"
                    maxLength={10}
                    required
                  />
                </div>

                {/* Servicer-specific fields */}
                {userType === "servicer" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Speciality
                        </label>
                        <select
                          onChange={(e) => setSpeciality(e.target.value)}
                          value={speciality}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        >
                          <option value="">Select Speciality</option>
                          <option value="Plumbing Services">
                            🔧 Plumbing Services
                          </option>
                          <option value="Electrical Wiring & Repair">
                            ⚡ Electrical Wiring & Repair
                          </option>
                          <option value="Cleaning Services">
                            🧹 Cleaning Services
                          </option>
                          <option value="Interior Painting">
                            🎨 Interior Painting
                          </option>
                          <option value="Appliance Repair">
                            🔨 Appliance Repair
                          </option>
                          <option value="Furniture Repair & Carpentry">
                            🛠️ Furniture Repair & Carpentry
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience (Years)
                        </label>
                        <input
                          onChange={(e) => setExperience(e.target.value)}
                          value={experience}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          type="number"
                          placeholder="Years of Experience"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available District
                        </label>
                        <select
                          onChange={(e) => setDistrict(e.target.value)}
                          value={district}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                        >
                          <option value="">Select Available District</option>
                          <option value="Colombo">🏙️ Colombo</option>
                          <option value="Jaffna">🏛️ Jaffna</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          About Yourself
                        </label>
                        <textarea
                          onChange={(e) => setAbout(e.target.value)}
                          value={about}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none"
                          rows="3"
                          placeholder="Brief description about your work..."
                          required
                        />
                      </div>
                    </div>

                    {/* Profile Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📸 Profile Photo
                      </label>
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-2">
                            {profileImage ? (
                              <img
                                src={URL.createObjectURL(profileImage)}
                                alt="Profile Preview"
                                className="w-24 h-24 object-cover border rounded-full"
                              />
                            ) : (
                              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-gray-400 text-sm">
                                  📸
                                </span>
                              </div>
                            )}
                          </div>
                          <label
                            htmlFor="profile-image"
                            className="cursor-pointer"
                          >
                            <input
                              type="file"
                              id="profile-image"
                              accept="image/*"
                              onChange={(e) =>
                                setProfileImage(e.target.files[0])
                              }
                              className="hidden"
                              required
                            />
                            <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                              {profileImage
                                ? "Change Profile Photo"
                                : "Upload Profile Photo"}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* NIC Upload Section */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📄 NIC Front Image
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex flex-col items-center text-center">
                            <div className="mb-2">
                              {nicFront ? (
                                <img
                                  src={URL.createObjectURL(nicFront)}
                                  alt="NIC Front Preview"
                                  className="w-24 h-20 object-cover border rounded"
                                />
                              ) : (
                                <div className="w-24 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">
                                    📸
                                  </span>
                                </div>
                              )}
                            </div>
                            <label
                              htmlFor="nic-front"
                              className="cursor-pointer"
                            >
                              <input
                                type="file"
                                id="nic-front"
                                accept="image/*"
                                onChange={(e) => setNicFront(e.target.files[0])}
                                className="hidden"
                                required
                              />
                              <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                {nicFront ? "Change Image" : "Upload NIC Front"}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📄 NIC Back Image
                        </label>
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex flex-col items-center text-center">
                            <div className="mb-2">
                              {nicBack ? (
                                <img
                                  src={URL.createObjectURL(nicBack)}
                                  alt="NIC Back Preview"
                                  className="w-24 h-20 object-cover border rounded"
                                />
                              ) : (
                                <div className="w-24 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                                  <span className="text-gray-400 text-sm">
                                    📸
                                  </span>
                                </div>
                              )}
                            </div>
                            <label
                              htmlFor="nic-back"
                              className="cursor-pointer"
                            >
                              <input
                                type="file"
                                id="nic-back"
                                accept="image/*"
                                onChange={(e) => setNicBack(e.target.files[0])}
                                className="hidden"
                                required
                              />
                              <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                {nicBack ? "Change Image" : "Upload NIC Back"}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                type="email"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg transform hover:scale-105 mt-5"
          >
            {state === "Sign Up" ? "✨ Create Account" : "🚀 Login"}
          </button>

          <div className="text-center">
            {state === "Sign Up" ? (
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700 font-medium underline transition-colors duration-200"
                  onClick={() => setState("Login")}
                >
                  Login Here
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-indigo-600 hover:text-indigo-700 font-medium underline transition-colors duration-200"
                  onClick={() => setState("Sign Up")}
                >
                  Create Account
                </button>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
