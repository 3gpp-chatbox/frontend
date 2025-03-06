import { useState, useEffect } from 'react';
import { fetchGraphData } from "../API_calls/api";
import { getMermaidConverter } from "../functions/mermaidConverters";

function JsonViewer({ selectedProcedure, onMermaidCodeChange }) {
  const [data, setData] = useState(null);
  const [mermaidGraph, setMermaidGraph] = useState("");
  const [showMermaid, setShowMermaid] = useState(true);

  useEffect(() => {
    if (!selectedProcedure?.resultSet || !selectedProcedure?.procedureName) {
      console.log("JsonViewer: No valid procedure selected");
      setData(null);
      return;
    }

    const loadGraphData = async () => {
      try {
        console.log("JsonViewer: Fetching data for:", 
          selectedProcedure.resultSet, 
          selectedProcedure.procedureName
        );
        
        const graphData = await fetchGraphData(
          selectedProcedure.resultSet,
          selectedProcedure.procedureName
        );
        
        console.log("JsonViewer: Received data:", graphData);
        setData(graphData);
      } catch (error) {
        console.error("Error fetching graph data:", error);
        setData(null);
      }
    };

    loadGraphData();
  }, [selectedProcedure]);

  useEffect(() => {
    if (!data || !selectedProcedure?.resultSet) return;

    console.log("JsonViewer: Converting data using method:", selectedProcedure.resultSet);
    const converter = getMermaidConverter(selectedProcedure.resultSet);
    const mermaidGraph = converter(data);
    setMermaidGraph(mermaidGraph);

    console.log("JsonViewer: Calling onMermaidCodeChange with:", mermaidGraph);
    onMermaidCodeChange(mermaidGraph);
  }, [data, selectedProcedure, onMermaidCodeChange]);

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Code View</span>
        <button
          className="toggle-button"
          onClick={() => setShowMermaid(!showMermaid)}
        >
          {showMermaid ? "Show JSON" : "Show Mermaid"}
        </button>
      </div>
      <div className="content-area">
        {data ? (
          <pre className="json-content">
            {showMermaid ? <code>{mermaidGraph}</code> : JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="placeholder-text">Select a procedure to view its data</div>
        )}
      </div>
    </div>
  );
}

export default JsonViewer;
