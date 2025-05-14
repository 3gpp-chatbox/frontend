import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";
import { FaSave } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";
import { highlightMermaidLine } from "../utils/MermaidHighlighter";
import InteractiveMarkdown from "../utils/InteractiveMarkdown";
import { createSaveHandlers } from "../utils/SaveChanges";
import ConfirmationDialog from "./modals/ConfirmationDialog";

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
 * @param {Function} props.setHighlightedElement - Callback to set highlighted element
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
  setHighlightedElement,
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
  const [activeView, setActiveView] = useState("mermaid");
  const [showMermaid, setShowMermaid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

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
    if (data) {
      try {
        // Get the current graph data based on edited status
        const graphData = data.edited_graph || data.original_graph || data.graph;

        if (!graphData) {
          console.warn("No graph data available in:", data);
          setJsonContent("");
          setMermaidGraph("");
          setOriginalMermaidGraph("");
          onMermaidCodeChange("");
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
      // Find the highlighted element in the current view
      const highlightedDiv = codeContentRef.current.querySelector(
        activeView === "json" ? ".orange-highlight" : ".highlighted-line"
      );
      
      if (highlightedDiv) {
        // Scroll the element into view with smooth behavior
        highlightedDiv.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }
  }, [highlightedElement, activeView]);

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

  const handleSaveChanges = () => {
    handleSaveClick();
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest(".node") || e.target.closest(".edgePath")) {
        return; // Don't initiate drag if clicking on a node or edge
      }
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add event listeners for dragging
  useEffect(() => {
    const currentRef = codeContentRef.current;
    if (currentRef) {
      currentRef.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        currentRef?.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  /**
   * Cleans and formats Mermaid code for rendering.
   * @param {string} code - The Mermaid code to clean
   * @returns {string} Cleaned Mermaid code
   */
  const cleanMermaidCode = (code) => {
    if (!code) return "";
    return code.trim();
  };

  /**
   * Handles folding/unfolding of JSON content
   * @param {Event} e - Click event
   */
  const handleFold = (e) => {
    // Only handle clicks on the fold buttons
    if (!e.target.classList.contains('fold-button')) return;
    
    const line = e.target.closest('.code-line');
    if (!line) return;

    const level = parseInt(line.dataset.level);

    // Toggle fold state
    const isFolded = e.target.textContent === "▼";
    e.target.textContent = isFolded ? "▶" : "▼";

    // Find the range to fold/unfold
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      current.style.display = isFolded ? "none" : "flex";
      current = current.nextElementSibling;
    }
  };

  // Handle node/edge click in Mermaid view
  const handleDiagramClick = useCallback((elementId, elementType, elementText = null) => {
    // Update highlighted element
    const element = {
      id: elementId,
      type: elementType,
      text: elementText || elementId // Use text if provided, otherwise use id
    };
    setHighlightedElement(element);
    
    // Find corresponding section in reference view
    if (markdownContent) {
      // Look for section headers that match the element ID or text
      const searchText = elementText || elementId;
      const sectionMatch = markdownContent.match(
        new RegExp(`(?:^|\n)#{2,3} .*${searchText}.*`, 'm')
      );
      
      if (sectionMatch) {
        setHighlightedSection(searchText);
      }
    }
  }, [setHighlightedElement, setHighlightedSection, markdownContent]);

  return (
    <div className="editor-panel">
      <div className="section-header">
        <span>
          {activeView === "mermaid" ? "Mermaid" : activeView === "json" ? "JSON" : "Reference"} Viewer
          {isEditing && <span className="editing-indicator"> (Editing)</span>}
        </span>
        <div className="header-controls">
          <div className="view-tabs">
            <button
              className={`tab-button ${activeView === "mermaid" ? "active" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setNotification({
                    show: true,
                    message: "Please save or revert your changes first",
                    type: "warning",
                  });
                  return;
                }
                setActiveView("mermaid");
              }}
            >
              Mermaid
            </button>
            <button
              className={`tab-button ${activeView === "json" ? "active" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setNotification({
                    show: true,
                    message: "Please save or revert your changes first",
                    type: "warning",
                  });
                  return;
                }
                setActiveView("json");
              }}
            >
              JSON
            </button>
            <button
              className={`tab-button ${activeView === "reference" ? "active" : ""}`}
              onClick={() => {
                if (isEditing) {
                  setNotification({
                    show: true,
                    message: "Please save or revert your changes first",
                    type: "warning",
                  });
                  return;
                }
                setActiveView("reference");
              }}
            >
              Reference
            </button>
          </div>
        </div>
      </div>
      {activeView === "mermaid" && selectedProcedure && (
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
                    onClick={(e) => {
                      const node = e.target.closest(".node");
                      const edge = e.target.closest(".edgePath");
                      if (node) {
                        const nodeId = node.id.replace("flowchart-", "").split("-")[0];
                        const nodeText = node.querySelector(".nodeLabel")?.textContent;
                        handleDiagramClick(nodeId, "node", nodeText);
                      } else if (edge) {
                        const edgeId = edge.querySelector("title")?.textContent;
                        if (edgeId) {
                          handleDiagramClick(edgeId, "edge");
                        }
                      }
                    }}
                    style={{
                      cursor: isDragging ? "grabbing" : "grab",
                      transform: `translate(${position.x}px, ${position.y}px)`,
                      position: "relative",
                      userSelect: isDragging ? "none" : "text",
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
                />
              )}
            </pre>
          ) : (
            <div className="loading">Loading...</div>
          )
        ) : (
          <div className="no-procedure">No procedure selected</div>
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
  setHighlightedElement: PropTypes.func.isRequired,
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
