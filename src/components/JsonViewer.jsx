import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { fetchProcedure, insertProcedureGraphChanges } from "../API/api_calls";
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid";
import { saveMermaidAsJson, validateMermaidCode, convertMermaidToJson } from "./functions/mermaidToJson";
import { validateGraph } from "../functions/schema_validation";
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

// Function to highlight Mermaid syntax
const highlightMermaid = (code) => {
  if (!code) return "";

  return code
    .split("\n")
    .map(line => {
      const trimmedLine = line.trim();
      let highlightedLine = line;

      // Highlight flowchart declaration
      if (trimmedLine.startsWith("flowchart")) {
        highlightedLine = line.replace(/(flowchart\s+TD)/, '<span class="flowchart">$1</span>');
      }
      // Highlight comments and metadata
      else if (trimmedLine.startsWith("%%")) {
        if (trimmedLine.includes("Type:")) {
          highlightedLine = line.replace(
            /(%%.+?Type:)(.+)/,
            '<span class="comment">$1</span><span class="type">$2</span>'
          );
        } else if (trimmedLine.includes("Description:")) {
          highlightedLine = line.replace(
            /(%%.+?Description:)(.+)/,
            '<span class="comment">$1</span><span class="description">$2</span>'
          );
        } else {
          highlightedLine = `<span class="comment">${line}</span>`;
        }
      }
      // Highlight node definitions: A(text)
      else if (/^[A-Z]+\([^)]+\)/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\()([^)]+)(\))/,
          '<span class="node-id">$1</span>$2<span class="node-text">$3</span>$4'
        );
      }
      // Highlight edges: A --> B
      else if (/^[A-Z]+\s*-->/.test(trimmedLine)) {
        highlightedLine = line.replace(
          /([A-Z]+)(\s*-->?\s*)([A-Z]+)/,
          '<span class="node-id">$1</span><span class="arrow">$2</span><span class="node-id">$3</span>'
        );
      }

      return highlightedLine;
    })
    .join("\n");
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
  const [debouncedMermaid, setDebouncedMermaid] = useState("");

  useEffect(() => {
    const loadProcedureData = async () => {
      if (!selectedProcedure?.id) return;

      try {
        console.log(
          "JsonViewer: Fetching procedure data:",
          selectedProcedure.id,
        );
        const procedureData = await fetchProcedure(selectedProcedure.id);
        console.log("JsonViewer: Received data:", procedureData);
        
        if (!procedureData) {
          throw new Error("No data received from server");
        }

        setData(procedureData);
        setOriginalData(procedureData);
        const jsonStr = JSON.stringify(procedureData, null, 2);
        setJsonContent(jsonStr);

        // Convert to Mermaid and store original
        const graphData = procedureData.edited_graph || procedureData.original_graph;
        const mermaidCode = JsonToMermaid(graphData, defaultMermaidConfig);
        setMermaidGraph(mermaidCode);
        setOriginalMermaidGraph(mermaidCode);
      } catch (error) {
        console.error("Error fetching procedure data:", error);
        setNotification({
          show: true,
          message: `Failed to load data: ${error.message}`,
          type: "error",
        });
        setData(null);
      }
    };

    loadProcedureData();
  }, [selectedProcedure]);

  // Debounced update for the diagram
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isEditing) return;
      onMermaidCodeChange(mermaidGraph);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
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
  };

  const handleSaveChanges = () => {
    try {
      // Validate Mermaid syntax (basic validation)
      if (!mermaidGraph.includes("flowchart TD")) {
        throw new Error('Invalid Mermaid syntax: Must include "flowchart TD"');
      }

      setNotification({
        show: true,
        message: "Validating structure...",
        type: "info",
      });

      // Convert to JSON and validate structure
      const jsonData = convertMermaidToJson(mermaidGraph);
      const validationResult = validateGraph(jsonData);

      if (validationResult.valid) {
        setNotification({
          show: true,
          message: "Structure validation successful",
          type: "success",
        });
        setTimeout(() => {
          setShowConfirmation(true);
        }, 1000);
      } else {
        throw new Error(`Structural validation failed: ${validationResult.error}`);
      }
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
      // First validate the Mermaid code
      if (!validateMermaidCode(mermaidGraph)) {
        throw new Error("Invalid Mermaid syntax");
      }

      // Convert to JSON and save
      const jsonData = convertMermaidToJson(mermaidGraph);
      const result = await insertProcedureGraphChanges(selectedProcedure.id, {
        edited_graph: jsonData
      });
      
      if (!result) {
        throw new Error("Failed to save changes");
      }

      // Update both Mermaid and JSON views
      setOriginalMermaidGraph(mermaidGraph);
      setData(result);
      setOriginalData(result);
      setJsonContent(JSON.stringify(result, null, 2));
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
        message: `Failed to save changes: ${error.message}`,
        type: "error",
      });
    }
  };

  const handleContinueEditing = () => {
    setShowConfirmation(false);
  };

  const handleRevertChanges = () => {
    setMermaidGraph(originalMermaidGraph);
    setData(originalData);
    setJsonContent(JSON.stringify(originalData, null, 2));
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
    const isFolded = button.textContent === "▼";
    button.textContent = isFolded ? "▶" : "▼";

    // Find the range to fold/unfold
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      current.style.display = isFolded ? "none" : "flex";
      current = current.nextElementSibling;
    }
  };

  return (
    <div className="section-container">
      <div className="section-header">
        <span>
          Code View {selectedProcedure ? `- ${selectedProcedure.name}` : ""}
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
                    className={`code-content ${isWrapped ? "wrapped" : ""}`}
                    value={cleanMermaidCode(mermaidGraph)}
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
            <div className="placeholder-text">Loading procedure data...</div>
          )
        ) : (
          <div className="placeholder-text">
            Please select a procedure from the list above
          </div>
        )}
      </div>
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
      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        show={showConfirmation}
        title="Save Changes?"
        message="Are you sure you want to save the changes you made to the JSON code?"
        onConfirm={handleConfirmSave}
        onContinueEditing={handleContinueEditing}
        onRevert={handleRevertChanges}
        showContinueEditing={true}
        showRevert={true}
      />
    </div>
  );
}

JsonViewer.propTypes = {
  onMermaidCodeChange: PropTypes.func.isRequired,
  selectedProcedure: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default JsonViewer;