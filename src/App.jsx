import { useState } from "react";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";
import Description from "./components/Descriptions";

function App() {
  const [mermaidCode, setMermaidCode] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const handleProcedureSelect = (procedure) => {
    console.log("Selected procedure:", procedure);
    setSelectedProcedure(procedure);
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
          <Description procedure={selectedProcedure} />
        </div>

        {/* Editor and Diagram Container */}
        <div className="editor-diagram-container">
          {/* JSON/Mermaid Editor Panel */}
          <div className="editor-panel">
            <JsonViewer
              onMermaidCodeChange={setMermaidCode}
              selectedProcedure={selectedProcedure}
            />
          </div>

          {/* Flow Diagram Panel */}
          <div className="diagram-panel">
            <FlowDiagram mermaidCode={mermaidCode} />
          </div>
          {/* Procedure Description */}
        </div>
      </div>
    </div>
  );
}

export default App;
