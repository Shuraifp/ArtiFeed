"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api/auth";
import { handleApiError } from "@/lib/handleApiError";
import toast from "react-hot-toast";

interface AdminCredentials {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const AdminLogin = () => {
  const { admin, loading, loginAdmin } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<AdminCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await adminLogin(formData.email, formData.password);
      loginAdmin(res.user);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error) {
      handleApiError({ error, router });
    }
  };

  useEffect(() => {
    if (admin && !loading) {
      router.push("/admin/dashboard");
    }
  }, [admin, router, loading]);

  if (admin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Login
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            error={errors.email}
            icon={<Mail className="w-5 h-5 text-gray-500" />}
            classNme={"text-gray-700"}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            error={errors.password}
            icon={<Lock className="w-5 h-5 text-gray-500" />}
            classNme={"text-gray-700"}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {}}
              loading={loading}
              className="w-full py-3 text-lg"
            >
              Sign In
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
