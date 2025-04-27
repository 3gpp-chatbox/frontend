import React from "react";
import PropTypes from "prop-types";
import { JsonToMermaid } from "../functions/jsonToMermaid";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";

function OriginalDataModal({ isOpen, onClose, originalData }) {
  if (!isOpen) return null;

  const jsonContent = originalData ? JSON.stringify(originalData, null, 2) : "";
  const mermaidCode = originalData ? JsonToMermaid(originalData, { styles: {} }) : "";

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