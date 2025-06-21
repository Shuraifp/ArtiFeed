"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import ArticleCard from "@/components/ArticleCard";
import ArticleViewModal from "@/components/ArticleViewModal";
import { FileText, Trash2, Flag } from "lucide-react";
import { Article } from "@/lib/types/article";

interface AdminArticle extends Article {
  status: "published" | "flagged" | "draft";
}

const mockArticles: AdminArticle[] = [
  {
    id: "1",
    title: "The Future of Space Exploration",
    body: "Discover the latest advancements in space technology...",
    category: "Space",
    image: "/images/space.jpg",
    views: 1200,
    readTime: 10,
    publishedAt: "2025-06-18",
    likes: 150,
    dislikes: 10,
    status: "published",
  },
  {
    id: "2",
    title: "AI in Sports Analytics",
    body: "How AI is transforming sports performance analysis...",
    category: "Sports",
    image: "/images/sports.jpg",
    views: 800,
    readTime: 8,
    publishedAt: "2025-06-17",
    likes: 90,
    dislikes: 5,
    status: "flagged",
  },
];

const ManageArticles = () => {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "users" | "articles" | "preferences" | "stats">("articles");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<AdminArticle | null>(null);

  useEffect(() => {
    // Simulate API call
    setArticles(mockArticles);
  }, []);

  const handleDelete = (id: string) => {
    setArticles(articles.filter((article) => article.id !== id));
    // Call API to delete article
  };

  const handleFlag = (id: string) => {
    setArticles(
      articles.map((article) =>
        article.id === id ? { ...article, status: article.status === "flagged" ? "published" : "flagged" } : article
      )
    );
    // Call API to update article status
  };

  const handleView = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) setSelectedArticle(article);
  };

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
                Moderate and manage all articles on ArticleFeeds. Flag or remove content as needed.
              </p>
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {articles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      layout
                    >
                      <div className="relative">
                        <ArticleCard
                          article={article}
                          onLike={() => {}}
                          onDislike={() => {}}
                          onShare={() => {}}
                          onView={handleView}
                          onBlock={handleDelete}
                        />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleFlag(article.id)}
                            className={`p-2 ${article.status === "flagged" ? "bg-yellow-600" : "bg-gray-600"} text-white rounded-xl`}
                            aria-label={article.status === "flagged" ? `Unflag article ${article.title}` : `Flag article ${article.title}`}
                          >
                            <Flag className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(article.id)}
                            className="p-2 bg-red-600 text-white rounded-xl"
                            aria-label={`Delete article ${article.title}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                        {article.status === "flagged" && (
                          <span className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Flagged
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
              <AnimatePresence>
                {selectedArticle && (
                  <ArticleViewModal
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    onLike={() => {}}
                    onDislike={() => {}}
                    onShare={() => {}}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageArticles;