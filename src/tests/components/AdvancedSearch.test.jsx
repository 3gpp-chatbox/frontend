/**
 * @file AdvancedSearch.test.jsx
 * @description Unit tests for the AdvancedSearch modal component
 */

import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdvancedSearch from "../../components/modals/AdvancedSearch";
import { fetchProcedures, fetchProcedure } from "../../API/api_calls";

// Mock the API calls
vi.mock("../../API/api_calls");

describe("AdvancedSearch Component", () => {
  const mockProcedures = [
    {
      document_id: "1",
      document_spec: "23.502",
      document_release: "17",
      document_version: "17.2.0",
      document_procedures: [
        {
          procedure_id: "1",
          procedure_name: "Registration Procedure",
          entity: ["AMF", "UE"],
        },
        {
          procedure_id: "2",
          procedure_name: "Deregistration Procedure",
          entity: ["AMF"],
        },
      ],
    },
    {
      document_id: "2",
      document_spec: "23.503",
      document_release: "18",
      document_version: "18.0.0",
      document_procedures: [
        {
          procedure_id: "3",
          procedure_name: "Policy Association Procedure",
          entity: ["PCF", "AMF"],
        },
      ],
    },
  ];

  const mockProcedureDetails = {
    graph: {
      nodes: [{ id: "1", label: "Start" }],
      edges: [{ source: "1", target: "2" }],
    },
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API responses
    fetchProcedures.mockResolvedValue(mockProcedures);
    fetchProcedure.mockResolvedValue(mockProcedureDetails);
  });

  afterEach(() => {
    vi.resetModules();
  });

  test("renders nothing when closed", () => {
    const { container } = render(<AdvancedSearch {...defaultProps} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders modal when open", async () => {
    render(<AdvancedSearch {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText("Advanced Search")).toBeInTheDocument();
      expect(screen.getByText("Procedure Name")).toBeInTheDocument();
      expect(screen.getByText("Entity")).toBeInTheDocument();
      expect(screen.getByText("Document Specification")).toBeInTheDocument();
      expect(screen.getByText("Release")).toBeInTheDocument();
      expect(screen.getByText("Version")).toBeInTheDocument();
    });
  });

  test("loads and displays procedures data", async () => {
    const { container } = render(<AdvancedSearch {...defaultProps} />);

    await waitFor(() => {
      // Check if procedure names are loaded in the select dropdown
      const select = screen.getByRole("combobox", { name: /procedure name/i });
      const options = within(select).getAllByRole("option");
      expect(options.some(opt => opt.textContent === "Registration Procedure")).toBe(true);
      expect(options.some(opt => opt.textContent === "Deregistration Procedure")).toBe(true);
      expect(options.some(opt => opt.textContent === "Policy Association Procedure")).toBe(true);
    });
  });

  test("handles filter changes", async () => {
    render(<AdvancedSearch {...defaultProps} />);

    await waitFor(() => {
      const select = screen.getByRole("combobox", { name: /procedure name/i });
      expect(select).toBeInTheDocument();
    });

    // Select a procedure
    const procedureSelect = screen.getByRole("combobox", { name: /procedure name/i });
    fireEvent.change(procedureSelect, { target: { value: "Registration Procedure" } });

    // Check if the entity options are updated accordingly
    await waitFor(() => {
      const entitySelect = screen.getByRole("combobox", { name: /entity/i });
      const options = within(entitySelect).getAllByRole("option").filter(opt => opt.value !== "");
      expect(options).toHaveLength(2);
      expect(options.map(opt => opt.value)).toEqual(expect.arrayContaining(["AMF", "UE"]));
    });
  });

  test("handles procedure selection", async () => {
    const { container } = render(<AdvancedSearch {...defaultProps} />);

    // Wait for the list to be populated
    await waitFor(() => {
      const list = container.querySelector(".advanced-search-list");
      expect(list).toBeInTheDocument();
      
      // Wait for items to be rendered (not loading state)
      const items = container.querySelectorAll(".advanced-search-list-item");
      expect(items.length).toBeGreaterThan(0);
    });

    // Find and click the first procedure result
    const firstProcedure = container.querySelector(".advanced-search-list-item");
    fireEvent.click(firstProcedure);

    await waitFor(() => {
      expect(fetchProcedure).toHaveBeenCalledWith("1", "AMF");
      expect(defaultProps.onSelect).toHaveBeenCalledWith(expect.objectContaining({
        id: "1",
        name: "Registration Procedure",
        entity: "AMF",
      }));
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  test("handles filter reset", async () => {
    render(<AdvancedSearch {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Registration Procedure")).toBeInTheDocument();
    });

    // Apply some filters
    const procedureSelect = screen.getByLabelText("Procedure Name");
    fireEvent.change(procedureSelect, { target: { value: "Registration Procedure" } });

    // Click reset button
    const resetButton = screen.getByText("Reset Filters");
    fireEvent.click(resetButton);

    // Check if filters are reset
    await waitFor(() => {
      expect(procedureSelect.value).toBe("");
      expect(screen.getByLabelText("Entity").value).toBe("");
      expect(screen.getByLabelText("Document Specification").value).toBe("");
      expect(screen.getByLabelText("Release").value).toBe("");
      expect(screen.getByLabelText("Version").value).toBe("");
    });
  });

  test("handles API error states", async () => {
    // Mock API error
    fetchProcedures.mockRejectedValueOnce(new Error("API Error"));
    
    render(<AdvancedSearch {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load procedures.")).toBeInTheDocument();
    });
  });

  test("closes on overlay click", async () => {
    const { container } = render(<AdvancedSearch {...defaultProps} />);

    const overlay = container.querySelector(".modal-overlay");
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("closes on escape key", async () => {
    render(<AdvancedSearch {...defaultProps} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  test("prevents closing when clicking modal content", async () => {
    const { container } = render(<AdvancedSearch {...defaultProps} />);

    const modalContent = container.querySelector(".advanced-search-modal");
    expect(modalContent).toBeInTheDocument();
    fireEvent.click(modalContent);

    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  test("updates available options based on selected filters", async () => {
    render(<AdvancedSearch {...defaultProps} />);

    // Wait for the component to load
    await waitFor(() => {
      const entitySelect = screen.getByRole("combobox", { name: /entity/i });
      expect(entitySelect).toBeInTheDocument();
    });

    // Select AMF entity
    const entitySelect = screen.getByRole("combobox", { name: /entity/i });
    fireEvent.change(entitySelect, { target: { value: "AMF" } });

    // Check if procedure options are filtered correctly
    await waitFor(() => {
      const procedureSelect = screen.getByRole("combobox", { name: /procedure name/i });
      const options = within(procedureSelect).getAllByRole("option").filter(opt => opt.value !== "");
      expect(options).toHaveLength(3);
      expect(options.map(opt => opt.value)).toEqual(
        expect.arrayContaining([
          "Registration Procedure",
          "Deregistration Procedure",
          "Policy Association Procedure"
        ])
      );
    });
  });
}); 