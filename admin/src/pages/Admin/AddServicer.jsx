import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader";

const AddServicer = () => {
  const [serImg, setSerImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("Cleaning Services");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [district, setDistrict] = useState("Jaffna");
  const [nicFront, setNicFront] = useState(false);
  const [nicBack, setNicBack] = useState(false);
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);
  const { loading, setLoading } = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!serImg) {
        return toast.error("Servicer Image Not Selected");
      }
      if (!nicFront) {
        return toast.error("NIC Front Image Not Selected");
      }
      if (!nicBack) {
        return toast.error("NIC Back Image Not Selected");
      }
      const formData = new FormData();
      if (serImg) formData.append("image", serImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("experience", experience);
      // formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("district", district);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      if (nicFront) formData.append("nicFront", nicFront);
      if (nicBack) formData.append("nicBack", nicBack);
      if (gender) formData.append("gender", gender);
      if (dob) formData.append("dob", dob);

      //console log formdata
      formData.forEach((value, key) => {
        console.log(`${key}:${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-servicer",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setSerImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setPhone("");
        setAddress1("");
        setAddress2("");
        setAbout("");
        // setFees("");
        setDistrict("");
        setNicFront(false);
        setNicBack(false);
        setGender("");
        setDob("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Add New Servicer
        </h1>
        <p className="text-gray-600">
          Register a new service provider to the platform
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <img
                  src={assets.add_icon}
                  alt=""
                  className="w-6 h-6 filter brightness-0 invert"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Servicer Registration
                </h2>
                <p className="text-blue-100 text-sm">
                  Fill in the details to add a new servicer
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Image Upload Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Profile & Documents
              </h3>

              {/* Profile Image */}
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <label htmlFor="ser-img" className="cursor-pointer group">
                    <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors flex items-center justify-center overflow-hidden">
                      {serImg ? (
                        <img
                          src={URL.createObjectURL(serImg)}
                          alt="Profile Preview"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-center">
                          <img
                            src={assets.upload_area}
                            alt=""
                            className="w-8 h-8 mx-auto mb-1 opacity-50"
                          />
                          <p className="text-xs text-gray-500">Upload</p>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    onChange={(e) => setSerImg(e.target.files[0])}
                    type="file"
                    id="ser-img"
                    hidden
                    accept="image/*"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Profile Picture</p>
                  <p className="text-sm text-gray-500">
                    Upload a clear photo of the servicer
                  </p>
                </div>
              </div>

              {/* NIC Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <label htmlFor="nic-front" className="cursor-pointer group">
                      <div className="w-20 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors flex items-center justify-center overflow-hidden">
                        {nicFront ? (
                          <img
                            src={URL.createObjectURL(nicFront)}
                            alt="NIC Front Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <img
                              src={assets.upload_area}
                              alt=""
                              className="w-6 h-6 mx-auto mb-1 opacity-50"
                            />
                            <p className="text-xs text-gray-500">Upload</p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      onChange={(e) => setNicFront(e.target.files[0])}
                      type="file"
                      id="nic-front"
                      hidden
                      accept="image/*"
                      required
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">NIC Front</p>
                    <p className="text-sm text-gray-500">
                      Upload NIC front image
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <label htmlFor="nic-back" className="cursor-pointer group">
                      <div className="w-20 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors flex items-center justify-center overflow-hidden">
                        {nicBack ? (
                          <img
                            src={URL.createObjectURL(nicBack)}
                            alt="NIC Back Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-center">
                            <img
                              src={assets.upload_area}
                              alt=""
                              className="w-6 h-6 mx-auto mb-1 opacity-50"
                            />
                            <p className="text-xs text-gray-500">Upload</p>
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      onChange={(e) => setNicBack(e.target.files[0])}
                      type="file"
                      id="nic-back"
                      hidden
                      accept="image/*"
                      required
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">NIC Back</p>
                    <p className="text-sm text-gray-500">
                      Upload NIC back image
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servicer Name
                    </label>
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="text"
                      placeholder="Enter servicer name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="email"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      onChange={(e) => setGender(e.target.value)}
                      value={gender}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="tel"
                      placeholder="Enter phone number"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      onChange={(e) => setDob(e.target.value)}
                      value={dob}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      type="date"
                      placeholder="Select date of birth"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience(Years)
                    </label>
                    <select
                      onChange={(e) => setExperience(e.target.value)}
                      value={experience}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialty
                    </label>
                    <select
                      onChange={(e) => setSpeciality(e.target.value)}
                      value={speciality}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Cleaning Services">
                        Cleaning Services
                      </option>
                      <option value="Plumbing Services">
                        Plumbing Services
                      </option>
                      <option value="Electrical Wiring & Repair">
                        Electrical Wiring & Repair
                      </option>
                      <option value="Appliance Repair">Appliance Repair</option>
                      <option value="Interior Painting">
                        Interior Painting
                      </option>
                      <option value="Furniture Repair & Carpentry">
                        Furniture Repair & Carpentry
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available District
                    </label>
                    <select
                      onChange={(e) => setDistrict(e.target.value)}
                      value={district}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Jaffna">Jaffna</option>
                      <option value="Colombo">Colombo</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Address Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1
                  </label>
                  <input
                    onChange={(e) => setAddress1(e.target.value)}
                    value={address1}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="text"
                    placeholder="Enter address line 1"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    type="text"
                    placeholder="Enter address line 2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                About Servicer
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Write about the servicer's skills, experience, and specialties..."
                  rows={5}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader />
                    <span>Adding Servicer...</span>
                  </>
                ) : (
                  <>
                    <img
                      src={assets.add_icon}
                      alt=""
                      className="w-5 h-5 filter brightness-0 invert"
                    />
                    <span>Add Servicer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddServicer;
