'use client';

import { motion } from 'framer-motion';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | string[];
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  multiple?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  required,
  multiple,
}) => {
  return (
    <motion.div className="mb-4" whileHover={{ scale: 1.02 }}>
      <label htmlFor={name} className="block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        multiple={multiple}
        className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--background)] text-[var(--foreground)]"
      >
        {!multiple && <option value="">Select {label}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default SelectField;