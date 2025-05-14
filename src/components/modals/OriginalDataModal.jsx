import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../../functions/jsonToMermaid";
import ModalDiagram from "../modals/ModalDiagram";
import { highlightJson } from "../../utils/jsonHighlighter";
import { highlightMermaid } from "../../utils/MermaidHighlighter";

function OriginalDataModal({ isOpen, onClose, originalData }) {
  const [selectedView, setSelectedView] = useState("json");
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isWrapped, setIsWrapped] = useState(true);
  const editorRef = useRef(null);

  // Reset position when modal is opened
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Handle modal dragging
  const handleMouseDown = useCallback(
    (e) => {
      // Only allow dragging from the header
      if (e.target.closest(".modal-header")) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [position],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isOpen, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (originalData) {
      console.log("OriginalData received:", originalData);
      // Validate data structure
      if (!originalData.nodes || !originalData.edges) {
        console.error(
          "Invalid data structure - missing nodes or edges:",
          originalData,
        );
        setError("Invalid data structure");
      }
    }
  }, [originalData]);

  if (!isOpen) return null;

  const jsonContent = originalData ? JSON.stringify(originalData, null, 2) : "";
  let mermaidCode = "";

  try {
    // Generate mermaid code and log for debugging
    if (originalData && originalData.nodes && originalData.edges) {
      mermaidCode = JsonToMermaid(originalData);
      console.log("Generated Mermaid Code:", mermaidCode);

      if (!mermaidCode) {
        console.warn(
          "No mermaid code generated from originalData:",
          originalData,
        );
        setError("Failed to generate diagram");
      }
    } else {
      console.warn("Invalid or missing data structure:", originalData);
      setError("Invalid data structure");
    }
  } catch (error) {
    console.error("Error generating mermaid code:", error);
    setError(error.message);
    mermaidCode =
      "graph TD\nA[Error] -->|Failed to generate diagram| B[Please check console]";
  }

  // Clean up mermaid code by removing initialization and class definitions
  const cleanMermaidCode = (code) => {
    return code
      .split("\n")
      .filter(
        (line) => 
          // Keep flowchart direction lines
          (line.startsWith('flowchart') || line.startsWith('graph')) ||
          // Filter out only init and class definitions
          (!line.includes("%%{init:") && !line.includes("classDef"))
      )
      .join("\n");
  };

  // Handle fold/unfold
  const handleFold = (event) => {
    const button = event.target;
    if (!button.classList.contains("fold-button")) return;

    const line = button.closest(".code-line");
    if (!line) return;

    const level = parseInt(line.dataset.level);

    // Toggle fold state
    const isFolded = button.textContent === "▼";
    button.textContent = isFolded ? "▶" : "▼";

    // Find the range to fold/unfold
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      current.style.display = isFolded ? "none" : "flex";
      current = current.nextElementSibling;
    }
  };

  // Function to render the appropriate view
  const renderView = () => {
    switch (selectedView) {
      case "json":
        return (
          <div className="json-viewer-content">
            <pre className="json-content">
              <div
                className={`code-content ${isWrapped ? "wrapped" : ""}`}
                dangerouslySetInnerHTML={{
                  __html: highlightJson(jsonContent),
                }}
                onClick={handleFold}
              />
            </pre>
            <div className="viewer-controls bottom-controls">
              <label className="wrap-toggle">
                <input
                  type="checkbox"
                  checked={isWrapped}
                  onChange={() => setIsWrapped(!isWrapped)}
                />
                Wrap Text
              </label>
            </div>
          </div>
        );
      case "mermaid":
        return (
          <div className="json-viewer-content">
            <pre className="json-content">
              <div className="mermaid-editor">
                <div
                  ref={editorRef}
                  className={`code-content ${isWrapped ? "wrapped" : ""}`}
                  contentEditable={false}
                  spellCheck="false"
                  dangerouslySetInnerHTML={{
                    __html: highlightMermaid(cleanMermaidCode(mermaidCode))
                  }}
                />
              </div>
            </pre>
            <div className="viewer-controls bottom-controls">
              <label className="wrap-toggle">
                <input
                  type="checkbox"
                  checked={isWrapped}
                  onChange={() => setIsWrapped(!isWrapped)}
                />
                Wrap Text
              </label>
            </div>
          </div>
        );
      case "graph":
        return (
          <div
            className="graph-view content-area"
            style={{
              height: "calc(100vh - 200px)",
              width: "100%",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
            }}
          >
            {error ? (
              <div
                className="error-message"
                style={{ padding: "20px", textAlign: "center", color: "red" }}
              >
                {error}
              </div>
            ) : mermaidCode ? (
              <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
                <ModalDiagram mermaidCode={mermaidCode} />
              </div>
            ) : (
              <div
                className="error-message"
                style={{ padding: "20px", textAlign: "center" }}
              >
                No diagram data available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "transparent",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          maxHeight: "90vh",
          width: "100vw",
          maxWidth: "900px",
          backgroundColor: "#1a1a1a",
          border: "1px solid #333",
          borderRadius: "8px",
          overflow: "hidden",
          position: "absolute",
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          pointerEvents: "auto",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          className="modal-header"
          style={{
            cursor: "grab",
            userSelect: "none",
            padding: "12px 16px",
            backgroundColor: "#27272a",
            borderBottom: "1px solid #333",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="modal-view-buttons"
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              className={`modal-view-button ${
                selectedView === "json" ? "active" : ""
              }`}
              onClick={() => setSelectedView("json")}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  selectedView === "json" ? "#3b82f6" : "#374151",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              JSON View
            </button>
            <button
              className={`modal-view-button ${
                selectedView === "mermaid" ? "active" : ""
              }`}
              onClick={() => setSelectedView("mermaid")}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  selectedView === "mermaid" ? "#3b82f6" : "#374151",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Mermaid View
            </button>
            <button
              className={`modal-view-button ${
                selectedView === "graph" ? "active" : ""
              }`}
              onClick={() => setSelectedView("graph")}
              style={{
                padding: "6px 12px",
                backgroundColor:
                  selectedView === "graph" ? "#3b82f6" : "#374151",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Graph View
            </button>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#f4f4f5",
              fontSize: "24px",
              cursor: "pointer",
              padding: "4px 8px",
              marginLeft: "16px",
            }}
          >
            ×
          </button>
        </div>
        <div
          className="modal-body content-area"
          style={{
            padding: selectedView === "graph" ? 0 : "16px",
            flex: 1,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          <div
            className="modal-section content-area"
            style={{
              height: selectedView === "graph" ? "100%" : "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {renderView()}
          </div>
        </div>
      </div>
    </div>
  );
}

OriginalDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  originalData: PropTypes.object,
};

export default OriginalDataModal;