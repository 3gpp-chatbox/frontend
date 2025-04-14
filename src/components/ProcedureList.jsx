// ProcedureList.jsx
import { useState, useEffect } from "react";
import { fetchProcedures, fetchProcedure } from "../API/api_calls";
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid";

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [procedureList, setProcedureList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch available procedures on mount
  useEffect(() => {
    const loadProcedures = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchProcedures();
        console.log("Received procedures data:", data); // Debug log
        
        if (Array.isArray(data)) {
          setProcedureList(data);
        } else {
          console.error("Expected array of procedures, got:", data);
          setError("Invalid data format received from server");
        }
      } catch (err) {
        console.error("Error fetching procedures:", err);
        setError("Failed to load procedures: " + (err.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    loadProcedures();
  }, []);

  const handleProcedureClick = async (procedure) => {
    try {
      // Fetch the procedure data
      const graphData = await fetchProcedure(procedure.id);
      
      if (graphData) {
        // Convert graph data to Mermaid diagram
        const mermaidDiagram = JsonToMermaid(graphData, defaultMermaidConfig);
        
        // Pass both the JSON data and Mermaid diagram to the parent component
        onProcedureSelect({
          procedureName: procedure.name,
          id: procedure.id,
          jsonData: graphData,
          mermaidDiagram: mermaidDiagram
        });
      } else {
        setError(`No data available for ${procedure.name}`);
      }
    } catch (err) {
      console.error("Error fetching procedure data:", err);
      setError(`Failed to load data for ${procedure.name}: ${err.message || "Unknown error"}`);
    }
  };

  if (error) {
    return (
      <div className="section-container">
        <div className="section-header">
          <span>Procedures</span>
        </div>
        <div className="content-area error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        {isLoading ? (
          <div className="placeholder-text">Loading procedures...</div>
        ) : procedureList.length === 0 ? (
          <div className="placeholder-text">No procedures available</div>
        ) : (
          <div className="procedure-list">
            {procedureList.map((procedure) => (
              <div 
                key={procedure.id}
                className={`procedure-item ${
                  selectedProcedure?.id === procedure.id ? "active" : ""
                }`}
                onClick={() => handleProcedureClick(procedure)}
              >
                <div className="procedure-header">
                  <span>{procedure.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProcedureList;