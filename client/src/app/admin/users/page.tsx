"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { Users, Trash2 } from "lucide-react";
import { UserProfile } from "@/lib/types/user";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { blockUser, getAllUsers } from "@/lib/api/user";
import { handleApiError } from "@/lib/handleApiError";

const ManageUsers = () => {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "users" | "articles" | "preferences" | "stats"
  >("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { users, totalPages, total } = await getAllUsers(page, 7);
        setUsers(users);
        setTotalUsers(total);
        setTotalPages(totalPages);
      } catch (error) {
        handleApiError({ error, router, admin });
      }
    })();
  }, [page, admin, router]);

  const handleDelete = (email: string) => {
    setUsers(users.filter((user) => user.email !== email));
    // Call API to delete user
  };

  const handleToggleBlock = async (id: string, isCurrentlyBlocked: boolean) => {
  try {
    await blockUser(id)
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, isBlocked: !isCurrentlyBlocked } : user
    );
    setUsers(updatedUsers);
  } catch (error) {
    handleApiError({ error, router, admin });
  }
};

  useEffect(() => {
    if (!admin && !loading) {
      router.push("/admin/login");
    }
  }, [admin, router, loading]);

  if (!admin) return null;

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
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Users
                </h2>
                <span className="ml-2 text-sm text-gray-600 font-medium">
                  ({totalUsers} total)
                </span>
              </div>
              <div className="space-y-4">
                {users.map((user) => (
                  <motion.div
                    key={user.email}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                      <p className="text-sm text-gray-500">
                        Preferences: {user.preferences.join(", ") || "None"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Articles: {user.totalArticles}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleToggleBlock(user.id, user.isBlocked)
                        }
                        className={`p-2 rounded-xl text-white ${
                          user.isBlocked ? "bg-green-600" : "bg-yellow-600"
                        }`}
                        aria-label={`${
                          user.isBlocked ? "Unblock" : "Block"
                        } user ${user.email}`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(user.email)}
                        className="p-2 bg-red-600 text-white rounded-xl"
                        aria-label={`Delete user ${user.email}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageUsers;
