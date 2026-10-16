import { FiGlobe, FiMessageSquare, FiBell, FiX } from "react-icons/fi";

interface PushToastProps {
  title?: string;
  body?: string;
  type?: string;
  durationMs: number;
  isVisible: boolean;
  onClose: () => void;
}

const ICONS = { new_message: FiMessageSquare, new_connection: FiGlobe } as const;

// Foreground push card: white surface, green icon badge and a countdown bar.
export const PushToast = ({
  title,
  body,
  type,
  durationMs,
  isVisible,
  onClose,
}: PushToastProps) => {
  const Icon = ICONS[type as keyof typeof ICONS] ?? FiBell;

  return (
    <div
      role="status"
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="bg-gradient-green flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white">
          <Icon size={18} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-black-light text-body-s truncate font-semibold">{title}</p>
          <p className="text-text-grey text-body-s mt-0.5 line-clamp-2">{body}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="text-text-grey shrink-0 rounded-full p-1 hover:bg-gray-100"
        >
          <FiX size={16} aria-hidden="true" />
        </button>
      </div>
      <div
        className="bg-gradient-green h-1 origin-left"
        style={{ animation: `push-toast-countdown ${durationMs}ms linear forwards` }}
      />
    </div>
  );
};
