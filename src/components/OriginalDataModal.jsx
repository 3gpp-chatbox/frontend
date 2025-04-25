import { useState } from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../functions/jsonToMermaid";

function OriginalDataModal({ isOpen, onClose, originalData }) {
  const [selectedView, setSelectedView] = useState("mermaid"); // Default view is mermaid

  if (!isOpen) return null;

  const jsonContent = originalData ? JSON.stringify(originalData, null, 2) : "";
  const mermaidCode = originalData ? JsonToMermaid(originalData) : "";

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
          <div className="graph-view content-area">
            <div className="placeholder-text">
              Graph visualization coming soon...
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-view-buttons">
            <button
              className={`modal-view-button ${
                selectedView === "json" ? "active" : ""
              }`}
              onClick={() => setSelectedView("json")}
            >
              JSON View
            </button>
            <button
              className={`modal-view-button ${
                selectedView === "mermaid" ? "active" : ""
              }`}
              onClick={() => setSelectedView("mermaid")}
            >
              Mermaid View
            </button>
            <button
              className={`modal-view-button ${
                selectedView === "graph" ? "active" : ""
              }`}
              onClick={() => setSelectedView("graph")}
            >
              Graph View
            </button>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body content-area">
          <div className="modal-section content-area">{renderView()}</div>
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
