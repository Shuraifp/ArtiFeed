"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Users,
  FileText,
  Settings,
  X,
  BookOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminPageKey } from "@/lib/types/admin";
import { Toaster } from "react-hot-toast";

interface AdminSidebarProps {
  currentPage: AdminPageKey;
  setCurrentPage: Dispatch<SetStateAction<AdminPageKey>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const AdminSidebar = ({
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) => {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const menuItems = [
    {
      icon: BarChart2,
      label: "Dashboard",
      key: "dashboard",
      href: "/admin/dashboard",
    },
    { icon: Users, label: "Manage Users", key: "users", href: "/admin/users" },
    {
      icon: FileText,
      label: "Manage Articles",
      key: "articles",
      href: "/admin/articles",
    },
    {
      icon: Settings,
      label: "Preferences",
      key: "preferences",
      href: "/admin/preferences",
    },
    {
      icon: BarChart2,
      label: "Website Stats",
      key: "stats",
      href: "/admin/stats",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setSidebarOpen(window.innerWidth >= 1024);
    };
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      <Toaster />
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{
          x: sidebarOpen || isDesktop ? 0 : -300,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 lg:min-w-64 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:shadow-none border-r border-gray-200 flex flex-col justify-between"
      >
        {/* Top section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div
              onClick={() => router.push("/admin/dashboard")}
              className="flex cursor-pointer items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ArticleFeeds Admin
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.key}
                whileHover={{ x: 5 }}
                onClick={() => {
                  setCurrentPage(item.key as AdminPageKey);
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  currentPage === item.key
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSidebar;
