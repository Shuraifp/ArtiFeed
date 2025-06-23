"use client";

import { Article } from "@/lib/types/article";
import { motion } from "framer-motion";
import { X, ThumbsUp, ThumbsDown } from "lucide-react";


interface ArticleViewModalProps {
  article: Article;
  onClose: () => void;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  // onShare: (id: string) => void;
}

const ArticleViewModal = ({
  article,
  onClose,
  onLike,
  onDislike,
  // onShare,
}: ArticleViewModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image + Close Button */}
        <div className="relative">
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 object-cover rounded-t-2xl"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4 inline-block">
            {article.category}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {article.title}
          </h2>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <span>{article.publishedAt}</span>
            <span>{article.readTime} min read</span>
          </div>

          {/* Full Body Content */}
          <div className="text-gray-700 space-y-4 leading-relaxed whitespace-pre-line mb-6">
            {article.body}
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => onLike(article.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
            >
              <ThumbsUp className="w-5 h-5" />
              <span>{article.likes}</span>
            </button>
            <button
              onClick={() => onDislike(article.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
            >
              <ThumbsDown className="w-5 h-5" />
              <span>{article.dislikes}</span>
            </button>
            {/* <button
              onClick={() => onShare(article.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-purple-600"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button> */}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleViewModal;
