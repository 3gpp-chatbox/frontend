import { useState } from "react";

// Define the procedure data structure
const procedures = [
  {
    id: "registration",
    label: "Registration Procedure",
    type: "registration",
    subProcedures: [
      {
        id: "Initial_Registration",
        label: "Initial Registration",
        type: "initial-registration",
        description: "Initial UE registration procedure",
      }
    ],
  },
  // Add more main procedures here as needed
];

function ProcedureList({ selectedProcedure, onProcedureSelect }) {
  const [expandedProcedures, setExpandedProcedures] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [floatingPanelPosition, setFloatingPanelPosition] = useState({
    x: 0,
    y: 0,
  });

  const toggleProcedure = (procedureId, event) => {
    const newExpanded = new Set(expandedProcedures);
    if (newExpanded.has(procedureId)) {
      newExpanded.delete(procedureId);
    } else {
      // Calculate position for floating panel
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      setFloatingPanelPosition({
        x: rect.right + 10, // 10px offset from the button
        y: rect.top,
      });
      newExpanded.add(procedureId);
    }
    setExpandedProcedures(newExpanded);
  };

  const renderProcedure = (procedure) => {
    const isExpanded = expandedProcedures.has(procedure.id);
    const isSelected = selectedProcedure?.id === procedure.id;
    const hasSubProcedures = procedure.subProcedures?.length > 0;

    return (
      <div key={procedure.id} className="procedure-container">
        <div
          className={`procedure-item main-procedure ${
            isExpanded ? "expanded" : ""
          } ${isSelected ? "active" : ""}`}
          onClick={(e) => {
            if (hasSubProcedures) {
              toggleProcedure(procedure.id, e);
            } else {
              onProcedureSelect(procedure);
            }
          }}
        >
          <div className="procedure-header">
            <span>{procedure.label}</span>
            {hasSubProcedures && <span className="expand-icon">+</span>}
          </div>
        </div>

        {isExpanded && hasSubProcedures && (
          <div
            className="floating-sub-procedures"
            style={{
              position: "fixed",
              left: `${floatingPanelPosition.x}px`,
              top: `${floatingPanelPosition.y}px`,
            }}
          >
            <div className="floating-panel-header">
              <span>Sub-procedures</span>
              <span
                className="close-button"
                onClick={() => toggleProcedure(procedure.id)}
              >
                ×
              </span>
            </div>
            {procedure.subProcedures.map((subProc) => (
              <div
                key={subProc.id}
                className={`procedure-item sub-procedure ${
                  selectedProcedure?.id === subProc.id ? "active" : ""
                }`}
                onClick={() => {
                  onProcedureSelect(subProc);
                  toggleProcedure(procedure.id);
                }}
              >
                <span>{subProc.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Add loading and error states to the UI
  return (
    <div className="section-container">
      <div className="section-header">
        <span>Procedures</span>
      </div>
      <div className="content-area">
        {loading && <div className="loading-state">Loading data...</div>}
        {error && <div className="error-state">Error: {error}</div>}
        {procedures.map(renderProcedure)}
      </div>
    </div>
  );
}

export default ProcedureList;
