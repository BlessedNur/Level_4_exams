"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Wine,
  Coffee,
  Cake,
  UtensilsCrossed,
  Soup,
  Star,
  X,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const categories = [
  { name: "All", icon: UtensilsCrossed },
  { name: "Starters", icon: Soup },
  { name: "Main Course", icon: UtensilsCrossed },
  { name: "Desserts", icon: Cake },
  { name: "Wines", icon: Wine },
  { name: "Beverages", icon: Coffee },
];
// MenuDetailPopup Component
const API_URL = "http://localhost:5000/api";
function MenuDetailPopup({ item, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "card",
  });

  const handleQuantityChange = (delta) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddToOrder = () => {
    setShowUserDetails(true);
  };
  const handleSubmitOrder = async (e) => {
    e.preventDefault(); // Always prevent default form submission

    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.address
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phoneRegex = /\d{9,}/;
    if (!phoneRegex.test(userDetails.phone)) {
      toast.error("Please enter a valid phone number (at least 9 digits)");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        customerName: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
        items: [
          {
            name: item.name,
            price: item.price,
            quantity: quantity,
          },
        ],
        total: item.price * quantity,
        specialInstructions: specialInstructions || "",
        type: "delivery",
        paymentMethod: userDetails.paymentMethod,
        paymentStatus: "pending", // Add this as it's required by the schema
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const data = await response.json();
      toast.success(`Order #${data.orderNumber} placed successfully!`);
      onClose();

      // Reset form
      setQuantity(1);
      setSpecialInstructions("");
      setShowUserDetails(false);
      setUserDetails({
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "card",
      });
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 top-0 h-full w-full z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full h-[90vh] max-w-2xl bg-white rounded-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {!showUserDetails ? (
              <>
                <div className="relative h-64 md:h-80">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <div className="absolute top-4 left-4 bg-amber-400 text-white px-4 py-2 rounded-md text-sm">
                      Chef's Special
                    </div>
                  )}
                </div>

                <div className="p-6 overflow-y-scroll h-[45vh] space-y-6">
                  {/* Item Details Section */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-light tracking-wide text-gray-900">
                        {item.name}
                      </h2>
                      <span className="text-xl font-medium text-amber-600">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>

                  {/* Dietary Tags */}
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.dietary.map((diet) => (
                        <span
                          key={diet}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Quantity:</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-2">
                    <label
                      htmlFor="instructions"
                      className="block text-gray-600"
                    >
                      Special Instructions
                    </label>
                    <textarea
                      id="instructions"
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      placeholder="Any special requests?"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>

                  {/* Total and Add to Order Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      <span className="text-gray-600">Total Amount</span>
                      <p className="text-2xl font-medium text-gray-900">
                        ${(item.price * quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={handleAddToOrder}
                      className="flex items-center space-x-2 px-6 py-3 bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // User Details Form
              <form onSubmit={handleSubmitOrder} className=" h-full space-y-6">
                {" "}
                <div className="p-6 overflow-y-scroll h-full space-y-6">
                  <h2 className="text-2xl font-light tracking-wide text-gray-900">
                    Complete Your Order
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-gray-600">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleUserDetailsChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleUserDetailsChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-600">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={userDetails.phone}
                        onChange={handleUserDetailsChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Your phone number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-600">
                        Delivery Address
                      </label>
                      <textarea
                        name="address"
                        value={userDetails.address}
                        onChange={handleUserDetailsChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                        placeholder="Your delivery address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-600">
                        Payment Method
                      </label>
                      <select
                        name="paymentMethod"
                        value={userDetails.paymentMethod}
                        onChange={handleUserDetailsChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                      >
                        <option value="card">Credit/Debit Card</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="paypal">PayPal</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="space-y-1">
                      <span className="text-gray-600">Total Amount</span>
                      <p className="text-2xl font-medium text-gray-900">
                        ${(item.price * quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-x-4">
                      <button
                        type="button" // Add type="button" to prevent form submission
                        onClick={() => setShowUserDetails(false)}
                        className="px-6 py-3 border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit" // Keep only type="submit", remove onClick handler
                        disabled={isSubmitting}
                        className={`px-6 py-3 bg-amber-400 text-white rounded-md transition-colors
            ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-amber-500"
            }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <span className="animate-spin">...</span>
                            <span>Placing Order...</span>
                          </div>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Menu() {
  const [isLoading, setLoading] = useState(false);
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
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDietary, setShowDietary] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [isStaff, setIsStaff] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      (searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedDietary.length === 0 ||
        selectedDietary.every((diet) => item.dietary.includes(diet)))
  );

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[40vh] bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop&q=60')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wider">
              Our Menu
            </h1>
            <p className="text-lg text-white/80 font-light tracking-wide max-w-2xl mx-auto px-4">
              Experience our carefully curated selection of dishes, crafted with
              passion and precision
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-12">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-b border-gray-200 focus:border-amber-400 
                focus:outline-none bg-transparent text-gray-800 placeholder-gray-500"
            />
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button
            onClick={() => setShowDietary(!showDietary)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-full
              hover:border-amber-400 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Dietary Requirements</span>
          </button>
        </div>

        {/* Dietary Filters */}
        <AnimatePresence>
          {showDietary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                {["V", "VG", "GF", "DF", "NF"].map((diet) => (
                  <button
                    key={diet}
                    onClick={() => {
                      setSelectedDietary((prev) =>
                        prev.includes(diet)
                          ? prev.filter((d) => d !== diet)
                          : [...prev, diet]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedDietary.includes(diet)
                        ? "bg-amber-400 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-amber-400"
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Navigation */}
        <nav className="flex mb-12">
          <div className="inline-flex flex-wrap gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`group flex items-center space-x-2 px-6 py-3 rounded-full transition-all
                    ${
                      selectedCategory === category.name
                        ? "bg-amber-400 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-amber-400"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors
                    ${
                      selectedCategory === category.name
                        ? "text-white"
                        : "text-gray-400 group-hover:text-amber-400"
                    }`}
                  />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Menu Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleItemClick(item)}
                className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl 
                  transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/20 
                    transition-colors z-10"
                  />
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 
                        transition-transform duration-500"
                    />
                  )}
                  {item.featured && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center space-x-1 bg-amber-400 px-3 py-1 rounded-md">
                        <Star className="w-4 h-4 text-white" />
                        <span className="text-sm text-white">
                          Chef's Special
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-light tracking-wide text-gray-900">
                      {item.name}
                    </h3>
                    <span className="text-lg font-medium text-amber-600">
                      ${item.price}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.dietary?.map((diet) => (
                      <span
                        key={diet}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {diet}
                      </span>
                    ))}
                  </div>

                  {isStaff && (
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-md
                        hover:bg-gray-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md
                        hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No items found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {isStaff && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex justify-center"
          >
            <button
              className="px-8 py-3 bg-amber-400 text-white rounded-full hover:bg-amber-500
              transition-colors shadow-lg hover:shadow-xl"
            >
              Add New Item
            </button>
          </motion.div>
        )}
      </div>

      {/* Menu Detail Popup */}
      <MenuDetailPopup
        item={selectedItem}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
      />

      <Footer />
    </div>
  );
}
