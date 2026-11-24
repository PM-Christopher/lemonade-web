import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MessageEditor } from "./MessageEditor";

const setup = (over: Partial<React.ComponentProps<typeof MessageEditor>> = {}) => {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  render(
    <MessageEditor
      initial="See you at 5"
      maxLength={100}
      saving={false}
      onSave={onSave}
      onCancel={onCancel}
      {...over}
    />,
  );
  return { onSave, onCancel, box: screen.getByLabelText("Edit message") };
};

describe("MessageEditor", () => {
  it("starts with the current text and cannot save until it changes", () => {
    setup();

    expect(screen.getByLabelText("Edit message")).toHaveValue("See you at 5");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("saves the trimmed new text", () => {
    const { onSave, box } = setup();

    fireEvent.change(box, { target: { value: "  See you at 6  " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith("See you at 6");
  });

  it("saves on Enter, keeps a new line on Shift+Enter, and cancels on Escape", () => {
    const { onSave, onCancel, box } = setup();

    fireEvent.change(box, { target: { value: "Changed" } });
    fireEvent.keyDown(box, { key: "Enter", shiftKey: true });
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.keyDown(box, { key: "Enter" });
    expect(onSave).toHaveBeenCalledWith("Changed");

    fireEvent.keyDown(box, { key: "Escape" });
    expect(onCancel).toHaveBeenCalled();
  });

  it("does not save an empty message or while saving", () => {
    const { onSave, box } = setup({ saving: true });

    fireEvent.change(box, { target: { value: "" } });
    fireEvent.keyDown(box, { key: "Enter" });

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
  });
});
