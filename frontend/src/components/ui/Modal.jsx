import { X } from "lucide-react";

function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="scrim fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="panel w-full max-w-lg p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-ink pb-4">
          <h3 id="modal-title" className="text-2xl">
            {title}
          </h3>
          <button type="button" onClick={onClose} className="iconkey shrink-0" aria-label="Close dialog">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
