"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/InputField";
import MultiSelectField from "@/components/MultiSelectField";
import Button from "@/components/Button";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Settings as SettingsIcon,
} from "lucide-react";
import { UserFormData } from "@/lib/types/user";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  password?: string;
  confirmPassword?: string;
  preferences?: string;
}

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

const Settings = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    dob: "1990-01-01",
    password: "",
    confirmPassword: "",
    preferences: ["Space", "Technology"],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMultiSelectChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, preferences: value }));
    setErrors((prev) => ({ ...prev, preferences: "" }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (formData.preferences.length === 0) {
      newErrors.preferences = "Please select at least one preference";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Settings Updated:", formData);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl ml-0 mr-auto relative">
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
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl"
      /> */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile Settings
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  error={errors.firstName}
                  icon={<User className="w-5 h-5 text-gray-500" />}
                />
                <InputField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  error={errors.lastName}
                  icon={<User className="w-5 h-5 text-gray-500" />}
                />
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  error={errors.email}
                  icon={<Mail className="w-5 h-5 text-gray-500" />}
                />
                <InputField
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  error={errors.phone}
                  icon={<Phone className="w-5 h-5 text-gray-500" />}
                />
                <InputField
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  error={errors.dob}
                  icon={<Calendar className="w-5 h-5 text-gray-500" />}
                />
              </div>
            </div>
            {/* Password Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InputField
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  icon={<Lock className="w-5 h-5 text-gray-500" />}
                />
                <InputField
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  icon={<Lock className="w-5 h-5 text-gray-500" />}
                />
              </div>
            </div>
            {/* Preferences Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Article Preferences
              </h3>
              <MultiSelectField
                label="Preferred Categories"
                options={categories}
                value={formData.preferences}
                onChange={handleMultiSelectChange}
                required
                error={errors.preferences}
              />
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button
              onClick={() => {}}
              loading={loading}
              className="w-full py-3 text-lg"
            >
              Save Changes
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;
