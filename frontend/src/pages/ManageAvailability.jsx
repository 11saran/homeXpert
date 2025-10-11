import React, { useContext, useEffect, useState } from "react";
import { ServicerContext } from "../context/ServicerContext";
import { AppContext } from "../context/AppContext";
import ServicerNavbar from "../components/ServicerNavbar";

const ManageAvailability = () => {
  const { servicerData, updateWorkingHours, toggleDayAvailability } =
    useContext(ServicerContext);
  const { loading, setLoading } = useContext(AppContext);
  const [workingHours, setWorkingHours] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (servicerData && servicerData.working_hours) {
      setWorkingHours(servicerData.working_hours);
    }
  }, [servicerData]);

  const handleToggleDay = (day) => {
    const currentDay = workingHours[day];
    toggleDayAvailability(day);
  };

  const handleTimeChange = (day, field, value) => {
    const updatedWorkingHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    };
    setWorkingHours(updatedWorkingHours);
  };

  const handleSaveSchedule = async () => {
    await updateWorkingHours(workingHours);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    if (servicerData && servicerData.working_hours) {
      setWorkingHours(servicerData.working_hours);
    }
    setIsEditing(false);
  };

  if (!servicerData) {
    return (
      <>
        <ServicerNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading availability...</p>
          </div>
        </div>
      </>
    );
  }

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <>
      <ServicerNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Availability
                </h1>
                <p className="text-gray-600 mt-2">
                  Set your working hours for each day of the week
                </p>
              </div>
              <div className="flex gap-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Edit Schedule
                  </button>
                ) : (
                  <>
                    <button
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSchedule}
                      className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Weekly Schedule
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {days.map(({ key, label }) => {
                    const dayData = workingHours[key] || {
                      start: "09:00",
                      end: "18:00",
                      available: false,
                    };
                    return (
                      <tr key={key} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {label}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              dayData.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {dayData.available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="time"
                              value={dayData.start}
                              onChange={(e) =>
                                handleTimeChange(key, "start", e.target.value)
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm"
                              disabled={!dayData.available}
                            />
                          ) : (
                            <span className="text-sm text-gray-900">
                              {dayData.start}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="time"
                              value={dayData.end}
                              onChange={(e) =>
                                handleTimeChange(key, "end", e.target.value)
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm"
                              disabled={!dayData.available}
                            />
                          ) : (
                            <span className="text-sm text-gray-900">
                              {dayData.end}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!isEditing && (
                            <button
                              onClick={() => handleToggleDay(key)}
                              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                                dayData.available
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                            >
                              {dayData.available
                                ? "Make Unavailable"
                                : "Make Available"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  const allDaysSchedule = Object.keys(workingHours).reduce(
                    (acc, day) => ({
                      ...acc,
                      [day]: { start: "09:00", end: "18:00", available: true },
                    }),
                    {}
                  );
                  setWorkingHours(allDaysSchedule);
                  updateWorkingHours(allDaysSchedule);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Make All Days Available
              </button>
              <button
                onClick={() => {
                  const allDaysSchedule = Object.keys(workingHours).reduce(
                    (acc, day) => ({
                      ...acc,
                      [day]: { start: "00:00", end: "00:00", available: false },
                    }),
                    {}
                  );
                  setWorkingHours(allDaysSchedule);
                  updateWorkingHours(allDaysSchedule);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Make All Days Unavailable
              </button>
              <button
                onClick={() => {
                  const weekdaysSchedule = Object.keys(workingHours).reduce(
                    (acc, day) => ({
                      ...acc,
                      [day]: {
                        start: "09:00",
                        end: "18:00",
                        available: !day.includes("sunday"),
                      },
                    }),
                    {}
                  );
                  setWorkingHours(weekdaysSchedule);
                  updateWorkingHours(weekdaysSchedule);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Weekdays Only
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Instructions
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Click "Edit Schedule" to modify start and end times</li>
              <li>
                • Use the "Make Available/Unavailable" buttons to toggle
                individual days
              </li>
              <li>
                • When a day is unavailable, customers won't be able to book
                appointments
              </li>
              <li>
                • Changes are saved automatically when you click "Save Changes"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageAvailability;
