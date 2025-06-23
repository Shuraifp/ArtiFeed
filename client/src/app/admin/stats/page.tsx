"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { BarChart2 } from "lucide-react";
import { AdminStats } from "@/lib/types/admin";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const mockStats: AdminStats = {
  totalUsers: 150,
  totalArticles: 500,
  totalViews: 100000,
  averageLikes: 75,
  averageDislikes: 5,
  categoryDistribution: {
    Sports: 100,
    Politics: 80,
    Space: 70,
    Technology: 120,
    Health: 50,
    Business: 40,
    Entertainment: 30,
    Science: 10,
  },
};

const WebsiteStats = () => {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "users" | "articles" | "preferences" | "stats"
  >("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    // Simulate API call
    setStats(mockStats);
  }, []);

  useEffect(() => {
    if (!admin && !loading) {
      router.push("/admin/login");
    }
  }, [admin, router, loading]);

  if (!admin) return null;

  if (!stats) return null;

  const maxCategoryCount = Math.max(
    ...Object.values(stats.categoryDistribution)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 lg:flex">
      <AdminSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
        />
        <main className="p-8">
          <div className="max-w-6xl ml-0 mr-auto relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl z-0"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl z-0"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Website Stats
                </h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalUsers}
                    </p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalArticles}
                    </p>
                    <p className="text-sm text-gray-500">Total Articles</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalViews}
                    </p>
                    <p className="text-sm text-gray-500">Total Views</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageLikes}
                    </p>
                    <p className="text-sm text-gray-500">Average Likes</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Category Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(stats.categoryDistribution).map(
                      ([category, count]) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "100%" }}
                          transition={{ duration: 0.6 }}
                          className="flex items-center space-x-4"
                        >
                          <p className="text-sm text-gray-900 w-24">
                            {category}
                          </p>
                          <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / maxCategoryCount) * 100}%`,
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            />
                          </div>
                          <p className="text-sm text-gray-900">{count}</p>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebsiteStats;
