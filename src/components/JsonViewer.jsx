import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure, insertProcedureGraphChanges } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import {
  validateMermaidCode,
  convertMermaidToJson,
} from "../functions/mermaidToJson";
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

function JsonViewer({
  onMermaidCodeChange,
  selectedProcedure,
  onProcedureUpdate,
}) {
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

  // Add ref to track user edits
  const userEditedContent = useRef("");
  const isUserEditing = useRef(false);

  // Add effect to update view when procedure data changes
  useEffect(() => {
    if (data && !isUserEditing.current) {
      try {
        // Get the current graph data based on edited status
        const graphData = data.edited ? data.edited_graph : data.original_graph;

        if (!graphData) {
          console.error("No graph data available:", data);
          setNotification({
            show: true,
            message: "No graph data available for this procedure",
            type: "error",
          });
          return;
        }

        // Update JSON content
        const jsonString = JSON.stringify(graphData, null, 2);
        console.log("Setting JSON content:", jsonString);
        setJsonContent(jsonString);

        // Only update Mermaid code if not actively editing
        if (!isEditing) {
          const mermaidCode = JsonToMermaid(graphData, defaultMermaidConfig);
          console.log("Generated Mermaid code:", mermaidCode);
          setMermaidGraph(mermaidCode);
          setOriginalMermaidGraph(mermaidCode);
          onMermaidCodeChange(mermaidCode);
        }
      } catch (error) {
        console.error("Error processing graph data:", error);
        setNotification({
          show: true,
          message: "Error processing graph data",
          type: "error",
        });
      }
    }
  }, [data, isEditing, onMermaidCodeChange]);

  // Update when selected procedure changes
  useEffect(() => {
    const loadProcedureData = async () => {
      if (!selectedProcedure?.id) {
        console.log("No procedure ID provided");
        return;
      }

      console.log("Loading procedure data for ID:", selectedProcedure.id);

      // Don't reload if user is currently editing
      if (isUserEditing.current) {
        setNotification({
          show: true,
          message:
            "Please save or discard your changes before switching procedures",
          type: "warning",
        });
        return;
      }

      try {
        // Clear previous data
        setData(null);
        setOriginalData(null);
        setMermaidGraph("");
        setOriginalMermaidGraph("");
        setJsonContent("");
        setIsEditing(false);
        isUserEditing.current = false;

        const procedureData = await fetchProcedure(selectedProcedure.id);
        console.log("Received procedure data:", procedureData);

        if (!procedureData) {
          throw new Error("No data received from server");
        }

        // Store complete data for state management
        setData(procedureData);
        setOriginalData(procedureData);
      } catch (error) {
        console.error("Error loading procedure data:", error);
        setNotification({
          show: true,
          message: `Failed to load data: ${error.message}`,
          type: "error",
        });
      }
    };

    loadProcedureData();
  }, [selectedProcedure?.id]);

  // Update data when procedure is updated externally
  useEffect(() => {
    if (selectedProcedure) {
      setData(selectedProcedure);
    }
  }, [selectedProcedure]);

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
    console.log("Mermaid code changed:", newCode);
    isUserEditing.current = true;
    userEditedContent.current = newCode;
    setMermaidGraph(newCode);
    setIsEditing(true);
    onMermaidCodeChange(newCode);
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
        throw new Error(
          `Structural validation failed: ${validationResult.error}`,
        );
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
      const graphData = convertMermaidToJson(mermaidGraph);
      const result = await insertProcedureGraphChanges(selectedProcedure.id, {
        nodes: graphData.nodes,
        edges: graphData.edges,
      });

      if (!result) {
        throw new Error("Failed to save changes");
      }

      // Update both Mermaid and JSON views
      setOriginalMermaidGraph(mermaidGraph);
      setData(result);
      setOriginalData(result);

      // Only show the graph data in JSON view
      const updatedGraphData = result.edited_graph || result.original_graph;
      setJsonContent(JSON.stringify(updatedGraphData, null, 2));

      isUserEditing.current = false;
      setIsEditing(false);

      // Update parent component with new data
      onProcedureUpdate(result);

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

    // Only show the graph data in JSON view
    const graphData = originalData.edited_graph || originalData.original_graph;
    setJsonContent(JSON.stringify(graphData, null, 2));

    isUserEditing.current = false;
    setIsEditing(false);
    setShowConfirmation(false);
    onMermaidCodeChange(originalMermaidGraph);
    setNotification({
      show: true,
      message: "Changes reverted to original",
      type: "info",
    });
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
  onProcedureUpdate: PropTypes.func.isRequired,
};

export default JsonViewer;
