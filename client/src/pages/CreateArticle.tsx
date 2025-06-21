"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/InputField";
import MultiSelectField from "@/components/MultiSelectField";
import Button from "@/components/Button";
import { Upload, BookOpen, Newspaper } from "lucide-react";
import { ArticleFormData, categories, tagsOptions } from "@/lib/types/article";


interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
}


const CreateArticle = () => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    body: "",
    category: "",
    tags: [],
    image: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, category: value[0] || "" }));
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleTagsChange = (value: string[]) => {
    setFormData((prev) => ({ ...prev, tags: value }));
    setErrors((prev) => ({ ...prev, tags: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.body)
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
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
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.body);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("tags", JSON.stringify(formData.tags));
    if (formData.image) formDataToSend.append("image", formData.image);

    setTimeout(() => {
      console.log("Article Created:", formData);
      setLoading(false);
      // Redirect or clear form
    }, 2000);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Article
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputField
                label="Article Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                error={errors.title}
                icon={<BookOpen className="w-5 h-5 text-gray-500" />}
                classNme="lg:col-span-2 text-gray-900"
              />
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write here...
                  <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  initial={{ height: "100px" }}
                  animate={{ height: formData.body ? "auto" : "100px" }}
                  name="description"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 text-gray-900 resize-y min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <MultiSelectField
                label="Category"
                options={categories}
                value={formData.category ? [formData.category] : []}
                onChange={handleCategoryChange}
                required
                error={errors.category}
              />
              <MultiSelectField
                label="Tags"
                options={tagsOptions}
                value={formData.tags}
                onChange={handleTagsChange}
                error={errors.tags}
              />
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Image
                </label>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center w-full"
                >
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white/50 hover:bg-gray-50 transition-all">
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-10 h-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {formData.image
                          ? formData.image.name
                          : "Drag and drop or click to upload an image"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </motion.div>
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
                Publish Article
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateArticle;
