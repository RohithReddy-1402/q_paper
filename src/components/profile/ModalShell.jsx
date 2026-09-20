import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/** Portal modal: a bottom sheet on phones, a centred dialog from `sm` up. Esc / backdrop closes. */
export default function ModalShell({ isOpen, onClose, title, children, maxWidth = "sm:max-w-lg" }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center sm:p-4">
      <div className="fixed inset-0 bg-gray-900/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative bg-white w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl p-5 sm:p-6`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
