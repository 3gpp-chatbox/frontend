import { useState, useEffect } from "react";
import { fetchProcedures, fetchProcedure } from "../API/api_calls";
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid";

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [procedureList, setProcedureList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProcedure, setExpandedProcedure] = useState(null);
  useEffect(() => {
    const loadProcedures = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const data = await fetchProcedures();
        console.log("Received procedures data:", data);
  
        if (Array.isArray(data)) {
          const groupedProcedures = data.reduce((acc, procedure) => {
            const existingProcedure = acc.find(p => p.procedure_name === procedure.procedure_name);
  
            const entities = Array.isArray(procedure.entity)
              ? procedure.entity
              : [procedure.entity];
  
            if (existingProcedure) {
              // Avoid duplicate entities
              entities.forEach(entity => {
                const exists = existingProcedure.entities.find(e => e.entity === entity);
                if (!exists) {
                  existingProcedure.entities.push({
                    id: `${procedure.procedure_id}_${entity.toLowerCase()}`,
                    name: `${entity} - ${procedure.procedure_name}`,
                    entity: entity
                  });
                }
              });
            } else {
              acc.push({
                procedure_id: procedure.procedure_id,
                procedure_name: procedure.procedure_name,
                entities: entities.map(entity => ({
                  id: `${procedure.procedure_id}_${entity.toLowerCase()}`,
                  name: `${entity} - ${procedure.procedure_name}`,
                  entity: entity
                }))
              });
            }
  
            return acc;
          }, []);
  
          setProcedureList(groupedProcedures);
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
  

  const handleProcedureClick = async (procedure, entity) => {
    try {
      const procedureData = await fetchProcedure(procedure.procedure_id, entity.entity);

      if (procedureData) {
        const mermaidDiagram = JsonToMermaid(procedureData.graph, defaultMermaidConfig);
        onProcedureSelect({
          ...procedureData,
          name: entity.name,
          procedure_name: procedure.procedure_name,
          mermaidDiagram,
        });
      } else {
        setError(`No data available for ${entity.name}`);
      }
    } catch (err) {
      console.error("Error fetching procedure data:", err);
      setError(`Failed to load data for ${entity.name}`);
    }
  };

  const toggleProcedure = (procedureId) => {
    setExpandedProcedure(expandedProcedure === procedureId ? null : procedureId);
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
              <div key={procedure.procedure_id}>
                <div
                  className={`dropdown-item procedure-header ${expandedProcedure === procedure.procedure_id ? 'expanded' : ''}`}
                  onClick={() => toggleProcedure(procedure.procedure_id)}
                >
                  <span>{procedure.procedure_name}</span>
                  <span className="toggle-icon">
                    {expandedProcedure === procedure.procedure_id ? '−' : '+'}
                  </span>
                </div>
                {expandedProcedure === procedure.procedure_id && (
                  <div className="entity-list">
                    {procedure.entities.map((entity) => (
                      <div
                        key={entity.id}
                        className="dropdown-item entity-item"
                        onClick={() => handleProcedureClick(procedure, entity)}
                      >
                        {entity.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcedureList;
