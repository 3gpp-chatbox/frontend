import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import { highlightJson } from "../utils/jsonHighlighter";
import {
  highlightMermaid,
  highlightMermaidElement,
} from "../utils/MermaidHighlighter";
import { FaSave } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";
import InteractiveMarkdown from "../utils/InteractiveMarkdown";
import { createSaveHandlers } from "../utils/SaveChanges";
import ConfirmationDialog from "./modals/ConfirmationDialog";
import EditorHeader from "./editor/EditorHeader";
import ViewerControls from "./editor/ViewerControls";
import NotificationManager from "./editor/NotificationManager";

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
  const [editorContent, setEditorContent] = useState("");
  const debouncedUpdateRef = useRef(null);
  const lastScrollPosition = useRef(null);
  const cursorPositionRef = useRef(null);

  // Add ref to track user edits
  const userEditedContent = useRef("");
  const isUserEditing = useRef(false);
  const editorRef = useRef(null);
  const codeContentRef = useRef(null);
  const scrollPositionRef = useRef(null);

  // Create save handlers
  const {
    handleSaveClick: originalHandleSaveClick,
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

  const [isValidCode, setIsValidCode] = useState(true);

  // Add handler for validation changes
  const handleValidationChange = useCallback((isValid) => {
    setIsValidCode(isValid);
  }, []);

  // Add effect to update view when procedure data changes
  useEffect(() => {
    if (data) {
      try {
        // Get the current graph data based on edited status
        const graphData =
          data.edited_graph || data.original_graph || data.graph;

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

        const procedureData = await fetchProcedure(
          selectedProcedure.id,
          selectedProcedure.entity,
        );
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
  }, [selectedProcedure?.id, selectedProcedure?.entity]);

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

  // Add debounced update function
  useEffect(() => {
    debouncedUpdateRef.current = debounce((newCode) => {
      // Save scroll position before the update
      if (editorRef.current) {
        lastScrollPosition.current = {
          top: editorRef.current.scrollTop,
          left: editorRef.current.scrollLeft,
        };
      }

      setMermaidGraph(newCode);
      onMermaidCodeChange(newCode);

      // Restore scroll position after the update
      requestAnimationFrame(() => {
        if (editorRef.current && lastScrollPosition.current) {
          editorRef.current.scrollTop = lastScrollPosition.current.top;
          editorRef.current.scrollLeft = lastScrollPosition.current.left;
        }
      });
    }, 300);

    return () => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current.cancel();
      }
    };
  }, [onMermaidCodeChange]);

  // Debounce function implementation
  const debounce = (func, wait) => {
    let timeout;
    const debouncedFunc = function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
    debouncedFunc.cancel = () => clearTimeout(timeout);
    return debouncedFunc;
  };

  // Helper function to get text offset considering all previous nodes
  const getTextOffset = (node, offset, root) => {
    let totalOffset = 0;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode === node) {
        return totalOffset + offset;
      }
      totalOffset += currentNode.textContent.length;
    }
    return totalOffset;
  };

  // Helper function to find text node at offset
  const findTextNodeAtOffset = (container, targetOffset) => {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    let currentOffset = 0;
    let node = walker.nextNode();

    while (node) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= targetOffset) {
        return {
          node,
          offset: targetOffset - currentOffset,
        };
      }
      currentOffset += nodeLength;
      node = walker.nextNode();
    }

    return null;
  };

  // Modify handleMermaidChange to use imported validation
  const handleMermaidChange = (event) => {
    try {
      const newCode = event.currentTarget.textContent;

      // Save cursor position before any changes
      const selection = window.getSelection();
      let savedCursor = null;

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        savedCursor = {
          offset: preCaretRange.toString().length,
          text: preCaretRange.toString().slice(-20),
        };
      }

      // Basic content validation
      if (typeof newCode !== "string") {
        throw new Error("Invalid content type");
      }

      // Normalize line breaks
      const normalizedCode = newCode.replace(/\r\n/g, "\n");

      // Update content
      setEditorContent(normalizedCode);

      if (normalizedCode !== mermaidGraph) {
        isUserEditing.current = true;
        userEditedContent.current = normalizedCode;
        setIsEditing(true);

        // Update graph
        if (debouncedUpdateRef.current) {
          debouncedUpdateRef.current(normalizedCode);
        }
      }

      // Restore cursor position
      if (savedCursor) {
        requestAnimationFrame(() => {
          try {
            const textNodeInfo = findTextNodeAtOffset(
              editorRef.current,
              savedCursor.offset,
            );
            if (textNodeInfo) {
              const newRange = document.createRange();
              newRange.setStart(textNodeInfo.node, textNodeInfo.offset);
              newRange.collapse(true);

              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          } catch (error) {
            console.error("Error restoring cursor position:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error in handleMermaidChange:", error);
      setNotification({
        show: true,
        message: `Error updating content: ${error.message}`,
        type: "error",
      });
    }
  };

  // Wrap the original handleSaveClick with validation
  const handleSaveClick = () => {
    originalHandleSaveClick();
  };

  // Add keydown handler for better line break control
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Create a new text node with a line break
        const textNode = document.createTextNode("\n");
        range.insertNode(textNode);

        // Move cursor to the new line
        range.setStart(textNode, 1);
        range.setEnd(textNode, 1);
        selection.removeAllRanges();
        selection.addRange(range);

        // Trigger change event
        const changeEvent = new Event("input", { bubbles: true });
        editorRef.current.dispatchEvent(changeEvent);
      }
    }
  };

  // Improved cursor position restoration
  const restoreCursorPosition = useCallback(() => {
    if (!editorRef.current || !cursorPositionRef.current) return;

    const { offset, surroundingText } = cursorPositionRef.current;

    // Find the correct text node and position
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    let currentOffset = 0;
    let targetNode = null;
    let targetOffset = 0;
    let bestMatchNode = null;
    let bestMatchScore = 0;

    // First try to find the exact position using surrounding text
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const nodeText = node.textContent;

      // Check if this node contains our target position
      if (
        currentOffset <= offset &&
        currentOffset + nodeText.length >= offset
      ) {
        targetNode = node;
        targetOffset = offset - currentOffset;
        break;
      }

      // If we haven't found an exact match, look for best match using surrounding text
      if (surroundingText) {
        const similarity = calculateStringSimilarity(nodeText, surroundingText);
        if (similarity > bestMatchScore) {
          bestMatchScore = similarity;
          bestMatchNode = node;
        }
      }

      currentOffset += nodeText.length;
    }

    // If we didn't find an exact match but have a best match, use it
    if (!targetNode && bestMatchNode) {
      targetNode = bestMatchNode;
      targetOffset = Math.min(offset, bestMatchNode.textContent.length);
    }

    // Set the cursor position
    if (targetNode) {
      try {
        const range = document.createRange();
        range.setStart(targetNode, targetOffset);
        range.collapse(true);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        // Restore scroll position after cursor is set
        if (scrollPositionRef.current) {
          requestAnimationFrame(() => {
            if (editorRef.current) {
              editorRef.current.scrollTop = scrollPositionRef.current.top;
              editorRef.current.scrollLeft = scrollPositionRef.current.left;
            }
          });
        }
      } catch (error) {
        console.warn("Error restoring cursor position:", error);
      }
    }
  }, []);

  // Add effect to restore editor state after content updates
  useEffect(() => {
    requestAnimationFrame(restoreCursorPosition);
  }, [editorContent, mermaidGraph, restoreCursorPosition]);

  // Add effect to scroll to highlighted element
  useEffect(() => {
    if (highlightedElement && codeContentRef.current) {
      // Find the highlighted element in the current view
      const highlightedDiv = codeContentRef.current.querySelector(
        activeView === "json" ? ".orange-highlight" : ".highlighted-line",
      );

      if (highlightedDiv) {
        // Scroll the element into view with smooth behavior
        highlightedDiv.scrollIntoView({
          behavior: "smooth",
          block: "center",
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
      cursorPositionRef.current = preCaretRange.toString().length;
      // Save scroll position
      if (editorRef.current) {
        scrollPositionRef.current = {
          top: editorRef.current.scrollTop,
          left: editorRef.current.scrollLeft,
        };
      }
    }
  };

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

  /**
   * Cleans and formats Mermaid code for rendering.
   * @param {string} code - The Mermaid code to clean
   * @returns {string} Cleaned Mermaid code
   */
  const cleanMermaidCode = (code) => {
    if (!code) return "";

    // Split into lines and filter out classDef lines
    const lines = code
      .split("\n")
      .filter((line) => !line.trim().startsWith("classDef"))
      .join("\n");

    return lines.trim();
  };

  // Add effect to update highlighting when highlightedElement changes
  useEffect(() => {
    if (
      activeView === "mermaid" &&
      highlightedElement &&
      codeContentRef.current
    ) {
      const svg = codeContentRef.current.querySelector("svg");
      if (svg) {
        // Clear existing highlights
        svg
          .querySelectorAll(".node.highlighted, .edgePath.highlighted")
          .forEach((el) => {
            el.classList.remove("highlighted");
          });

        // Apply new highlight
        if (highlightedElement.type === "node") {
          // Look for node with the correct ID pattern
          const nodeId = `flowchart-${highlightedElement.id}`;
          const node = svg.querySelector(`#${nodeId}`);
          if (node) {
            node.classList.add("highlighted");
          }
        } else if (highlightedElement.type === "edge") {
          // Look for edge with ID containing the edge ID
          const edges = svg.querySelectorAll(".edgePath");
          for (const edge of edges) {
            if (edge.id.includes(highlightedElement.id)) {
              edge.classList.add("highlighted");
              break;
            }
          }
        }
      }
    }
  }, [activeView, highlightedElement]);

  /**
   * Handles folding/unfolding of JSON content
   * @param {Event} e - Click event
   */
  const handleFold = (e) => {
    // Only handle clicks on the fold buttons
    if (!e.target.classList.contains("fold-button")) return;

    const line = e.target.closest(".code-line");
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
  const handleDiagramClick = useCallback(
    (element) => {
      // Update highlighted element
      setHighlightedElement(element);

      // Find corresponding section in reference view
      if (markdownContent && element) {
        // Use the section_ref and text_ref directly from the element object
        const sectionRef = element.section_ref;
        const textRef = element.text_ref;

        if (sectionRef) {
          // Create a reference section object with both section and text refs
          const referenceSection = {
            refs: {
              section: sectionRef,
              text: textRef,
            },
            type: element.type,
          };
          setHighlightedSection(referenceSection);
        } else {
          // If no section_ref, clear the highlighted section
          setHighlightedSection(null);
        }
      }
    },
    [setHighlightedElement, setHighlightedSection, markdownContent],
  );

  // Add effect to maintain scroll position after any content updates
  useEffect(() => {
    if (editorRef.current && lastScrollPosition.current) {
      editorRef.current.scrollTop = lastScrollPosition.current.top;
      editorRef.current.scrollLeft = lastScrollPosition.current.left;
    }
  }, [editorContent, mermaidGraph]);

  return (
    <div className="editor-panel">
      <EditorHeader
        activeView={activeView}
        setActiveView={setActiveView}
        isEditing={isEditing}
        setNotification={setNotification}
      />

      <ViewerControls
        activeView={activeView}
        direction={direction}
        isEditing={isEditing}
        onDirectionChange={handleDirectionChange}
        onSave={handleSaveClick}
        setNotification={setNotification}
        isValidCode={isValidCode}
      />

      <NotificationManager
        notification={notification}
        isEditing={isEditing}
        activeView={activeView}
        mermaidCode={editorContent || mermaidGraph}
        onValidationChange={handleValidationChange}
      />

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
                    onKeyDown={handleKeyDown}
                    onFocus={onEditorFocus}
                    onClick={(e) => {
                      const node = e.target.closest(".node");
                      const edge = e.target.closest(".edgePath");

                      if (node || edge) {
                        // Remove any existing highlights first
                        const svg = e.target.closest("svg");
                        if (svg) {
                          svg
                            .querySelectorAll(
                              ".node.highlighted, .edgePath.highlighted",
                            )
                            .forEach((el) => {
                              el.classList.remove("highlighted");
                            });
                        }

                        if (node) {
                          const nodeId = node.id
                            .replace(/^flowchart-/, "")
                            .split("-")[0];
                          const nodeText =
                            node.querySelector(
                              ".label, .nodeLabel",
                            )?.textContent;
                          node.classList.add("highlighted");
                          handleDiagramClick({
                            type: "node",
                            id: nodeId,
                            text: nodeText,
                            section_ref: node.dataset.sectionRef,
                            text_ref: node.dataset.textRef,
                          });
                        } else if (edge) {
                          const edgeId =
                            edge.id?.split("-").slice(-1)[0] ||
                            edge.querySelector("title")?.textContent;
                          if (edgeId) {
                            edge.classList.add("highlighted");
                            handleDiagramClick({
                              type: "edge",
                              id: edgeId,
                              text: edgeId,
                              section_ref: edge.dataset.sectionRef,
                              text_ref: edge.dataset.textRef,
                            });
                          }
                        }
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightMermaidElement(
                        highlightMermaid(
                          cleanMermaidCode(editorContent || mermaidGraph),
                        ),
                        highlightedElement,
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
            onChange={() => setIsWrapped(!isWrapped)}
          />
          Wrap Text
        </label>
      </div>

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
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  onProcedureUpdate: PropTypes.func.isRequired,
  highlightedElement: PropTypes.shape({
    type: PropTypes.oneOf(["node", "edge"]),
    id: PropTypes.string,
  }),
  setHighlightedElement: PropTypes.func.isRequired,
  highlightedSection: PropTypes.shape({
    refs: PropTypes.shape({
      section: PropTypes.string,
      text: PropTypes.string,
    }),
    type: PropTypes.string,
  }),
  markdownContent: PropTypes.string.isRequired,
  onEditorFocus: PropTypes.func.isRequired,
  setHighlightedSection: PropTypes.func.isRequired,
};

JsonViewer.defaultProps = {
  selectedProcedure: null,
  highlightedElement: null,
  highlightedSection: null,
};

export default JsonViewer;
