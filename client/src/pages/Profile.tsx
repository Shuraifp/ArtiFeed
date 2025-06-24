"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
import { User, Mail, Calendar, Tag } from "lucide-react";
import { Article } from "@/lib/types/article";
import { UserProfile } from "@/lib/types/user";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserById } from "@/lib/api/user";
import { handleApiError } from "@/lib/handleApiError";
import { getUserArticles } from "@/lib/api/article";

const Profile = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { user }: { user: UserProfile } = await getUserById();
        setProfile({
          id: user.id || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          totalArticles: user.totalArticles || 0,
          totalViews: user.totalViews || 0,
          totalLikes: user.totalLikes || 0,
          preferences: user.preferences || [],
          isBlocked: user.isBlocked || false
        });
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
    (async () => {
      try {
        const data = await getUserArticles(1, 3);
        setArticles(data.articles);
      } catch (error) {
        handleApiError({ error, router, user });
      }
    })();
  }, [router, user]);

  if (!profile) return null;

  return (
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h2>
        </div>
        {/* Profile Info */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <User className="w-4 h-4 mr-2" /> Full Name
              </p>
              <p className="text-lg font-medium text-gray-900">
                {profile.firstName} {profile.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-2" /> Email
              </p>
              <p className="text-lg font-medium text-gray-900">
                {profile.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-2" /> Date of Birth
              </p>
              <p className="text-lg font-medium text-gray-900">{profile.dob}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Tag className="w-4 h-4 mr-2" /> Preferences
              </p>
              <p className="text-lg font-medium text-gray-900">
                {profile.preferences.join(", ") || "None"}
              </p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.totalArticles}
              </p>
              <p className="text-sm text-gray-500">Articles Published</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.totalViews}
              </p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-gray-900">
                {profile.totalLikes}
              </p>
              <p className="text-sm text-gray-500">Total Likes</p>
            </div>
          </div>
          {/* Articles */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              My Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <ArticleCard
                    article={article}
                    onLike={() => {}}
                    onDislike={() => {}}
                    // onShare={() => {}}
                    onView={() => {}}
                    onBlock={() => {}}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
