import { useState } from "react";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";
import Description from "./components/Descriptions";

function App() {
  const [mermaidCode, setMermaidCode] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureData, setProcedureData] = useState(null);

  const handleProcedureSelect = (procedure) => {
    console.log("Selected procedure:", procedure);
    setSelectedProcedure(procedure);
    setProcedureData(procedure);
  };

  const handleMermaidCodeChange = (newCode) => {
    console.log("App: Mermaid code updated:", newCode);
    setMermaidCode(newCode);
  };

  const handleProcedureUpdate = (updatedData) => {
    console.log("App: Procedure data updated:", updatedData);
    setProcedureData({
      ...selectedProcedure,
      ...updatedData
    });
  };

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
        <div className="panel description-panel">
          <Description procedure={procedureData} />
        </div>

        {/* Editor and Diagram Container */}
        <div className="editor-diagram-container">
          {/* JSON/Mermaid Editor Panel */}
          <div className="editor-panel">
            <JsonViewer
              onMermaidCodeChange={handleMermaidCodeChange}
              selectedProcedure={selectedProcedure}
              onProcedureUpdate={handleProcedureUpdate}
            />
          </div>

          {/* Flow Diagram Panel */}
          <div className="diagram-panel">
            <FlowDiagram mermaidCode={mermaidCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
