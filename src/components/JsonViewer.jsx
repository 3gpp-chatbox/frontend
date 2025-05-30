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
import { FaSave, FaUndo } from "react-icons/fa";
import { BiVerticalBottom, BiHorizontalRight } from "react-icons/bi";
import InteractiveMarkdown from "../utils/InteractiveMarkdown";
import ConfirmationDialog from "./modals/SaveConfirmation";
import EditorHeader from "./editor/EditorHeader";
import ViewerControls from "./editor/ViewerControls";
import NotificationManager from "./editor/NotificationManager";
import FormatGuide from "./editor/FormatGuide";
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
  const [hasChanges, setHasChanges] = useState(false);
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
    // Normalize and validate content
    const normalizeContent = (content) => {
      const normalized = content
        .replace(/\r\n/g, '\n')
        .trim();

      const lines = normalized
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '' && /\S/.test(line));

      return lines.join('\n');
    };

    const normalizedContent = normalizeContent(editorContent || mermaidGraph);
    
    // Check for empty or whitespace-only content
    if (!normalizedContent || !/\S/.test(normalizedContent)) {
      setNotification({
        show: true,
        message: "Cannot save empty content",
        type: "error"
      });
      return;
    }

    // Check for actual content (nodes or edges)
    const contentLines = normalizedContent.split('\n');
    if (!contentLines.some(line => /[A-Za-z0-9]/.test(line))) {
      setNotification({
        show: true,
        message: "Graph must contain at least one node or edge definition",
        type: "error"
      });
      return;
    }

    // Check for duplicate nodes and edges
    const nodes = new Set();
    const edges = new Set();
    let duplicateFound = false;
    let duplicateMessage = "";

    contentLines.forEach(line => {
      line = line.trim();
      
      // Match node definitions (e.g., "A[text]", "B(text)", etc.)
      const nodeMatch = line.match(/^([A-Za-z0-9_]+)[\[\(\{\<]/);
      if (nodeMatch) {
        const nodeId = nodeMatch[1];
        if (nodes.has(nodeId)) {
          duplicateFound = true;
          duplicateMessage = `Duplicate node found: ${nodeId}`;
        }
        nodes.add(nodeId);
      }

      // Match edge definitions (e.g., "A-->B", "A==>B", etc.)
      const edgeMatch = line.match(/^([A-Za-z0-9_]+)\s*[-=][-=]+>\s*([A-Za-z0-9_]+)/);
      if (edgeMatch) {
        const edgeId = `${edgeMatch[1]}->${edgeMatch[2]}`;
        if (edges.has(edgeId)) {
          duplicateFound = true;
          duplicateMessage = `Duplicate edge found: ${edgeMatch[1]} to ${edgeMatch[2]}`;
        }
        edges.add(edgeId);
      }
    });

    if (duplicateFound) {
      setNotification({
        show: true,
        message: duplicateMessage,
        type: "error"
      });
      return;
    }

    // Compare with original content after normalization
    const normalizedOriginal = normalizeContent(originalMermaidGraph);
    if (normalizedContent === normalizedOriginal) {
      setNotification({
        show: true,
        message: "No changes to save",
        type: "info"
      });
      return;
    }

    if (!isValidCode) {
      setNotification({
        show: true,
        message: "Cannot save while there are validation errors",
        type: "error"
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSaveClick = async ({ title, message }) => {
    try {
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

      // Fetch the latest procedure data after saving
      if (selectedProcedure?.id && selectedProcedure?.entity) {
        const updatedProcedure = await fetchProcedure(selectedProcedure.id, selectedProcedure.entity);
        if (updatedProcedure) {
          // Update the procedure data in the parent component
          onProcedureUpdate(updatedProcedure);
        }
      }
    } catch (error) {
      console.error("Error saving changes:", error);
          setNotification({
            show: true,
        message: "Error saving changes. Please try again.",
            type: "error"
          });
    }
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

  const [isValidCode, setIsValidCode] = useState(true);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const lastContentRef = useRef('');

  // Add effect to initialize undo stack when editing starts
  useEffect(() => {
    if (isEditing && undoStack.length === 0) {
      setUndoStack([mermaidGraph]);
      lastContentRef.current = mermaidGraph;
    }
  }, [isEditing, mermaidGraph]);

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
        setJsonContent(jsonString);
        
        // Only update Mermaid code if not actively editing
        if (!isEditing) {
          const mermaidCode = JsonToMermaid(graphData, { ...defaultMermaidConfig, direction });
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
        // Clear all states when no procedure is selected
        setData(null);
        setOriginalData(null);
        setMermaidGraph("");
        setOriginalMermaidGraph("");
        setJsonContent("");
        setIsEditing(false);
        isUserEditing.current = false;
        return;
      }

      console.log("Loading procedure data for ID:", selectedProcedure.id);

      try {
        // Clear previous data first
        setData(null);
        setOriginalData(null);
        setMermaidGraph("");
        setOriginalMermaidGraph("");
        setJsonContent("");
        setIsEditing(false);
        isUserEditing.current = false;
        setEditorContent("");

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

        // Generate and set initial Mermaid code
        const graphData = procedureData.edited_graph || procedureData.original_graph || procedureData.graph;
        if (graphData) {
          const mermaidCode = JsonToMermaid(graphData, { ...defaultMermaidConfig, direction });
          setMermaidGraph(mermaidCode);
          setOriginalMermaidGraph(mermaidCode);
          onMermaidCodeChange(mermaidCode);
          setEditorContent(mermaidCode);
        }
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

  // Add keydown handler for better line break control and undo/redo
  const handleKeyDown = (event) => {
    // Handle undo
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      
      if (undoStack.length > 0) {
        const prevState = undoStack[undoStack.length - 1];
        const currentContent = editorRef.current.textContent;
        
        // Update stacks
        setUndoStack(undoStack.slice(0, -1));
        setRedoStack([currentContent, ...redoStack]);
        
        // Update content
        editorRef.current.textContent = prevState;
        setEditorContent(prevState);
        
        // Update Mermaid graph
        if (debouncedUpdateRef.current) {
          debouncedUpdateRef.current(prevState);
        }
      }
      return;
    }
    
    // Handle redo (Ctrl+Y or Ctrl+Shift+Z)
    if ((event.ctrlKey || event.metaKey) && (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey))) {
      event.preventDefault();
      event.stopPropagation();
      
      if (redoStack.length > 0) {
        const nextState = redoStack[0];
        const currentContent = editorRef.current.textContent;
        
        // Update stacks
        setRedoStack(redoStack.slice(1));
        setUndoStack([...undoStack, currentContent]);
        
        // Update content
        editorRef.current.textContent = nextState;
        setEditorContent(nextState);
        
        // Update Mermaid graph
        if (debouncedUpdateRef.current) {
          debouncedUpdateRef.current(nextState);
        }
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      
      // Save scroll position
      if (editorRef.current) {
        scrollPositionRef.current = {
          top: editorRef.current.scrollTop,
          left: editorRef.current.scrollLeft
        };
      }
      
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentContent = editorRef.current.textContent;
        
        // Create a new text node with a line break
        const textNode = document.createTextNode('\n');
        range.insertNode(textNode);
        
        // Move cursor to the new line
        range.setStart(textNode, 1);
        range.setEnd(textNode, 1);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Save state for undo
        setUndoStack([...undoStack, currentContent]);
        setRedoStack([]);
        
        // Trigger change event
        const changeEvent = new Event('input', { bubbles: true });
        editorRef.current.dispatchEvent(changeEvent);

        // Restore scroll position
        requestAnimationFrame(() => {
          if (editorRef.current && scrollPositionRef.current) {
            editorRef.current.scrollTop = scrollPositionRef.current.top;
            editorRef.current.scrollLeft = scrollPositionRef.current.left;
          }
        });
      }
    }
  };

  // Modify handleMermaidChange to track actual changes
  const handleMermaidChange = (event) => {
    try {
      const newCode = event.currentTarget.textContent;
      
      // Save scroll position before any changes
      if (editorRef.current) {
        scrollPositionRef.current = {
          top: editorRef.current.scrollTop,
          left: editorRef.current.scrollLeft
        };
      }

      // Save cursor position before any changes
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        cursorPositionRef.current = {
          offset: getTextOffset(range.endContainer, range.endOffset, editorRef.current),
          surroundingText: range.endContainer.textContent
        };
      }

      // Basic content validation
      if (typeof newCode !== 'string') {
        throw new Error('Invalid content type');
      }

      // Check for actual content and duplicates
      const contentLines = newCode.split('\n');
      const hasContent = contentLines.some(line => /[A-Za-z0-9]/.test(line));

      // Check for duplicate nodes and edges
      const nodes = new Set();
      const edges = new Set();
      let duplicateErrors = [];

      contentLines.forEach(line => {
        line = line.trim();
        
        // Match node definitions (e.g., "A[text]", "B(text)", etc.)
        const nodeMatch = line.match(/^([A-Za-z0-9_]+)[\[\(\{\<]/);
        if (nodeMatch) {
          const nodeId = nodeMatch[1];
          if (nodes.has(nodeId)) {
            duplicateErrors.push(`Duplicate node found: ${nodeId}`);
          }
          nodes.add(nodeId);
        }

        // Match edge definitions (e.g., "A-->B", "A==>B", etc.)
        const edgeMatch = line.match(/^([A-Za-z0-9_]+)\s*[-=][-=]+>\s*([A-Za-z0-9_]+)/);
        if (edgeMatch) {
          const edgeId = `${edgeMatch[1]}->${edgeMatch[2]}`;
          if (edges.has(edgeId)) {
            duplicateErrors.push(`Duplicate edge found: ${edgeMatch[1]} to ${edgeMatch[2]}`);
          }
          edges.add(edgeId);
        }
      });

      // Set validation state based on duplicates
      setIsValidCode(!duplicateErrors.length);

      // Check if there are actual structural changes
      console.log('Checking for structural changes...');
      console.log('New code:', newCode);
      console.log('Original code:', originalMermaidGraph);
      
      const hasActualChanges = hasGraphStructureChanges(newCode, originalMermaidGraph);
      console.log('Has actual changes:', hasActualChanges);
      
      // Update states based on changes
      if (hasActualChanges) {
        setIsEditing(true);
        setHasChanges(true);
        isUserEditing.current = true;
        console.log('Setting editing states to true due to actual changes');
      } else if (newCode !== originalMermaidGraph) {
        // There are changes, but they're only whitespace
        setIsEditing(true);
        setHasChanges(false);
        isUserEditing.current = true;
      }
      
      // Always update the editor content to maintain cursor position
      setEditorContent(newCode);
      
      // Update the graph with debounce
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current(newCode);
      }

      // Restore cursor and scroll position
      requestAnimationFrame(() => {
        // Restore scroll position first
        if (editorRef.current && scrollPositionRef.current) {
          editorRef.current.scrollTop = scrollPositionRef.current.top;
          editorRef.current.scrollLeft = scrollPositionRef.current.left;
        }

        // Then restore cursor position
        if (cursorPositionRef.current) {
          const textNodeInfo = findTextNodeAtOffset(editorRef.current, cursorPositionRef.current.offset);
          if (textNodeInfo) {
            const newRange = document.createRange();
            newRange.setStart(textNodeInfo.node, textNodeInfo.offset);
            newRange.collapse(true);
            
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        }
      });

    } catch (error) {
      console.error('Error in handleMermaidChange:', error);
      setNotification({
        show: true,
        message: `Error updating content: ${error.message}`,
        type: "error"
      });
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

  // here------direction change
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
    // Use newDirection here!
    const updatedCode = mermaidGraph.replace(
      /flowchart\s+(TD|LR)/,
      `flowchart ${newDirection}`,
    );
    setMermaidGraph(updatedCode);
    onMermaidCodeChange(updatedCode);
  };
  // here------direction change

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
      .filter(line => !line.trim().startsWith('flowchart'))
      .join('\n');
    
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

  // Add fold/unfold functionality
  const handleFold = (e) => {
    const foldButton = e.target.closest('.fold-button');
    if (!foldButton) return;

    const line = foldButton.closest('.code-line');
    if (!line) return;

    const level = parseInt(line.dataset.level || '0');
    const isExpanded = foldButton.classList.contains('expanded');

    // Toggle fold state of clicked button
    foldButton.classList.toggle('expanded');
    foldButton.textContent = isExpanded ? '▶' : '▼';

    // Find all children and simply show/hide them
    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level || '0') > level) {
      // When folding (isExpanded is true), hide all children
      // When unfolding (isExpanded is false), show all children
      current.style.display = isExpanded ? 'none' : '';
      
      // Also update the fold button state to match parent
      const childFoldButton = current.querySelector('.fold-button');
      if (childFoldButton) {
        if (isExpanded) {
          childFoldButton.classList.remove('expanded');
          childFoldButton.textContent = '▶';
        } else {
          childFoldButton.classList.add('expanded');
          childFoldButton.textContent = '▼';
        }
      }
      
      current = current.nextElementSibling;
    }
  };

  // Add click handler for JSON content
  const handleJsonClick = (e) => {
    if (activeView === 'json') {
      handleFold(e);
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

  const hasGraphStructureChanges = (newContent, originalContent) => {
    if (!newContent || !originalContent) {
      console.log('One of the contents is empty');
      return false;
    }

    // Helper function to extract nodes and edges from content
    const extractElements = (content) => {
      const elements = {
        nodes: new Set(),
        edges: new Set(),
        metadata: new Map()
      };

      const lines = content.split('\n');
      for (let line of lines) {
        line = line.trim();
        
        // Match node definitions more precisely
        const nodeMatch = line.match(/^([A-Za-z0-9_]+)[\[\(\{\<](.*?)[\]\)\}\>](:::[\w-]+)?$/);
        if (nodeMatch) {
          const [fullMatch, id, label] = nodeMatch;
          elements.nodes.add(fullMatch);
          continue;
        }

        // Match edge definitions
        const edgeMatch = line.match(/^([A-Za-z0-9_]+)\s*[-=][-=]+>\s*([A-Za-z0-9_]+)/);
        if (edgeMatch) {
          elements.edges.add(line.trim());
          continue;
        }

        // Match metadata
        if (line.startsWith('%%')) {
          const currentElement = Array.from(elements.nodes).pop() || Array.from(elements.edges).pop();
          if (currentElement) {
            const metadata = elements.metadata.get(currentElement) || [];
            metadata.push(line.trim());
            elements.metadata.set(currentElement, metadata);
          }
        }
      }

      return elements;
    };

    const newElements = extractElements(newContent);
    const originalElements = extractElements(originalContent);

    console.log('Extracted elements:', {
      new: {
        nodes: Array.from(newElements.nodes),
        edges: Array.from(newElements.edges)
      },
      original: {
        nodes: Array.from(originalElements.nodes),
        edges: Array.from(originalElements.edges)
      }
    });

    // Compare node counts
    if (newElements.nodes.size !== originalElements.nodes.size) {
      console.log('Different number of nodes detected');
      return true;
    }

    // Compare edge counts
    if (newElements.edges.size !== originalElements.edges.size) {
      console.log('Different number of edges detected');
      return true;
    }

    // Compare nodes
    for (const node of newElements.nodes) {
      if (!originalElements.nodes.has(node)) {
        console.log('New or modified node detected:', node);
        return true;
      }
    }

    // Compare edges
    for (const edge of newElements.edges) {
      if (!originalElements.edges.has(edge)) {
        console.log('New or modified edge detected:', edge);
        return true;
      }
    }

    // Compare metadata
    for (const [element, metadata] of newElements.metadata) {
      const originalMetadata = originalElements.metadata.get(element) || [];
      if (!arraysEqual(metadata, originalMetadata)) {
        console.log('Metadata changes detected for:', element);
        return true;
      }
    }

    console.log('No structural changes detected');
    return false;
  };

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  };

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
        hasChanges={hasChanges}
        onDirectionChange={handleDirectionChange}
        onSave={handleSaveClick}
        onRevert={handleRevertChangesClick}
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

      <FormatGuide isEditing={isEditing} activeView={activeView} />

      {/* Add unsaved changes warning for JSON and Reference views */}
      {activeView !== "mermaid" && isEditing && (
        <div className="unsaved-changes-warning">
          You have unsaved changes in the Mermaid editor
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
                  onClick={handleJsonClick}
                  ref={codeContentRef}
                  dangerouslySetInnerHTML={{
                    __html: highlightJson(jsonContent, highlightedElement),
                  }}
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
