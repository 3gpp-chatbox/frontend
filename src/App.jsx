import { useState, useEffect } from "react";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";
import Description from "./components/Descriptions";

function App() {
  const [mermaidCode, setMermaidCode] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureData, setProcedureData] = useState(null);
  const [highlightedElement, setHighlightedElement] = useState(null);

  const handleProcedureSelect = (procedure) => {
    console.log("Selected procedure:", procedure);
    setSelectedProcedure(procedure);
    setProcedureData(procedure);
  };

  const handleMermaidCodeChange = (newCode) => {
    console.log("App: Mermaid code updated:", newCode);
    setMermaidCode(newCode);
    if (newCode !== mermaidCode) {
      setHighlightedElement(null);
    }
  };

  const handleProcedureUpdate = (updatedData) => {
    console.log("App: Procedure data updated:", updatedData);
    setProcedureData({
      ...selectedProcedure,
      ...updatedData
    });
  };

  const handleElementClick = (element) => {
    console.log("Diagram element clicked:", element);
    setHighlightedElement(element);
  };

  const handleEditorFocus = () => {
    setHighlightedElement(null);
  };

  useEffect(() => {
    const resizer = document.querySelector('.resizer');
    const leftPanel = document.querySelector('.editor-panel');
    const rightPanel = document.querySelector('.diagram-panel');

    let isResizing = false;
    let startX;
    let leftWidth;

    const startResizing = (e) => {
      isResizing = true;
      startX = e.clientX;
      leftWidth = leftPanel.offsetWidth;
      
      resizer.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const stopResizing = () => {
      if (!isResizing) return;
      
      isResizing = false;
      resizer.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const resize = (e) => {
      if (!isResizing) return;

      const container = document.querySelector('.editor-diagram-container');
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

    resizer.addEventListener('mousedown', startResizing);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResizing);

    return () => {
      resizer.removeEventListener('mousedown', startResizing);
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>3GPP Flow Editor</h1>
      </header>

      <div className="grid-layout">
        {/* Procedures Panel */}
        <div className="col-3">
          <ProcedureList
            selectedProcedure={selectedProcedure}
            onProcedureSelect={handleProcedureSelect}
          />
        </div>
        <div className="description-panel">
          <Description 
            procedure={procedureData} 
            onProcedureUpdate={handleProcedureUpdate}
            onMermaidCodeChange={handleMermaidCodeChange}
          />
        </div>

        {/* Editor and Diagram Container */}
        <div className="editor-diagram-container">
          {/* JSON/Mermaid Editor Panel */}
          <div className="editor-panel">
            <JsonViewer
              onMermaidCodeChange={handleMermaidCodeChange}
              selectedProcedure={selectedProcedure}
              onProcedureUpdate={handleProcedureUpdate}
              highlightedElement={highlightedElement}
              onEditorFocus={handleEditorFocus}
            />
            <div className="resizer"></div>
          </div>

          {/* Flow Diagram Panel */}
          <div className="diagram-panel">
            <FlowDiagram 
              mermaidCode={mermaidCode} 
              onElementClick={handleElementClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
