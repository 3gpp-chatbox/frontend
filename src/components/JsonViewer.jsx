import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import {
  validateMermaidCode,
  convertMermaidToJson,
} from "../functions/mermaidToJson";
import { validateGraph } from "../functions/schema_validation";
import ConfirmationDialog from "./modals/ConfirmationDialog";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";
import { FaSave } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";
import { highlightMermaidLine } from "../utils/MermaidHighlighter";
import InteractiveMarkdown from "../utils/InteractiveMarkdown";
import { createSaveHandlers } from "../utils/SaveChanges";

/**
 * Component for displaying and editing JSON data with multiple view modes.
 * Supports JSON tree view, Mermaid diagram view, and reference view.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Function} props.onMermaidCodeChange - Callback for Mermaid code changes
 * @param {Object} props.selectedProcedure - Currently selected procedure
 * @param {Function} props.onProcedureUpdate - Callback for procedure updates
 * @param {Object} props.highlightedElement - Currently highlighted diagram element
 * @param {Object} props.highlightedSection - Currently highlighted section
 * @param {string} props.markdownContent - Markdown content to display
 * @param {Function} props.onEditorFocus - Callback for editor focus events
 * @param {Function} props.setHighlightedSection - Callback to set highlighted section
 * @returns {JSX.Element} The rendered JSON viewer
 */
function JsonViewer({
  onMermaidCodeChange,
  selectedProcedure,
  onProcedureUpdate,
  highlightedElement,
  highlightedSection,
  markdownContent,
  onEditorFocus,
  setHighlightedSection,
}) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [mermaidGraph, setMermaidGraph] = useState("");
  const [originalMermaidGraph, setOriginalMermaidGraph] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [isWrapped, setIsWrapped] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [direction, setDirection] = useState("TD");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [activeView, setActiveView] = useState(null);

  // Add ref to track user edits
  const userEditedContent = useRef("");
  const isUserEditing = useRef(false);
  const editorRef = useRef(null);
  const cursorPosition = useRef(null);
  const codeContentRef = useRef(null);

  // Create save handlers
  const {
    handleSaveClick,
    handleConfirmSaveClick,
    handleRevertChangesClick,
    handleContinueEditingClick,
  } = createSaveHandlers({
    mermaidGraph,
    selectedProcedure,
    setShowConfirmation,
    setNotification,
    setOriginalMermaidGraph,
    setData,
    setOriginalData,
    setJsonContent,
    isUserEditing,
    setIsEditing,
    onProcedureUpdate,
    onMermaidCodeChange,
    originalMermaidGraph,
    originalData,
    setMermaidGraph,
  });

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

  /**
   * Handles changes to the Mermaid code.
   * Updates the code and triggers necessary state updates.
   *
   * @param {string} newCode - The updated Mermaid code
   */
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

  // Add effect to scroll to highlighted element
  useEffect(() => {
    if (highlightedElement && codeContentRef.current) {
      // Find the highlighted element
      const highlightedDiv =
        codeContentRef.current.querySelector(".orange-highlight");
      if (highlightedDiv) {
        // Scroll the element into view with some padding at the top
        highlightedDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedElement]);

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

  // Add function to update direction
  const handleDirectionChange = (newDirection) => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    setDirection(newDirection);
    // Update the Mermaid code with new direction
    const updatedCode = mermaidGraph.replace(
      /flowchart\s+(TD|TB|BT|LR|RL)/,
      `flowchart ${newDirection}`,
    );
    setMermaidGraph(updatedCode);
    onMermaidCodeChange(updatedCode);
  };

  return (
    <div className="editor-panel">
      <div className="section-header">
        <span>
          {showMermaid ? "Mermaid" : "JSON"} Viewer
          {isEditing && <span className="editing-indicator"> (Editing)</span>}
        </span>
        <div className="header-controls">
          <div className="view-tabs">
            <button
              className={`tab-button ${showMermaid ? "active" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setNotification({
                    show: true,
                    message: "Please save or revert your changes first",
                    type: "warning",
                  });
                  return;
                }
                setShowMermaid(true);
              }}
            >
              Mermaid
            </button>
            <button
              className={`tab-button ${!showMermaid ? "active" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setNotification({
                    show: true,
                    message: "Please save or revert your changes first",
                    type: "warning",
                  });
                  return;
                }
                setShowMermaid(false);
              }}
            >
              JSON
            </button>
          </div>
        </div>
      </div>
      {showMermaid && selectedProcedure && (
        <div className="viewer-controls">
          <div className="viewer-controls-left">
            <span className="direction-label">Flow chart direction</span>
            <div className="direction-tabs">
              <button
                className={`direction-button ${
                  direction === "TD" ? "active" : ""
                }`}
                onClick={() => handleDirectionChange("TD")}
                title="Top to Bottom"
              >
                <BiVerticalTop size={20} />
              </button>
              <button
                className={`direction-button ${
                  direction === "LR" ? "active" : ""
                }`}
                onClick={() => handleDirectionChange("LR")}
                title="Left to Right"
              >
                <BiHorizontalLeft size={20} />
              </button>
            </div>
          </div>
          <div className="viewer-controls-right">
            <button
              className={`save-button ${isEditing ? "active" : ""}`}
              onClick={handleSaveChanges}
              disabled={!isEditing}
              title="Save Changes"
            >
              <FaSave size={16} />
              Save
            </button>
          </div>
        </div>
      )}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="json-viewer-content">
        {activeView === "reference" ? (
          <div className="reference-viewer">
            <div className="markdown-content">
              <InteractiveMarkdown
                content={markdownContent}
                highlightedSection={highlightedSection}
                key={`${activeView}-${!!highlightedSection}`}
              />
            </div>
          </div>
        ) : selectedProcedure ? (
          data ? (
            <pre className="json-content">
              {activeView === "mermaid" ? (
                <div className="mermaid-editor">
                  <div
                    ref={(el) => {
                      editorRef.current = el;
                      codeContentRef.current = el;
                    }}
                    className={`code-content ${isWrapped ? "wrapped" : ""}`}
                    contentEditable={true}
                    onInput={handleMermaidChange}
                    onFocus={onEditorFocus}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const selection = window.getSelection();
                        const range = selection.getRangeAt(0);
                        const br = document.createElement("br");
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
                        highlightedElement?.type,
                      ),
                    }}
                    spellCheck="false"
                  />
                </div>
              ) : (
                <div
                  className={`code-content ${isWrapped ? "wrapped" : ""}`}
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(jsonContent, highlightedElement),
                  }}
                  ref={codeContentRef}
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
        onConfirm={handleConfirmSaveClick}
        onContinueEditing={handleContinueEditingClick}
        onRevert={handleRevertChangesClick}
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
    type: PropTypes.oneOf(["node", "edge"]),
    id: PropTypes.string,
  }),
  highlightedSection: PropTypes.shape({
    lineNumber: PropTypes.number.isRequired,
    contextStart: PropTypes.number.isRequired,
    contextEnd: PropTypes.number.isRequired,
  }),
  markdownContent: PropTypes.string.isRequired,
  onEditorFocus: PropTypes.func.isRequired,
  setHighlightedSection: PropTypes.func.isRequired,
};

export default JsonViewer;
