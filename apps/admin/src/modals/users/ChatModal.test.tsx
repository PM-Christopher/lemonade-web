import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ChatModal from "./ChatModal";

const send = vi.fn();
const upload = vi.fn();

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
  useUploadChatMediaMutation: () => ({ mutate: upload, isPending: false }),
}));

describe("ChatModal", () => {
  beforeEach(() => {
    send.mockReset();
    upload.mockReset();
  });

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

  it("uploads several picked files together and sends them with the text", () => {
    render(<ChatModal isOpen toggle={vi.fn()} userId="u1" />);

    const files = [
      new File(["a"], "a.png", { type: "image/png" }),
      new File(["b"], "b.jpg", { type: "image/jpeg" }),
    ];
    fireEvent.change(screen.getByLabelText("Attachment files"), { target: { files } });
    expect(screen.getByAltText("a.png")).toBeInTheDocument();
    expect(screen.getByAltText("b.jpg")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Message"), { target: { value: "See these" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(upload).toHaveBeenCalledWith(files, expect.any(Object));
    const media = [
      { type: "image", url: "https://cdn.test/a.png" },
      { type: "image", url: "https://cdn.test/b.jpg" },
    ];
    upload.mock.calls[0][1].onSuccess(media);
    expect(send).toHaveBeenCalledWith({ message: "See these", media }, expect.any(Object));
  });

  it("lets a picked file be removed and stops at four files", () => {
    render(<ChatModal isOpen toggle={vi.fn()} userId="u1" />);

    const five = Array.from(
      { length: 5 },
      (_, i) => new File(["x"], `f${i}.png`, { type: "image/png" }),
    );
    fireEvent.change(screen.getByLabelText("Attachment files"), { target: { files: five } });

    expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Remove f0.png" }));
    expect(screen.getAllByRole("button", { name: /^Remove / })).toHaveLength(3);
  });
});
