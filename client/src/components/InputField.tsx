'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  icon?: ReactNode;
  classNme?: string;
}

const InputField = ({ label, type, name, value, onChange, required, error, icon, classNme }:InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${classNme} mb-6`}
    >
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{icon}</div>
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''} border-2 rounded-xl transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
          `}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
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

export default InputField;