import { Article } from "@/lib/types/article";
import { motion } from "framer-motion";
import { Eye, Clock, ThumbsUp, ThumbsDown, XCircle } from "lucide-react";


interface ArticleCardProps {
  article: Article;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  // onShare: (id: string) => void;
  onView: (id: string) => void;
  onBlock: (id: string) => void;
}

const ArticleCard = ({ article, onLike, onDislike, onView, onBlock }: ArticleCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600">
        {article.image && (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            {article.category}
          </span> 
        </div>
        <button
          onClick={() => onBlock(article.id)}
          className="absolute top-4 right-4 p-1 bg-white/10 rounded-full hover:bg-red-500/20"
        >
          <XCircle className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 cursor-pointer" onClick={() => onView(article.id)}>
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{article.body}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {article.views}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {article.readTime} min read
            </span>
          </div>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
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
          <button
            onClick={() => onView(article.id)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium hover:shadow-lg"
          >
            Read More
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;