import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ChatModal from "./ChatModal";

const send = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/user/queries", () => ({
  useSupportMessagesQuery: () => ({
    data: {
      messages: [
        {
          id: "m1",
          sender: "user",
          message: "Hi, I need help",
          media: [],
          read_at: null,
          created_at: "2026-10-20T08:00:00Z",
        },
        {
          id: "m2",
          sender: "admin",
          message: null,
          media: [{ type: "image", url: "https://cdn.test/a.png" }],
          read_at: null,
          created_at: "2026-10-20T08:01:00Z",
        },
      ],
    },
  }),
}));
vi.mock("@/features/user/mutations", () => ({
  useSendSupportMessageMutation: () => ({ mutate: send, isPending: false }),
  useUploadChatMediaMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

describe("ChatModal", () => {
  beforeEach(() => send.mockReset());

  it("shows the conversation, including attachments", () => {
    render(<ChatModal isOpen toggle={vi.fn()} userId="u1" userName="Ada" />);

    expect(screen.getByText("Hi, I need help")).toBeInTheDocument();
    expect(screen.getByAltText("Attachment")).toHaveAttribute("src", "https://cdn.test/a.png");
  });

  it("sends the typed message and ignores a blank one", () => {
    render(<ChatModal isOpen toggle={vi.fn()} userId="u1" />);

    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: " Hello " } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(send).toHaveBeenCalledWith({ message: "Hello" }, expect.any(Object));
  });
});
