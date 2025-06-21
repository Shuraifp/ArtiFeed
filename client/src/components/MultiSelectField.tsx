"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface MultiSelectFieldProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
}

const MultiSelectField = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
}: MultiSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(value || []);

  const handleToggleItem = (item: string) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item];

    setSelectedItems(newSelection);
    onChange(newSelection);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
            ${
              error
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
        >
          <div className="flex justify-between items-center">
            <span
              className={
                selectedItems.length ? "text-gray-900" : "text-gray-500"
              }
            >
              {selectedItems.length
                ? `${selectedItems.length} categories selected`
                : "Select your interests"}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="text-gray-400"
            >
              ↓
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg"
            >
              {options.map((option) => (
                <motion.div
                  key={option}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  onClick={() => handleToggleItem(option)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-gray-700">{option}</span>
                  {selectedItems.includes(option) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {selectedItems.map((item) => (
            <motion.span
              key={item}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center"
            >
              {item}
              <button
                onClick={() => handleToggleItem(item)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default MultiSelectField;
