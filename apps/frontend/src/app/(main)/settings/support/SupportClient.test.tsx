import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { clearTyping, markTyping } from "@/lib/typing";
import SupportClient from "./SupportClient";

const send = vi.fn();
const upload = vi.fn();
const edit = vi.fn();
const sendTyping = vi.hoisted(() => vi.fn());

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => vi.fn() }));
vi.mock("@/components/layouts/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/global/BackHeader", () => ({ BackHeader: () => null }));
vi.mock("@/features/settings/queries", () => ({
  settingsKeys: { supportUnread: () => ["unread"] },
  useSupportMessagesQuery: () => ({
    data: {
      messages: [
        {
          id: "m1",
          sender: "admin",
          message: "Here you go",
          media: [
            { type: "image", url: "https://cdn.test/a.png" },
            { type: "image", url: "https://cdn.test/b.png" },
          ],
          read_at: null,
          created_at: "2026-10-20T08:00:00Z",
          edited_at: null,
        },
        {
          id: "m2",
          sender: "user",
          message: "My order is late",
          media: [],
          read_at: null,
          created_at: "2026-10-20T09:00:00Z",
          edited_at: "2026-10-20T09:05:00Z",
        },
      ],
    },
  }),
}));
vi.mock("@/features/settings/useSupportRealtime", () => ({
  SUPPORT_TYPING_KEY: "support",
  useSupportRealtime: vi.fn(),
}));
vi.mock("@/features/settings/api", () => ({ settingsApi: { sendSupportTyping: sendTyping } }));
vi.mock("@/features/settings/mutations", () => ({
  useSendSupportMessageMutation: () => ({ mutate: send, isPending: false }),
  useUploadSupportMediaMutation: () => ({ mutate: upload, isPending: false }),
  useEditSupportMessageMutation: () => ({ mutate: edit, isPending: false }),
}));

describe("SupportClient", () => {
  beforeEach(() => {
    send.mockReset();
    upload.mockReset();
    edit.mockReset();
    sendTyping.mockReset();
    sendTyping.mockResolvedValue({});
    clearTyping("support");
  });

  it("shows every attachment on a message", () => {
    render(<SupportClient />);

    expect(screen.getAllByAltText("Attachment")).toHaveLength(2);
  });

  it("uploads several picked files and sends them in one message", () => {
    render(<SupportClient />);

    const files = [
      new File(["a"], "a.png", { type: "image/png" }),
      new File(["b"], "clip.mp4", { type: "video/mp4" }),
    ];
    fireEvent.change(screen.getByLabelText("Attachment files"), { target: { files } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(upload).toHaveBeenCalledWith(files, expect.any(Object));
    const media = [
      { type: "image", url: "https://cdn.test/a.png" },
      { type: "video", url: "https://cdn.test/clip.mp4" },
    ];
    upload.mock.calls[0][1].onSuccess(media);
    expect(send).toHaveBeenCalledWith({ media }, expect.any(Object));
  });

  it("sends plain text without uploading", () => {
    render(<SupportClient />);

    fireEvent.change(screen.getByLabelText("Message"), { target: { value: " Hi " } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(upload).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith({ message: "Hi" }, expect.any(Object));
  });

  it("marks an edited message and offers Edit on my own messages only", () => {
    render(<SupportClient />);

    expect(screen.getByText(/edited ·/)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
  });

  it("edits my message and saves the new text", () => {
    render(<SupportClient />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit message"), {
      target: { value: "My order 123 is late" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(edit).toHaveBeenCalledWith(
      { id: "m2", message: "My order 123 is late" },
      expect.any(Object),
    );
  });

  it("shows when support is typing", () => {
    render(<SupportClient />);
    expect(screen.queryByText("Support is typing...")).not.toBeInTheDocument();

    act(() => markTyping("support"));

    expect(screen.getByText("Support is typing...")).toBeInTheDocument();
  });

  it("tells support when the user types", () => {
    render(<SupportClient />);

    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hel" } });

    expect(sendTyping).toHaveBeenCalledTimes(1);
  });
});
