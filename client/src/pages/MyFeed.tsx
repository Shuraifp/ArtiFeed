"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import MultiSelectField from "@/components/MultiSelectField";
import ArticleViewModal from "@/components/ArticleViewModal";
import { Rss, Compass } from "lucide-react";
import { Article } from "@/lib/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/handleApiError";
import { getPreferences } from "@/lib/api/preferences";

const mockFollowingArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Space Exploration",
    body: "Discover the latest advancements in space technology...",
    category: "Space",
    readTime: 10,
    views: 1200,
    publishedAt: "2025-06-18",
    likes: 150,
    dislikes: 10,
    image: "/images/space.jpg",
  },
  {
    id: "2",
    title: "AI in Sports Analytics",
    body: "How AI is transforming sports performance analysis...",
    category: "Sports",
    views: 800,
    publishedAt: "2025-06-17",
    readTime: 8,
    likes: 90,
    dislikes: 5,
    image: "/images/sports.jpg",
  },
];

const mockExploreArticles: Article[] = [
  {
    id: "3",
    title: "Quantum Computing Breakthroughs",
    body: "The latest innovations in quantum computing...",
    category: "Technology",
    views: 500,
    readTime: 8,
    publishedAt: "2025-06-15",
    likes: 50,
    dislikes: 3,
    image: "/images/tech.jpg",
  },
  {
    id: "4",
    title: "The Rise of Sustainable Fashion",
    body: "How sustainability is shaping the fashion industry...",
    category: "Business",
    views: 600,
    readTime: 8,
    publishedAt: "2025-06-16",
    likes: 70,
    dislikes: 2,
    image: "/images/fashion.jpg",
  },
];

export default function MyFeed() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState<string[]>([]);
  const [tab, setTab] = useState<"following" | "explore">("following");
  const [articles, setArticles] = useState<Article[]>(mockFollowingArticles);
  const [exploreArticles, setExploreArticles] =
    useState<Article[]>(mockExploreArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [categoryList, setCategoryList] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { preferences } = await getPreferences();
        setCategoryList(preferences);
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
  }, [router, user]);

  const handleLike = (id: string) => {
    const updateArticles = (arts: Article[]) =>
      arts.map((article) =>
        article.id === id ? { ...article, likes: article.likes + 1 } : article
      );
    setArticles(updateArticles(articles));
    setExploreArticles(updateArticles(exploreArticles));
  };

  const handleDislike = (id: string) => {
    const updateArticles = (arts: Article[]) =>
      arts.map((article) =>
        article.id === id
          ? { ...article, dislikes: article.dislikes + 1 }
          : article
      );
    setArticles(updateArticles(articles));
    setExploreArticles(updateArticles(exploreArticles));
  };

  const handleShare = (id: string) => {
    console.log(`Share article ${id}`);
    // Implement Web Share API or copy link
  };

  const handleView = (id: string) => {
    const article = [...articles, ...exploreArticles].find((a) => a.id === id);
    if (article) setSelectedArticle(article);
  };

  const handleBlock = (id: string) => {
    setArticles(articles.filter((article) => article.id !== id));
    setExploreArticles(exploreArticles.filter((article) => article.id !== id));
    // Call API to block article
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
              {tab === "following" ? (
                <Rss className="w-6 h-6 text-white" />
              ) : (
                <Compass className="w-6 h-6 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {tab === "following" ? "My Feed" : "Explore"}
            </h2>
          </div>
          <div className="flex space-x-4 mb-6">
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
          </div>
          <MultiSelectField
            label="Filter by Category"
            options={categoryList}
            value={filters}
            onChange={handleFilterChange}
            error=""
            // classNme="max-w-xs"
          />
        </div>
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
        {/* Article Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          <AnimatePresence>
            {(tab === "following"
              ? filteredArticles(articles)
              : filteredArticles(exploreArticles)
            ).map((article, index) => (
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
                  onShare={handleShare}
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
              onShare={handleShare}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
