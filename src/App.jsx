import { useState, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";
// import Description from "./components/Descriptions";
import ProcedureTitle from "./components/procedureTitle";
import { mapElementToReference } from "./utils/referenceMapper";

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
  const [highlightedSection, setHighlightedSection] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");

  // Load markdown content when component mounts
  useEffect(() => {
    const loadMarkdownContent = async () => {
      try {
        const response = await fetch(
          "/src/data/Security mode control procedure_original_context_context_20250505_182324.md",
        );
        if (!response.ok) {
          throw new Error("Failed to load markdown content");
        }
        const content = await response.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error("Error loading markdown content:", error);
      }
    };
    loadMarkdownContent();
  }, []);

  /**
   * Handles procedure selection from the list.
   * Updates the selected procedure and associated data.
   *
   * @param {Object} procedure - The selected procedure
   * @param {string} procedure.id - Procedure identifier
   * @param {string} procedure.name - Procedure name
   */
  const handleProcedureSelect = (procedure) => {
    console.log("Selected procedure:", procedure);
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
    console.log("App: Mermaid code updated:", newCode);
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
    console.log("App: Procedure data updated:", updatedData);
    setProcedureData({
      ...selectedProcedure,
      ...updatedData,
    });
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
    console.log("Diagram element clicked:", element);

    // Only update if we have a new element to highlight
    // Don't clear highlighting when element is null (clicking empty space)
    if (element) {
      setHighlightedElement(element);

      // Map the element to its reference section
      if (markdownContent) {
        /* When the new data structure is available, use section_ref and text_ref directly
        if (element.section_ref) {
          const referenceSection = {
            refs: {
              section: element.section_ref,
              text: element.text_ref || ''
            },
            type: element.type
          };
          setHighlightedSection(referenceSection);
          return;
        }
        */

        // Current implementation - fallback to using description
        const elementToMap =
          element.type === "node" && element.description
            ? { ...element, id: element.description }
            : element;

        const referenceSection = mapElementToReference(
          markdownContent,
          elementToMap,
        );
        console.log("Found reference section:", referenceSection);
        if (referenceSection) {
          referenceSection.type = element.type; // Add element type for better matching
        }
        setHighlightedSection(referenceSection);
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

  useEffect(() => {
    const resizer = document.querySelector(".resizer");
    const leftPanel = document.querySelector(".editor-panel");
    const rightPanel = document.querySelector(".diagram-panel");

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
  }, []);

  return (
    <div className="container">
      <div className="title-bar-container">
        {/* title bar */}
        <header className="title">3GPP Procedure Insights</header>
        <ProcedureList
          selectedProcedure={selectedProcedure}
          onProcedureSelect={handleProcedureSelect}
        />
      </div>
      {/* grid layout */}
      <div className="grid-layout">
        {/* procedure title bar */}
        <ProcedureTitle selectedProcedure={selectedProcedure} />

        {/* procedure Container */}
        <div className="procedure-container">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <div className="procedure-container-left">
                {/* description panel */}
                {/* <Description
                    procedure={procedureData}
                    onProcedureUpdate={handleProcedureUpdate}
                    onMermaidCodeChange={handleMermaidCodeChange}
                  /> */}
                {/* JSON/Mermaid Editor Panel */}
                <JsonViewer
                  onMermaidCodeChange={handleMermaidCodeChange}
                  selectedProcedure={selectedProcedure}
                  onProcedureUpdate={handleProcedureUpdate}
                  highlightedElement={highlightedElement}
                  highlightedSection={highlightedSection}
                  markdownContent={markdownContent}
                  onEditorFocus={handleEditorFocus}
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
      </div>
    </div>
  );
}

export default App;
