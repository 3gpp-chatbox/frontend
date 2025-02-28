import { useState } from 'react'
import ProcedureList from './components/ProcedureList'
import FlowDiagram from './components/FlowDiagram'
import JsonViewer from './components/JsonViewer'
import Description from './components/Descriptions'

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
            procedure={selectedProcedure} 
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