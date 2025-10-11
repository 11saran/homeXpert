import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const MyProfile = () => {
  const {
    userData,
    setUserData,
    token,
    backendUrl,
    loadUserProfileData,
    loading,
    setLoading,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateUserProfile = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("district", userData.district || "");

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );
      if (data.success) {
        setLoading(true);
        toast.success(data.message);
        await loadUserProfileData().finally(() => setLoading(false));
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      // Handle specific Cloudinary errors
      if (error.response?.data?.message?.includes("File size too large")) {
        toast.error(
          "Image file is too large. Please select an image smaller than 10MB."
        );
      } else if (error.response?.data?.message?.includes("cloudinary")) {
        toast.error(
          "Image upload failed. Please try again with a smaller image."
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "An error occurred while updating profile"
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-lg flex flex-col gap-2 text-sm relative">
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No user data available</p>
          <p className="text-gray-400 text-sm mt-2">
            Please try refreshing the page or logging in again
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm relative">
      {/* Saving overlay */}
      {isSaving && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex justify-center items-center z-10">
          <Loader />
          <p className="font-bold text-primary text-lg text-center ">
            Saving your changes..
          </p>
        </div>
      )}

      {isEdit ? (
        <div>
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEyNS41MjMgMTUwIDE0NSAxMzAuNTIzIDE0NSAxMDVDMTQ1IDc5LjQ3NzEgMTI1LjUyMyA2MCAxMDAgNjBDNzQuNDc3MSA2MCA1NSA3OS40NzcxIDU1IDEwNUM1NSAxMzAuNTIzIDc0LjQ3NzEgMTUwIDEwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMC40OTMgMTIwIDEyMCAxMTAuNDkzIDEyMCAxMDBDMTIwIDg5LjUwNzEgMTEwLjQ5MyA4MCAxMDAgODBDODkuNTA3MSA4MCA4MCA4OS41MDcxIDgwIDEwMEM4MCAxMTAuNDkzIDg5LjUwNzEgMTIwIDEwMCAxMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
                }}
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Check file size (10MB limit)
                  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                  if (file.size > maxSize) {
                    toast.error(
                      "File size too large. Please select an image smaller than 10MB."
                    );
                    e.target.value = ""; // Clear the input
                    return;
                  }

                  // Check file type
                  const allowedTypes = [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                  ];
                  if (!allowedTypes.includes(file.type)) {
                    toast.error(
                      "Please select a valid image file (JPEG, PNG, GIF, or WebP)."
                    );
                    e.target.value = ""; // Clear the input
                    return;
                  }

                  setImage(file);
                }
              }}
              type="file"
              id="image"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              hidden
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Click to change profile picture. Max size: 10MB. Supported formats:
            JPEG, PNG, GIF, WebP
          </p>
        </div>
      ) : (
        <img
          className="w-36 rounded"
          src={userData.image}
          alt="Profile"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTUwQzEyNS41MjMgMTUwIDE0NSAxMzAuNTIzIDE0NSAxMDVDMTQ1IDc5LjQ3NzEgMTI1LjUyMyA2MCAxMDAgNjBDNzQuNDc3MSA2MCA1NSA3OS40NzcxIDU1IDEwNUM1NSAxMzAuNTIzIDc0LjQ3NzEgMTUwIDEwMCAxNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzExMC40OTMgMTIwIDEyMCAxMTAuNDkzIDEyMCAxMDBDMTIwIDg5LjUwNzEgMTEwLjQ5MyA4MCAxMDAgODBDODkuNTA3MSA4MCA4MCA4OS41MDcxIDgwIDEwMEM4MCAxMTAuNDkzIDg5LjUwNzEgMTIwIDEwMCAxMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K";
          }}
        />
      )}

      {isEdit ? (
        <input
          className="bg-gray-100 text-3xl font-medium max-w-65 mt-4"
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      ) : (
        <p className="text-3xl font-medium text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Email id:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-100 max-w-52"
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-100"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, address1: e.target.value },
                  }))
                }
                value={
                  userData.address?.address1 || userData.address?.line1 || ""
                }
                type="text"
                placeholder="Address Line 1"
              />
              <br />
              <input
                className="bg-gray-100 mt-1"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, address2: e.target.value },
                  }))
                }
                value={
                  userData.address?.address2 || userData.address?.line2 || ""
                }
                type="text"
                placeholder="Address Line 2"
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address?.address1 ||
                userData.address?.line1 ||
                (typeof userData.address === "string"
                  ? userData.address
                  : "N/A")}
              <br />
              {userData.address?.address2 || userData.address?.line2 || ""}
            </p>
          )}
          <p className="font-medium">District:</p>
          {isEdit ? (
            <select
              className="max-w-40 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, district: e.target.value }))
              }
              value={userData.district || ""}
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
          ) : (
            <p className="text-gray-500">{userData.district || "N/A"}</p>
          )}
        </div>
      </div>
      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-100"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">FeMale</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-20 bg-gray-100"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>

      <div>
        {isEdit ? (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:text-white transition-all hover:bg-primary disabled:opacity-50"
            onClick={updateUserProfile}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Information"}
          </button>
        ) : (
          <button
            className="border border-primary px-8 py-2 rounded-full hover:text-white transition-all hover:bg-primary"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
