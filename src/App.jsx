import { useState } from 'react'
import ProcedureList from './components/ProcedureList'
import FlowDiagram from './components/FlowDiagram'
import JsonViewer from './components/JsonViewer'
import Description from './components/Descriptions'
import procedureData from './assets/mock.json'

// Function to convert JSON to Mermaid format
function convertJsonToMermaid(json) {
  if (!json || !json.nodes || !json.edges) return "";
  
  let mermaidStr = "graph TD\n";
  json.nodes.forEach(node => {
    mermaidStr += `  ${node.id}["${node.label || node.id}"]\n`;
  });
  json.edges.forEach(edge => {
    mermaidStr += `  ${edge.source} -->|${edge.label}| ${edge.target}\n`;
  });
  return mermaidStr;
}

function App() {
  const [selectedProcedure, setSelectedProcedure] = useState(null)
  const [mermaidCode, setMermaidCode] = useState(null)

  return (
    <div className="container">
      <header className="header">
        <h1>SpecFlow</h1>
        <p>
          Interactive 3GPP specification viewer for network procedures and message flows.
          <br />
          Select a procedure to view its detailed flow diagram and documentation.
        </p>
      </header>
      
      <div className="grid-layout">
        <div className="panel col-3">
          <ProcedureList 
            selectedProcedure={selectedProcedure}
            onProcedureSelect={setSelectedProcedure}
          />
        </div>

        <div className="panel col-3"> 
          <JsonViewer 
            data={procedureData}
            onMermaidCodeChange={setMermaidCode}
          />
        </div>

        <div className="panel col-6">
          <FlowDiagram mermaidCode={mermaidCode} />
        </div>

        <div className="panel col-12">
          <Description procedure={selectedProcedure} />
        </div>
      </div>
    </div>
  )
}

export default App