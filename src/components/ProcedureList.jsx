import { useState, useEffect } from "react";
import { fetchProcedures, fetchProcedure } from "../API/api_calls";
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid";

function ProcedureList({ selectedProcedure, onProcedureSelect, disabled }) {
  const [procedureList, setProcedureList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDocument, setExpandedDocument] = useState(null);
  const [expandedProcedure, setExpandedProcedure] = useState(null);

  // Fetch available procedures on mount
  useEffect(() => {
    const loadProcedures = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchProcedures();
        console.log("Received procedures data:", data); 
        
        if (Array.isArray(data)) {
          // Group procedures by document and procedure_name
          const groupedData = data.reduce((acc, procedure) => {
            // Get or create document group
            const documentName = procedure.document_name || 'Other';
            let documentGroup = acc.find(d => d.document_name === documentName);
            
            if (!documentGroup) {
              documentGroup = {
                document_name: documentName,
                procedures: []
              };
              acc.push(documentGroup);
            }

            // Find existing procedure in document group
            const existingProcedure = documentGroup.procedures.find(
              p => p.procedure_name === procedure.procedure_name
            );

            if (existingProcedure) {
              // Add entities to existing procedure
              procedure.entity.forEach(entityName => {
                existingProcedure.entities.push({
                  id: `${procedure.procedure_id}_${entityName.toLowerCase()}`,
                  name: `${entityName}-${procedure.procedure_name}`,
                  entity: entityName
                });
              });
            } else {
              // Create new procedure entry
              documentGroup.procedures.push({
                procedure_id: procedure.procedure_id,
                procedure_name: procedure.procedure_name,
                entities: procedure.entity.map(entityName => ({
                  id: `${procedure.procedure_id}_${entityName.toLowerCase()}`,
                  name: `${entityName}-${procedure.procedure_name}`,
                  entity: entityName
                }))
              });
            }
            return acc;
          }, []);
          
          setProcedureList(groupedData);
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
    if (disabled) return;
    try {
      // Fetch procedure-entity specific data
      const procedureData = await fetchProcedure(procedure.procedure_id, entity.entity);
      
      if (procedureData) {
        const mermaidDiagram = JsonToMermaid(
          procedureData.graph,
          defaultMermaidConfig
        );
        // Pass all procedure data to the parent component
        onProcedureSelect({
          ...procedureData,           // Include all API response data
          id: procedure.procedure_id,  // Map procedure_id to id for consistency
          name: entity.name,          // Use entity-specific name
          procedure_name: procedure.procedure_name, // Keep original procedure name 
          mermaidDiagram,            // Add generated Mermaid diagram
          entity: entity.entity,      // Add entity type
          document_name: procedure.document_name    // Add document name
        });
      } else {
        setError(`No data available for ${entity.name}`);
      }
    } catch (err) {
      console.error("Error fetching procedure data:", err);
      setError(`Failed to load data for ${entity.name}`);
    }
  };

  const toggleDocument = (documentName) => {
    setExpandedDocument(expandedDocument === documentName ? null : documentName);
  };

  const toggleProcedure = (procedureId) => {
    setExpandedProcedure(expandedProcedure === procedureId ? null : procedureId);
  };

  return (
    <div className={`menu-bar${disabled ? ' disabled' : ''}`}>
      {disabled && (
        <div className="disabled-tooltip">
          To select a new procedure, you have to close the comparison view.
        </div>
      )}
      <div className="menu-item"> 
        <span className="menu-item-text">Documents</span>
        <div className="dropdown-content">
          {isLoading ? (
            <div className="placeholder-text">Loading procedures...</div>
          ) : procedureList.length === 0 ? (
            <div className="placeholder-text">No procedures available</div>
          ) : (
            procedureList.map((document) => (
              <div key={document.document_name}>
                <div 
                  className={`dropdown-item document-header ${expandedDocument === document.document_name ? 'expanded' : ''}`}
                  onClick={() => !disabled && toggleDocument(document.document_name)}
                >
                  <span>{document.document_name}</span>
                  <span className="toggle-icon">
                    {expandedDocument === document.document_name ? '−' : '+'}
                  </span>
                </div>
                {expandedDocument === document.document_name && (
                  <div className="procedure-list">
                    {document.procedures.map((procedure) => (
                      <div key={procedure.procedure_id}>
                        <div 
                          className={`dropdown-item procedure-header ${expandedProcedure === procedure.procedure_id ? 'expanded' : ''}`}
                          onClick={() => !disabled && toggleProcedure(procedure.procedure_id)}
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
                                onClick={() => !disabled && handleProcedureClick(procedure, entity)}
                              >
                                {entity.name}
                              </div>
                            ))}
                          </div>
                        )}
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