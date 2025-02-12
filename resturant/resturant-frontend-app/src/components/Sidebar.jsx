// components/Sidebar.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Coffee,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    title: "Staff",
    icon: Users,
    id: "staff",
  },
  {
    title: "Reservations",
    icon: Calendar,
    id: "reservations",
  },
  {
    title: "Menu",
    icon: BookOpen,
    id: "menu",
  },
  {
    title: "Orders",
    icon: ShoppingBag,
    id: "orders",
  },
];

export default function Sidebar({ onMenuSelect, activeMenu }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { logout, user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuClick = (menuId) => {
    onMenuSelect(menuId);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const router = useRouter();
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Coffee className="h-8 w-8 text-amber-600" />
          {!isCollapsed && (
            <span
              onClick={() => router.push("/")}
              className="ml-2 text-xl font-semibold cursor-pointer text-gray-800"
            >
              L'ESSENCE{" "}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems
            .filter((item) => !(user?.role === "staff" && item.id === "staff"))
            .map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-150 ${
                    activeMenu === item.id
                      ? "bg-amber-50 text-amber-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 min-w-[20px] ${
                      activeMenu === item.id
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`}
                  />
                  {(!isCollapsed || isMobile) && (
                    <span className="ml-3">{item.title}</span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </nav>
      {/* log out */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="w-full p-2 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Collapse Toggle */}
      {/* {!isMobile && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      )} */}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        >
          {showMobileMenu ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="relative">
          <motion.div
            initial={{ width: 280 }}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3 }}
            className="h-screen bg-white border-r border-gray-200 flex flex-col fixed top-0 left-0 shadow-sm"
          >
            <SidebarContent />
          </motion.div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <AnimatePresence>
          {showMobileMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowMobileMenu(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 left-0 h-screen w-[280px] bg-white flex flex-col z-50 shadow-xl"
              >
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
