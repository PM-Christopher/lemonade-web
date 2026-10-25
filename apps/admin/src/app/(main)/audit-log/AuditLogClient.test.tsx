import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AuditLogClient from "./AuditLogClient";
import type { AuditLogResponse } from "@/features/audit/api";

const query = vi.fn();

vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/hooks/useDebounce", () => ({
  default: <T,>(value: T) => ({ debouncedValue: value }),
}));
vi.mock("@/features/audit/queries", () => ({
  useAuditLogQuery: (...args: unknown[]) => query(...args),
}));

const data: AuditLogResponse = {
  logs: [
    {
      id: "l1",
      message: "Suspended an event",
      area: "events",
      subject_label: "Lagos Founders Night",
      method: "PATCH",
      ip: "10.0.0.2",
      details: { reason: "Fraud" },
      created_at: "2026-10-20T10:00:00Z",
      admin: { id: "a1", name: "Charles Ajimobi" },
    },
  ],
  admins: [{ id: "a1", name: "Charles Ajimobi" }],
  areas: ["events"],
  meta: { current_page: 1, last_page: 1, per_page: 25, total: 1 },
};

describe("AuditLogClient", () => {
  beforeEach(() => {
    query.mockReset();
    query.mockReturnValue({ data, isLoading: false, isFetching: false });
  });

  it("lists who did what, with the reason beside the action", () => {
    render(<AuditLogClient />);

    expect(screen.getByText("Charles Ajimobi")).toBeInTheDocument();
    expect(screen.getByText("Suspended an event")).toBeInTheDocument();
    expect(screen.getByText("“Fraud”")).toBeInTheDocument();
  });

  it("shows the event name as the target and never a raw id", () => {
    render(<AuditLogClient />);

    fireEvent.click(screen.getByText("Suspended an event"));

    expect(screen.getByText("Reason")).toBeInTheDocument();
    expect(screen.getByText(/10\.0\.0\.2/)).toBeInTheDocument();
    expect(screen.getAllByText("Lagos Founders Night").length).toBeGreaterThan(0);
    expect(screen.queryByText(/01a159e3/)).not.toBeInTheDocument();
  });

  it("searches, and clears the filters with one click", () => {
    render(<AuditLogClient />);

    fireEvent.change(screen.getByLabelText("Search the audit log"), { target: { value: "event" } });
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: "event", page: 1 }),
      expect.anything(),
    );

    fireEvent.click(screen.getByRole("button", { name: /Clear/ }));
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: undefined }),
      expect.anything(),
    );
  });

  it("says when nothing matches", () => {
    query.mockReturnValue({ data: { ...data, logs: [] }, isLoading: false, isFetching: false });
    render(<AuditLogClient />);

    expect(screen.getByText("No admin actions recorded yet.")).toBeInTheDocument();
  });
});
