// app/dashboard/admin/reservations/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  Check,
  X,
  Search,
  Plus,
  Filter,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newReservation, setNewReservation] = useState({
    customerName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    tableNumber: "",
    specialRequests: "",
  });

  // Fetch reservations
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reservations`);
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      toast.error("Failed to load reservations");
      console.error("Error loading reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newReservation,
          guests: Number(newReservation.guests),
          tableNumber: Number(newReservation.tableNumber),
          status: "confirmed",
        }),
      });

      if (!response.ok) throw new Error("Failed to create reservation");
      const data = await response.json();
      setReservations([...reservations, data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Reservation created successfully");
    } catch (error) {
      toast.error("Failed to create reservation");
      console.error("Error creating reservation:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      const data = await response.json();
      setReservations(reservations.map((r) => (r._id === id ? data : r)));
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update reservation status");
      console.error("Error updating status:", error);
    }
  };

  const resetForm = () => {
    setNewReservation({
      customerName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: "",
      tableNumber: "",
      specialRequests: "",
    });
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 justify-between md:items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-amber-500" />
          Reservations
        </h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search reservations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredReservations.map((reservation) => (
            <motion.div
              key={reservation._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {reservation.customerName}
                  </h3>
                  <p className="text-gray-600">
                    Table {reservation.tableNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    reservation.status
                  )}`}
                >
                  {reservation.status.charAt(0).toUpperCase() +
                    reservation.status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(reservation.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{reservation.guests} guests</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{reservation.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{reservation.email}</span>
                </div>
              </div>

              {reservation.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {reservation.specialRequests}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() =>
                    handleStatusChange(reservation._id, "confirmed")
                  }
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(reservation._id, "cancelled")
                  }
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Reservation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md m-4"
          >
            <h2 className="text-xl font-semibold mb-4">New Reservation</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Customer Name"
                type="text"
                value={newReservation.customerName}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    customerName: e.target.value,
                  })
                }
                required
              />
              <InputField
                label="Email"
                type="email"
                value={newReservation.email}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    email: e.target.value,
                  })
                }
                required
              />
              <InputField
                label="Phone"
                type="tel"
                value={newReservation.phone}
                onChange={(e) =>
                  setNewReservation({
                    ...newReservation,
                    phone: e.target.value,
                  })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Date"
                  type="date"
                  value={newReservation.date}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      date: e.target.value,
                    })
                  }
                  required
                />
                <InputField
                  label="Time"
                  type="time"
                  value={newReservation.time}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Guests"
                  type="number"
                  value={newReservation.guests}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      guests: e.target.value,
                    })
                  }
                  required
                />
                <InputField
                  label="Table Number"
                  type="number"
                  value={newReservation.tableNumber}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      tableNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows="3"
                  value={newReservation.specialRequests}
                  onChange={(e) =>
                    setNewReservation({
                      ...newReservation,
                      specialRequests: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                  Create Reservation
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const InputField = ({ label, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      required={required}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      value={value}
      onChange={onChange}
    />
  </div>
);
