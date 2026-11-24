import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SupportChatPanel } from "./SupportChatPanel";

const edit = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) =>
    select({ auth: { isLoggedIn: true, admin: { id: "admin-1" } } }),
}));

const message = (over: Record<string, unknown>) => ({
  media: [],
  read_at: null,
  created_at: "2026-10-20T08:00:00Z",
  edited_at: null,
  admin_id: null,
  ...over,
});

vi.mock("@/features/user/queries", () => ({
  useSupportMessagesQuery: () => ({
    data: {
      messages: [
        message({ id: "m1", sender: "user", message: "My order is late" }),
        message({
          id: "m2",
          sender: "admin",
          admin_id: "admin-1",
          message: "Please send the order number",
          edited_at: "2026-10-20T08:05:00Z",
        }),
        message({
          id: "m3",
          sender: "admin",
          admin_id: "admin-2",
          message: "A colleague wrote this",
        }),
      ],
    },
  }),
  useSupportMessageEditsQuery: (_id: string, messageId: string | null) => ({
    data: messageId
      ? {
          message_id: messageId,
          edit_count: 1,
          current: "Please send the order number",
          versions: [
            {
              version: 1,
              message: "Send your order id",
              at: "2026-10-20T08:00:00Z",
              edited_by: null,
              changes: null,
            },
            {
              version: 2,
              message: "Please send the order number",
              at: "2026-10-20T08:05:00Z",
              edited_by: { type: "admin", id: "admin-1" },
              changes: [
                { type: "removed", text: "Send your order id" },
                { type: "added", text: "Please send the order number" },
              ],
            },
          ],
        }
      : undefined,
    isLoading: false,
    isError: false,
  }),
}));
vi.mock("@/features/user/mutations", () => ({
  useSendSupportMessageMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useUploadChatMediaMutation: () => ({ mutate: vi.fn(), isPending: false }),
  useEditSupportMessageMutation: () => ({ mutate: edit, isPending: false }),
}));

describe("SupportChatPanel editing", () => {
  beforeEach(() => edit.mockReset());

  it("offers Edit only on the signed-in admin's own messages", () => {
    render(<SupportChatPanel userId="user-1" />);

    expect(screen.getAllByRole("button", { name: "Edit" })).toHaveLength(1);
  });

  it("saves the new text of my message", () => {
    render(<SupportChatPanel userId="user-1" />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit message"), { target: { value: "Order number?" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(edit).toHaveBeenCalledWith(
      { messageId: "m2", message: "Order number?" },
      expect.any(Object),
    );
  });

  it("shows every version with who changed it and what changed", () => {
    render(<SupportChatPanel userId="user-1" />);

    fireEvent.click(screen.getByRole("button", { name: "edited" }));

    expect(screen.getByText(/Original/)).toBeInTheDocument();
    expect(screen.getByText(/Edit 1 by Admin/)).toBeInTheDocument();
    expect(screen.getByText("Send your order id", { selector: "del" })).toBeInTheDocument();
    expect(
      screen.getByText("Please send the order number", { selector: "ins" }),
    ).toBeInTheDocument();
  });
});
