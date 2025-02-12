// app/dashboard/admin/layout.jsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, User, Menu as MenuIcon, X, ChevronLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import StaffManagement from "@/components/StaffManagment";
import Reservations from "@/components/Reservstions";
import MenuManagement from "@/components/MenuManagment";
import Orders from "@/components/Orders";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout() {
  const [activeMenu, setActiveMenu] = useState("staff");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle menu selection on mobile
  const handleMobileMenuSelect = (menu) => {
    setActiveMenu(menu);
    setIsMobileMenuOpen(false);
  };

  const renderComponent = () => {
    switch (activeMenu) {
      case "staff" :
        return <StaffManagement />;
      case "reservations":
        return <Reservations />;
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <Orders />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  // Notifications panel
  const NotificationsPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <button
            onClick={() => setShowNotifications(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Notification items */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">New order received</p>
            <span className="text-xs text-blue-600">2 minutes ago</span>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">Low stock alert</p>
            <span className="text-xs text-yellow-600">15 minutes ago</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar
            onMenuSelect={isMobile ? handleMobileMenuSelect : setActiveMenu}
            activeMenu={activeMenu}
          />
        </div>

        {/* Main Content */}
        <div className="md:ml-[280px]">
          {/* Top Navigation */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900 md:hidden"
                >
                  {isMobileMenuOpen ? (
                    <ChevronLeft className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </button>

                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 capitalize">
                  {activeMenu}
                </h1>
              </div>

              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <Bell className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      2
                    </span>
                  </button>

                  <AnimatePresence>
                    {showNotifications && <NotificationsPanel />}
                  </AnimatePresence>
                </div>

                {/* User Profile */}
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    Admin
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMenu}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderComponent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
