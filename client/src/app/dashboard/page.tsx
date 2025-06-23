"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MyFeed from "@/pages/MyFeed";
import CreateArticle from "@/pages/CreateArticle";
import Settings from "@/pages/Settings";
import MyArticles from "@/pages/MyArticle";
import { PageKey } from "@/lib/types/article";
import Profile from "@/pages/Profile";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, router, loading]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <Toaster />
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        <main className="flex-1 p-6">
          {currentPage === "dashboard" && <MyFeed />}
          {currentPage === "create" && <CreateArticle />}
          {currentPage === "articles" && <MyArticles />}
          {currentPage === "settings" && <Settings />}
          {currentPage === "profile" && <Profile />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
