"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  MessageSquare,
  User,
  Check,
  Mail,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { format, addDays } from "date-fns";
import { toast } from "sonner";

const timeSlots = [
  { id: 1, time: "11:00", available: true },
  { id: 2, time: "11:30", available: true },
  { id: 3, time: "12:00", available: false },
  { id: 4, time: "12:30", available: true },
  { id: 5, time: "13:00", available: true },
  { id: 6, time: "17:00", available: true },
  { id: 7, time: "17:30", available: true },
  { id: 8, time: "18:00", available: true },
  { id: 9, time: "18:30", available: true },
  { id: 10, time: "19:00", available: true },
];

// Table options - This could come from your backend API
const tableOptions = [
  { id: 1, name: "Table 1", capacity: 2 },
  { id: 2, name: "Table 2", capacity: 4 },
  { id: 3, name: "Table 3", capacity: 4 },
  { id: 4, name: "Table 4", capacity: 6 },
  { id: 5, name: "Table 5", capacity: 8 },
];

export default function Reservations() {
  const NEXT_PUBLIC_API_URL = "http://localhost:5000";
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    specialRequests: "",
    occasion: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reservationData = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: selectedDate,
      time: selectedTime,
      guests: parseInt(formData.guests),
      tableNumber: parseInt(selectedTable),
      specialRequests: formData.specialRequests || "",
      status: "confirmed",
    };

    try {
      const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create reservation");
      }

      const data = await response.json();
      console.log("Reservation successful:", data);

      // Move to confirmation step
      setStep(3);
    } catch (error) {
      console.error("Error making reservation:", error);
      // You might want to add toast notifications here
      toast.error(error.message || "Failed to create reservation");
    }
  };

  // Add these at the top of your component
  const [availableTables, setAvailableTables] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Add this function to check table availability
  const checkTableAvailability = async (date, time) => {
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_URL}/api/available-tables?date=${date}&time=${time}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available tables");
      }

      const data = await response.json();
      setAvailableTables(data);
    } catch (error) {
      console.error("Error checking table availability:", error);
      toast.error("Failed to check table availability");
    }
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setSelectedTime("");
    setSelectedTable("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setSelectedTable("");
    checkTableAvailability(selectedDate, time);
  };

  const filteredTableOptions = tableOptions.filter((table) =>
    availableTables.includes(table.id)
  );

  const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          {...props}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl  mx-auto px-4 py-16">
        <div className="bg-white md:mt-12 rounded-md shadow-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="px-8 py-4 bg-gray-50 border-b">
            <div className="flex justify-between max-w-2xl mx-auto">
              {[
                { num: 1, title: "Date & Time" },
                { num: 2, title: "Details" },
                { num: 3, title: "Confirmation" },
              ].map((s) => (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                      ${
                        step >= s.num
                          ? "bg-amber-400 text-white"
                          : "bg-gray-200"
                      }`}
                  >
                    {s.num}
                  </div>
                  {s.num < 3 && (
                    <div
                      className={`w-24 h-1 mx-2 
                        ${step > s.num ? "bg-amber-400" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                      {[...Array(7)].map((_, i) => {
                        const date = addDays(new Date(), i);
                        const dateStr = format(date, "yyyy-MM-dd");

                        return (
                          <button
                            key={i}
                            onClick={() => handleDateSelect(dateStr)}
                            className={`p-3 rounded-lg border text-center transition-all
                            ${
                              selectedDate === dateStr
                                ? "border-amber-400 bg-amber-50"
                                : "border-gray-200 hover:border-amber-400"
                            }`}
                          >
                            <div className="text-xs text-gray-500">
                              {format(date, "EEE")}
                            </div>
                            <div className="text-lg font-medium">
                              {format(date, "d")}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleTimeSelect(slot.time)}
                          disabled={!slot.available}
                          className={`
                          p-3 rounded-lg border text-center transition-all
                          ${
                            !slot.available
                              ? "opacity-50 cursor-not-allowed bg-gray-50"
                              : ""
                          }
                          ${
                            selectedTime === slot.time
                              ? "border-amber-400 bg-amber-50"
                              : "border-gray-200 hover:border-amber-400"
                          }
                        `}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="px-6 py-2 bg-amber-400 text-white rounded-lg
                        hover:bg-amber-500 transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Name"
                        icon={User}
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />

                      <InputField
                        label="Email"
                        icon={Mail}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />

                      <InputField
                        label="Phone"
                        icon={Phone}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />

                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Guests
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            name="guests"
                            value={formData.guests}
                            onChange={handleInputChange}
                            className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Table Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Table
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredTableOptions.map((table) => (
                          <button
                            key={table.id}
                            type="button"
                            onClick={() => setSelectedTable(table.id)}
                            className={`p-4 rounded-lg border text-center transition-all
        ${
          selectedTable === table.id
            ? "border-amber-400 bg-amber-50"
            : "border-gray-200 hover:border-amber-400"
        }`}
                          >
                            <div className="font-medium">{table.name}</div>
                            <div className="text-sm text-gray-500">
                              {table.capacity} seats
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Requests
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <MessageSquare className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="pl-10 w-full rounded-md border border-gray-300 bg-white py-2 text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="Any dietary restrictions or special requests?"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500"
                      >
                        Confirm Reservation
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-xl font-medium">
                    Reservation Confirmed!
                  </h3>
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500 text-sm">
                          Date & Time
                        </span>
                        <div className="font-medium">
                          {format(new Date(selectedDate), "MMMM d, yyyy")}
                          <br />
                          {selectedTime}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Guests</span>
                        <div className="font-medium">
                          {formData.guests} people
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Name</span>
                        <div className="font-medium">{formData.name}</div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-sm">Contact</span>
                        <div className="font-medium">{formData.email}</div>
                        <div className="text-sm text-gray-500">
                          {formData.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-6 px-6 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500"
                  >
                    Make Another Reservation
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
