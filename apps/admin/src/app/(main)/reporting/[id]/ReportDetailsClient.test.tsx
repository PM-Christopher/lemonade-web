import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ReportDetailsClient from "./ReportDetailsClient";

const resolve = vi.fn();
const remove = vi.fn();
const detail = vi.fn();

vi.mock("next/dynamic", async () => {
  const mod = await import("@/modals/reporting/ConfirmReportActionModal");
  return { default: () => mod.default };
});
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/reporting/queries", () => ({
  useReportDetailQuery: () => ({ data: { report: detail() } }),
}));
vi.mock("@/features/reporting/mutations", () => ({
  useResolveReportMutation: () => ({ mutate: resolve, isPending: false }),
  useDeleteReportContentMutation: () => ({ mutate: remove, isPending: false }),
}));

const report = (overrides: Record<string, unknown> = {}) => ({
  id: "r1",
  unique_id: "RE12343",
  reported_by: { name: "Funmilayo Johnson", image: null },
  category: "Threads",
  case: "Abuse & Harassment",
  date_submitted: "",
  date_submitted_iso: "2024-04-23T21:45:00Z",
  status: "pending",
  resolved_by: null,
  resolved_at_iso: null,
  content: { id: "t1" },
  preview: {
    type: "thread",
    topic: "Why are structures not as good?",
    thoughts: "Architecture is an art.",
    media: [],
    videos: [],
    created_at: null,
    author: { name: "Christojoe", image: null },
  },
  ...overrides,
});

describe("ReportDetailsClient", () => {
  beforeEach(() => {
    resolve.mockReset();
    remove.mockReset();
  });

  it("shows the reported thread and its author", () => {
    detail.mockReturnValue(report());
    render(<ReportDetailsClient id="r1" />);

    expect(screen.getByText("Why are structures not as good?")).toBeInTheDocument();
    expect(screen.getByText("Christojoe")).toBeInTheDocument();
  });

  it("asks before marking a report resolved", () => {
    detail.mockReturnValue(report());
    render(<ReportDetailsClient id="r1" />);

    fireEvent.click(screen.getByRole("button", { name: "Make as resolved" }));
    expect(resolve).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Resolve" }));

    expect(resolve).toHaveBeenCalled();
  });

  it("deletes the thread only after confirming, sending its id", () => {
    detail.mockReturnValue(report());
    render(<ReportDetailsClient id="r1" />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Are you sure you want to delete this thread?")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Delete" }).at(-1) as HTMLElement);

    expect(remove).toHaveBeenCalledWith(
      { category: "Threads", category_id: "t1" },
      expect.any(Object),
    );
  });

  it("shows who resolved it and drops the actions once it is resolved", () => {
    detail.mockReturnValue(
      report({
        status: "completed",
        resolved_by: { name: "Sulaiman Abubakar", image: null },
        resolved_at_iso: "2024-04-24T10:00:00Z",
      }),
    );
    render(<ReportDetailsClient id="r1" />);

    expect(screen.getByText("Resolved")).toBeInTheDocument();
    expect(screen.getByText("Sulaiman Abubakar")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Make as resolved" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("marks deleted content and cannot be deleted again", () => {
    detail.mockReturnValue(report({ status: "deleted" }));
    render(<ReportDetailsClient id="r1" />);

    expect(screen.getAllByText("Deleted").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });
});
