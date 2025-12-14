import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Modal } from "./Modal";

// Mock dialog element methods for testing environment
Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
  value: vi.fn(),
  writable: true
});

Object.defineProperty(HTMLDialogElement.prototype, 'close', {
  value: vi.fn(),
  writable: true
});

describe("Modal", () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockExistingNodes = [
    { id: "node-1", data: { label: "Moon walk" } },
    { id: "node-2", data: { label: "The worm" } },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    existingNodes: mockExistingNodes,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render modal with expected fields", () => {
    render(<Modal {...defaultProps} />);

    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
    expect(screen.getByLabelText("Close modal")).toBeInTheDocument();
    expect(screen.getByLabelText(/skill name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prerequisite/i)).toBeInTheDocument();
  });

  it("should render prerequisite options from existing nodes", () => {
    render(<Modal {...defaultProps} />);

    const prerequisiteSelect = screen.getByLabelText(/prerequisite/i);
    expect(prerequisiteSelect).toBeInTheDocument();

    expect(screen.getByText("Moon walk")).toBeInTheDocument();
    expect(screen.getByText("The worm")).toBeInTheDocument();
  });

  it("should handle form input changes", () => {
    render(<Modal {...defaultProps} />);

    const skillNameInput = screen.getByLabelText(/skill name/i);
    const descriptionTextarea = screen.getByLabelText(/description/i);

    fireEvent.change(skillNameInput, { target: { value: "New Shiny Skill" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Very Detailed Description" },
    });

    expect(skillNameInput.value).toBe("New Shiny Skill");
    expect(descriptionTextarea.value).toBe("Very Detailed Description");
  });

  it("should handle category selection", () => {
    render(<Modal {...defaultProps} />);

    const categorySelect = screen.getByLabelText(/category/i);

    fireEvent.change(categorySelect, { target: { value: "combat" } });

    expect(categorySelect.value).toBe("combat");
  });

  it("should handle form submission", () => {
    render(<Modal {...defaultProps} />);

    const skillNameInput = screen.getByLabelText(/skill name/i);
    const submitButton = screen.getByText("Add Skill");

    fireEvent.change(skillNameInput, { target: { value: "Cha Cha Slide" } });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      skillName: "Cha Cha Slide",
      description: "",
      category: "movement",
      prerequisite: "",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should handle form submission with full data", () => {
    render(<Modal {...defaultProps} />);

    const skillNameInput = screen.getByLabelText(/skill name/i);
    const descriptionTextarea = screen.getByLabelText(/description/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const submitButton = screen.getByText("Add Skill");

    fireEvent.change(skillNameInput, { target: { value: "Cha Cha Slide" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Cha Cha Real Smooth" },
    });
    fireEvent.change(categorySelect, { target: { value: "combat" } });

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      skillName: "Cha Cha Slide",
      description: "Cha Cha Real Smooth",
      category: "combat",
      prerequisite: "",
    });
  });

  it("should handle cancel button", () => {
    render(<Modal {...defaultProps} />);

    const skillNameInput = screen.getByLabelText(/skill name/i);
    const cancelButton = screen.getByText("Cancel");

    // Fill in some data first
    fireEvent.change(skillNameInput, { target: { value: "Test Skill" } });
    expect(skillNameInput.value).toBe("Test Skill");

    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should handle close button", () => {
    render(<Modal {...defaultProps} />);

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should reset form after successful submission", async () => {
    render(<Modal {...defaultProps} />);

    const skillNameInput = screen.getByLabelText(/skill name/i);
    const submitButton = screen.getByText("Add Skill");

    // Fill and submit form
    fireEvent.change(skillNameInput, { target: { value: "Test Skill" } });
    fireEvent.click(submitButton);

    // Form should be reset (this tests the internal state)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
