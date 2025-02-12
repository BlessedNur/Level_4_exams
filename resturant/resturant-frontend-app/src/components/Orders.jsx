"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: AlertCircle },
  preparing: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock },
  completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
  cancelled: { bg: "bg-red-100", text: "text-red-800", icon: XCircle },
};
const EditOrderModal = ({ order, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    specialInstructions: "",
    type: "dine-in",
    table: "",
  });

  // Update form data when order changes
  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || "",
        specialInstructions: order.specialInstructions || "",
        type: order.type || "dine-in",
        table: order.table || "",
        // Preserve other existing order data
        items: order.items || [],
        total: order.total || 0,
        status: order.status,
        orderNumber: order.orderNumber,
      });
    }
  }, [order]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Only send changed fields
      const updatedFields = {};
      if (formData.customerName !== order.customerName) {
        updatedFields.customerName = formData.customerName;
      }
      if (formData.specialInstructions !== order.specialInstructions) {
        updatedFields.specialInstructions = formData.specialInstructions;
      }
      if (formData.type !== order.type) {
        updatedFields.type = formData.type;
      }
      if (formData.type === "dine-in" && formData.table !== order.table) {
        updatedFields.table = formData.table;
      }

      // Only make the API call if there are actually changes
      if (Object.keys(updatedFields).length > 0) {
        await onUpdate(order._id, updatedFields);
        toast.success("Order updated successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to update order");
      console.error("Error updating order:", error);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Edit Order #{order.orderNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specialInstructions: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="dine-in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>

          {formData.type === "dine-in" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Table Number
              </label>
              <input
                type="text"
                value={formData.table}
                onChange={(e) =>
                  setFormData({ ...formData, table: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ORDER_UPDATE") {
        handleRealTimeUpdate(data.order);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete order");

      setOrders(orders.filter((order) => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error("Failed to delete order");
      console.error("Error deleting order:", error);
    }
  };
  const updateOrder = async (orderId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order");
      }

      const updatedOrder = await response.json();

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? updatedOrder : order
        )
      );

      toast.success("Order updated successfully");
      return updatedOrder;
    } catch (error) {
      toast.error(error.message || "Failed to update order");
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleRealTimeUpdate = (updatedOrder) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
    toast.success(`Order ${updatedOrder.orderNumber} has been updated`);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");
      const updatedOrder = await response.json();
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
      toast.success(`Order ${updatedOrder.orderNumber} marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesType = typeFilter === "all" || order.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order) => {
            const StatusIcon = statusColors[order.status]?.icon;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                          statusColors[order.status]?.bg
                        } ${statusColors[order.status]?.text}`}
                      >
                        {StatusIcon && <StatusIcon className="h-4 w-4" />}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customerName}
                    </p>
                    <div className="text-sm text-gray-500">
                      <span className="capitalize">{order.type}</span>
                      {order.table && ` • Table ${order.table}`}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "preparing")
                          }
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200"
                        >
                          Start Preparing
                        </button>
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm hover:bg-gray-200"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this order?"
                              )
                            ) {
                              deleteOrder(order._id);
                            }
                          }}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "completed")
                        }
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200"
                      >
                        Complete
                      </button>
                    )}
                    {(order.status === "pending" ||
                      order.status === "preparing") && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "cancelled")
                        }
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <EditOrderModal
                    order={editingOrder}
                    isOpen={!!editingOrder}
                    onClose={() => setEditingOrder(null)}
                    onUpdate={updateOrder}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
