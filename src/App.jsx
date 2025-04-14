import { useState } from 'react';
import ProcedureList from './components/ProcedureList';
import JsonViewer from './components/JsonViewer';
import FlowDiagram from './components/FlowDiagram';
import Description from './components/Description';

function App() {
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [mermaidCode, setMermaidCode] = useState(null);

  // Handler for procedure selection
  const handleProcedureSelect = (procedureData) => {
    console.log("App: Selected procedure data:", procedureData);
    
    if (!procedureData) {
      setSelectedProcedure(null);
      return;
    }
  
    setSelectedProcedure({
      ...procedureData,  // This includes all procedure data 
      procedureName: procedureData.name // For backward compatibility
    });
  };
  return (
    <div className="container">
      <header className="header">
        <h1>SpecFlow</h1>
      </header>
      
      <div className="grid-layout">
        {/* Left Panel: Procedure List */}
        <div className="panel col-3">
          <ProcedureList 
            selectedProcedure={selectedProcedure}
            onProcedureSelect={handleProcedureSelect}
          />
        </div>

        {/* Right Panel: JSON Viewer */}
        <div className="panel col-9">
          <JsonViewer 
            selectedProcedure={selectedProcedure}
            onMermaidCodeChange={setMermaidCode}
          />
        </div>

        {/* Flow Diagram Panel */}
        <div className="panel col-12 flow-diagram-panel">
          <FlowDiagram mermaidCode={mermaidCode} />
        </div>

        {/* Procedure Description */}
        
        <div className="panel description-panel">
          <Description 
            procedure={selectedProcedure}
          />
        </div>
       
      </div>
    </div>
  );
}

export default App;
