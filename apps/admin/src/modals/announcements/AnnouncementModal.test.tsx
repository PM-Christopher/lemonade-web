import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AnnouncementModal from "./AnnouncementModal";
import type { AnnouncementRow } from "@/features/announcements/api";

const mutate = vi.fn();
const dispatch = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => dispatch }));
vi.mock("next/dynamic", () => ({ default: () => () => <p>Schedule picker</p> }));
vi.mock("@/features/announcements/mutations", () => ({
  useSaveAnnouncementMutation: () => ({ mutate, isPending: false }),
}));

const announcement = (status: string): AnnouncementRow => ({
  id: 7,
  unique_id: "AN1",
  title: "Maintenance",
  created_by: { name: "Admin", image: null },
  content: "We will be down",
  created_at: "",
  scheduled_date: "",
  created_at_iso: "2030-01-01T00:00:00Z",
  scheduled_at: "2030-02-01T09:00:00Z",
  status,
});

const fill = () => {
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Hello" } });
  fireEvent.change(screen.getByLabelText("Body"), { target: { value: "World" } });
};

describe("AnnouncementModal", () => {
  beforeEach(() => {
    mutate.mockReset();
    dispatch.mockReset();
  });

  it("asks for a title and body before saving a draft", async () => {
    render(<AnnouncementModal isOpen toggle={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Save as draft" }));

    expect(await screen.findByText("Title is required")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("saves a new announcement as a draft", async () => {
    mutate.mockImplementation((_payload, options) => options.onSuccess());
    const toggle = vi.fn();
    render(<AnnouncementModal isOpen toggle={toggle} />);
    fill();

    fireEvent.click(screen.getByRole("button", { name: "Save as draft" }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { title: "Hello", content: "World", draft: true },
        expect.any(Object),
      ),
    );
    expect(toggle).toHaveBeenCalled();
  });

  it("keeps a scheduled announcement scheduled when only the text is saved", async () => {
    render(<AnnouncementModal isOpen toggle={vi.fn()} announcement={announcement("pending")} />);

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Maintenance tonight" } });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { title: "Maintenance tonight", content: "We will be down", draft: false },
        expect.any(Object),
      ),
    );
  });

  it("keeps a draft a draft when changes are saved", async () => {
    render(<AnnouncementModal isOpen toggle={vi.fn()} announcement={announcement("draft")} />);

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({ draft: true }),
        expect.any(Object),
      ),
    );
  });

  it("opens the scheduler only once the form is valid", async () => {
    render(<AnnouncementModal isOpen toggle={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Schedule" }));
    expect(screen.queryByText("Schedule picker")).not.toBeInTheDocument();

    fill();
    fireEvent.click(screen.getByRole("button", { name: "Schedule" }));
    expect(await screen.findByText("Schedule picker")).toBeInTheDocument();
  });
});
