"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Star, Eye, Shield, ChevronDown } from "lucide-react";
import FloatingParticles from "@/components/FloatingParticles";
import AnimatedNavbar from "@/components/Navbar";
import FeaturesSection from "@/components/Features";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const HeroSection = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Toaster />
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
        </div>
        <FloatingParticles />
      </div>

      <motion.div
        style={{ y }}
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20"
          >
            ✨ Welcome to the Future of Article Discovery
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Discover Articles That
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Transform Minds
            </span>
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of curious minds discovering, sharing, and engaging
          with thought-provoking articles tailored to your unique interests.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                router.push("/dashboard");
                toast.success("Welcome back to your dashboard!");
              }
            }}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
          >
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
          >
            Watch Demo
          </motion.button> */}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { number: "50K+", label: "Active Readers" },
            { number: "10K+", label: "Articles Shared" },
            { number: "95%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/60"
          >
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join thousands of readers who have already discovered their perfect
            articles. Start your journey today, completely free.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <Link href='/register'>Create Your Account</Link>
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/30 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </motion.button> */}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-200"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>5-Star Rated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Privacy First</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Main App Component
const ArticleFeedsHomepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <AnimatedNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default ArticleFeedsHomepage;
