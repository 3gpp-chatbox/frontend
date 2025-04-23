import React from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../functions/jsonToMermaid";

function OriginalDataModal({ isOpen, onClose, originalData }) {
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
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Original Graph Data</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-section">
            <h4>JSON View</h4>
            <pre className="modal-json-content">
              <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonContent) }} />
            </pre>
          </div>
          <div className="modal-section">
            <h4>Mermaid View</h4>
            <pre className="modal-mermaid-content">
              <code dangerouslySetInnerHTML={{ __html: highlightMermaid(mermaidCode) }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

OriginalDataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  originalData: PropTypes.object
};

export default OriginalDataModal; 