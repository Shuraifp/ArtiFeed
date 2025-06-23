"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/InputField";
import MultiSelectField from "@/components/MultiSelectField";
import Button from "@/components/Button";
import { ArrowLeft, Calendar, Lock, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api/auth";
import { handleApiError } from "@/lib/handleApiError";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  confirmPassword: string;
  preferences: string[];
}

const RegisterPage = () => {
  const router = useRouter();
  const { user, login, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    confirmPassword: "",
    preferences: [],
  });
  const [errors, setErrors] = useState<
    Partial<Omit<FormData, "preferences">> & { preferences?: string }
  >({});

  const categories = [
    "Sports",
    "Politics",
    "Space",
    "Technology",
    "Health",
    "Business",
    "Entertainment",
    "Science",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelectChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, preferences: value }));
    if (errors.preferences) {
      setErrors((prev) => ({ ...prev, preferences: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Omit<FormData, "preferences">> & {
      preferences?: string;
    } = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits and valid";
    }
    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (isNaN(dob.getTime())) {
        newErrors.dob = "Invalid date format";
      } else if (age < 13) {
        newErrors.dob = "You must be at least 13 years old";
      }
    }
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.preferences.length === 0) {
      newErrors.preferences = "Please select at least one interest";
    }
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
      const res = await register(formData);
      login(res.user);
      toast.success("Account created successfully!");
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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full"
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
          Join ArticleFeeds
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Create your account and start discovering amazing articles
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            error={errors.firstName}
            icon={<User className="w-5 h-5" />}
            classNme="text-gray-700"
          />
          <InputField
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            error={errors.lastName}
            icon={<User className="w-5 h-5" />}
            classNme="text-gray-700"
          />
        </div>

        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          classNme="text-gray-700"
        />

        <InputField
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          error={errors.phone}
          icon={<Phone className="w-5 h-5" />}
          classNme="text-gray-700"
        />

        <InputField
          label="Date of Birth"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
          error={errors.dob}
          icon={<Calendar className="w-5 h-5" />}
          classNme="text-gray-700"
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
          classNme="text-gray-700"
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          error={errors.confirmPassword}
          icon={<Lock className="w-5 h-5" />}
          classNme="text-gray-700"
        />

        <MultiSelectField
          label="Article Interests"
          options={categories}
          value={formData.preferences}
          onChange={handleMultiSelectChange}
          required
          error={errors.preferences}
        />

        {/* <div className="flex items-center">
          <input
            type="checkbox"
            required
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </span>
        </div> */}

        <Button onClick={handleSubmit} loading={loading}>
          Create Account
        </Button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            Sign in
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegisterPage;
