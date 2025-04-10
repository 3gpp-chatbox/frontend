import { useState } from "react";
import JsonViewer from "./components/JsonViewer";
import FlowDiagram from "./components/FlowDiagram";
import ProcedureList from "./components/ProcedureList";

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

        <div className="col-9">
          {/* JSON Editor Panel */}
          <div className="panel">
            <JsonViewer
              onMermaidCodeChange={setMermaidCode}
              selectedProcedure={selectedProcedure}
            />
          </div>

          {/* Flow Diagram Panel */}
          <div className="col-12">
            <FlowDiagram mermaidCode={mermaidCode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
