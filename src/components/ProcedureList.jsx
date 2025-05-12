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
      console.log("Received procedures data:", data); 
      
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
    const procedureData = await fetchProcedure(procedure.id);
    
    if (procedureData) {
      const mermaidDiagram = JsonToMermaid(
        procedureData.edited_graph || procedureData.original_graph,
        defaultMermaidConfig
      );
      
      // Pass all procedure data to the parent component
      onProcedureSelect({
        ...procedureData,           // Include all API response data
        name: procedure.name,       // Ensure name is included
        id: procedure.id,           // Ensure ID is included
        mermaidDiagram,            // Add generated Mermaid diagram
        jsonData: procedureData.edited_graph || procedureData.original_graph
      });
    } else {
      setError(`No data available for ${procedure.name}`);
    }
  } catch (err) {
    console.error("Error fetching procedure data:", err);
    setError(`Failed to load data for ${procedure.name}`);
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
  <div className="menu-bar">
    <div className="menu-item"> 
      <span className="menu-item-text">Procedures</span>
      <div className="dropdown-content">
        {isLoading ? (
          <div className="placeholder-text">Loading procedures...</div>
        ) : procedureList.length === 0 ? (
          <div className="placeholder-text">No procedures available</div>
        ) : (
          procedureList.map((procedure) => (
            <div 
              key={procedure.id}
              className="dropdown-item"
              onClick={() => handleProcedureClick(procedure)}
            >
              {procedure.name}
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);
}
export default ProcedureList;