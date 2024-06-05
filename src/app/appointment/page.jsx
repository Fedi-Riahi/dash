"use client";
import React, { useEffect, useState } from "react";
import withAuth from "@/utils/withAuth";
// Define the Appointments component
function Appointments() {
  // State variables
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  // Fetch appointments and services data
  const fetchAppointments = async () => {
    try {
      const appointmentResponse = await fetch("/api/appointment");
      const serviceResponse = await fetch("/api/service");

      if (!appointmentResponse.ok || !serviceResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const appointmentData = await appointmentResponse.json();
      const serviceData = await serviceResponse.json();

      setAppointments(appointmentData.appointments);
      setServices(serviceData.services);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Utility functions
  const getServiceName = (serviceId) => {
    const service = services.find((s) => s.services.some((subService) => subService._id === serviceId));
    return service ? service.services.find((subService) => subService._id === serviceId).name : "Service Not Found";
  };



  // Function to handle status change
  const changeStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`/api/appointment/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      fetchAppointments(); // Fetch updated appointments

      // Get the updated appointment details
      const updatedAppointment = appointments.find(app => app._id === appointmentId);

      // Send email notification if status changed to Confirmed or Declined
      if (newStatus === "Confirmed" || newStatus === "Declined") {
        await fetch(`/api/sendEmail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: updatedAppointment.email, status: newStatus, phoneNumber: updatedAppointment.phoneNumber }),
        });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Function to delete an appointment
  const deleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointment/${appointmentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      fetchAppointments();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <div className="flex items-center justify-between my-4">
        <h1 className="text-xl font-bold mb-4">Appointments Management</h1>
        {!showAppointmentForm && (
          <button
            onClick={() => setShowAppointmentForm(true)}
            className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9]"
          >
            Add Appointment
          </button>
        )}
      </div>

      {showAppointmentForm && <AppointmentForm />}

      {!showAppointmentForm && (
        <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                {/* Checkbox */}
                {/* Place your checkbox input here */}
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Car VIN
              </th>
              <th scope="col" className="px-6 py-3">
                Service Type
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Date
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : appointments && appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">{/* Checkbox input */}</td>
                  <td className="px-6 py-4 flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.firstName} {appointment.lastName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {appointment.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{appointment.phoneNumber}</td>
                  <td className="px-6 py-4">{appointment.carVIN}</td>
                  <td className="px-6 py-4">
                    {appointment.services.map((serviceId) => (
                      <div key={serviceId}>{getServiceName(serviceId)}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4">{appointment.selectedDate} - {appointment.selectedTime}</td>
                  <td className="px-6 py-4">
                    <select
                      value={appointment.status}
                      onChange={(e) => changeStatus(appointment._id, e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color: appointment.status === "Confirmed" ? "#0F9D58" : "#000",
                        }}
                        value="Confirmed"
                      >
                        Confirmed
                      </option>
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color: appointment.status === "Pending" ? "#FFD33D" : "#000",
                        }}
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        style={{
                          backgroundColor: "#fff",
                          color: appointment.status === "Declined" ? "#DB4437" : "#000",
                        }}
                        value="Declined"
                      >
                        Declined
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      className="inline-flex items-start px-4 py-2 rounded-md shadow-sm text-sm font-medium text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default withAuth(Appointments);
