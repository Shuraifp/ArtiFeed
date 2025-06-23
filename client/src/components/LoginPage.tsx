"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "./InputField";
import Button from "./Button";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api/auth";
import toast from "react-hot-toast";
import { handleApiError } from "@/lib/handleApiError";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { user, login, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<{
    identifier: string;
    password: string;
  }>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { identifier?: string; password?: string } = {};
    if (!formData.identifier)
      newErrors.identifier = "Email or phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await loginUser(formData.identifier, formData.password);
      login(res.user);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      handleApiError({ error, router });
    }
  };

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard");
    }
  }, [user, router, loading]);

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-white text-black dark:bg-white dark:text-black h-full flex flex-col items-center"
    >
      <div className="w-full max-w-md mx-auto mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </div>

      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Welcome Back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Sign in to continue your reading journey
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Email or Phone"
          type="text"
          name="identifier"
          value={formData.identifier}
          onChange={handleInputChange}
          required
          error={errors.identifier}
          icon={<Mail className="w-5 h-5" />}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          error={errors.password}
          icon={<Lock className="w-5 h-5" />}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot password?
          </a>
        </div>

        <Button onClick={handleSubmit} loading={loading}>
          Sign In
        </Button>

        <div className="text-center">
          <span className="text-gray-600">{`Don't have an account? `}</span>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign up now
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginPage;
