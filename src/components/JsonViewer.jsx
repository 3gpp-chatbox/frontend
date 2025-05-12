import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { fetchProcedure } from "../API/api_calls";
import {
  JsonToMermaid,
  defaultMermaidConfig,
} from "../functions/jsonToMermaid";
import ConfirmationDialog from "./ConfirmationDialog";
import { highlightJson } from "../utils/jsonHighlighter";
import { highlightMermaid } from "../utils/MermaidHighlighter";
import { extractElementFromClick } from "../utils/ClickCodeHighlighter";
import { highlightMermaidLine } from "../utils/MermaidHighlighter";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import InteractiveMarkdown from '../utils/InteractiveMarkdown';
import { createSaveHandlers } from '../utils/SaveChanges';

function JsonViewer({ onMermaidCodeChange, selectedProcedure, onProcedureUpdate, highlightedElement, onEditorFocus }) {
  const [data, setData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [mermaidGraph, setMermaidGraph] = useState("");
  const [originalMermaidGraph, setOriginalMermaidGraph] = useState("");
  const [showMermaid, setShowMermaid] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [isWrapped, setIsWrapped] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [showPdf, setShowPdf] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [markdownContent, setMarkdownContent] = useState("");
  const [selectedMarkdownElement, setSelectedMarkdownElement] = useState(null);
  const [activeView, setActiveView] = useState(null);

  // Add ref to track user edits
  const userEditedContent = useRef("");
  const isUserEditing = useRef(false);
  const editorRef = useRef(null);
  const cursorPosition = useRef(null);

  // Add ref for the code content
  const codeContentRef = useRef(null);

  // Create save handlers
  const {
    handleSaveClick,
    handleConfirmSaveClick,
    handleRevertChangesClick,
    handleContinueEditingClick
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
    setMermaidGraph
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

  // Add effect to scroll to highlighted element
  useEffect(() => {
    if (highlightedElement && codeContentRef.current) {
      // Find the highlighted element
      const highlightedDiv = codeContentRef.current.querySelector('.orange-highlight');
      if (highlightedDiv) {
        // Scroll the element into view with some padding at the top
        highlightedDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  // Add effect to show Mermaid when procedure is selected
  useEffect(() => {
    if (selectedProcedure) {
      setShowMermaid(true);
      setShowPdf(false);
      setShowReference(false);
      setActiveView('mermaid');
    }
  }, [selectedProcedure]);

  // Update the handler functions to use activeView
  const handleMermaidViewerClick = () => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    setShowMermaid(true);
    setShowPdf(false);
    setShowReference(false);
    setActiveView('mermaid');
  };

  const handleJsonViewerClick = () => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    setShowMermaid(false);
    setShowPdf(false);
    setShowReference(false);
    setActiveView('json');
  };

  const handleDocumentViewerClick = () => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    setShowPdf(true);
    setShowReference(false);
    setShowMermaid(false);
    setActiveView('pdf');
  };

  const handleReferenceViewerClick = () => {
    if (isEditing) {
      setNotification({
        show: true,
        message: "Please save or revert your changes first",
        type: "warning",
      });
      return;
    }
    setShowReference(true);
    setShowPdf(false);
    setShowMermaid(false);
    setActiveView('reference');
  };

  // Add function to load markdown content
  const loadMarkdownContent = async () => {
    try {
      const response = await fetch('/src/data/Registration procedure for mobility and periodic registration update_original_context_20250505_144017.md');
      if (!response.ok) {
        throw new Error('Failed to load markdown content');
      }
      const content = await response.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error loading markdown content:', error);
      setNotification({
        show: true,
        message: 'Failed to load reference content',
        type: 'error'
      });
    }
  };

  // Load markdown content when Reference Viewer is shown
  useEffect(() => {
    if (showReference) {
      loadMarkdownContent();
    }
  }, [showReference]);

  // Add handler for clicking in Mermaid editor
  const handleMermaidClick = (event) => {
    // Only handle clicks on code lines
    const clickedLine = event.target.closest('.code-line');
    if (!clickedLine || !clickedLine.textContent) return;

    const line = clickedLine.textContent.trim();
    console.log('Clicked line:', line);

    const element = extractElementFromClick(line);
    console.log('Extracted element:', element);

    if (element) {
      onEditorFocus(element);
    }
  };

  // Add handler for markdown element clicks
  const handleMarkdownElementClick = (element) => {
    setSelectedMarkdownElement(element);
    console.log('Clicked markdown element:', element);
    // You can add additional handling here, such as:
    // - Updating the UI
    // - Triggering a search
    // - Updating related components
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
  const handleFold = useCallback((event) => {
    const button = event.target.closest('.fold-button');
    if (!button) return;

    const line = button.closest('.code-line');
    if (!line) return;

    const level = parseInt(line.dataset.level);
    const isFolded = button.textContent === '▼';
    button.textContent = isFolded ? '▶' : '▼';

    let current = line.nextElementSibling;
    while (current && parseInt(current.dataset.level) > level) {
      current.style.display = isFolded ? 'none' : 'flex';
      current = current.nextElementSibling;
    }
  }, []);

  return (
    <div className="section-container">
      <div className="section-header">
        <div className="header-content">
          <div className="header-row">
            <span className="title">
              Code View {selectedProcedure ? `- ${selectedProcedure.name}` : ""}
              {isEditing && <span className="editing-indicator"> (Editing)</span>}
            </span>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button
          className={`toggle-button ${activeView === 'mermaid' ? 'active' : ''}`}
          onClick={handleMermaidViewerClick}
          title="View Mermaid"
          disabled={!selectedProcedure}
        >
          Show Mermaid
        </button>
        <button
          className={`toggle-button ${activeView === 'json' ? 'active' : ''}`}
          onClick={handleJsonViewerClick}
          title="View JSON"
          disabled={!selectedProcedure}
        >
          Show JSON
        </button>
        <button
          className={`toggle-button ${activeView === 'pdf' ? 'active' : ''}`}
          onClick={handleDocumentViewerClick}
          title="View Document"
          disabled={!selectedProcedure}
        >
          Document Viewer
        </button>
        <button
          className={`toggle-button ${activeView === 'reference' ? 'active' : ''}`}
          onClick={handleReferenceViewerClick}
          title="View References"
          disabled={!selectedProcedure}
        >
          Reference Viewer
        </button>
        {activeView === 'mermaid' && (
          <button
            className={`save-button ${isEditing ? "active" : ""}`}
            onClick={handleSaveClick}
            disabled={!isEditing}
          >
            Save Changes
          </button>
        )}
      </div>
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <div className="json-viewer-content">
        {activeView === 'pdf' ? (
          <div className="pdf-viewer">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer fileUrl="./src/data/TS 24.501.pdf" />
            </Worker>
          </div>
        ) : activeView === 'reference' ? (
          <div className="reference-viewer">
            <div className="markdown-content">
              <InteractiveMarkdown 
                content={markdownContent}
                onElementClick={handleMarkdownElementClick}
              />
            </div>
          </div>
        ) : selectedProcedure ? (
          data ? (
            <pre className="json-content">
              {activeView === 'mermaid' ? (
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
                    onClick={handleMermaidClick}
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
                    __html: highlightJson(jsonContent, highlightedElement)
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
    type: PropTypes.oneOf(['node', 'edge']),
    id: PropTypes.string,
  }),
  onEditorFocus: PropTypes.func.isRequired,
};

export default JsonViewer;