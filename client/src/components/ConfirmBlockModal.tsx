"use client";
import { motion } from "framer-motion";

export default function ConfirmBlockModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Block Article?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to block this article? It will no longer appear in your feed.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Block
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
