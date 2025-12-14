import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillNode } from "./SkillNode";

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

describe("SkillNode", () => {
  const mockHandleClick = vi.fn();

  const mockProps = {
    id: "test-node",
    data: {
      label: "Moon walk",
      description: "A cool dance move",
      category: "movement",
      handleSkillNodeClick: mockHandleClick,
      selected: false,
      locked: false,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render skill label, description, and category", () => {
    render(<SkillNode {...mockProps} />);

    expect(screen.getByText("Moon walk")).toBeInTheDocument();
    expect(screen.getByText("A cool dance move")).toBeInTheDocument();
    expect(screen.getByText("movement")).toBeInTheDocument();
  });

  it("should render with selected class when selected", () => {
    const selectedProps = {
      ...mockProps,
      data: { ...mockProps.data, selected: true },
    };

    render(<SkillNode {...selectedProps} />);

    const nodeElement = screen.getByText("Moon walk").closest(".skill-node");
    expect(nodeElement).toHaveClass("skill-node", "selected-skill-node");
  });

  it("should render with locked class when locked", () => {
    const lockedProps = {
      ...mockProps,
      data: { ...mockProps.data, locked: true },
    };

    render(<SkillNode {...lockedProps} />);

    const nodeElement = screen.getByText("Moon walk").closest(".skill-node");
    expect(nodeElement).toHaveClass("skill-node", "locked-skill-node");
  });

  it("should handle click when not locked", () => {
    render(<SkillNode {...mockProps} />);

    const nodeElement = screen.getByText("Moon walk").closest(".skill-node");
    fireEvent.click(nodeElement);

    expect(mockHandleClick).toHaveBeenCalledWith("test-node");
  });

  it("should not handle click when locked", () => {
    const lockedProps = {
      ...mockProps,
      data: { ...mockProps.data, locked: true },
    };

    render(<SkillNode {...lockedProps} />);

    const nodeElement = screen.getByText("Moon walk").closest(".skill-node");
    fireEvent.click(nodeElement);

    expect(mockHandleClick).not.toHaveBeenCalled();
  });

  it("should render both target and source handles", () => {
    render(<SkillNode {...mockProps} />);

    const targetHandle = screen.getByTestId("handle-target");
    const sourceHandle = screen.getByTestId("handle-source");

    expect(targetHandle).toHaveAttribute("data-position", "top");
    expect(sourceHandle).toHaveAttribute("data-position", "bottom");
    expect(targetHandle).toHaveStyle({ visibility: "hidden" });
    expect(sourceHandle).toHaveStyle({ visibility: "hidden" });
  });
});
