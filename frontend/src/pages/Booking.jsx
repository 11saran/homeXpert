import React, { useContext, useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedServicers from "../components/RelatedServicers";
import { toast } from "react-toastify";
import axios from "axios";

const Booking = () => {
  const navigate = useNavigate();

  const { serId } = useParams();
  const {
    servicers,
    currencySympol,
    backendUrl,
    token,
    getServicerData,
    getImageUrl,
  } = useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [serInfo, setSerInfo] = useState(null);
  const [serSlots, setSerSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  const fetchSerInfo = () => {
    const serInfo = servicers.find((ser) => ser._id === serId);
    setSerInfo(serInfo);
  };

  const getAvailableSlots = async () => {
    setSerSlots([]);
    if (!serInfo || !serInfo.working_hours) return;

    //Getting current date
    let today = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    for (let i = 0; i < 7; i++) {
      //Getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Get day name for checking availability
      const dayName = dayNames[currentDate.getDay()];
      const daySchedule = serInfo.working_hours[dayName];

      // Skip if servicer is not available on this day
      if (!daySchedule || !daySchedule.available) {
        setSerSlots((prev) => [...prev, []]);
        continue;
      }

      // Parse start and end times
      const [startHour, startMin] = daySchedule.start.split(":").map(Number);
      const [endHour, endMin] = daySchedule.end.split(":").map(Number);

      //Setting start time
      let slotTime = new Date(currentDate);
      slotTime.setHours(startHour, startMin, 0, 0);

      //Setting end time
      let endTime = new Date(currentDate);
      endTime.setHours(endHour, endMin, 0, 0);

      // If it's today, don't show past times
      if (today.getDate() === currentDate.getDate()) {
        const now = new Date();
        if (slotTime < now) {
          slotTime = new Date(now);
          slotTime.setMinutes(Math.ceil(slotTime.getMinutes() / 30) * 30);
          slotTime.setSeconds(0);
        }
      }

      let timeSlots = [];
      while (slotTime < endTime) {
        let formattedTime = slotTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = slotTime.getDate();
        let month = slotTime.getMonth() + 1;
        let year = slotTime.getFullYear();

        const slotDate = day + "/" + month + "/" + year;
        const slotTimeStr = formattedTime;

        const isSlotAvailable =
          serInfo.slots_booked[slotDate] &&
          serInfo.slots_booked[slotDate].includes(slotTimeStr)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(slotTime),
            time: formattedTime,
          });
        }

        //increment time by 30 minutes
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }
      setSerSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    // Validation
    if (!address.trim()) {
      toast.error("Please enter the service address");
      return;
    }

    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const date = serSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "/" + month + "/" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { serId, slotDate, slotTime, description, address },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getServicerData();
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchSerInfo();
  }, [servicers, serId]);

  useEffect(() => {
    getAvailableSlots();
  }, [serInfo]);

  useEffect(() => {
    console.log(serSlots);
  }, [serSlots]);
  return (
    serInfo && (
      <div>
        {/* Servicers Detail */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="border bg-primary border-gray-400 w-full sm:max-w-72 rounded-lg "
              src={
                serInfo.image
                  ? getImageUrl(serInfo.image)
                  : "/placeholder-service.jpg"
              }
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {serInfo.name}{" "}
              <img className="w-5 " src={assets.verified_icon} alt="" />
            </p>
            <p className="text-gray-600 text-sm">
              <span className="text-gray-600 font-medium">
                Available District:
              </span>{" "}
              {""}
              {serInfo.district}
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>{serInfo.speciality}</p>
              <button className="py-0.5 px-2 border  border-gray-300 text-xs rounded-full">
                {serInfo.experience} Years
              </button>
            </div>

            {/* About Servicer */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[-700px] mt-1">
                {serInfo.about}
              </p>
            </div>
            {/* <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600">
                {currencySympol}
                {serInfo.fees}
              </span>
            </p> */}
          </div>
        </div>
        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {serSlots.length &&
              serSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div className="flex items-center gap-2 w-full overflow-x-scroll mt-4 ">
            {serSlots.length &&
              serSlots[slotIndex].map((item, index) => (
                <p
                  key={index}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {" "}
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          {/* Description and Address Fields */}
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description{" "}
                <span className="text-gray-500">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                rows="3"
                placeholder="Describe the service you need..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter the address where service is needed..."
                required
              />
            </div>
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an Appointment
          </button>
        </div>

        {/* Listing Related Servicers */}

        <RelatedServicers serId={serId} speciality={serInfo.speciality} />
      </div>
    )
  );
};

export default Booking;
