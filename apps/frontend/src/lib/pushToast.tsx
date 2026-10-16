import { toast } from "react-hot-toast";
import { PushToast } from "@/components/global/PushToast";

// How long a push toast stays on screen.
export const PUSH_TOAST_DURATION_MS = 10_000;

interface ShowPushToastInput {
  id?: string;
  title?: string;
  body?: string;
  type?: string;
}

// Shows the push card; the same id replaces a toast instead of stacking a second one.
export function showPushToast({ id, title, body, type }: ShowPushToastInput) {
  toast.custom(
    (t) => (
      <PushToast
        title={title}
        body={body}
        type={type}
        durationMs={PUSH_TOAST_DURATION_MS}
        isVisible={t.visible}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    { id, duration: PUSH_TOAST_DURATION_MS },
  );
}
