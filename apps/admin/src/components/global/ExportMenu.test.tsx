import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ExportMenu } from "./ExportMenu";

describe("ExportMenu", () => {
  it("offers pdf and csv and reports the choice", () => {
    const onExport = vi.fn();
    render(<ExportMenu onExport={onExport} />);

    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Export as pdf" }));

    expect(onExport).toHaveBeenCalledWith("pdf");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
