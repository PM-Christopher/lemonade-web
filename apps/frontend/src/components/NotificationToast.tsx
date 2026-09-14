import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

type Notification = {
  title: string;
  body: string;
};

const NotificationToast = ({ payload }: { payload: Notification }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (payload) {
      setNotification(payload);

      toast.custom((t) => (
        <div
          className={`pointer-events-auto flex w-full max-w-sm rounded-xl bg-gradient-green p-4 shadow-lg ring-1 ring-black ring-opacity-5 transition-all ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <div className="w-0 flex-1">
            <p className={"text-sm font-semibold text-white"}>New notification</p>
            <p className="mt-2 text-sm font-semibold text-stone-100">{payload?.title}</p>
            <p className="mt-[0.5px] text-sm text-stone-100">{payload?.body}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 flex-shrink-0 text-white hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>
      ));
    }
  }, [payload]);

  // Show persistent preview when no payload
  if (!payload) {
    return (
      <div className="w-full max-w-sm rounded-xl bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
        <p className="text-sm font-semibold text-gray-900">Sample Title</p>
        <p className="mt-1 text-sm text-gray-600">This is a sample body text for preview.</p>
      </div>
    );
  }

  return null;
};

export default NotificationToast;
