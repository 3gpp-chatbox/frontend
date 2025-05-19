import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure,insertProcedureGraphChanges } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import { convertMermaidToJson } from "../functions/mermaidToJson";
import { validateGraph } from "../functions/schema_validation";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid, highlightMermaidElement } from "../utils/MermaidHighlighter";
import { FaSave } from "react-icons/fa";
import { BiVerticalTop, BiHorizontalLeft } from "react-icons/bi";
import InteractiveMarkdown from "../utils/InteractiveMarkdown";
import ConfirmationDialog from "./modals/ConfirmationDialog";
import { saveGraphChanges, revertChanges, continueEditing } from "../utils/SaveChanges";

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

  // Save changes
  const handleSaveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSaveClick = async ({ title, message }) => {
    await saveGraphChanges({
      mermaidGraph,
      selectedProcedure,
      setNotification,
      setShowConfirmation,
      setIsEditing,
      isUserEditing,
      setData,
      setOriginalData,
      setJsonContent,
      onProcedureUpdate,
      title,
      message,
    });
  };

  const handleRevertChangesClick = () => {
    // Save current editor state before reverting
    if (editorRef.current) {
      lastScrollPosition.current = {
        top: editorRef.current.scrollTop,
        left: editorRef.current.scrollLeft
      };
    }

    revertChanges({
      originalMermaidGraph,
      originalData,
      setMermaidGraph,
      setData,
      setJsonContent,
      isUserEditing,
      setIsEditing,
      setShowConfirmation,
      onMermaidCodeChange,
      setNotification,
    });

    // Clear editor content and reset to original
    setEditorContent(originalMermaidGraph);
    
    // Reset user editing state
    userEditedContent.current = originalMermaidGraph;
  };

  const handleContinueEditingClick = () => {
    continueEditing(setShowConfirmation);
  };

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

        const procedureData = await fetchProcedure(selectedProcedure.id, selectedProcedure.entity);
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
          left: editorRef.current.scrollLeft
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

  // Save both cursor and scroll position
  // const saveEditorState = () => {
  //   if (editorRef.current) {
  //     // Save scroll position
  //     lastScrollPosition.current = {
  //       top: editorRef.current.scrollTop,
  //       left: editorRef.current.scrollLeft
  //     };

  //     // Save cursor position with more context
  //     const selection = window.getSelection();
  //     if (selection.rangeCount > 0) {
  //       const range = selection.getRangeAt(0);
  //       const content = editorRef.current.textContent;
        
  //       // Store more context about the cursor position
  //       cursorPositionRef.current = {
  //         offset: range.startOffset,
  //         containerText: range.startContainer.textContent,
  //         containerIndex: Array.from(editorRef.current.childNodes).indexOf(range.startContainer),
  //         totalLength: content.length,
  //         // Store some surrounding text for better position recovery
  //         surroundingText: content.substring(
  //           Math.max(0, range.startOffset - 10),
  //           Math.min(content.length, range.startOffset + 10)
  //         )
  //       };
  //     }
  //   }
  // };

  // Restore both cursor and scroll position
  const restoreEditorState = useCallback(() => {
    if (!editorRef.current || !cursorPositionRef.current) return;

    // Restore scroll position first
    if (scrollPositionRef.current) {
      editorRef.current.scrollTop = scrollPositionRef.current.top;
      editorRef.current.scrollLeft = scrollPositionRef.current.left;
    }

    // Restore cursor position
    const selection = window.getSelection();
    const range = document.createRange();

    // Try to find the exact text node based on surrounding context
    const findTextNodeWithContext = (node, searchText) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.includes(searchText)) {
          return node;
        }
      } else {
        for (const child of node.childNodes) {
          const result = findTextNodeWithContext(child, searchText);
          if (result) return result;
        }
      }
      return null;
    };

    // First try to find the exact text node using surrounding context
    const surroundingText = cursorPositionRef.current.surroundingText;
    let targetNode = findTextNodeWithContext(editorRef.current, surroundingText);
    let targetOffset = cursorPositionRef.current.offset;

    // If we can't find the exact node, try to find a node with similar content
    if (!targetNode) {
      const walk = document.createTreeWalker(
        editorRef.current,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      let bestMatch = { node: null, similarity: 0 };

      while ((node = walk.nextNode())) {
        const similarity = calculateStringSimilarity(
          node.textContent,
          cursorPositionRef.current.containerText
        );
        if (similarity > bestMatch.similarity) {
          bestMatch = { node, similarity };
        }
      }

      if (bestMatch.node) {
        targetNode = bestMatch.node;
        // Adjust offset based on content similarity
        const originalLength = cursorPositionRef.current.containerText.length;
        const newLength = targetNode.textContent.length;
        targetOffset = Math.round((cursorPositionRef.current.offset * newLength) / originalLength);
      }
    }

    // If we found a target node, set the cursor position
    if (targetNode) {
      try {
        targetOffset = Math.min(targetOffset, targetNode.textContent.length);
        range.setStart(targetNode, targetOffset);
        range.setEnd(targetNode, targetOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (error) {
        console.warn("Error restoring cursor position:", error);
      }
    }
  }, []);

  // Add helper function to calculate string similarity
  const calculateStringSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill().map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return 1 - matrix[len1][len2] / maxLen;
  };

  // Update the handleMermaidChange function with improved cursor handling
  const handleMermaidChange = (event) => {
    const newCode = event.currentTarget.textContent;
    
    // Save editor state before any updates
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      
      // Store more detailed cursor context
      cursorPositionRef.current = {
        offset: range.startOffset,
        containerNode: range.startContainer,
        containerText: range.startContainer.textContent,
        containerIndex: Array.from(editorRef.current.childNodes).indexOf(range.startContainer.parentNode),
        surroundingText: range.startContainer.textContent.substring(
          Math.max(0, range.startOffset - 20),
          Math.min(range.startContainer.textContent.length, range.startOffset + 20)
        )
      };
    }
    
    // Save scroll position
    if (editorRef.current) {
      scrollPositionRef.current = {
        top: editorRef.current.scrollTop,
        left: editorRef.current.scrollLeft
      };
    }
    
    // Update editor content immediately for responsive typing
    setEditorContent(newCode);
    
    // Only trigger mermaid updates if code actually changed
    if (newCode !== mermaidGraph) {
      isUserEditing.current = true;
      userEditedContent.current = newCode;
      setIsEditing(true);
      
      // Debounce the mermaid graph update
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current(newCode);
      }
    }
  };

  // Add effect to restore editor state after content updates
  useEffect(() => {
    requestAnimationFrame(restoreEditorState);
  }, [editorContent, mermaidGraph, restoreEditorState]);

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

  // const saveCursorPosition = () => {
  //   const selection = window.getSelection();
  //   if (selection.rangeCount > 0) {
  //     const range = selection.getRangeAt(0);
  //     const preCaretRange = range.cloneRange();
  //     preCaretRange.selectNodeContents(editorRef.current);
  //     preCaretRange.setEnd(range.endContainer, range.endOffset);
  //     cursorPositionRef.current = preCaretRange.toString().length;
  //     // Save scroll position
  //     if (editorRef.current) {
  //       scrollPositionRef.current = {
  //         top: editorRef.current.scrollTop,
  //         left: editorRef.current.scrollLeft
  //       };
  //     }
  //   }
  // };

  const restoreCursorPosition = useCallback(() => {
    if (editorRef.current && cursorPositionRef.current !== null) {
      const selection = window.getSelection();
      const range = document.createRange();
      let charCount = 0;
      let targetNode = null;
      let targetOffset = 0;

      const findPosition = (node) => {
        if (targetNode) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const length = node.textContent.length;
          if (charCount + length >= cursorPositionRef.current) {
            targetNode = node;
            targetOffset = cursorPositionRef.current - charCount;
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
          
          // Restore scroll position after cursor is restored
          if (scrollPositionRef.current) {
            requestAnimationFrame(() => {
              if (editorRef.current) {
                editorRef.current.scrollTop = scrollPositionRef.current.top;
                editorRef.current.scrollLeft = scrollPositionRef.current.left;
              }
            });
          }
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

  /**
   * Cleans and formats Mermaid code for rendering.
   * @param {string} code - The Mermaid code to clean
   * @returns {string} Cleaned Mermaid code
   */
  const cleanMermaidCode = (code) => {
    if (!code) return "";
    
    // Split into lines and filter out classDef lines
    const lines = code.split('\n')
      .filter(line => !line.trim().startsWith('classDef'))
      .join('\n');
    
    return lines.trim();
  };

  // Add effect to update highlighting when highlightedElement changes
  useEffect(() => {
    if (activeView === "mermaid" && highlightedElement && codeContentRef.current) {
      const svg = codeContentRef.current.querySelector("svg");
      if (svg) {
        // Clear existing highlights
        svg.querySelectorAll(".node.highlighted, .edgePath.highlighted").forEach(el => {
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
          const edges = svg.querySelectorAll('.edgePath');
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
  const handleDiagramClick = useCallback((element) => {
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
            text: textRef
          },
          type: element.type
        };
        setHighlightedSection(referenceSection);
      } else {
        // If no section_ref, clear the highlighted section
        setHighlightedSection(null);
      }
    }
  }, [setHighlightedElement, setHighlightedSection, markdownContent]);

  // Add effect to maintain scroll position after any content updates
  useEffect(() => {
    if (editorRef.current && lastScrollPosition.current) {
      editorRef.current.scrollTop = lastScrollPosition.current.top;
      editorRef.current.scrollLeft = lastScrollPosition.current.left;
    }
  }, [editorContent, mermaidGraph]);

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
              onClick={handleSaveClick}
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
                      
                      if (node || edge) {
                        // Remove any existing highlights first
                        const svg = e.target.closest("svg");
                        if (svg) {
                          svg.querySelectorAll(".node.highlighted, .edgePath.highlighted").forEach(el => {
                            el.classList.remove("highlighted");
                          });
                        }
                        
                        if (node) {
                          // Extract the actual node ID from the flowchart-prefixed ID
                          const nodeId = node.id.replace(/^flowchart-/, '').split('-')[0];
                          const nodeText = node.querySelector(".label, .nodeLabel")?.textContent;
                          // Add highlight class to the clicked node
                          node.classList.add("highlighted");
                          // Pass the extracted references and other properties
                          handleDiagramClick({
                            type: "node",
                            id: nodeId,
                            text: nodeText,
                            section_ref: node.dataset.sectionRef, // Assuming data attributes are added
                            text_ref: node.dataset.textRef // Assuming data attributes are added
                          });
                        } else if (edge) {
                          // Extract edge ID from the path or title
                          const edgeId = edge.id?.split('-').slice(-1)[0] || 
                                       edge.querySelector("title")?.textContent;
                          if (edgeId) {
                            // Add highlight class to the clicked edge
                            edge.classList.add("highlighted");
                            // Pass the extracted references and other properties
                            handleDiagramClick({
                              type: "edge",
                              id: edgeId,
                              text: edgeId, // Or extract edge label if needed
                              section_ref: edge.dataset.sectionRef, // Assuming data attributes are added
                              text_ref: edge.dataset.textRef // Assuming data attributes are added
                            });
                          }
                        }
                    }
                  }}
                  dangerouslySetInnerHTML={{
                      __html: highlightMermaidElement(
                        highlightMermaid(cleanMermaidCode(editorContent || mermaidGraph)),
                        highlightedElement
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
        // title="Save Changes?"
        // message="Are you sure you want to save the changes you made to the JSON code?"
        onConfirm={handleConfirmSaveClick}
        onContinueEditing={handleContinueEditingClick}
        onRevert={handleRevertChangesClick}
        showContinueEditing={true}
        // showRevert={true}
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
      text: PropTypes.string
    }),
    type: PropTypes.string
  }),
  markdownContent: PropTypes.string.isRequired,
  onEditorFocus: PropTypes.func.isRequired,
  setHighlightedSection: PropTypes.func.isRequired,
};

JsonViewer.defaultProps = {
  selectedProcedure: null,
  highlightedElement: null,
  highlightedSection: null
};

export default JsonViewer;