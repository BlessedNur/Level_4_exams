// app/dashboard/admin/menu/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Search, Edit2, Trash2, Filter, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const categories = ["All", "Starters", "Main Course", "Desserts", "Beverages"];

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "Main Course",
    price: "",
    status: "available",
    dietary: [],
    image: "",
  });

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menu`);
      if (!response.ok) throw new Error("Failed to fetch menu items");
      const data = await response.json();
      console.log(data);

      setMenuItems(data.data);
    } catch (error) {
      toast.error("Failed to load menu items");
      console.error("Error loading menu items:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error("Failed to add menu item");
      const data = await response.json();

      // Make sure the new item has all required properties
      const formattedItem = {
        _id: data._id,
        name: data.name || "",
        description: data.description || "",
        category: data.category || "Main Course",
        price: data.price || 0,
        status: data.status || "available",
        dietary: data.dietary || [],
        image: data.image || "",
      };

      setMenuItems((prevItems) => [...prevItems, formattedItem]);
      setShowAddModal(false);
      resetForm();
      toast.success("Menu item added successfully");
    } catch (error) {
      toast.error("Failed to add menu item");
      console.error("Error adding menu item:", error);
    }
  };

  const handleEditItem = async () => {
    if (!currentItem) return;

    try {
      const response = await fetch(`${API_URL}/menu/${currentItem._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentItem),
      });

      if (!response.ok) throw new Error("Failed to update menu item");
      const data = await response.json();
      setMenuItems(
        menuItems.map((item) => (item._id === data._id ? data : item))
      );
      setShowEditModal(false);
      setCurrentItem(null);
      toast.success("Menu item updated successfully");
    } catch (error) {
      toast.error("Failed to update menu item");
      console.error("Error updating menu item:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete menu item");
      setMenuItems(menuItems.filter((item) => item._id !== id));
      toast.success("Menu item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error("Error deleting menu item:", error);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (!item || typeof item !== "object") return false;

    const matchesSearch = item.name
      ? item.name.toString().toLowerCase().includes(searchTerm.toLowerCase())
      : false;

    const matchesCategory = item.category
      ? selectedCategory === "All" || item.category === selectedCategory
      : false;

    return matchesSearch && matchesCategory;
  });

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "available" ? "out_of_stock" : "available";
      const response = await fetch(`${API_URL}/menu-items/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");
      const data = await response.json();
      setMenuItems(menuItems.map((item) => (item._id === id ? data : item)));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };
  const resetForm = () => {
    setNewItem({
      name: "",
      description: "",
      category: "Main Course",
      price: "",
      status: "available",
      dietary: [],
      image: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          Add New Item
        </button>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    width={"100%"}
                    height={"100%"}
                    className="w-28 rounded-sm"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => {
                      setCurrentItem(item);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-100 rounded"
                    onClick={() => handleDeleteItem(item._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleStatusToggle(item._id, item.status)}
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.status === "available" ? "Available" : "Out of Stock"}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Add/Edit Item Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black -top-10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold mb-4">
              {showAddModal ? "Add New Menu Item" : "Edit Menu Item"}
            </h2>
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Name"
                  value={showAddModal ? newItem.name : currentItem?.name}
                  onChange={(e) =>
                    showAddModal
                      ? setNewItem({ ...newItem, name: e.target.value })
                      : setCurrentItem({ ...currentItem, name: e.target.value })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    value={
                      showAddModal ? newItem.category : currentItem?.category
                    }
                    onChange={(e) =>
                      showAddModal
                        ? setNewItem({ ...newItem, category: e.target.value })
                        : setCurrentItem({
                            ...currentItem,
                            category: e.target.value,
                          })
                    }
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={
                    showAddModal
                      ? newItem.description
                      : currentItem?.description
                  }
                  onChange={(e) =>
                    showAddModal
                      ? setNewItem({ ...newItem, description: e.target.value })
                      : setCurrentItem({
                          ...currentItem,
                          description: e.target.value,
                        })
                  }
                  placeholder="Enter item description..."
                />
              </div>

              {/* Price and Featured Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Price"
                  type="number"
                  step="0.01"
                  value={showAddModal ? newItem.price : currentItem?.price}
                  onChange={(e) =>
                    showAddModal
                      ? setNewItem({
                          ...newItem,
                          price: parseFloat(e.target.value),
                        })
                      : setCurrentItem({
                          ...currentItem,
                          price: parseFloat(e.target.value),
                        })
                  }
                />
              </div>

              {/* Dietary Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Requirements
                </label>
                <div className="flex flex-wrap gap-3">
                  {["V", "VG", "GF", "DF", "N"].map((diet) => (
                    <label key={diet} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        checked={
                          showAddModal
                            ? newItem.dietary?.includes(diet)
                            : currentItem?.dietary?.includes(diet)
                        }
                        onChange={(e) => {
                          const updateDietary = (item) => {
                            const dietary = item.dietary || [];
                            return e.target.checked
                              ? [...dietary, diet]
                              : dietary.filter((d) => d !== diet);
                          };

                          showAddModal
                            ? setNewItem({
                                ...newItem,
                                dietary: updateDietary(newItem),
                              })
                            : setCurrentItem({
                                ...currentItem,
                                dietary: updateDietary(currentItem),
                              });
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        {diet === "V"
                          ? "Vegetarian"
                          : diet === "VG"
                          ? "Vegan"
                          : diet === "GF"
                          ? "Gluten-Free"
                          : diet === "DF"
                          ? "Dairy-Free"
                          : "Contains Nuts"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={showAddModal ? newItem.image : currentItem?.image}
                  onChange={(e) =>
                    showAddModal
                      ? setNewItem({ ...newItem, image: e.target.value })
                      : setCurrentItem({
                          ...currentItem,
                          image: e.target.value,
                        })
                  }
                  placeholder="Enter image URL..."
                />
              </div>

              {/* Image Preview */}
              {(showAddModal ? newItem.image : currentItem?.image) && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={showAddModal ? newItem.image : currentItem?.image}
                    alt="Item preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "placeholder-image-url.jpg";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    showAddModal
                      ? setShowAddModal(false)
                      : setShowEditModal(false);
                    showAddModal && resetForm();
                    !showAddModal && setCurrentItem(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                  onClick={showAddModal ? handleAddItem : handleEditItem}
                >
                  {showAddModal ? "Add Item" : "Save Changes"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const InputField = ({ label, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
      {...props}
    />
  </div>
);
