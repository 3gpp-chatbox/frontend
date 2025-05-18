import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../../functions/jsonToMermaid";
import ModalDiagram from "../../utils/DiagramView";
import { highlightJson } from "../../utils/jsonHighlighter";
import { highlightMermaid } from "../../utils/MermaidHighlighter";

function OriginalDataModal({ isOpen, onClose, originalData }) {
  const [selectedView, setSelectedView] = useState("json");
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 900, height: "90vh" });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isWrapped, setIsWrapped] = useState(true);
  const editorRef = useRef(null);
  const modalRef = useRef(null);

  // Reset position and size when modal is opened
  useEffect(() => {
    if (isOpen) {
      setPosition({ x: 0, y: 0 });
      setSize({ width: 900, height: "90vh" });
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

  // Handle resize start
  const handleResizeStart = useCallback((e, direction) => {
    e.stopPropagation();
    const rect = modalRef.current.getBoundingClientRect();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialWidth: rect.width,
      initialHeight: rect.height,
      initialLeft: rect.left,
      initialTop: rect.top,
    });
  }, []);

  // Handle mouse move for both dragging and resizing
  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      } else if (isResizing) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newWidth = dragStart.initialWidth;
        let newHeight = dragStart.initialHeight;
        let newX = position.x;
        let newY = position.y;

        // Handle corner resizing
        if (
          resizeDirection === "nw" ||
          resizeDirection === "ne" ||
          resizeDirection === "sw" ||
          resizeDirection === "se"
        ) {
          // Handle width
          if (resizeDirection.includes("e")) {
            newWidth = Math.max(400, dragStart.initialWidth + deltaX);
          } else if (resizeDirection.includes("w")) {
            newWidth = Math.max(400, dragStart.initialWidth - deltaX);
            newX = dragStart.initialLeft + deltaX;
          }

          // Handle height
          if (resizeDirection.includes("s")) {
            newHeight = Math.max(200, dragStart.initialHeight + deltaY);
          } else if (resizeDirection.includes("n")) {
            newHeight = Math.max(200, dragStart.initialHeight - deltaY);
            newY = dragStart.initialTop + deltaY;
          }
        }
        // Handle edge resizing
        else {
          if (resizeDirection === "e") {
            newWidth = Math.max(400, dragStart.initialWidth + deltaX);
          } else if (resizeDirection === "w") {
            newWidth = Math.max(400, dragStart.initialWidth - deltaX);
            newX = dragStart.initialLeft + deltaX;
          } else if (resizeDirection === "s") {
            newHeight = Math.max(200, dragStart.initialHeight + deltaY);
          } else if (resizeDirection === "n") {
            newHeight = Math.max(200, dragStart.initialHeight - deltaY);
            newY = dragStart.initialTop + deltaY;
          }
        }

        // Ensure we don't resize beyond minimum dimensions
        if (newWidth === 400) {
          newX = position.x;
        }
        if (newHeight === 200) {
          newY = position.y;
        }

        setSize({
          width: newWidth,
          height: newHeight,
        });
        setPosition({
          x: newX,
          y: newY,
        });
      }
    },
    [isDragging, isResizing, dragStart, resizeDirection, position],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
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
          line.startsWith("flowchart") ||
          line.startsWith("graph") ||
          // Filter out only init and class definitions
          (!line.includes("%%{init:") && !line.includes("classDef")),
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
                    __html: highlightMermaid(cleanMermaidCode(mermaidCode)),
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
    <div className="modal-overlay">
      <div
        ref={modalRef}
        className="modal-content"
        style={{
          width: size.width,
          height: size.height,
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? "grabbing" : "default",
          transition:
            isDragging || isResizing ? "none" : "transform 0.1s ease-out",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Resize handles */}
        <div
          className="resize-handle e"
          onMouseDown={(e) => handleResizeStart(e, "e")}
        />
        <div
          className="resize-handle w"
          onMouseDown={(e) => handleResizeStart(e, "w")}
        />
        <div
          className="resize-handle n"
          onMouseDown={(e) => handleResizeStart(e, "n")}
        />
        <div
          className="resize-handle s"
          onMouseDown={(e) => handleResizeStart(e, "s")}
        />
        <div
          className="resize-handle se"
          onMouseDown={(e) => handleResizeStart(e, "se")}
        />
        <div
          className="resize-handle sw"
          onMouseDown={(e) => handleResizeStart(e, "sw")}
        />
        <div
          className="resize-handle ne"
          onMouseDown={(e) => handleResizeStart(e, "ne")}
        />
        <div
          className="resize-handle nw"
          onMouseDown={(e) => handleResizeStart(e, "nw")}
        />

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
