"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    salary: "",
    startDate: "",
  });

  const [currentStaff, setCurrentStaff] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const staffData = {
        ...newStaff,
        name: newStaff.name || "", // Ensure name is never undefined
        position: newStaff.position || "", // Ensure position is never undefined
        salary: Number(newStaff.salary),
        status: "active",
      };

      const response = await fetch(`${API_URL}/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add staff");
      }

      const data = await response.json();
      setStaff((prev) => [...prev, data]);
      setShowAddModal(false);
      resetForm();
      toast.success("Staff member added successfully");
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(error.message || "Failed to add staff member");
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/staff`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch staff");
      }

      const data = await response.json();
      setStaff(data.data || []); // Handle the response structure correctly
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error(error.message || "Failed to fetch staff data");
    } finally {
      setLoading(false);
    }
  };

  // Update the handleUpdate function
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentStaff) return;

    try {
      const response = await fetch(`${API_URL}/staff/${currentStaff._id}`, {
        method: "PUT", // Changed from PATCH to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentStaff),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update staff");
      }

      const data = await response.json();
      setStaff((prev) =>
        prev.map((s) => (s._id === currentStaff._id ? data.data : s))
      );
      setShowEditModal(false);
      setCurrentStaff(null);
      toast.success("Staff member updated successfully");
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(error.message || "Failed to update staff member");
    }
  };
  useEffect(() => {
    fetchStaff();
  }, []);

  // Update the handleDelete function
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const response = await fetch(`${API_URL}/staff/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete staff");
      }

      setStaff((prev) => prev.filter((s) => s._id !== id));
      toast.success("Staff member deleted successfully");
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(error.message || "Failed to delete staff member");
    }
  };

  // Update the toggleStatus function
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await fetch(`${API_URL}/staff/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const data = await response.json();
      setStaff((prev) => prev.map((s) => (s._id === id ? data.data : s)));
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  const resetForm = () => {
    setNewStaff({
      name: "",
      position: "",
      email: "",
      phone: "",
      salary: "",
      startDate: "",
    });
  };

  const filteredStaff = staff.filter((member) => {
    const nameMatch =
      member?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    const positionMatch =
      member?.position?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      false;
    return nameMatch || positionMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-amber-500" />
          Staff Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search staff by name or position..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStaff.map((member) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Staff Card Content */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-16 w-16 rounded-full border-2 border-amber-500"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentStaff(member);
                      setShowEditModal(true);
                    }}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">
                    ${member.salary.toLocaleString()}/year
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Started {new Date(member.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => toggleStatus(member._id, member.status)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    member.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {member.status.charAt(0).toUpperCase() +
                    member.status.slice(1)}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal Component */}
      <StaffModal
        show={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setCurrentStaff(null);
          resetForm();
        }}
        onSubmit={showEditModal ? handleUpdate : handleSubmit}
        staff={currentStaff}
        setStaff={showEditModal ? setCurrentStaff : setNewStaff}
        isEdit={showEditModal}
      />
    </div>
  );
}
const StaffModal = ({ show, onClose, onSubmit, staff, setStaff, isEdit }) => {
  // Initialize state outside of any conditions
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    salary: "",
    startDate: "",
  });

  // Update form data when staff or show props change
  useEffect(() => {
    if (staff && show) {
      setFormData({
        name: staff.name || "",
        position: staff.position || "",
        email: staff.email || "",
        phone: staff.phone || "",
        salary: staff.salary || "",
        startDate: staff.startDate
          ? new Date(staff.startDate).toISOString().split("T")[0]
          : "",
      });
    } else if (!show) {
      // Reset form when modal closes
      setFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        salary: "",
        startDate: "",
      });
    }
  }, [staff, show]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Update parent state
    setStaff((prev) => ({ ...prev, [field]: value }));
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg p-6 w-full max-w-md m-4"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <input
              type="number"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              {isEdit ? "Update" : "Add"} Staff Member
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, type, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      required={required}
      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
      value={value}
      onChange={onChange}
    />
  </div>
);
