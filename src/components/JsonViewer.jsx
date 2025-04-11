import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fetchMockData, saveEditedData } from "../API_calls/mockapi";
import { getMermaidConverter } from "../functions/mermaidConverters";
import ConfirmationDialog from "./ConfirmationDialog";

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
    const trimmedLine = line.trim();
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
        /[{}\[\]]/g,
        (match) => `<span class="json-punctuation">${match}</span>`,
      );

    // Add fold button if line is foldable
    if (foldable.has(i)) {
      const foldButton = `<button class="fold-button" data-line="${i}">▶</button>`;
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

function JsonViewer({ onMermaidCodeChange, selectedProcedure }) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [mermaidGraph, setMermaidGraph] = useState("");
  const [originalMermaidGraph, setOriginalMermaidGraph] = useState("");
  const [showMermaid, setShowMermaid] = useState(true);
  const [jsonContent, setJsonContent] = useState("");
  const [isWrapped, setIsWrapped] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [foldedRanges, setFoldedRanges] = useState(new Set());

  useEffect(() => {
    const loadMockData = async () => {
      if (!selectedProcedure) return;

      try {
        console.log(
          "JsonViewer: Fetching mock data for procedure:",
          selectedProcedure,
        );
        const mockData = await fetchMockData(selectedProcedure);
        console.log("JsonViewer: Received data:", mockData);
        setData(mockData);
        setOriginalData(mockData);
        const jsonStr = JSON.stringify(mockData, null, 2);
        setJsonContent(jsonStr);

        // Convert to Mermaid and store original
        const converter = getMermaidConverter();
        const mermaidCode = converter(mockData);
        setMermaidGraph(mermaidCode);
        setOriginalMermaidGraph(mermaidCode);
      } catch (error) {
        console.error("Error fetching mock data:", error);
        setNotification({
          show: true,
          message: "Failed to load mock data",
          type: "error",
        });
        setData(null);
      }
    };

    loadMockData();
  }, [selectedProcedure]);

  useEffect(() => {
    if (!isEditing) {
      onMermaidCodeChange(mermaidGraph);
    }
  }, [mermaidGraph, isEditing, onMermaidCodeChange]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleMermaidChange = (event) => {
    const newCode = event.target.value;
    setMermaidGraph(newCode);
    setIsEditing(true);
    // Update the diagram immediately
    onMermaidCodeChange(newCode);
  };

  const handleSaveChanges = () => {
    try {
      // Validate Mermaid syntax (basic validation)
      if (!mermaidGraph.includes("flowchart TD")) {
        throw new Error('Invalid Mermaid syntax: Must include "flowchart TD"');
      }
      setShowConfirmation(true);
    } catch (error) {
      setNotification({
        show: true,
        message: error.message,
        type: "error",
      });
    }
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    setNotification({
      show: true,
      message: "Saving changes...",
      type: "info",
    });

    try {
      // Here you would convert Mermaid back to JSON if needed
      // For now, we'll just save the Mermaid code
      await saveEditedData({ mermaidCode: mermaidGraph });

      setOriginalMermaidGraph(mermaidGraph);
      setIsEditing(false);

      setNotification({
        show: true,
        message: "Changes saved successfully",
        type: "success",
      });

      // Update the diagram
      onMermaidCodeChange(mermaidGraph);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to save changes",
        type: "error",
      });
    }
  };

  const handleContinueEditing = () => {
    setShowConfirmation(false);
  };

  const handleRevertChanges = () => {
    setMermaidGraph(originalMermaidGraph);
    setIsEditing(false);
    setShowConfirmation(false);
    setNotification({
      show: true,
      message: "Changes reverted to original",
      type: "info",
    });
    onMermaidCodeChange(originalMermaidGraph);
  };

  const cleanMermaidCode = (code) => {
    return code
      .split("\n")
      .filter(
        (line) => !line.includes("%%{init:") && !line.includes("classDef"),
      )
      .join("\n");
  };

  // Handle fold/unfold
  const handleFold = (event) => {
    const button = event.target;
    if (!button.classList.contains("fold-button")) return;

    const line = button.closest(".code-line");
    if (!line) return;

    const lineNumber = parseInt(line.dataset.line);
    const level = parseInt(line.dataset.level);

    // Toggle fold state
    const isFolded = button.textContent === "▶";
    button.textContent = isFolded ? "▼" : "▶";
    button.classList.toggle("expanded", !isFolded);
    line.classList.toggle("folded", isFolded);

    // Find the range to fold/unfold
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      if (isFolded) {
        current.style.display = "none";
        // If this line was expanded, collapse it
        const foldButton = current.querySelector(".fold-button");
        if (foldButton && foldButton.textContent === "▼") {
          foldButton.textContent = "▶";
          foldButton.classList.remove("expanded");
          current.classList.remove("folded");
        }
      } else {
        current.style.display = "flex";
      }
      current = current.nextElementSibling;
    }
  };

  return (
    <div className="section-container">
      <style>
        {`
          .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }

          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .notification.info {
            background-color: #2196F3;
          }

          .notification.success {
            background-color: #4CAF50;
          }

          .notification.error {
            background-color: #f44336;
          }

          .json-viewer-content {
            height: calc(1000px - 48px); /* 1000px minus header height */
            background-color: var(--black-800);
            position: relative;
          }

          .json-content {
            height: 100%;
            margin: 0;
            overflow-y: auto;
            background-color: var(--black-800);
          }

          .json-content code {
            display: block;
            padding: 0;
            color: var(--silver-100);
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            background-color: var(--black-800);
          }

          .json-content code.wrapped {
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .json-content code:not(.wrapped) {
            white-space: pre;
          }

          .json-content textarea {
            width: 100%;
            height: 100%;
            background-color: var(--black-800);
            color: var(--silver-100);
            border: none;
            resize: none;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            padding: 16px;
          }

          .json-content textarea.wrapped {
            white-space: pre-wrap;
            word-wrap: break-word;
          }

          .json-content textarea:not(.wrapped) {
            white-space: pre;
          }

          .json-content textarea:focus {
            outline: none;
            border: none;
          }

          /* Syntax highlighting for JSON */
          .json-string { color:rgb(236, 159, 43); }
          .json-number { color: #ff9d00; }
          .json-boolean { color: #ff628c; }
          .json-null { color: #ff628c; }
          .json-key { color: #5ccfe6; }

          /* Syntax highlighting for Mermaid */
          .mermaid-keyword { color: #ff9d00; }
          .mermaid-arrow { color: #ff628c; }
          .mermaid-node { color: #5ccfe6; }
          .mermaid-label { color: #a8ff60; }
          .mermaid-comment { color: #727272; }

          /* Button styles */
          .viewer-controls {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .wrap-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-right: 12px;
            color: var(--silver-300);
            font-size: 14px;
          }

          .wrap-toggle input[type="checkbox"] {
            margin: 0;
          }

          .code-line {
            display: flex;
            align-items: center;
            min-height: 24px;
            position: relative;
            background-color: var(--black-800);
            padding: 0 8px 0 24px;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
          }

          .code-line:hover {
            background-color: var(--black-700);
          }

          .fold-button {
            position: absolute;
            left: 4px;
            cursor: pointer;
            color: var(--blue-400);
            font-size: 12px;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            background-color: transparent;
            border-radius: 3px;
            z-index: 2;
          }

          .fold-button:hover {
            color: var(--blue-300);
            background-color: var(--black-600);
          }

          /* Add transition for smooth folding */
          .json-content div {
            transition: all 0.2s ease;
          }

          .json-content pre {
            margin: 0;
            background-color: var(--black-800);
          }
        `}
      </style>
      <div className="section-header">
        <span>
          Code View {selectedProcedure ? `- ${selectedProcedure}` : ""}
          {isEditing && <span className="editing-indicator"> (Editing)</span>}
        </span>
        <div className="viewer-controls">
          <button
            className="toggle-button"
            onClick={() => {
              if (isEditing) {
                setNotification({
                  show: true,
                  message: "Please save or revert your changes first",
                  type: "warning",
                });
                return;
              }
              setShowMermaid(!showMermaid);
            }}
            title={showMermaid ? "View JSON" : "View Mermaid"}
          >
            {showMermaid ? "Show JSON" : "Show Mermaid"}
          </button>
          {showMermaid && (
            <button
              className={`save-button ${isEditing ? "active" : ""}`}
              onClick={handleSaveChanges}
              disabled={!isEditing}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="json-viewer-content">
        {selectedProcedure ? (
          data ? (
            <pre className="json-content">
              {showMermaid ? (
                <div className="mermaid-editor">
                  <textarea
                    className={isWrapped ? "wrapped" : ""}
                    value={mermaidGraph}
                    onChange={handleMermaidChange}
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div
                  className={`code-content ${isWrapped ? "wrapped" : ""}`}
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(jsonContent),
                  }}
                  onClick={handleFold}
                />
              )}
            </pre>
          ) : (
            <div className="placeholder-text">Loading mock data...</div>
          )
        ) : (
          <div className="placeholder-text">
            Please select a procedure from the list above
          </div>
        )}
      </div>
      <div
        className="viewer-controls"
        style={{ padding: "8px 16px", borderTop: "1px solid var(--black-700)" }}
      >
        <label className="wrap-toggle">
          <input
            type="checkbox"
            checked={isWrapped}
            onChange={() => setIsWrapped(!isWrapped)}
          />
          Wrap Text
        </label>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          onConfirm={handleConfirmSave}
          onContinueEditing={handleContinueEditing}
          onRevert={handleRevertChanges}
        />
      )}
    </div>
  );
}

JsonViewer.propTypes = {
  onMermaidCodeChange: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.string,
};

export default JsonViewer;
