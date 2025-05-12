import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";
// import Description from "./components/Descriptions";
import ProcedureTitle from "./components/procedureTitle";

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
    // Only clear highlight if the code actually changed
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

  return (
    <div className="container">
      <div className="title-bar-container">    
      {/* title bar */}
        <header className="title">
          3GPP Procedure Insights
        </header>
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
                  onEditorFocus={handleEditorFocus}
                />
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
