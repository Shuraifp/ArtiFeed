"use client";

import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut } from "lucide-react";
import { AdminPageKey } from "@/lib/types/admin";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  currentPage: AdminPageKey;
}

const AdminHeader = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
}: AdminHeaderProps) => {
  const pageNames: Record<AdminPageKey, string> = {
    dashboard: "Admin Dashboard",
    users: "Manage Users",
    articles: "Manage Articles",
    preferences: "Preferences",
    stats: "Website Stats",
  };

  const pageDescriptions: Record<AdminPageKey, string> = {
    dashboard: "Overview of ArticleFeeds administration.",
    users: "Manage user accounts and their preferences.",
    articles: "Review and manage all articles on ArticleFeeds.",
    preferences: "Configure article categories for the platform.",
    stats: "View site-wide statistics and insights.",
  };

  const handleLogout = () => {
    // Simulate logout
    console.log("Admin logged out");
    // Redirect to /admin/login
  };

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {pageNames[currentPage]}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                {pageDescriptions[currentPage]}
              </p>
            </div>
          </div>
          {/* Right section */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-600 hidden sm:block">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;