import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureTitle from "./components/procedureTitle";
import Comparison from "./components/Comparison";
import SearchProcedure from "./components/SearchProcedure";
import AdvancedSearch from "./components/modals/AdvancedSearch";
import { LuSettings2 } from "react-icons/lu";
import { fetchProcedures } from "./API/api_calls";
/**
 * Main application component for the 3GPP Flow Editor.
 * Manages the overall application state and layout, including:
 * - Procedure selection and management
 * - Mermaid diagram rendering and interaction
 * - JSON/Reference view switching
 * - Element highlighting and navigation
 *
 * @component
 * @returns {JSX.Element} The rendered application interface
 */

function App() {
  const [mermaidCode, setMermaidCode] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureData, setProcedureData] = useState(null);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch procedures once on mount
  useEffect(() => {
    console.log("fetching procedures in App.jsx");
    setLoading(true);
    setError(null);
    fetchProcedures()
      .then((data) => {
        setProcedures(data);
      })
      .catch((err) => {
        console.error("Error fetching procedures:", err);
        setError("Failed to load procedures.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Update markdown content when procedure data changes
  useEffect(() => {
    if (procedureData?.reference?.context_markdown) {
      setMarkdownContent(procedureData.reference.context_markdown);
    }
  }, [procedureData]);

  /**
   * Handles procedure selection from the list.
   * Updates the selected procedure and associated data.
   *
   * @param {Object} procedure - The selected procedure
   * @param {string} procedure.id - Procedure identifier
   * @param {string} procedure.name - Procedure name
   */
  const handleProcedureSelect = (procedure) => {
    setSelectedProcedure(procedure);
    setProcedureData(procedure);
  };

  /**
   * Handles updates to the Mermaid code.
   * Updates the diagram and clears highlighting if code changes.
   *
   * @param {string} newCode - The new Mermaid diagram code
   */

  const handleMermaidCodeChange = (newCode) => {
    setMermaidCode(newCode);
    if (newCode !== mermaidCode) {
      setHighlightedElement(null);
      setHighlightedSection(null);
    }
  };

  /**
   * Handles updates to procedure data.
   * Updates the selected procedure with new data.
   *
   * @param {Object} updatedData - The updated procedure data
   */

  const handleProcedureUpdate = (updatedData) => {
    const updatedProcedure = {
      ...selectedProcedure,
      ...updatedData,
      id: selectedProcedure?.id,
      entity: selectedProcedure?.entity,
      name: selectedProcedure?.name,
      version: selectedProcedure?.version
    };
    setProcedureData(updatedProcedure);
    setSelectedProcedure(updatedProcedure);
  };

  /**
   * Handles clicks on diagram elements (nodes/edges).
   * Updates highlighting and manages reference section mapping.
   *
   * @param {Object} element - The clicked diagram element
   * @param {string} element.type - Type of element ('node' or 'edge')
   * @param {string} element.id - Element identifier
   * @param {string} [element.text] - Display text for the element
   * @param {string} [element.description] - Element description
   * @param {string} [element.section_ref] - Section reference (future use)
   * @param {string} [element.text_ref] - Text reference (future use)
   */

  const handleElementClick = (element) => {
    if (element) {
    setHighlightedElement(element);
    
      // Use the section_ref and text_ref directly from the element object
      const sectionRef = element.section_ref;
      const textRef = element.text_ref;
      if (markdownContent && sectionRef) {
        const referenceSection = {
          refs: {
            section: sectionRef,
            text: textRef || '',
          },
          type: element.type,
        };
        setHighlightedSection(referenceSection);
      } else {
        setHighlightedSection(null);
      }
    }
  };

  /**
   * Handles editor focus events.
   * Clears any existing element highlighting and section mapping.
   */
  const handleEditorFocus = () => {
    setHighlightedElement(null);
    setHighlightedSection(null);
  };

  // Current version data for the left panel of comparison view
  const leftVersion = {
    title: selectedProcedure
      ? `${selectedProcedure.procedure_name} (${selectedProcedure.entity}) - Baseline Version ${selectedProcedure.version}`
      : 'Select a procedure',
    jsonContent: JSON.stringify(procedureData?.graph || {}, null, 2),
    version: selectedProcedure?.version,
  };

  // Handler to open comparison view
  const handleOpenComparison = () => {
    setShowComparison(true);
  };
  // Handler to close comparison view
  const handleCloseComparison = () => {
    setShowComparison(false);
    setHighlightedElement(null);
    setHighlightedSection(null);
    setMermaidCode(prev => prev);
  };


  useEffect(() => {
    // Only set up resize handlers when not in comparison view
    if (showComparison) return;

    const resizer = document.querySelector(".resizer");
    const leftPanel = document.querySelector(".editor-panel");
    const rightPanel = document.querySelector(".diagram-panel");

    // Return early if any required elements are missing
    if (!resizer || !leftPanel || !rightPanel) return;

    let isResizing = false;
    let startX;
    let leftWidth;

    const startResizing = (e) => {
      isResizing = true;
      startX = e.clientX;
      leftWidth = leftPanel.offsetWidth;

      resizer.classList.add("dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };

    const stopResizing = () => {
      if (!isResizing) return;

      isResizing = false;
      resizer.classList.remove("dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    const resize = (e) => {
      if (!isResizing) return;

      const container = document.querySelector(".editor-diagram-container");
      const containerWidth = container.offsetWidth;

      const delta = e.clientX - startX;
      const newLeftWidth = ((leftWidth + delta) / containerWidth) * 100;
      const newRightWidth = 100 - newLeftWidth;

      // Ensure minimum width of 20% for both panels
      if (newLeftWidth >= 20 && newRightWidth >= 20) {
        leftPanel.style.width = `${newLeftWidth}%`;
        rightPanel.style.width = `${newRightWidth}%`;
      }
    };

    resizer.addEventListener("mousedown", startResizing);
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResizing);

    return () => {
      resizer.removeEventListener("mousedown", startResizing);
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [showComparison]); 

  return (
    <div className="container">
      <div className="title-bar-container">
        {/* title bar */}
        <div className="title">3GPP Procedure Insights</div>
        <SearchProcedure 
          onProcedureSelect={handleProcedureSelect} 
          selectedProcedure={selectedProcedure}
          disabled={showComparison}
          procedures={procedures}
          loading={loading}
          error={error}
        />
        <button
          className="advanced-search-btn"
          onClick={() => setShowAdvancedSearch(true)}
          type="button"
        >
          <LuSettings2 className="action-icon advanced-search-icon" />
          Advanced Search
        </button>
        <AdvancedSearch
          isOpen={showAdvancedSearch}
          onClose={() => setShowAdvancedSearch(false)}
          onSelect={(proc) => {
            handleProcedureSelect(proc);
            setShowAdvancedSearch(false);
          }}
          procedures={procedures}
          loading={loading}
          error={error}
        />
        </div>
      {/* grid layout */}
      <div className="grid-layout">
        {/* procedure title bar */}
        <ProcedureTitle 
          selectedProcedure={selectedProcedure} 
          onOpenComparison={handleOpenComparison} 
        />

        {/* Render comparison view if toggled */}
        {showComparison ? (
          <Comparison 
            left={leftVersion} 
            right={{ title: 'Select Version' }} 
            onClose={handleCloseComparison}
            selectedProcedure={selectedProcedure}
          />
        ) : (
          <div className="procedure-container">
            <PanelGroup direction="horizontal">
              <Panel defaultSize={50} minSize={30}>
                <div className="procedure-container-left">
          {/* JSON/Mermaid Editor Panel */}
            <JsonViewer
              onMermaidCodeChange={handleMermaidCodeChange}
              selectedProcedure={selectedProcedure}
              onProcedureUpdate={handleProcedureUpdate}
                    highlightedElement={highlightedElement}
                    setHighlightedElement={setHighlightedElement}
                    highlightedSection={highlightedSection}
                    markdownContent={markdownContent}
                    onEditorFocus={handleEditorFocus}
                    setHighlightedSection={setHighlightedSection}
                  />
                  <div className="resizer"></div>
          </div>
              </Panel>
              <PanelResizeHandle className="resize-handle" />
              <Panel defaultSize={50} minSize={30}>
                <div className="procedure-container-right">
          {/* Flow Diagram Panel */}
          <div className="diagram-panel">
            <FlowDiagram 
              mermaidCode={mermaidCode} 
              onElementClick={handleElementClick}
                      highlightedElement={highlightedElement}
            />
          </div>
        </div>
              </Panel>
            </PanelGroup>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;