"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import MultiSelectField from "@/components/MultiSelectField";
import ArticleViewModal from "@/components/ArticleViewModal";
import { Rss } from "lucide-react";
import { Article } from "@/lib/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/handleApiError";
import { getPreferences } from "@/lib/api/preferences";
import { getArticles,likeArticle, dislikeArticle, blockArticle } from "@/lib/api/article";


export default function MyFeed() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState<string[]>([]);
  // const [tab, setTab] = useState<"following" | "explore">("following");
  const [articles, setArticles] = useState<Article[]>([]);
  // const [exploreArticles, setExploreArticles] =
  //   useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;
  console.log(articles)

  useEffect(() => {
    (async () => {
      try {
        const { preferences } = await getPreferences();
        setCategoryList(preferences);
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
    (async () => {
      try {
        const data = await getArticles(page, limit);
        console.log(data)
        setArticles(data.articles);
        setTotalPages(data.totalPages);
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
  }, [router, user, page]);

  const handleLike = async (id: string) => {
  try {
    await likeArticle(id);
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, likes: article.likes + 1 } : article
      )
    );
  } catch (error) {
    handleApiError({ error, router, user });
  }
};

  const handleDislike = async (id: string) => {
  try {
    await dislikeArticle(id);
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id ? { ...article, dislikes: article.dislikes + 1 } : article
      )
    );
  } catch (error) {
    handleApiError({ error, router, user });
  }
};


  const handleView = (id: string) => {
    const article = articles.find((a) => a.id === id);
    if (article) setSelectedArticle(article);
  };

  const handleBlock = async (id: string) => {
  try {
    await blockArticle(id);
    setArticles((prev) => prev.filter((article) => article.id !== id));
  } catch (error) {
    handleApiError({ error, router, user });
  }
};


  const handleFilterChange = (value: string[]) => {
    setFilters(value);
  };

  const filteredArticles = (arts: Article[]) =>
    arts.filter(
      (article) => filters.length === 0 || filters.includes(article.category)
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              {/* {tab === "following" ? ( */}
              <Rss className="w-6 h-6 text-white" />
              {/* ) : (
                <Compass className="w-6 h-6 text-white" />
              )} */}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Feed
            </h2>
          </div>
          {/* <div className="flex space-x-4 mb-6">
            <motion.button
              onClick={() => setTab("following")}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                tab === "following"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Following
            </motion.button>
            <motion.button
              onClick={() => setTab("explore")}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                tab === "explore"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.button>
          </div> */}
          <MultiSelectField
            label="Filter by Category"
            options={categoryList}
            value={filters}
            onChange={handleFilterChange}
            error=""
          />
        </div>
        {/* Decorative Background Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
        />
        {/* Article Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          <AnimatePresence>
            {filteredArticles(articles)
              // : filteredArticles(exploreArticles)
              .map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  layout
                >
                  <ArticleCard
                    article={article}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    // onShare={handleShare}
                    onView={handleView}
                    onBlock={handleBlock}
                  />
                </motion.div>
              ))}
          </AnimatePresence>
        </motion.div>
        {/* Article View Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <ArticleViewModal
              article={selectedArticle}
              onClose={() => setSelectedArticle(null)}
              onLike={handleLike}
              onDislike={handleDislike}
              // onShare={handleShare}
            />
          )}
        </AnimatePresence>
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
      </div>
    </div>
  );
}
