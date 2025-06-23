"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { Settings, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  createPreference,
  deletePreference,
  fetchPreferences,
} from "@/lib/api/preferences";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleApiError";

const ManagePreferences = () => {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "users" | "articles" | "preferences" | "stats"
  >("preferences");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory) {
      setError("Category name is required");
      return;
    }
    const exists = categoryList.some(
      (it) => it.toLowerCase() === newCategory.toLowerCase()
    );
    if (exists) {
      setError("Category already exists");
      return;
    }

    setError("");
    try {
      await createPreference(newCategory);
      setCategoryList([...categoryList, newCategory]);
      setNewCategory("");
      toast.success("Preference created successfully!");
    } catch (error) {
      handleApiError({ error, router, admin });
    }
  };

  const handleDeleteCategory = async (category: string) => {
    try {
      await deletePreference(category);
      setCategoryList((prev) => prev.filter((cat) => cat !== category));
      toast.success(`Category "${category}" deleted successfully!`);
    } catch (error) {
      handleApiError({ error, router, admin });
    }
  };

  useEffect(() => {
    if (!admin && !loading) {
      router.push("/admin/login");
    } else if (admin) {
      (async () => {
        try {
          const { preferences } = await fetchPreferences();
          setCategoryList(preferences);
        } catch (error) {
          handleApiError({ error, router, admin });
        }
      })();
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
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Preferences
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <InputField
                    label="New Category"
                    type="text"
                    name="newCategory"
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      setError("");
                    }}
                    error={error}
                    classNme="text-gray-700"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={handleAddCategory}
                      className="w-full py-3 text-lg"
                    >
                      Add Category
                    </Button>
                  </motion.div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Existing Categories
                  </h3>
                  <div className="space-y-2">
                    {categoryList.map((category) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <p className="text-sm text-gray-900">{category}</p>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCategory(category)}
                          className="p-2 bg-red-600 text-white rounded-xl"
                          aria-label={`Delete category ${category}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    ))}
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

export default ManagePreferences;
