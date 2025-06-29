"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import MultiSelectField from "@/components/MultiSelectField";
import ArticleViewModal from "@/components/ArticleViewModal";
import { Compass, Rss } from "lucide-react";
import { Article } from "@/lib/types/article";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/handleApiError";
import { getPreferences } from "@/lib/api/preferences";

import {
  getArticles,
  likeArticle,
  dislikeArticle,
  blockArticle,
  getExploreArticles,
} from "@/lib/api/article";
import ConfirmBlockModal from "@/components/ConfirmBlockModal";

export default function MyFeed() {
  const router = useRouter();
  const { user } = useAuth();
  const [filters, setFilters] = useState<string[]>([]);
  const [tab, setTab] = useState<"following" | "explore">("following");
  const [articles, setArticles] = useState<Article[]>([]);
  const [exploreArticles, setExploreArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [followingCategoryList, setFollowingCategoryList] = useState<string[]>([])
  const [blockTargetId, setBlockTargetId] = useState<string | null>(null);

  const [followingPage, setFollowingPage] = useState(1);
  const [explorePage, setExplorePage] = useState(1);
  const limit = 6;
  const [followingHasMore, setFollowingHasMore] = useState(true);
  const [exploreHasMore, setExploreHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { preferences, userPreferences } = await getPreferences();
        setCategoryList(preferences);
        setFollowingCategoryList(userPreferences)
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
  }, [router, user]);


  useEffect(() => {
    const target = loaderRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          const currentPage = tab === "following" ? followingPage : explorePage;
          const hasMore =
            tab === "following" ? followingHasMore : exploreHasMore;

          if (hasMore) {
            loadArticles(tab, currentPage);
          }
        }
      },
      {
        rootMargin: "100px",
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [
    tab,
    followingPage,
    explorePage,
    followingHasMore,
    exploreHasMore,
    isLoading,
  ]);

  const loadArticles = async (
    tabType: "following" | "explore",
    currentPage: number
  ) => {
    if (isLoading) return;

    const hasMore = tabType === "following" ? followingHasMore : exploreHasMore;
    if (!hasMore) return;

    setIsLoading(true);
    try {
      if (tabType === "following") {
        const data = await getArticles(currentPage, limit);
        setArticles((prev) => [...prev, ...data.articles]);
        const isLastPage = currentPage >= data.totalPages;
        setFollowingHasMore(!isLastPage);
        setFollowingPage(currentPage + 1);
      } else {
        const data = await getExploreArticles(currentPage, limit);
        setExploreArticles((prev) => [...prev, ...data.articles]);
        const isLastPage = currentPage >= data.totalPages;
        setExploreHasMore(!isLastPage);
        setExplorePage(currentPage + 1);
      }
    } catch (error) {
      handleApiError({ error, router, user });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const { article } = await likeArticle(id);

      setArticles((prev) => prev.map((art) => (art.id === id ? article : art)));
      setExploreArticles((prev) =>
        prev.map((art) => (art.id === id ? article : art))
      );
    } catch (error) {
      handleApiError({ error, router, user });
    }
  };

  const handleDislike = async (id: string) => {
    try {
      const { article } = await dislikeArticle(id);

      setArticles((prev) => prev.map((art) => (art.id === id ? article : art)));
      setExploreArticles((prev) =>
        prev.map((art) => (art.id === id ? article : art))
      );
    } catch (error) {
      handleApiError({ error, router, user });
    }
  };

  const handleView = (id: string) => {
    const currentArticles = tab === "following" ? articles : exploreArticles;
    const article = currentArticles.find((a) => a.id === id);
    if (article) setSelectedArticle(article);
  };

  const handleBlock = async (id: string) => {
    setBlockTargetId(id);
  };

  const confirmBlock = async () => {
    if (!blockTargetId) return;
    try {
      await blockArticle(blockTargetId);

      setArticles((prev) => prev.filter((a) => a.id !== blockTargetId));
      setExploreArticles((prev) => prev.filter((a) => a.id !== blockTargetId));
      setBlockTargetId(null);
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

  // Get current articles based on active tab
  const currentArticles = tab === "following" ? articles : exploreArticles;
  const currentHasMore =
    tab === "following" ? followingHasMore : exploreHasMore;
  const currentCategoryList = tab === "following" ? followingCategoryList : categoryList;

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
              My Feed
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
            options={currentCategoryList}
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
            {filteredArticles(currentArticles).map((article, index) => (
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
                  onView={handleView}
                  onBlock={handleBlock}
                  isFeedPage={true}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show message when no articles */}
        {filteredArticles(currentArticles).length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {tab === "following"
                ? "No articles from following"
                : "No articles to explore"}
            </p>
          </div>
        )}

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

        <div ref={loaderRef} className="py-6 text-center text-sm text-gray-500">
          {isLoading
            ? "Loading more..."
            : currentHasMore
            ? "Scroll down to load more"
            : "No more articles"}
        </div>
      </div>
      <AnimatePresence>
        {blockTargetId && (
          <ConfirmBlockModal
            onCancel={() => setBlockTargetId(null)}
            onConfirm={confirmBlock}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
