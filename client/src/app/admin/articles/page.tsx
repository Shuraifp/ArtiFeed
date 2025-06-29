"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { FileText, StepBack, Trash2 } from "lucide-react";
import { Article } from "@/lib/types/article";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  adminBlockArticle,
  adminUnBlockArticle,
  getArticlesForadmin,
} from "@/lib/api/article";
import { handleApiError } from "@/lib/handleApiError";
import toast from "react-hot-toast";

const ManageArticles = () => {
  const router = useRouter();
  const { admin, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "users" | "articles" | "preferences" | "stats"
  >("articles");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    (async () => {
      try {
        const data = await getArticlesForadmin(page, limit);
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (error) {
        handleApiError({ error, router, admin });
      }
    })();
  }, [router, admin, page]);

  const handleDelete = async (id: string) => {
    try {
      const { article } = await adminBlockArticle(id);
      setArticles(articles.map((arti) => (arti.id === id ? article : arti)));
      toast.success("Article has been Blocked")
    } catch (error) {
      handleApiError({ error, router, admin });
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      const { article } = await adminUnBlockArticle(id);
      setArticles(articles.map((arti) => (arti.id === id ? article : arti)));
      toast.success("Article has been Restored")
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Articles
                </h2>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Moderate and manage all articles on ArticleFeeds. Flag or remove
                content as needed.
              </p>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 bg-gray-200 shadow rounded-xl flex flex-col justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {article.title}
                        </p>
                        <p className="font-medium mt-1 text-gray-700">
                          By {article.authorName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {article.category} •{" "}
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {article.views} views • {article.likes} 👍 •{" "}
                          {article.dislikes} 👎
                        </p>
                      </div>
                      {article.isBlocked ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUnblock(article.id)}
                          className="self-end mt-4 p-2 bg-gray-600 text-white rounded-xl"
                        >
                          <StepBack className="w-5 h-5" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(article.id)}
                          className="self-end mt-4 p-2 bg-red-600 text-white rounded-xl"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
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

export default ManageArticles;
