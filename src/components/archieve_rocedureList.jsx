import { useState, useEffect } from "react";
import { fetchProcedures, fetchProcedure } from "../API/api_calls";
import { JsonToMermaid, defaultMermaidConfig } from "../functions/jsonToMermaid";

function ProcedureList({ selectedProcedure, onProcedureSelect, disabled }) {
  const [docTree, setDocTree] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  // Helper to toggle expansion at any level
  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const loadProcedures = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchProcedures();
        // Transform response into a nested tree
        const tree = data.map(doc => ({
          spec: doc.document_spec,
          release: doc.document_release,
          version: doc.document_version,
          document_id: doc.document_id,
          procedures: doc.document_procedures.map(proc => ({
            ...proc,
            // entity is an array, so we keep it as is
          }))
        }));
        setDocTree(tree);
      } catch (err) {
        setError("Failed to load procedures: " + (err.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };
    loadProcedures();
  }, []);

  const handleProcedureClick = async (procedure, entity, doc) => {
    if (disabled) return;
    try {
      const procedureData = await fetchProcedure(procedure.procedure_id, entity);
      if (procedureData) {
        const mermaidDiagram = JsonToMermaid(
          procedureData.graph,
          defaultMermaidConfig
        );
        onProcedureSelect({
          ...procedureData,
          id: procedure.procedure_id,
          name: `${entity}-${procedure.procedure_name}`,
          procedure_name: procedure.procedure_name,
          mermaidDiagram,
          entity,
          document_id: doc.document_id,
          spec: doc.spec,
          release: doc.release,
          version: doc.version,
        });
      } else {
        setError(`No data available for ${entity}-${procedure.procedure_name}`);
      }
    } catch (err) {
      setError(`Failed to load data for ${entity}-${procedure.procedure_name}`);
    }
  };

  return (
    <div className={`menu-bar${disabled ? ' disabled' : ''}`}>
      {disabled && (
        <div className="disabled-tooltip">
          To select a new procedure, you have to close the comparison view.
        </div>
      )}
      <div className="menu-item">
        <span className="menu-item-text">Procedures</span>
        <div className="dropdown-content">
          {isLoading ? (
            <div className="placeholder-text">Loading procedures...</div>
          ) : docTree.length === 0 ? (
            <div className="placeholder-text">No procedures available</div>
          ) : (
            docTree.map((doc) => {
              const specKey = `spec-${doc.spec}`;
              const releaseKey = `${specKey}-release-${doc.release}`;
              const versionKey = `${releaseKey}-version-${doc.version}`;
              return (
                <div key={doc.document_id}>
                  {/* Spec */}
                  <div
                    className={`dropdown-item procedure-header ${expanded[specKey] ? 'expanded' : ''}`}
                    onClick={() => !disabled && toggleExpand(specKey)}
                  >
                    <span>TS {doc.spec}</span>
                    <span className="toggle-icon">{expanded[specKey] ? '−' : '+'}</span>
                  </div>
                  {expanded[specKey] && (
                    <div className="entity-list">
                      {/* Release */}
                      <div
                        className={`dropdown-item procedure-header ${expanded[releaseKey] ? 'expanded' : ''}`}
                        onClick={() => !disabled && toggleExpand(releaseKey)}
                        style={{ paddingLeft: 20 }}
                      >
                        <span>R {doc.release}</span>
                        <span className="toggle-icon">{expanded[releaseKey] ? '−' : '+'}</span>
                      </div>
                      {expanded[releaseKey] && (
                        <div className="entity-list">
                          {/* Version */}
                          <div
                            className={`dropdown-item procedure-header ${expanded[versionKey] ? 'expanded' : ''}`}
                            onClick={() => !disabled && toggleExpand(versionKey)}
                            style={{ paddingLeft: 40 }}
                          >
                            <span>v{doc.version}</span>
                            <span className="toggle-icon">{expanded[versionKey] ? '−' : '+'}</span>
                          </div>
                          {expanded[versionKey] && (
                            <div className="entity-list">
                              {/* Procedures */}
                              {doc.procedures.map((proc) => (
                                <div key={proc.procedure_id}>
                                  <div
                                    className="dropdown-item procedure-header"
                                    style={{ paddingLeft: 60 }}
                                  >
                                    <span>{proc.procedure_name}</span>
                                  </div>
                                  <div className="entity-list">
                                    {proc.entity.map((entityName) => (
                                      <div
                                        key={`${proc.procedure_id}_${entityName}`}
                                        className="dropdown-item entity-item"
                                        style={{ paddingLeft: 80 }}
                                        onClick={() => !disabled && handleProcedureClick(proc, entityName, doc)}
                                      >
                                        {entityName}-{proc.procedure_name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcedureList;