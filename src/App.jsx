import { useState, useEffect } from 'react';
import ProcedureList from './components/ProcedureList';
import FlowDiagram from './components/FlowDiagram';
import JsonViewer from './components/JsonViewer';
import Description from './components/Descriptions';

function App() {
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [mermaidCode, setMermaidCode] = useState(null);
  const [procedureData, setProcedureData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when a procedure is selected
  useEffect(() => {
    const fetchProcedureData = async () => {
      if (!selectedProcedure) {
        setProcedureData(null);
        setMermaidCode(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching data for procedure:', selectedProcedure);
        const url = `http://localhost:5000/fetch-jsondata/all`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        const contentType = response.headers.get("content-type");
        
        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          } else {
            const text = await response.text();
            console.error('Received non-JSON response:', text);
            throw new Error(`Server returned ${response.status} with non-JSON response`);
          }
        }
        
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error('Received non-JSON response:', text);
          throw new Error('Server did not return JSON');
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          console.error('Invalid data structure:', data);
          throw new Error('Invalid data structure received from server. Expected {nodes: [], edges: []}');
        }
        
        if (data.nodes.length === 0 || data.edges.length === 0) {
          throw new Error('No flow data available');
        }
        
        setProcedureData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setProcedureData(null);
        setMermaidCode(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcedureData();
  }, [selectedProcedure]);

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
        {/* Top row: Procedures and JSON Viewer */}
        <div className="panel col-3">
          <ProcedureList 
            selectedProcedure={selectedProcedure}
            onProcedureSelect={setSelectedProcedure}
          />
        </div>

        <div className="panel col-9"> 
          {isLoading ? (
            <div className="loading-state">Loading data...</div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
            <JsonViewer 
              data={procedureData}
              onMermaidCodeChange={setMermaidCode}
            />
          )}
        </div>

        {/* Bottom row: Flow Diagram */}
        <div className="panel col-12 flow-diagram-panel">
          {isLoading ? (
            <div className="loading-state">Loading diagram...</div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
            <FlowDiagram mermaidCode={mermaidCode} />
          )}
        </div>

        {/* Description at the bottom */}
        <div className="panel col-12">
          <Description procedure={selectedProcedure} />
        </div>
      </div>
    </div>
  );
}

export default App;
