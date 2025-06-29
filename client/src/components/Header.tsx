"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import { PageKey } from "@/lib/types/article";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  currentPage: PageKey;
  setCurrentPage: Dispatch<SetStateAction<PageKey>>;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  setCurrentPage,
}: HeaderProps) => {
  const { user } = useAuth()
  // const [searchQuery, setSearchQuery] = useState("");
  const pageNames: Record<PageKey, string> = {
    dashboard: "Dashboard",
    create: "Create Article",
    articles: "My Articles",
    settings: "Settings",
    profile: "Profile",
  };

  const pageDescriptions: Record<PageKey, string> = {
    dashboard:
      "Welcome back! Here's what's happening with your articles today.",
    create: "Share your thoughts and expertise with the world.",
    articles: "Manage and track the performance of your published content.",
    settings: "Customize your profile and account preferences.",
    profile: "View your profile and contributions.",
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {pageNames[currentPage]}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">
                {pageDescriptions[currentPage]}
              </p>
            </div>
          </div>
          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            {/* <motion.div
              whileHover={{ scale: 1.02 }}
              className="hidden md:flex items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2 transition-colors"
            >
              <Search className="w-4 h-4 text-gray-400 mr-3" />
              <input
                type="text"
                id="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="bg-transparent outline-none text-sm text-gray-700 w-full"
              />
              <kbd className="ml-auto text-xs text-gray-400 bg-white px-2 py-1 rounded border">
                ⌘K
              </kbd>
            </motion.div> */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </motion.button>
            {/* Profile link */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setCurrentPage("profile");
              }}
              className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Writer</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
