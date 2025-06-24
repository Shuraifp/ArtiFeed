"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/components/InputField";
import MultiSelectField from "@/components/MultiSelectField";
import Button from "@/components/Button";
import { Upload, Edit, BookOpen, X } from "lucide-react";
import { Article, categories, tagsOptions } from "@/lib/types/article";
import { updateArticle } from "@/lib/api/article";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/handleApiError";

interface FormData {
  title: string;
  body: string;
  category: string;
  tags: string[];
  image: string | null;
  existingImage?: string;
}

interface FormErrors {
  title?: string;
  body?: string;
  category?: string;
  tags?: string;
}

const EditArticle = ({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: article?.title || "",
    body: article?.body || "",
    category: article?.category || "",
    tags: article?.tags || [],
    image: null,
    existingImage: article?.image || "",
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
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: reader.result as string,
          existingImage: "",
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.body) newErrors.body = "Body is required";
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
    try {
      await updateArticle(article.id, {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        tags: formData.tags,
        image: formData.image || formData.existingImage || null,
      });

      toast.success("Article updated successfully!");
      onClose();
    } catch (error) {
      handleApiError({ error, router, user });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 flex justify-center items-center bg-black/50 p-8 z-50 overflow-y-scroll">
      <div className="bg-white max-w-4xl w-full mt-100 rounded-xl shadow-xl relative">
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
          <div className="flex items-center justify-between mb-8 relative">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <Edit className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Edit Article
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
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
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 text-gray-900 resize-y min-h-[100px]"
                />
                {errors.body && (
                  <p className="text-red-500 text-sm mt-1">{errors.body}</p>
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
                {formData.existingImage && !formData.image && (
                  <div className="mb-4">
                    <img
                      src={formData.existingImage}
                      alt="Current article image"
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, existingImage: "" }))
                      }
                      className="mt-2 text-red-600 text-sm hover:underline"
                    >
                      Remove Current Image
                    </button>
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center w-full"
                >
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-white/50 hover:bg-gray-50 transition-all">
                    {formData.image ? (
                      <div className="w-full h-40 flex items-center justify-center">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-full object-contain rounded-xl"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="w-10 h-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag and drop or click to upload an image
                        </p>
                      </div>
                    )}
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
                Update Article
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </main>
  );
};

export default EditArticle;
