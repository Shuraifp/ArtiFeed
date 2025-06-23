"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, X, Home } from "lucide-react";
import EditArticle from "./EditArticle";
import { Article } from "@/lib/types/article";
import { getUserArticles } from "@/lib/api/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/handleApiError";

const MyArticles = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    const getArticles = async () => {
      try {
        const data = await getUserArticles(page, limit);
        console.log(data)
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (error) {
        handleApiError({ error, router, user });
      }
    };

    getArticles();
  }, [page, router, user]);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setArticles(articles.filter((article) => article.id !== deleteId));
      setDeleteId(null);
      // Call API to delete article
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <>
      <div className="max-w-6xl ml-0 mr-auto relative">
        {/* Decorative Background Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-40 right-0 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"
        /> */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Home className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Articles
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="relative h-40">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {article.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                  {article.title}
                </h3>
                <div className="text-sm text-gray-500 mb-4">
                  <span>{article.views} views</span> •{" "}
                  <span>{article.likes} likes</span> •{" "}
                  <span>{article.dislikes} dislikes</span> •{" "}
                  <span>{new Date(article.publishedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 hover:bg-blue-100 rounded-full"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingArticle(article);
                    }}
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(article.id)}
                    className="p-2 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Confirm Deletion
                </h3>
                <button
                  onClick={cancelDelete}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this article? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && editingArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditArticle
              article={editingArticle}
              onClose={() => setIsEditing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MyArticles;
