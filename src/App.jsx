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
        console.log('Selected procedure:', selectedProcedure);
        console.log('Procedure ID being sent:', selectedProcedure.id);
        const url = `http://localhost:8000/periodic-registration/${selectedProcedure.id}`;
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
        
        // Check if data exists and has the expected structure
        if (!data) {
          throw new Error('No data received from server');
        }

        // If data is wrapped in a response object, extract it
        const flowData = data.response || data;
        console.log('Flow data:', flowData);

        // Validate the flow data structure
        if (!flowData.nodes || !flowData.edges || 
            !Array.isArray(flowData.nodes) || !Array.isArray(flowData.edges)) {
          console.error('Invalid data structure:', flowData);
          throw new Error('Invalid data structure received from server');
        }
        
        if (flowData.nodes.length === 0 && flowData.edges.length === 0) {
          throw new Error('No flow data available for this trigger');
        }
        
        setProcedureData(flowData);
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
        <div className="panel col-12 flow-diagram-panel" style={{ height: '600px', minWidth: '1200px', overflowX: 'auto' }}>
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
