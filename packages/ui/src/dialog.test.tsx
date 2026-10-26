import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogContentBare,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

expect.extend(toHaveNoViolations);

function ExampleDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete event</DialogTitle>
          <DialogDescription>This can&apos;t be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Cancel</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens from its trigger with an accessible name and description", () => {
    render(<ExampleDialog />);

    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const dialog = screen.getByRole("dialog", { name: "Delete event" });
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
  });

  it("closes from its built-in close button", () => {
    render(<ExampleDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", () => {
    render(<ExampleDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each([
    ["DialogContent", DialogContent],
    ["DialogContentBare", DialogContentBare],
  ])("%s keeps the dark backdrop by default", (_name, Content) => {
    render(
      <Dialog open>
        <Content>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Body</DialogDescription>
        </Content>
      </Dialog>,
    );

    expect(document.querySelector('[data-state="open"].fixed.inset-0')).toHaveClass("bg-black/80");
  });

  it("lets the caller restyle the backdrop", () => {
    render(
      <Dialog open>
        <DialogContent overlayClassName="bg-transparent">
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>None</DialogDescription>
        </DialogContent>
      </Dialog>,
    );

    const overlay = document.querySelector('[data-state="open"].fixed.inset-0');
    expect(overlay).toHaveClass("bg-transparent");
    expect(overlay).not.toHaveClass("bg-black/80");
  });

  it("has no axe violations when open", async () => {
    render(<ExampleDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    expect(await axe(document.body)).toHaveNoViolations();
  });

  it("the bare variant renders no close button of its own", () => {
    render(
      <Dialog defaultOpen>
        <DialogContentBare aria-describedby={undefined}>
          <DialogTitle>Legacy panel</DialogTitle>
        </DialogContentBare>
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { name: "Legacy panel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  });
});

describe("Dialog stuck page guard", () => {
  it("clears pointer-events on the page once the last dialog has closed", () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>One</DialogTitle>
          <DialogDescription>Body</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    document.body.style.pointerEvents = "none";

    rerender(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>One</DialogTitle>
          <DialogDescription>Body</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    vi.advanceTimersByTime(400);

    expect(document.body.style.pointerEvents).toBe("");
    vi.useRealTimers();
  });
});
