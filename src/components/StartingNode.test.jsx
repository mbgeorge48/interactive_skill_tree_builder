import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StartingNode } from "./StartingNode";

vi.mock("@xyflow/react", () => ({
  Position: {
    Bottom: "bottom",
    Top: "top",
  },
  Handle: ({ type, position, style }) => (
    <div
      data-testid={`handle-${type}`}
      data-position={position}
      style={style}
    />
  ),
}));

describe("StartingNode", () => {
  it("should render starting point text", () => {
    render(<StartingNode />);

    expect(screen.getByText("Starting Point")).toBeInTheDocument();
  });

  it("should render a source handle at bottom position", () => {
    render(<StartingNode />);

    const handle = screen.getByTestId("handle-source");
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveAttribute("data-position", "bottom");
    expect(handle).toHaveStyle({ visibility: "hidden" });
  });
});
