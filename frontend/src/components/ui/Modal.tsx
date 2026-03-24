import React from "react";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export default function Modal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-scaleIn">
      
      {/* Modal Box */}
      <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md border border-white/10">

        {/* Title */}
        {title && (
          <h2 className="text-xl font-bold mb-2">{title}</h2>
        )}

        {/* Message */}
        <p className="text-zinc-300 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              {cancelText}
            </button>
          )}

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-white text-black hover:opacity-80 transition"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}