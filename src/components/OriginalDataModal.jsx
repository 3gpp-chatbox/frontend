import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../functions/jsonToMermaid";
import ModalDiagram from "./ModalDiagram";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";

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
  const mermaidCode = originalData ? JsonToMermaid(originalData) : "";

  // Function to highlight JSON syntax
  const highlightJson = (json) => {
    if (!json) return "";
    return json
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
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
        }
      )
      .replace(/[{}\[\]]/g, (match) => `<span class="json-punctuation">${match}</span>`);
  };

  // Function to highlight Mermaid syntax
  const highlightMermaid = (code) => {
    if (!code) return "";
    return code
      .split("\n")
      .map((line) => {
        if (line.trim().startsWith("flowchart")) {
          return `<span class="mermaid-keyword">${line}</span>`;
        } else if (line.includes("-->")) {
          return line.replace(
            /([A-Za-z0-9]+)(\s*-->?\s*)([A-Za-z0-9]+)/g,
            '<span class="mermaid-node">$1</span><span class="mermaid-arrow">$2</span><span class="mermaid-node">$3</span>'
          );
        } else if (line.trim().startsWith("%%")) {
          return `<span class="mermaid-comment">${line}</span>`;
        }
        return line;
      })
      .join("\n");
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
