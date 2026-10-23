import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ActionMenu } from "./ActionMenu";

const setup = () => {
  const edit = vi.fn();
  const remove = vi.fn();
  render(
    <ActionMenu
      label="Actions for Ops"
      items={[
        { label: "Edit", onSelect: edit },
        { label: "Delete", onSelect: remove, danger: true },
      ]}
    />,
  );
  return { edit, remove };
};

describe("ActionMenu", () => {
  it("opens a menu of actions and runs the one picked", () => {
    const { edit } = setup();

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Actions for Ops" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(edit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and moves between actions with the arrow keys", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Actions for Ops" }));

    const edit = screen.getByRole("menuitem", { name: "Edit" });
    expect(edit).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "ArrowDown" });
    expect(edit).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes when the page is clicked elsewhere", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "Actions for Ops" }));

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens from a custom trigger and shows item icons", () => {
    render(
      <ActionMenu
        label="Account menu"
        trigger={<span>Demo Admin</span>}
        items={[{ label: "Profile", onSelect: vi.fn(), icon: <svg data-testid="icon" /> }]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    expect(screen.getByText("Demo Admin")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
