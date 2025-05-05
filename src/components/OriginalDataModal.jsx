import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../functions/jsonToMermaid";
import ModalDiagram from "./ModalDiagram";

function OriginalDataModal({ isOpen, onClose, originalData }) {
  const [selectedView, setSelectedView] = useState("json");
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
        (line) => !line.includes("%%{init:") && !line.includes("classDef"),
      )
      .join("\n");
  };

  // Function to highlight JSON syntax with folding
  const highlightJson = (json) => {
    if (!json) return "";

    // Parse and re-stringify to ensure proper formatting
    try {
      const parsed = JSON.parse(json);
      json = JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.warn("JSON parsing failed, using original string");
    }

    let lines = json.split("\n");
    let result = [];
    let indentLevel = 0;
    let foldable = new Set(); // Track which lines can be folded

    // First pass: identify foldable lines
    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      if (trimmedLine.endsWith("{") || trimmedLine.endsWith("[")) {
        foldable.add(i);
      }
    });

    // Second pass: generate HTML with fold buttons
    lines.forEach((line, i) => {
      const indent = line.match(/^\s*/)[0].length;
      indentLevel = Math.floor(indent / 2);

      let lineHtml = line
        .replace(
          /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
          function (match) {
            let cls = "json-number";
            if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                cls = "json-key";
                match = match.slice(0, -1);
              } else {
                cls = "json-string";
              }
            } else if (/true|false/.test(match)) {
              cls = "json-boolean";
            } else if (/null/.test(match)) {
              cls = "json-null";
            }
            return `<span class="${cls}">${match}</span>${
              /:$/.test(match) ? ":" : ""
            }`;
          },
        )
        .replace(
          /[{}[\]]/g,
          (match) => `<span class="json-punctuation">${match}</span>`,
        );

      // Add fold button if line is foldable
      if (foldable.has(i)) {
        const foldButton = `<button class="fold-button" data-line="${i}">▼</button>`;
        result.push(
          `<div class="code-line" data-line="${i}" data-level="${indentLevel}">${foldButton}${lineHtml}</div>`,
        );
      } else {
        result.push(
          `<div class="code-line" data-line="${i}" data-level="${indentLevel}">${lineHtml}</div>`,
        );
      }
    });

    return result.join("");
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
          <pre className="modal-json-content content-area" onClick={handleFold}>
            <code
              dangerouslySetInnerHTML={{ __html: highlightJson(jsonContent) }}
            />
          </pre>
        );
      case "mermaid":
        return (
          <div className="mermaid-editor content-area">
            <textarea
              className="code-content"
              value={cleanMermaidCode(mermaidCode)}
              readOnly
              spellCheck="false"
            />
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
        pointerEvents: "none", // Allow interactions with elements behind
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
          pointerEvents: "auto", // Re-enable interactions for the modal itself
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