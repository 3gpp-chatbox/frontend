import { useState, useEffect, useCallback, useRef } from "react";
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
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";

function JsonViewer({ onMermaidCodeChange, selectedProcedure, onProcedureUpdate, highlightedElement, onEditorFocus }) {
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
  const editorRef = useRef(null);
  const cursorPosition = useRef(null);

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
            type: "error"
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
          type: "error"
        });
      }
    }
  }, [data, isEditing, onMermaidCodeChange]);

  // Log isWrapped state changes
  useEffect(() => {
    console.log("isWrapped state changed:", isWrapped);
  }, [isWrapped]);

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
          message: "Please save or discard your changes before switching procedures",
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
    saveCursorPosition();
    const newCode = event.currentTarget.textContent;
    // Only trigger changes if the code actually changed
    if (newCode !== mermaidGraph) {
      console.log("Mermaid code changed:", newCode);
      isUserEditing.current = true;
      userEditedContent.current = newCode;
      setMermaidGraph(newCode);
      setIsEditing(true);
      onMermaidCodeChange(newCode);
    }
  };

  const handleSaveChanges = () => {
    try {
      // Get current direction or default to LR
      const directionMatch = mermaidGraph.match(/flowchart\s+(TD|TB|BT|LR|RL)/);
      if (!directionMatch) {
        // If no direction specified, prepend LR direction
        const lines = mermaidGraph.split('\n');
        const firstLine = lines[0].trim();
        if (!firstLine.startsWith('flowchart')) {
          setMermaidGraph(`flowchart LR\n${mermaidGraph}`);
        } else {
          throw new Error('Invalid Mermaid syntax: Must include valid flowchart direction (TD, TB, BT, LR, or RL)');
        }
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
      const result = await insertProcedureGraphChanges(selectedProcedure.id,{nodes:graphData.nodes,edges:graphData.edges});

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

    const lineNumber = parseInt(line.dataset.line);
    const level = parseInt(line.dataset.level);

    // Toggle fold state
    const isFolded = button.textContent === "▼";
    button.textContent = isFolded ? "▶" : "▼";

    // Find the range to fold/unfold
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      current.style. display= isFolded ? "none" : "flex";
      current = current.nextElementSibling;
    }
  };

  const highlightMermaidLine = (code, elementId, elementType) => {
    if (!code || !elementId) {
      console.log("No code or elementId provided");
      return code;
    }
    
    console.log("Received element:", { id: elementId, type: elementType });
    
    // Extract the node label for node highlighting
    const nodeMatch = elementId.match(/flowchart-([A-Z0-9]+)-/);
    if (!nodeMatch && elementType === 'node') {
      console.log("No node match found for elementId:", elementId);
      return code;
    }
    
    const nodeLabel = nodeMatch ? nodeMatch[1] : null;
    console.log("Looking for node/edge:", { nodeLabel, elementId });
    
    // First split and process the raw code
    const lines = code.replace(/<[^>]*>/g, '').split('\n');
    const highlightedLines = lines.map(line => {
      console.log("Checking raw line:", line);
      
      if (elementType === 'node' && nodeLabel) {
        // Match node definitions with optional leading whitespace
        const nodePattern = new RegExp(`^\\s*${nodeLabel}(\\[|\\(\\()`);
        const matches = nodePattern.test(line);
        console.log("Node pattern test:", { line, matches });
        if (matches) {
          console.log("Found matching node line:", line);
          return `<div class="highlighted-line">${highlightMermaid(line)}</div>`;
        }
      } else if (elementType === 'edge') {
        // For edges, we now use the label text directly
        // The elementId is now the label text from the edge label
        // We need to escape special characters in the elementId for the regex
        const escapedElementId = elementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Look for the edge label with quotes around it
        // The edge label in the Mermaid code is wrapped in quotes, but the elementId doesn't have quotes
        const edgePattern = new RegExp(`^\\s*.*-->\\|"${escapedElementId}"\\|.*`);
        const matches = edgePattern.test(line);
        console.log("Edge pattern test:", { line, matches, elementId, escapedElementId });
        if (matches) {
          console.log("Found matching edge line:", line);
          return `<div class="highlighted-line">${highlightMermaid(line)}</div>`;
        }
        
        // If the first pattern didn't match, try without quotes
        // This handles cases where the edge label might not have quotes
        const edgePatternNoQuotes = new RegExp(`^\\s*.*-->\\|${escapedElementId}\\|.*`);
        const matchesNoQuotes = edgePatternNoQuotes.test(line);
        console.log("Edge pattern test (no quotes):", { line, matches: matchesNoQuotes });
        if (matchesNoQuotes) {
          console.log("Found matching edge line (no quotes):", line);
          return `<div class="highlighted-line">${highlightMermaid(line)}</div>`;
        }
      }
      return highlightMermaid(line);
    });
    
    return highlightedLines.join('\n');
  };

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorPosition.current = preCaretRange.toString().length;
    }
  };

  const restoreCursorPosition = useCallback(() => {
    if (editorRef.current && cursorPosition.current !== null) {
      const selection = window.getSelection();
      const range = document.createRange();
      let charCount = 0;
      let targetNode = null;
      let targetOffset = 0;

      const findPosition = (node) => {
        if (targetNode) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const length = node.textContent.length;
          if (charCount + length >= cursorPosition.current) {
            targetNode = node;
            targetOffset = cursorPosition.current - charCount;
            return;
          }
          charCount += length;
        } else {
          for (const child of node.childNodes) {
            findPosition(child);
            if (targetNode) return;
          }
        }
      };

      findPosition(editorRef.current);

      if (targetNode) {
        try {
          range.setStart(targetNode, targetOffset);
          range.setEnd(targetNode, targetOffset);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.log("Error restoring cursor position:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isEditing) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        restoreCursorPosition();
      });
    }
  }, [mermaidGraph, isEditing, restoreCursorPosition]);

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
                <div
                  ref={editorRef}
                  className={`code-content ${isWrapped ? "wrapped" : ""}`}
                  contentEditable={true}
                  onInput={handleMermaidChange}
                  onFocus={onEditorFocus}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const selection = window.getSelection();
                      const range = selection.getRangeAt(0);
                      const br = document.createElement('br');
                      range.deleteContents();
                      range.insertNode(br);
                      range.setStartAfter(br);
                      range.setEndAfter(br);
                      selection.removeAllRanges();
                      selection.addRange(range);
                      handleMermaidChange(e);
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightMermaidLine(
                      highlightMermaid(cleanMermaidCode(mermaidGraph)),
                      highlightedElement?.id,
                      highlightedElement?.type
                    )
                  }}
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
            onChange={() => {
              console.log("Toggling wrap state:", !isWrapped);
              setIsWrapped(!isWrapped);
            }}
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
  highlightedElement: PropTypes.shape({
    type: PropTypes.oneOf(['node', 'edge']),
    id: PropTypes.string,
  }),
  onEditorFocus: PropTypes.func.isRequired,
};

export default JsonViewer;