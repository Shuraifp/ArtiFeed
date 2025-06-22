"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import { Toaster } from "react-hot-toast";

const AuthPages = ({ page }: { page: string }) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {page === "login" ? (
              <LoginPage key="login" />
            ) : (
              <RegisterPage key="register" />
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Secure authentication powered by ArtiFeed
        </motion.p>
      </div>
    </div>
  );
};

export default AuthPages;
